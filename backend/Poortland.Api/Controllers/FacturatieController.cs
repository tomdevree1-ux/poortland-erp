using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

// TS-10 Facturatievoorbereiding (FR-014): geen eigen facturatiemotor (ADR-005).
// Het factuurvoorstel bundelt de goedgekeurde offerte en het uitgevoerde werk,
// de boekhouding keurt goed na de consistentiecontrole en geeft door aan
// Exact Online. Zolang de directe koppeling er niet is dient de CSV export
// als alternatief pad (spec sectie 4) en wordt het nummer manueel teruggemeld.
[ApiController]
[Route("api/v1/facturatie")]
[Authorize]
public class FacturatieController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record VoorstelInvoer(FactuurSoort Soort);
    public record RegelInvoer(string Omschrijving, decimal Aantal, string? Eenheid, decimal Eenheidsprijs, BtwTarief Btw);
    public record GoedkeurInvoer(bool AfwijkingBevestigd);
    public record GefactureerdInvoer(string? ExactNummer);

    static decimal BtwPct(BtwTarief t) => t switch
    {
        BtwTarief.P0 => 0m,
        BtwTarief.P6 => 0.06m,
        _ => 0.21m
    };

    static string EenheidTekst(ArtikelEenheid e) => e switch
    {
        ArtikelEenheid.LopendeMeter => "lm",
        ArtikelEenheid.VierkanteMeter => "m2",
        _ => "stuk"
    };

    static void Herbereken(Factuurvoorstel v)
    {
        var regels = v.Regels.Where(r => r.VerwijderdOp == null).ToList();
        v.TotaalExclBtw = Math.Round(regels.Sum(r => r.Aantal * r.Eenheidsprijs), 2);
        v.TotaalBtw = Math.Round(regels.Sum(r => r.Aantal * r.Eenheidsprijs * BtwPct(r.Btw)), 2);
        v.TotaalInclBtw = v.TotaalExclBtw + v.TotaalBtw;
    }

    async Task<decimal?> OfferteTotaal(Guid projectId) =>
        await db.Offertes.AsNoTracking()
            .Where(o => o.ProjectId == projectId && o.VerwijderdOp == null && o.Status == OfferteStatus.Goedgekeurd)
            .OrderByDescending(o => o.GewijzigdOp)
            .Select(o => (decimal?)o.TotaalExclBtw)
            .FirstOrDefaultAsync();

    // Overzicht van de dossiers die factuurklaar zijn (spec sectie 2):
    // gemonteerd of afgesloten met een door de klant getekende werkbon.
    [HttpGet("factuurklaar")]
    [VereistRol("boekhouding", "verkoop")]
    public async Task<IActionResult> Factuurklaar()
    {
        var projecten = await db.Projecten.AsNoTracking()
            .Include(p => p.Klant)
            .Where(p => p.VerwijderdOp == null &&
                (p.Status == OrderStatus.Gemonteerd || p.Status == OrderStatus.Afgesloten))
            .OrderByDescending(p => p.GewijzigdOp)
            .Take(100)
            .ToListAsync();
        var ids = projecten.Select(p => p.Id).ToList();

        // Defensief zolang migratie 0029 nog niet toegepast is.
        var getekend = new HashSet<Guid>();
        var meerwerk = new Dictionary<Guid, int>();
        try
        {
            var bonnen = await db.Werkbonnen.AsNoTracking()
                .Where(w => w.VerwijderdOp == null && ids.Contains(w.ProjectId) &&
                    (w.Status == WerkbonStatus.KlantGetekend || w.Status == WerkbonStatus.VerwerktInFacturatie))
                .Select(w => new { w.Id, w.ProjectId })
                .ToListAsync();
            getekend = bonnen.Select(b => b.ProjectId).ToHashSet();
            var bonIds = bonnen.Select(b => b.Id).ToList();
            var meerwerkRegels = await db.Werkbonregels.AsNoTracking()
                .Where(r => r.VerwijderdOp == null && r.Soort == "meerwerk" && bonIds.Contains(r.WerkbonId))
                .Select(r => r.WerkbonId)
                .ToListAsync();
            var bonNaarProject = bonnen.ToDictionary(b => b.Id, b => b.ProjectId);
            foreach (var wb in meerwerkRegels)
                meerwerk[bonNaarProject[wb]] = meerwerk.GetValueOrDefault(bonNaarProject[wb]) + 1;
        }
        catch (Npgsql.PostgresException) { }

        var voorstellen = new List<Factuurvoorstel>();
        try
        {
            voorstellen = await db.Factuurvoorstellen.AsNoTracking()
                .Where(f => f.VerwijderdOp == null && ids.Contains(f.ProjectId))
                .ToListAsync();
        }
        catch (Npgsql.PostgresException) { }

        var offertes = await db.Offertes.AsNoTracking()
            .Where(o => o.VerwijderdOp == null && o.Status == OfferteStatus.Goedgekeurd && ids.Contains(o.ProjectId))
            .Select(o => new { o.ProjectId, o.TotaalExclBtw })
            .ToListAsync();

        return Ok(projecten.Select(p => new
        {
            p.Id, p.Nummer, p.Werfadres, p.Status,
            klant = new { p.Klant!.Naam, p.Klant.Voornaam, p.Klant.Bedrijfsnaam },
            offerteTotaal = offertes.Where(o => o.ProjectId == p.Id).Sum(o => o.TotaalExclBtw),
            werkbonGetekend = getekend.Contains(p.Id),
            meerwerkRegels = meerwerk.GetValueOrDefault(p.Id),
            voorstellen = voorstellen.Where(f => f.ProjectId == p.Id)
                .Select(f => new { f.Id, f.Soort, f.Status, f.TotaalInclBtw, f.ExactNummer })
        }));
    }

    [HttpGet("voorstellen")]
    [VereistRol("boekhouding", "verkoop")]
    public async Task<IActionResult> Voorstellen([FromQuery] FactuurStatus? status)
    {
        var query = db.Factuurvoorstellen.AsNoTracking()
            .Include(f => f.Project!).ThenInclude(p => p.Klant)
            .Where(f => f.VerwijderdOp == null);
        if (status is { } st) query = query.Where(f => f.Status == st);
        var lijst = await query.OrderByDescending(f => f.AangemaaktOp).Take(200).ToListAsync();
        return Ok(lijst.Select(f => new
        {
            f.Id, f.Soort, f.Status, f.TotaalExclBtw, f.TotaalInclBtw, f.ExactNummer,
            f.GoedgekeurdOp, f.GefactureerdOp, f.AangemaaktOp,
            project = new { f.Project!.Id, f.Project.Nummer, f.Project.Werfadres },
            klant = new { f.Project.Klant!.Naam, f.Project.Klant.Voornaam, f.Project.Klant.Bedrijfsnaam }
        }));
    }

    [HttpGet("voorstellen/{id:guid}")]
    [VereistRol("boekhouding", "verkoop")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var v = await db.Factuurvoorstellen.AsNoTracking()
            .Include(f => f.Regels)
            .Include(f => f.Project!).ThenInclude(p => p.Klant)
            .FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        var offerteTotaal = await OfferteTotaal(v.ProjectId);
        return Ok(new
        {
            v.Id, v.Soort, v.Status, v.AfwijkingBevestigd,
            v.TotaalExclBtw, v.TotaalBtw, v.TotaalInclBtw,
            v.ExactNummer, v.GoedgekeurdOp, v.GefactureerdOp,
            offerteTotaal,
            afwijkingVanOfferte = v.Soort == FactuurSoort.Eind && offerteTotaal is { } ot &&
                Math.Abs(v.TotaalExclBtw - ot) > 0.01m,
            project = new { v.Project!.Id, v.Project.Nummer, v.Project.Werfadres },
            klant = new { v.Project.Klant!.Naam, v.Project.Klant.Voornaam, v.Project.Klant.Bedrijfsnaam, v.Project.Klant.BtwNummer },
            regels = v.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.Volgnummer)
                .Select(r => new { r.Id, r.Volgnummer, r.Bron, r.Omschrijving, r.Aantal, r.Eenheid, r.Eenheidsprijs, r.Btw,
                    totaal = Math.Round(r.Aantal * r.Eenheidsprijs, 2) })
        });
    }

    // Voorstel genereren: de offerte tegenover het uitgevoerde werk (spec 2 en 3).
    [HttpPost("projecten/{projectId:guid}/voorstellen")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> Maak(Guid projectId, VoorstelInvoer invoer)
    {
        var project = await db.Projecten.AsNoTracking().FirstOrDefaultAsync(p => p.Id == projectId && p.VerwijderdOp == null);
        if (project is null) return NotFound();

        var offerte = await db.Offertes.AsNoTracking()
            .Include(o => o.Regels)
            .Where(o => o.ProjectId == projectId && o.VerwijderdOp == null && o.Status == OfferteStatus.Goedgekeurd)
            .OrderByDescending(o => o.GewijzigdOp)
            .FirstOrDefaultAsync();
        if (offerte is null) return BadRequest(new { fout = "Geen goedgekeurde offerte op dit dossier." });

        var order = await db.Orders.AsNoTracking()
            .Where(o => o.OfferteId == offerte.Id && o.VerwijderdOp == null)
            .Select(o => (Guid?)o.Id).FirstOrDefaultAsync();

        var voorstel = new Factuurvoorstel
        {
            ProjectId = projectId,
            OrderId = order,
            Soort = invoer.Soort,
            AangemaaktDoor = claims.MedewerkerId
        };

        var volg = 1;
        if (invoer.Soort == FactuurSoort.Voorschot)
        {
            voorstel.Regels.Add(new Factuurvoorstelregel
            {
                Volgnummer = volg++,
                Bron = FactuurregelBron.Handmatig,
                Omschrijving = $"Voorschot volgens offerte {offerte.Nummer}",
                Aantal = 1,
                Eenheidsprijs = Math.Round(offerte.TotaalExclBtw * 0.3m, 2),
                Btw = BtwTarief.P21,
                AangemaaktDoor = claims.MedewerkerId
            });
        }
        else
        {
            foreach (var r in offerte.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.Volgnummer))
            {
                var aantal = r.Aantal == 0 ? 1 : r.Aantal;
                voorstel.Regels.Add(new Factuurvoorstelregel
                {
                    Volgnummer = volg++,
                    Bron = FactuurregelBron.Offerte,
                    Omschrijving = r.Omschrijving,
                    Aantal = aantal,
                    Eenheid = EenheidTekst(r.Eenheid),
                    Eenheidsprijs = Math.Round(r.Totaal / aantal, 2),
                    Btw = r.Btw,
                    AangemaaktDoor = claims.MedewerkerId
                });
            }
            if (offerte.KortingBedrag > 0)
            {
                voorstel.Regels.Add(new Factuurvoorstelregel
                {
                    Volgnummer = volg++,
                    Bron = FactuurregelBron.Offerte,
                    Omschrijving = "Commerciële korting volgens offerte",
                    Aantal = 1,
                    Eenheidsprijs = -offerte.KortingBedrag,
                    Btw = BtwTarief.P21,
                    AangemaaktDoor = claims.MedewerkerId
                });
            }

            // Meerwerk van de getekende werkbonnen als voorstelregels zonder prijs;
            // de boekhouding prijst en bevestigt de afwijking expliciet (spec 3).
            try
            {
                var bonIds = await db.Werkbonnen.AsNoTracking()
                    .Where(w => w.ProjectId == projectId && w.VerwijderdOp == null &&
                        (w.Status == WerkbonStatus.KlantGetekend || w.Status == WerkbonStatus.VerwerktInFacturatie))
                    .Select(w => w.Id).ToListAsync();
                var meerwerk = await db.Werkbonregels.AsNoTracking()
                    .Where(r => r.VerwijderdOp == null && r.Soort == "meerwerk" && bonIds.Contains(r.WerkbonId))
                    .OrderBy(r => r.AangemaaktOp).ToListAsync();
                foreach (var m in meerwerk)
                {
                    voorstel.Regels.Add(new Factuurvoorstelregel
                    {
                        Volgnummer = volg++,
                        Bron = FactuurregelBron.Meerwerk,
                        Omschrijving = $"Meerwerk: {m.Omschrijving}",
                        Aantal = m.Aantal ?? 1,
                        Eenheid = m.Eenheid,
                        Eenheidsprijs = 0,
                        Btw = BtwTarief.P21,
                        AangemaaktDoor = claims.MedewerkerId
                    });
                }
            }
            catch (Npgsql.PostgresException) { }
        }

        Herbereken(voorstel);
        db.Factuurvoorstellen.Add(voorstel);
        await db.SaveChangesAsync();
        return Ok(new { voorstel.Id });
    }

    [HttpPost("voorstellen/{id:guid}/regels")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> RegelToevoegen(Guid id, RegelInvoer invoer)
    {
        var v = await db.Factuurvoorstellen.Include(f => f.Regels).FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        if (v.Status != FactuurStatus.Concept) return BadRequest(new { fout = "Alleen een concept is bewerkbaar." });
        v.Regels.Add(new Factuurvoorstelregel
        {
            Volgnummer = v.Regels.Where(r => r.VerwijderdOp == null).Select(r => r.Volgnummer).DefaultIfEmpty(0).Max() + 1,
            Bron = FactuurregelBron.Handmatig,
            Omschrijving = invoer.Omschrijving,
            Aantal = invoer.Aantal,
            Eenheid = invoer.Eenheid,
            Eenheidsprijs = invoer.Eenheidsprijs,
            Btw = invoer.Btw,
            AangemaaktDoor = claims.MedewerkerId
        });
        Herbereken(v);
        await db.SaveChangesAsync();
        return Ok(new { v.Id });
    }

    [HttpPatch("regels/{regelId:guid}")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> RegelWijzig(Guid regelId, RegelInvoer invoer)
    {
        var regel = await db.Factuurvoorstelregels.FirstOrDefaultAsync(r => r.Id == regelId && r.VerwijderdOp == null);
        if (regel is null) return NotFound();
        var v = await db.Factuurvoorstellen.Include(f => f.Regels)
            .FirstOrDefaultAsync(f => f.Id == regel.FactuurvoorstelId && f.VerwijderdOp == null);
        if (v is null || v.Status != FactuurStatus.Concept) return BadRequest(new { fout = "Alleen een concept is bewerkbaar." });
        regel.Omschrijving = invoer.Omschrijving;
        regel.Aantal = invoer.Aantal;
        regel.Eenheid = invoer.Eenheid;
        regel.Eenheidsprijs = invoer.Eenheidsprijs;
        regel.Btw = invoer.Btw;
        Herbereken(v);
        await db.SaveChangesAsync();
        return Ok(new { regel.Id });
    }

    [HttpDelete("regels/{regelId:guid}")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> RegelVerwijder(Guid regelId)
    {
        var regel = await db.Factuurvoorstelregels.FirstOrDefaultAsync(r => r.Id == regelId && r.VerwijderdOp == null);
        if (regel is null) return NotFound();
        var v = await db.Factuurvoorstellen.Include(f => f.Regels)
            .FirstOrDefaultAsync(f => f.Id == regel.FactuurvoorstelId && f.VerwijderdOp == null);
        if (v is null || v.Status != FactuurStatus.Concept) return BadRequest(new { fout = "Alleen een concept is bewerkbaar." });
        regel.VerwijderdOp = DateTimeOffset.UtcNow;
        Herbereken(v);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // Consistentiecontrole (spec 3): een afwijking tegenover de offerte of
    // meerwerkregels vragen een expliciete bevestiging voor de goedkeuring.
    [HttpPost("voorstellen/{id:guid}/goedkeuren")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> Goedkeuren(Guid id, GoedkeurInvoer invoer)
    {
        var v = await db.Factuurvoorstellen.Include(f => f.Regels).FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        if (v.Status != FactuurStatus.Concept) return BadRequest(new { fout = "Alleen een concept kan goedgekeurd worden." });

        var regels = v.Regels.Where(r => r.VerwijderdOp == null).ToList();
        if (regels.Count == 0) return BadRequest(new { fout = "Een leeg voorstel kan niet goedgekeurd worden." });
        if (regels.Any(r => r.Bron == FactuurregelBron.Meerwerk && r.Eenheidsprijs == 0))
            return BadRequest(new { fout = "Prijs eerst alle meerwerkregels of verwijder ze." });

        var offerteTotaal = await OfferteTotaal(v.ProjectId);
        var afwijking = regels.Any(r => r.Bron == FactuurregelBron.Meerwerk) ||
            (v.Soort == FactuurSoort.Eind && offerteTotaal is { } ot && Math.Abs(v.TotaalExclBtw - ot) > 0.01m);
        if (afwijking && !invoer.AfwijkingBevestigd)
            return Conflict(new { fout = "Het voorstel wijkt af van de offerte. Bevestig de afwijking expliciet.", afwijking = true });

        v.AfwijkingBevestigd = afwijking;
        v.Status = FactuurStatus.Goedgekeurd;
        v.GoedgekeurdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { v.Id, v.Status });
    }

    [HttpPost("voorstellen/{id:guid}/heropen")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> Heropen(Guid id)
    {
        var v = await db.Factuurvoorstellen.FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        if (v.Status != FactuurStatus.Goedgekeurd) return BadRequest(new { fout = "Alleen een goedgekeurd voorstel kan terug naar concept." });
        v.Status = FactuurStatus.Concept;
        await db.SaveChangesAsync();
        return Ok(new { v.Id, v.Status });
    }

    // Alternatief pad zolang de directe Exact koppeling er niet is (spec 4):
    // een exportbestand met klant, btw, ordernummer, lijnen en tarief.
    [HttpGet("voorstellen/{id:guid}/export")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> Export(Guid id)
    {
        var v = await db.Factuurvoorstellen.AsNoTracking()
            .Include(f => f.Regels)
            .Include(f => f.Project!).ThenInclude(p => p.Klant)
            .FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        if (v.Status == FactuurStatus.Concept) return BadRequest(new { fout = "Keur het voorstel eerst goed." });

        static string Csv(string? w) => $"\"{(w ?? "").Replace("\"", "\"\"")}\"";
        var k = v.Project!.Klant!;
        var klantnaam = !string.IsNullOrWhiteSpace(k.Bedrijfsnaam) ? k.Bedrijfsnaam : $"{k.Voornaam} {k.Naam}".Trim();
        var sb = new StringBuilder();
        sb.AppendLine("Klant;BtwNummer;Dossier;Soort;Omschrijving;Aantal;Eenheid;Eenheidsprijs;BtwPct;RegelTotaalExcl");
        foreach (var r in v.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.Volgnummer))
        {
            sb.AppendLine(string.Join(';',
                Csv(klantnaam), Csv(k.BtwNummer), Csv(v.Project.Nummer.ToString()), Csv(v.Soort.ToString().ToLowerInvariant()),
                Csv(r.Omschrijving), r.Aantal.ToString("0.##", System.Globalization.CultureInfo.InvariantCulture),
                Csv(r.Eenheid), r.Eenheidsprijs.ToString("0.00", System.Globalization.CultureInfo.InvariantCulture),
                (BtwPct(r.Btw) * 100).ToString("0"), (r.Aantal * r.Eenheidsprijs).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)));
        }
        var naam = $"factuur_dossier_{v.Project.Nummer}_{v.Soort.ToString().ToLowerInvariant()}.csv";
        return File(Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray(), "text/csv", naam);
    }

    // Terugmelding uit Exact Online (spec 5): nummer bewaren en het dossier
    // en de order afsluiten.
    [HttpPost("voorstellen/{id:guid}/gefactureerd")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> Gefactureerd(Guid id, GefactureerdInvoer invoer)
    {
        var v = await db.Factuurvoorstellen.FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (v is null) return NotFound();
        if (v.Status != FactuurStatus.Goedgekeurd) return BadRequest(new { fout = "Keur het voorstel eerst goed." });

        v.Status = FactuurStatus.Gefactureerd;
        v.GefactureerdOp = DateTimeOffset.UtcNow;
        v.ExactNummer = string.IsNullOrWhiteSpace(invoer.ExactNummer) ? null : invoer.ExactNummer.Trim();

        var project = await db.Projecten.FirstOrDefaultAsync(p => p.Id == v.ProjectId && p.VerwijderdOp == null);
        if (project is { Status: OrderStatus.Gemonteerd }) project.Status = OrderStatus.Afgesloten;
        if (v.OrderId is { } orderId)
        {
            var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.VerwijderdOp == null);
            if (order is { Status: OrderStatus.Gemonteerd }) order.Status = OrderStatus.Afgesloten;
        }

        await db.SaveChangesAsync();
        return Ok(new { v.Id, v.Status, v.ExactNummer });
    }
}
