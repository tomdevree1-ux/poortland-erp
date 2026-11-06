using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// TS-09 Veld en werkbon, eerste online versie. De werkbon vervangt de
// doorslagbon: werken, materialen met afwijking, meerwerk, foto's voor en na
// (FR-009) en de klanthandtekening op het scherm (FR-013). Offline met
// PowerSync volgt in een latere fase.
[ApiController]
[Route("api/v1")]
[Authorize]
public class WerkbonnenController(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag) : ControllerBase
{
    const string Bucket = "werkbon";
    static readonly string[] FotoTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];

    public record WerkbonInvoer(Guid ProjectId, WerkbonType Type, Guid? PlaatserId, Guid? PlanningsitemId, DateOnly? Uitvoeringsdatum);
    public record WerkbonWijziging(DateOnly? Uitvoeringsdatum, TimeOnly? UrenBegin, TimeOnly? UrenEinde, string? Opmerkingen);
    public record RegelInvoer(string Soort, string Omschrijving, decimal? Aantal, string? Eenheid,
        bool? AfwijkingVanStuklijst, Guid? ArtikelId);
    public record TekenInvoer(string HandtekeningPng, decimal? GpsLat, decimal? GpsLon);

    // Plaatsersnamen in een keer laden zodat de lijstprojectie geen query per bon doet
    // (audit performantie 1, patroon uit PlanningController).
    async Task<Dictionary<Guid, string>> LaadPlaatsers(IEnumerable<Werkbon> bonnen)
    {
        var ids = bonnen.Select(w => w.PlaatserId).Distinct().ToList();
        return await db.Medewerkers.AsNoTracking()
            .Where(m => ids.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, m => ($"{m.Voornaam} {m.Naam}").Trim());
    }

    async Task<object> Projectie(Werkbon w, IReadOnlyDictionary<Guid, string> plaatsers)
    {
        // Signed urls parallel ophalen in plaats van een voor een (audit snelheid 1).
        var fotos = await Task.WhenAll(w.Fotos.Where(f => f.VerwijderdOp == null).Select(async f =>
        {
            string? url = null;
            try { url = await opslag.SignedUrl(Bucket, f.BestandPad, 600); } catch { }
            return (object)new { f.Id, f.Moment, f.Bestandsnaam, f.GpsLat, f.GpsLon, f.AangemaaktOp, url };
        }));
        string? handtekeningUrl = null;
        if (w.KlanthandtekeningPad is not null)
            try { handtekeningUrl = await opslag.SignedUrl(Bucket, w.KlanthandtekeningPad, 600); } catch { }
        return new
        {
            w.Id, w.ProjectId, w.PlaatserId, w.Type, w.PlaatsingNummer, w.Status, w.Uitvoeringsdatum, w.UrenBegin, w.UrenEinde,
            w.Opmerkingen, w.GetekendOp, handtekeningUrl,
            plaatser = plaatsers.GetValueOrDefault(w.PlaatserId, "—"),
            project = w.Project is null ? null : new
            {
                w.Project.Id, w.Project.Nummer, w.Project.Werfadres,
                klant = new { w.Project.Klant!.Naam, w.Project.Klant.Voornaam, w.Project.Klant.Bedrijfsnaam }
            },
            regels = w.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.AangemaaktOp)
                .Select(r => new { r.Id, r.Soort, r.Omschrijving, r.Aantal, r.Eenheid,
                    r.AfwijkingVanStuklijst, r.ArtikelId, r.ArtikelCode }),
            fotos
        };
    }

    [HttpGet("projecten/{projectId:guid}/werkbonnen")]
    public async Task<IActionResult> VanProject(Guid projectId)
    {
        var bonnen = await db.Werkbonnen.AsNoTracking()
            .Include(w => w.Project!).ThenInclude(p => p.Klant)
            .Include(w => w.Regels).Include(w => w.Fotos)
            .Where(w => w.ProjectId == projectId && w.VerwijderdOp == null)
            .OrderByDescending(w => w.AangemaaktOp)
            .ToListAsync();
        var namen = await LaadPlaatsers(bonnen);
        var lijst = await Task.WhenAll(bonnen.Select(w => Projectie(w, namen)));
        return Ok(lijst);
    }

    // FR-012: de eigen bonnen van de plaatser, open eerst.
    [HttpGet("werkbonnen/mijn")]
    public async Task<IActionResult> Mijn()
    {
        var mijnId = claims.MedewerkerId!.Value;
        var bonnen = await db.Werkbonnen.AsNoTracking()
            .Include(w => w.Project!).ThenInclude(p => p.Klant)
            .Include(w => w.Regels).Include(w => w.Fotos)
            .Where(w => w.PlaatserId == mijnId && w.VerwijderdOp == null
                && w.Status != WerkbonStatus.VerwerktInFacturatie)
            .OrderBy(w => w.Status).ThenBy(w => w.Uitvoeringsdatum)
            .Take(50)
            .ToListAsync();
        var namen = await LaadPlaatsers(bonnen);
        var lijst = await Task.WhenAll(bonnen.Select(w => Projectie(w, namen)));
        return Ok(lijst);
    }

    [HttpGet("werkbonnen/{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var bon = await db.Werkbonnen.AsNoTracking()
            .Include(w => w.Project!).ThenInclude(p => p.Klant)
            .Include(w => w.Regels).Include(w => w.Fotos)
            .FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        return Ok(await Projectie(bon, await LaadPlaatsers([bon])));
    }

    // De planner (of montage zelf) maakt de werkbon aan (TS-09 sectie 4 en 7).
    [HttpPost("werkbonnen")]
    [VereistRol("planning", "montage")]
    public async Task<IActionResult> Maak(WerkbonInvoer invoer)
    {
        var bon = new Werkbon
        {
            ProjectId = invoer.ProjectId, Type = invoer.Type,
            PlaatserId = invoer.PlaatserId ?? claims.MedewerkerId!.Value,
            PlanningsitemId = invoer.PlanningsitemId,
            Uitvoeringsdatum = invoer.Uitvoeringsdatum ?? DateOnly.FromDateTime(DateTime.Today),
            AangemaaktDoor = claims.MedewerkerId
        };
        // Elke plaatsing krijgt automatisch het volgende nummer binnen het dossier.
        // Verwijderde bonnen tellen mee zodat een nummer nooit hergebruikt wordt.
        if (invoer.Type == WerkbonType.Plaatsing)
        {
            var hoogste = await db.Werkbonnen
                .Where(w => w.ProjectId == invoer.ProjectId && w.Type == WerkbonType.Plaatsing)
                .MaxAsync(w => (int?)w.PlaatsingNummer);
            bon.PlaatsingNummer = (hoogste ?? 0) + 1;
        }
        db.Werkbonnen.Add(bon);
        await db.SaveChangesAsync();
        return Ok(new { bon.Id });
    }

    [HttpPatch("werkbonnen/{id:guid}")]
    [VereistRol("montage", "planning")]
    public async Task<IActionResult> Wijzig(Guid id, WerkbonWijziging invoer)
    {
        var bon = await db.Werkbonnen.FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        if (bon.Status is WerkbonStatus.KlantGetekend or WerkbonStatus.VerwerktInFacturatie)
            return BadRequest(new { fout = "Een getekende werkbon wijzigt niet meer." });
        // Uren einde mag niet vóór uren begin liggen (audit randgevallen 5).
        if (invoer.UrenBegin is { } b && invoer.UrenEinde is { } e && e < b)
            return BadRequest(new { fout = "De einduren liggen vóór de beginuren." });
        if (invoer.Uitvoeringsdatum is { } d) bon.Uitvoeringsdatum = d;
        bon.UrenBegin = invoer.UrenBegin;
        bon.UrenEinde = invoer.UrenEinde;
        if (invoer.Opmerkingen is not null) bon.Opmerkingen = invoer.Opmerkingen;
        await db.SaveChangesAsync();
        return Ok(new { bon.Id });
    }

    [HttpPost("werkbonnen/{id:guid}/regels")]
    [VereistRol("montage", "planning")]
    public async Task<IActionResult> MaakRegel(Guid id, RegelInvoer invoer)
    {
        var bon = await db.Werkbonnen.FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        if (bon.Status is WerkbonStatus.KlantGetekend or WerkbonStatus.VerwerktInFacturatie)
            return BadRequest(new { fout = "Een getekende werkbon wijzigt niet meer." });
        // Bij een gekozen artikel nemen wij naam, code en eenheid over, zodat de
        // bon leesbaar blijft wanneer het artikel later hernoemd of geschrapt wordt.
        var omschrijving = invoer.Omschrijving;
        string? artikelCode = null;
        var eenheid = invoer.Eenheid;
        if (invoer.ArtikelId is { } artikelId)
        {
            var artikel = await db.Artikelen.AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == artikelId && a.VerwijderdOp == null);
            if (artikel is null) return BadRequest(new { fout = "Dat artikel bestaat niet." });
            artikelCode = artikel.Code;
            if (string.IsNullOrWhiteSpace(omschrijving)) omschrijving = artikel.Naam;
            eenheid ??= artikel.Eenheid switch
            {
                ArtikelEenheid.LopendeMeter => "m",
                ArtikelEenheid.VierkanteMeter => "m2",
                _ => "stuk"
            };
        }
        if (string.IsNullOrWhiteSpace(omschrijving))
            return BadRequest(new { fout = "Een regel heeft een omschrijving of een artikel nodig." });

        var regel = new Werkbonregel
        {
            WerkbonId = id, Soort = invoer.Soort, Omschrijving = omschrijving.Trim(),
            Aantal = invoer.Aantal, Eenheid = eenheid,
            AfwijkingVanStuklijst = invoer.AfwijkingVanStuklijst ?? false,
            ArtikelId = invoer.ArtikelId, ArtikelCode = artikelCode,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Werkbonregels.Add(regel);
        await db.SaveChangesAsync();
        return Ok(regel);
    }

    [HttpDelete("werkbonregels/{id:guid}")]
    [VereistRol("montage", "planning")]
    public async Task<IActionResult> VerwijderRegel(Guid id)
    {
        var regel = await db.Werkbonregels.FirstOrDefaultAsync(r => r.Id == id && r.VerwijderdOp == null);
        if (regel is null) return NotFound();
        regel.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { regel.Id, verwijderd = true });
    }

    // FR-009: foto's voor en na met tijdstempel en eventueel gps.
    [HttpPost("werkbonnen/{id:guid}/fotos")]
    [VereistRol("montage", "planning")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    public async Task<IActionResult> UploadFoto(Guid id, [FromForm] IFormFile bestand, [FromForm] string moment,
        [FromForm] decimal? gpsLat, [FromForm] decimal? gpsLon)
    {
        if (moment is not ("voor" or "na")) return BadRequest(new { fout = "Moment is voor of na." });
        if (!FotoTypes.Contains(bestand.ContentType)) return BadRequest(new { fout = "Toegelaten: jpeg, png, webp of heic." });
        if (bestand.Length == 0 || bestand.Length > 10 * 1024 * 1024) return BadRequest(new { fout = "Maximaal 10 MB per foto." });

        var foto = new Werkbonfoto
        {
            Id = Guid.NewGuid(), WerkbonId = id, Moment = moment,
            Bestandsnaam = bestand.FileName, GpsLat = gpsLat, GpsLon = gpsLon,
            AangemaaktDoor = claims.MedewerkerId
        };
        var extensie = Path.GetExtension(bestand.FileName);
        if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
        foto.BestandPad = $"{id}/{foto.Id}{extensie}";

        using var geheugen = new MemoryStream();
        await bestand.CopyToAsync(geheugen);
        await opslag.Upload(Bucket, foto.BestandPad, geheugen.ToArray(), bestand.ContentType);

        db.Werkbonfotos.Add(foto);
        await db.SaveChangesAsync();
        return Ok(new { foto.Id, foto.Moment });
    }

    [HttpPost("werkbonnen/{id:guid}/afronden")]
    [VereistRol("montage")]
    public async Task<IActionResult> Afronden(Guid id)
    {
        var bon = await db.Werkbonnen.FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        bon.Status = WerkbonStatus.Uitgevoerd;
        await db.SaveChangesAsync();
        return Ok(new { bon.Id, bon.Status });
    }

    // FR-013: de klant tekent op het scherm; de bon bevriest en is meteen
    // beschikbaar voor kantoor, planning en facturatie.
    [HttpPost("werkbonnen/{id:guid}/tekenen")]
    [VereistRol("montage")]
    public async Task<IActionResult> Tekenen(Guid id, TekenInvoer invoer)
    {
        var bon = await db.Werkbonnen.FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        var basis64 = invoer.HandtekeningPng;
        var komma = basis64.IndexOf(',');
        if (komma >= 0) basis64 = basis64[(komma + 1)..];
        byte[] bytes;
        try { bytes = Convert.FromBase64String(basis64); }
        catch { return BadRequest(new { fout = "De handtekening is geen geldig beeld." }); }
        if (bytes.Length is 0 or > 2 * 1024 * 1024)
            return BadRequest(new { fout = "De handtekening is leeg of te groot." });

        bon.KlanthandtekeningPad = $"{id}/handtekening.png";
        await opslag.Upload(Bucket, bon.KlanthandtekeningPad, bytes, "image/png");
        bon.HandtekeningMethode = "online";
        bon.GpsLat = invoer.GpsLat;
        bon.GpsLon = invoer.GpsLon;
        bon.Status = WerkbonStatus.KlantGetekend;
        // Zonder dit bleef het moment van tekenen leeg en drukte de pdf
        // "digitaal getekend op" af zonder datum.
        bon.GetekendOp = DateTimeOffset.UtcNow;

        // Een getekende plaatsingsbon betekent dat de montage achter de rug is.
        // Zonder deze stap kwam het dossier nooit in de lijst factuurklaar,
        // want die vraagt de status Gemonteerd en niemand kende ze ooit toe.
        if (bon.Type == WerkbonType.Plaatsing)
        {
            var project = await db.Projecten.FirstOrDefaultAsync(p => p.Id == bon.ProjectId);
            if (project is { Status: OrderStatus.Aangemaakt or OrderStatus.InProductie
                or OrderStatus.ExterneBehandeling or OrderStatus.KlaarVoorMontage })
                project.Status = OrderStatus.Gemonteerd;
        }
        await db.SaveChangesAsync();
        return Ok(new { bon.Id, bon.Status, bon.GetekendOp });
    }

    // De werkbon als pdf: vervangt de papieren doorslagbon richting klant en
    // facturatie, met regels, foto's en de digitale handtekening erop.
    [HttpGet("werkbonnen/{id:guid}/pdf")]
    public async Task<IActionResult> Pdf(Guid id,
        [FromServices] WerkbonPdfService pdfService, [FromServices] OfferteService offerteService)
    {
        var bon = await db.Werkbonnen.AsNoTracking()
            .Include(w => w.Project!).ThenInclude(p => p.Klant)
            .Include(w => w.Regels).Include(w => w.Fotos)
            .FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();

        var namen = await LaadPlaatsers([bon]);
        var (bedrijf, _, _) = await offerteService.LaadSjabloonGegevens();

        byte[]? handtekening = null;
        if (bon.KlanthandtekeningPad is not null)
            try { handtekening = await opslag.Download(Bucket, bon.KlanthandtekeningPad); } catch { }

        var fotos = new List<WerkbonPdfService.FotoBijlage>();
        foreach (var f in bon.Fotos.Where(f => f.VerwijderdOp == null).OrderBy(f => f.AangemaaktOp))
            try { fotos.Add(new(f.Moment, f.Bestandsnaam, await opslag.Download(Bucket, f.BestandPad))); } catch { }

        // De contactpersoon van de klant hoort bij Tel op de bon. Die stond er
        // nooit op, al bestaat het veld. Eerste contactpersoon met een nummer.
        string? contact = null;
        if (bon.Project?.KlantId is { } klantId)
        {
            var cp = await db.Contactpersonen.AsNoTracking()
                .Where(c => c.KlantId == klantId && c.VerwijderdOp == null && c.Telefoon != null)
                .OrderBy(c => c.AangemaaktOp)
                .Select(c => new { c.Naam, c.Telefoon }).FirstOrDefaultAsync();
            if (cp is not null) contact = $"{cp.Naam} · {cp.Telefoon}";
        }

        var bytes = pdfService.Genereer(bon, namen.GetValueOrDefault(bon.PlaatserId, "—"), bedrijf,
            handtekening, fotos, contact: contact, bonOpmerking: bon.Opmerkingen);
        var naam = $"LSB_{WerkbonPdfService.TypeTekst(bon).Replace(' ', '_')}_dossier_{bon.Project?.Nummer.ToString() ?? "onbekend"}.pdf";
        return File(bytes, "application/pdf", naam);
    }

    [HttpPost("werkbonnen/{id:guid}/naar-facturatie")]
    [VereistRol("boekhouding")]
    public async Task<IActionResult> NaarFacturatie(Guid id)
    {
        var bon = await db.Werkbonnen.FirstOrDefaultAsync(w => w.Id == id && w.VerwijderdOp == null);
        if (bon is null) return NotFound();
        bon.Status = WerkbonStatus.VerwerktInFacturatie;
        await db.SaveChangesAsync();
        return Ok(new { bon.Id, bon.Status });
    }
}
