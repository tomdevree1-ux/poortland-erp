using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

public record RegelInvoer(string Soort, Guid? ArtikelId, string Omschrijving, decimal Aantal,
    ArtikelEenheid Eenheid, decimal Eenheidsprijs, decimal KortingBedrag, BtwTarief Btw, string? Detail = null);
public record OfferteInvoer(List<RegelInvoer> Regels, decimal KortingPercentage, decimal KortingBedrag,
    DateOnly? GeldigTot, OfferteSoort? Soort = null, bool? BtwVerlegd = null, string? Model = null);

public class OfferteService(
    PoortlandDbContext db, ClaimsContext claims, InstellingenService instellingen,
    OffertePdfService pdf, IEmailVerzender email, SupabaseOpslag opslag)
{
    public async Task<Offerte> Maak(Guid projectId, Taal? taal, OfferteSoort soort = OfferteSoort.Offerte)
    {
        var project = await db.Projecten.Include(p => p.Klant).FirstOrDefaultAsync(p => p.Id == projectId)
            ?? throw new DomeinFout("Project niet gevonden.");
        var dagen = await instellingen.Getal("offerte_geldigheid_dagen", 30);
        var nummer = await VolgendNummer();
        var versie = (await db.Offertes.Where(o => o.ProjectId == projectId).MaxAsync(o => (int?)o.VersieOfferte) ?? 0) + 1;
        var offerte = new Offerte
        {
            ProjectId = projectId,
            Nummer = nummer,
            VersieOfferte = versie,
            Taal = taal ?? project.Klant?.Communicatietaal ?? Taal.Nl,
            GeldigTot = DateOnly.FromDateTime(DateTime.Today.AddDays(dagen)),
            Soort = soort,
            // Btw verlegd voorstellen bij een onderneming met btw nummer; de
            // verkoper kan dit altijd zelf uitzetten (feedback 2026-09-13).
            BtwVerlegd = project.Klant?.Type == KlantType.Bedrijf
                && !string.IsNullOrWhiteSpace(project.Klant?.BtwNummer),
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Offertes.Add(offerte);
        await db.SaveChangesAsync();
        return offerte;
    }

    // TS-05 sectie 9: wijziging na verzending betekent een nieuwe versie.
    public async Task<Offerte> NieuweVersie(Guid offerteId)
    {
        var bron = await db.Offertes.Include(o => o.Regels).FirstOrDefaultAsync(o => o.Id == offerteId)
            ?? throw new DomeinFout("Offerte niet gevonden.");
        var nieuw = await Maak(bron.ProjectId, bron.Taal, bron.Soort);
        nieuw.KortingPercentage = bron.KortingPercentage;
        nieuw.KortingBedrag = bron.KortingBedrag;
        nieuw.BtwVerlegd = bron.BtwVerlegd;
        nieuw.Model = bron.Model;
        nieuw.UitRamingId = bron.UitRamingId;
        foreach (var r in bron.Regels.Where(r => r.VerwijderdOp is null).OrderBy(r => r.Volgnummer))
        {
            db.Offerteregels.Add(new Offerteregel
            {
                OfferteId = nieuw.Id, Volgnummer = r.Volgnummer, Soort = r.Soort, ArtikelId = r.ArtikelId,
                Omschrijving = r.Omschrijving, Detail = r.Detail, Aantal = r.Aantal, Eenheid = r.Eenheid,
                Eenheidsprijs = r.Eenheidsprijs, KortingBedrag = r.KortingBedrag, Btw = r.Btw, Totaal = r.Totaal,
                AangemaaktDoor = claims.MedewerkerId
            });
        }
        HerberekenTotalen(nieuw, bron.Regels.Select(r => (r.Totaal, r.Btw)).ToList());
        await db.SaveChangesAsync();
        return nieuw;
    }

    /* Feedback 2026-09-13: een prijsraming ontstaat zonder plaatsbezoek. Na de
       opmeting of op basis van het plan van de architect wordt ze met één klik
       een offerte, met behoud van de inhoud en een verwijzing naar de raming. */
    public async Task<Offerte> ZetOmNaarOfferte(Guid ramingId)
    {
        var raming = await db.Offertes.Include(o => o.Regels).FirstOrDefaultAsync(o => o.Id == ramingId)
            ?? throw new DomeinFout("Prijsraming niet gevonden.");
        if (raming.Soort != OfferteSoort.Prijsraming)
            throw new DomeinFout("Dit document is al een offerte.");

        var nieuw = await Maak(raming.ProjectId, raming.Taal, OfferteSoort.Offerte);
        nieuw.KortingPercentage = raming.KortingPercentage;
        nieuw.KortingBedrag = raming.KortingBedrag;
        nieuw.BtwVerlegd = raming.BtwVerlegd;
        nieuw.Model = raming.Model;
        nieuw.UitRamingId = raming.Id;
        foreach (var r in raming.Regels.Where(r => r.VerwijderdOp is null).OrderBy(r => r.Volgnummer))
        {
            db.Offerteregels.Add(new Offerteregel
            {
                OfferteId = nieuw.Id, Volgnummer = r.Volgnummer, Soort = r.Soort, ArtikelId = r.ArtikelId,
                Omschrijving = r.Omschrijving, Detail = r.Detail, Aantal = r.Aantal, Eenheid = r.Eenheid,
                Eenheidsprijs = r.Eenheidsprijs, KortingBedrag = r.KortingBedrag, Btw = r.Btw, Totaal = r.Totaal,
                AangemaaktDoor = claims.MedewerkerId
            });
        }
        HerberekenTotalen(nieuw, raming.Regels.Select(r => (r.Totaal, r.Btw)).ToList());
        await db.SaveChangesAsync();
        return nieuw;
    }

    public async Task<Offerte> BewaarInhoud(Guid id, OfferteInvoer invoer)
    {
        var offerte = await db.Offertes.Include(o => o.Regels).FirstOrDefaultAsync(o => o.Id == id)
            ?? throw new DomeinFout("Offerte niet gevonden.");
        if (offerte.Status != OfferteStatus.Nieuw)
            throw new DomeinFout("Enkel een offerte met status nieuw is bewerkbaar. Maak een nieuwe versie.");

        db.Offerteregels.RemoveRange(offerte.Regels);
        var volgnummer = 1;
        var regelTotalen = new List<(decimal totaal, BtwTarief btw)>();
        foreach (var r in invoer.Regels)
        {
            var totaal = Prijsmotor.RegelTotaal(r.Aantal, r.Eenheidsprijs, r.KortingBedrag);
            regelTotalen.Add((totaal, r.Btw));
            db.Offerteregels.Add(new Offerteregel
            {
                OfferteId = offerte.Id, Volgnummer = volgnummer++, Soort = r.Soort, ArtikelId = r.ArtikelId,
                Omschrijving = r.Omschrijving, Detail = r.Detail, Aantal = r.Aantal, Eenheid = r.Eenheid,
                Eenheidsprijs = r.Eenheidsprijs, KortingBedrag = r.KortingBedrag, Btw = r.Btw, Totaal = totaal,
                AangemaaktDoor = claims.MedewerkerId
            });
        }
        offerte.KortingPercentage = invoer.KortingPercentage;
        offerte.KortingBedrag = invoer.KortingBedrag;
        if (invoer.GeldigTot is { } tot) offerte.GeldigTot = tot;
        if (invoer.Soort is { } soort) offerte.Soort = soort;
        if (invoer.BtwVerlegd is { } verlegd) offerte.BtwVerlegd = verlegd;
        if (invoer.Model is not null) offerte.Model = invoer.Model.Trim() is { Length: > 0 } m ? m : null;
        HerberekenTotalen(offerte, regelTotalen);
        await db.SaveChangesAsync();
        return offerte;
    }

    void HerberekenTotalen(Offerte offerte, IReadOnlyCollection<(decimal totaal, BtwTarief btw)> regels)
    {
        // Bij btw verlegd draagt de medecontractant de btw af: op het document
        // staat nul procent met de wettelijke vermelding.
        var telling = offerte.BtwVerlegd
            ? regels.Select(r => (r.totaal, BtwTarief.P0)).ToList()
            : regels;
        var (excl, btw, incl, _) = Prijsmotor.Totalen(telling, offerte.KortingPercentage, offerte.KortingBedrag);
        offerte.TotaalExclBtw = excl;
        offerte.TotaalBtw = btw;
        offerte.TotaalInclBtw = incl;
    }

    // Instellingen voor het documentsjabloon (configuratie boven code).
    public async Task<(Bedrijfsgegevens bedrijf, string voorwaarden, int voorschotPct)> LaadSjabloonGegevens()
    {
        var json = await instellingen.Tekst("bedrijfsgegevens");
        Bedrijfsgegevens bedrijf;
        try
        {
            var d = System.Text.Json.JsonDocument.Parse(json ?? "{}").RootElement;
            string Veld(string naam, string standaard) =>
                d.TryGetProperty(naam, out var w) ? w.GetString() ?? standaard : standaard;
            bedrijf = new Bedrijfsgegevens(
                Veld("naam", "Poortland nv"), Veld("straat", ""), Veld("postcode", ""),
                Veld("gemeente", "Mechelen"), Veld("telefoon", ""), Veld("btw", ""));
        }
        catch
        {
            bedrijf = new Bedrijfsgegevens("Poortland nv", "", "", "Mechelen", "", "");
        }
        var voorwaarden = await instellingen.Tekst("offerte_voorwaarden")
            ?? "Voorschot bij bestelling, saldo na plaatsing. Garantie 24 maanden.";
        var voorschotPct = await instellingen.Getal("voorschot_percentage", 30);
        return (bedrijf, voorwaarden, voorschotPct);
    }

    public async Task<(byte[] bytes, Offerte offerte)> GenereerPdf(Guid id)
    {
        var offerte = await Laad(id);
        var (bedrijf, voorwaarden, voorschotPct) = await LaadSjabloonGegevens();
        return (pdf.Genereer(offerte, bedrijf, voorwaarden, voorschotPct), offerte);
    }

    // TS-05 sectie 5: verzenden per email en de communicatie bij het dossier bewaren.
    public async Task<Offerte> Verzenden(Guid id)
    {
        var offerte = await Laad(id);
        if (!offerte.Regels.Any(r => r.VerwijderdOp is null))
            throw new DomeinFout("Een offerte zonder regels kan niet verzonden worden.");
        var klant = offerte.Project!.Klant!;
        offerte.Status = OfferteStatus.Verzonden;
        offerte.VerzondenOp = DateTimeOffset.UtcNow;

        var (bedrijf, voorwaarden, voorschotPct) = await LaadSjabloonGegevens();
        var pdfBytes = pdf.Genereer(offerte, bedrijf, voorwaarden, voorschotPct);
        // SSOT nuance: het verzonden document wordt bevroren bewaard zodat het
        // niet mee verandert wanneer klantgegevens later wijzigen.
        string? documentPad = $"offertes/{offerte.Nummer}-v{offerte.VersieOfferte}.pdf";
        try { await opslag.Upload("documenten", documentPad, pdfBytes, "application/pdf"); }
        catch { documentPad = null; } // dev zonder opslagsleutel: verzenden blijft werken
        var onderwerp = $"Offerte {offerte.Nummer} van Poortland";
        var tekst = $"Beste {klant.Naam}\n\nIn bijlage vindt u offerte {offerte.Nummer} (geldig tot {offerte.GeldigTot:dd/MM/yyyy}).\n\nMet vriendelijke groeten\nPoortland";
        var status = CommunicatieStatus.Gelogd;
        if (!string.IsNullOrWhiteSpace(klant.Email))
        {
            await email.Verzend(klant.Email!, onderwerp, tekst, (pdfBytes, $"{offerte.Nummer}.pdf"));
            status = CommunicatieStatus.Verzonden;
        }
        db.Communicaties.Add(new Communicatie
        {
            KlantId = klant.Id, ProjectId = offerte.ProjectId, OfferteId = offerte.Id,
            Onderwerp = onderwerp, Inhoud = tekst, InhoudPad = documentPad, VerzondenOp = DateTimeOffset.UtcNow,
            Status = status, AangemaaktDoor = claims.MedewerkerId
        });
        await db.SaveChangesAsync();
        return offerte;
    }

    // FR-004: goedkeuring maakt automatisch het orderdossier met notificatie.
    public async Task<(Offerte offerte, Order order)> Akkoord(Guid id)
    {
        var offerte = await Laad(id);
        offerte.Status = OfferteStatus.Goedgekeurd;
        offerte.BeslistOp = DateTimeOffset.UtcNow;
        var order = new Order
        {
            OfferteId = offerte.Id,
            DatumGoedkeuring = DateOnly.FromDateTime(DateTime.Today),
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Orders.Add(order);
        var doelwit = offerte.AangemaaktDoor ?? claims.MedewerkerId;
        if (doelwit is { } medewerker)
        {
            db.Notificaties.Add(new Notificatie
            {
                MedewerkerId = medewerker, Type = "order_aangemaakt",
                Titel = $"Offerte {offerte.Nummer} goedgekeurd",
                Boodschap = "Het orderdossier staat klaar voor productie en planning.",
                // Wijst naar het dossier: daar leeft de opvolging (een orderscherm bestaat niet).
                EntiteitType = "project", EntiteitId = offerte.ProjectId,
                AangemaaktDoor = claims.MedewerkerId
            });
        }
        await db.SaveChangesAsync();
        return (offerte, order);
    }

    public async Task<Offerte> Weigeren(Guid id, string reden)
    {
        var offerte = await Laad(id);
        offerte.Status = OfferteStatus.Geweigerd;
        offerte.BeslistOp = DateTimeOffset.UtcNow;
        offerte.WeigerReden = reden;
        await db.SaveChangesAsync();
        return offerte;
    }

    public async Task<Offerte> Heractiveren(Guid id, DateOnly nieuweGeldigheid)
    {
        var offerte = await Laad(id);
        offerte.GeldigTot = nieuweGeldigheid;
        offerte.Status = OfferteStatus.Verzonden;
        await db.SaveChangesAsync();
        return offerte;
    }

    public async Task<Offerte> Laad(Guid id) =>
        await db.Offertes
            .Include(o => o.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.Volgnummer))
            .Include(o => o.Project)!.ThenInclude(p => p!.Klant)
            .FirstOrDefaultAsync(o => o.Id == id)
        ?? throw new DomeinFout("Offerte niet gevonden.");

    async Task<string> VolgendNummer()
    {
        var conn = db.Database.GetDbConnection();
        if (conn.State != System.Data.ConnectionState.Open) await db.Database.OpenConnectionAsync();
        await using var cmd = conn.CreateCommand();
        cmd.CommandText = "select volgend_offertenummer()";
        return (string)(await cmd.ExecuteScalarAsync())!;
    }
}
