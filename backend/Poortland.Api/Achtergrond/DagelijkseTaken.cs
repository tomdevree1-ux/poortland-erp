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

        var wijzigingen = await db.SaveChangesAsync(stop);
        if (wijzigingen > 0)
            log.LogInformation("Dagelijkse taken: {Verlopen} verlopen offertes en {Taken} nieuwe opvolgtaken",
                teVerlopen.Count, zonderReactie.Count + leads.Count);
    }
}
