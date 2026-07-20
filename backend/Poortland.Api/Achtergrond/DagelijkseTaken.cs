using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Achtergrond;

// FR-005 opvolgtaken en het automatisch verlopen van offertes (bouwspec 6.4).
// Draait onder de rol systeem (BS-02): de statusbewaking en RLS gelden ook hier.
public class DagelijkseTaken(IServiceScopeFactory scopes, ILogger<DagelijkseTaken> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        await Task.Delay(TimeSpan.FromSeconds(15), stop); // opstart afwachten
        while (!stop.IsCancellationRequested)
        {
            try { await VoerUit(stop); }
            catch (Exception fout) { log.LogError(fout, "Dagelijkse taken mislukt"); }
            await Task.Delay(TimeSpan.FromHours(6), stop);
        }
    }

    async Task VoerUit(CancellationToken stop)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PoortlandDbContext>();
        var claims = scope.ServiceProvider.GetRequiredService<ClaimsContext>();
        var instellingen = scope.ServiceProvider.GetRequiredService<Domein.InstellingenService>();
        claims.VulAlsSysteem();
        await DbClaims.ZetClaims(db, claims, stop);

        var vandaag = DateOnly.FromDateTime(DateTime.Today);

        // Verzonden offertes voorbij hun geldigheid worden verlopen (TS-05 sectie 9).
        var teVerlopen = await db.Offertes
            .Where(o => o.Status == OfferteStatus.Verzonden && o.GeldigTot < vandaag && o.VerwijderdOp == null)
            .ToListAsync(stop);
        foreach (var offerte in teVerlopen) offerte.Status = OfferteStatus.Verlopen;

        // Opvolgtaak bij verzonden offertes zonder reactie na de termijn (FR-005).
        var dagen = await instellingen.Getal("opvolgtermijn_dagen", 14);
        var grens = DateTimeOffset.UtcNow.AddDays(-dagen);
        var zonderReactie = await db.Offertes
            .Where(o => o.Status == OfferteStatus.Verzonden && o.VerzondenOp <= grens && o.VerwijderdOp == null)
            .Where(o => !db.Opvolgtaken.Any(t => t.OfferteId == o.Id && t.Status == OpvolgtaakStatus.Open && t.VerwijderdOp == null))
            .ToListAsync(stop);
        foreach (var offerte in zonderReactie)
        {
            if (offerte.AangemaaktDoor is not { } eigenaar) continue;
            db.Opvolgtaken.Add(new Opvolgtaak
            {
                Type = OpvolgtaakType.NaOfferte, OfferteId = offerte.Id, MedewerkerId = eigenaar,
                DueDatum = vandaag, Omschrijving = $"Offerte {offerte.Nummer} opvolgen: {dagen} dagen zonder reactie."
            });
            db.Notificaties.Add(new Notificatie
            {
                MedewerkerId = eigenaar, Type = "opvolgtaak", Titel = $"Opvolging voor offerte {offerte.Nummer}",
                Boodschap = "De klant reageerde nog niet.", EntiteitType = "offerte", EntiteitId = offerte.Id
            });
        }

        // Leads met een verstreken opvolgdatum krijgen een taak voor de eigenaar.
        var leads = await db.Leads
            .Where(l => (l.Status == LeadStatus.Nieuw || l.Status == LeadStatus.Gekwalificeerd)
                && l.Opvolgdatum != null && l.Opvolgdatum <= vandaag && l.VerwijderdOp == null)
            .Where(l => !db.Opvolgtaken.Any(t => t.LeadId == l.Id && t.Status == OpvolgtaakStatus.Open && t.VerwijderdOp == null))
            .ToListAsync(stop);
        foreach (var lead in leads)
        {
            db.Opvolgtaken.Add(new Opvolgtaak
            {
                Type = OpvolgtaakType.LeadOpvolging, LeadId = lead.Id, MedewerkerId = lead.EigenaarId,
                DueDatum = vandaag, Omschrijving = $"Lead {lead.Naam ?? lead.Email ?? "onbekend"} opvolgen."
            });
        }

        // FR-011: afspraakbevestiging 48 uur vooraf en reminder 24 uur vooraf per
        // gepland planningsitem, gelogd in communicatie zodat niets dubbel vertrekt.
        var email = scope.ServiceProvider.GetRequiredService<Adapters.IEmailVerzender>();
        var afspraken = await db.Planningsitems
            .Include(p => p.Project!).ThenInclude(pr => pr.Klant)
            .Where(p => p.VerwijderdOp == null && p.Status != "uitgevoerd"
                && (p.GeplandeDatum == vandaag.AddDays(2) || p.GeplandeDatum == vandaag.AddDays(1)))
            .ToListAsync(stop);
        var verzonden = 0;
        foreach (var afspraak in afspraken)
        {
            var klant = afspraak.Project?.Klant;
            if (klant?.Email is not { Length: > 0 } naar) continue;
            var soort = afspraak.GeplandeDatum == vandaag.AddDays(2) ? "afspraakbevestiging" : "afspraakreminder";
            var alVerstuurd = await db.Communicaties.AnyAsync(c =>
                c.ProjectId == afspraak.ProjectId && c.Onderwerp.StartsWith(soort + ":" + afspraak.Id), stop);
            if (alVerstuurd) continue;
            var wanneer = afspraak.GeplandeDatum.ToString("dd-MM-yyyy");
            var titel = soort == "afspraakbevestiging"
                ? $"Bevestiging van uw afspraak op {wanneer}"
                : $"Herinnering: onze afspraak op {wanneer}";
            var tekst = $"Beste {($"{klant.Voornaam} {klant.Naam}").Trim()},\n\n" +
                $"{(soort == "afspraakbevestiging" ? "Wij bevestigen" : "Een herinnering aan")} onze afspraak op {wanneer} " +
                $"voor de fase {afspraak.Fase} op {afspraak.Project!.Werfadres}.\n\n" +
                "Komt dit toch niet uit, laat het ons gerust weten via +32 (0)15 432 111.\n\nMet vriendelijke groeten\nPoortland";
            try
            {
                await email.Verzend(naar, titel, tekst);
                db.Communicaties.Add(new Communicatie
                {
                    KlantId = klant.Id, ProjectId = afspraak.ProjectId,
                    Onderwerp = $"{soort}:{afspraak.Id} {titel}", Inhoud = tekst,
                    VerzondenOp = DateTimeOffset.UtcNow, Status = CommunicatieStatus.Verzonden
                });
                verzonden++;
            }
            catch (Exception fout) { log.LogError(fout, "Afspraakmail naar {Naar} mislukt", naar); }
        }

        var wijzigingen = await db.SaveChangesAsync(stop);
        if (wijzigingen > 0)
            log.LogInformation("Dagelijkse taken: {Verlopen} verlopen offertes, {Taken} nieuwe opvolgtaken en {Mails} afspraakmails",
                teVerlopen.Count, zonderReactie.Count + leads.Count, verzonden);
    }
}
