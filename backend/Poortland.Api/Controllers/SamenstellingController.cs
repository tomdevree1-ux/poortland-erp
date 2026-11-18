using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// Samenstelling van een dossier (migratie 0051, Tom 2026-11-18): subprojecten,
// onderdelen met vleugelmaten en het globaal overzicht met de LSB per regel.
// Wie wat mag, beslist de databank via RLS op het domein project.
[ApiController]
[Route("api/v1/samenstelling")]
[Authorize]
public class SamenstellingController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record SubprojectInvoer(string Naam, string? Locatie, string? Soort, string? Type, int? Vleugels);
    public record OnderdeelInvoer(string Naam, Guid? OuderId, int? BreedteMm, int? HoogteMm);
    public record RegelInvoer(string Rubriek, Guid? SubprojectId, Guid? OnderdeelId, Guid? ArtikelId,
        string? Omschrijving, decimal? Aantal, string? OpdrachtSoort, DateOnly? GeplandeDatum,
        WerkbonType? LsbType, int? LsbPlaatsingNummer);

    static string? Leeg(string? s) => string.IsNullOrWhiteSpace(s) ? null : s.Trim();
    static BadRequestObjectResult Fout(string tekst) => new(new { fout = tekst });

    // Alles wat het scherm Globaal overzicht nodig heeft in een keer.
    [HttpGet("projecten/{projectId:guid}")]
    public async Task<IActionResult> Lees(Guid projectId)
    {
        var project = await db.Projecten.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == projectId && p.VerwijderdOp == null);
        if (project is null) return NotFound();
        var subprojecten = await db.Subprojecten.AsNoTracking()
            .Where(s => s.ProjectId == projectId && s.VerwijderdOp == null)
            .OrderBy(s => s.Volgnummer).ThenBy(s => s.AangemaaktOp).ToListAsync();
        var subIds = subprojecten.Select(s => s.Id).ToList();
        var onderdelen = await db.SubprojectOnderdelen.AsNoTracking()
            .Where(o => subIds.Contains(o.SubprojectId) && o.VerwijderdOp == null)
            .OrderBy(o => o.Volgnummer).ThenBy(o => o.AangemaaktOp).ToListAsync();
        var regels = await db.Projectregels.AsNoTracking()
            .Where(r => r.ProjectId == projectId && r.VerwijderdOp == null)
            .OrderBy(r => r.Volgnummer).ThenBy(r => r.AangemaaktOp).ToListAsync();
        var bonnen = await db.Werkbonnen.AsNoTracking()
            .Where(w => w.ProjectId == projectId && w.VerwijderdOp == null)
            .Select(w => new { w.Id, w.Type, w.PlaatsingNummer, w.Status }).ToListAsync();
        // Hoogste plaatsing die al ergens gebruikt wordt, zodat er nooit een kolom verdwijnt.
        var hoogste = new[] { project.LsbPlaatsingen }
            .Concat(regels.Where(r => r.LsbPlaatsingNummer != null).Select(r => r.LsbPlaatsingNummer!.Value))
            .Concat(bonnen.Where(b => b.PlaatsingNummer != null).Select(b => b.PlaatsingNummer!.Value))
            .Max();
        return Ok(new
        {
            lsbPlaatsingen = hoogste,
            subprojecten = subprojecten.Select(s => new
            {
                s.Id, s.Naam, s.Locatie, s.Soort, s.Type, s.Volgnummer,
                onderdelen = onderdelen.Where(o => o.SubprojectId == s.Id)
                    .Select(o => new { o.Id, o.OuderId, o.Naam, o.BreedteMm, o.HoogteMm, o.Volgnummer })
            }),
            regels = regels.Select(r => new
            {
                r.Id, r.Rubriek, r.SubprojectId, r.OnderdeelId, r.ArtikelId, r.ArtikelCode, r.Omschrijving,
                r.Aantal, r.OpdrachtSoort, r.GeplandeDatum, r.LsbType, r.LsbPlaatsingNummer
            }),
            werkbonnen = bonnen
        });
    }

    // ---- Subprojecten ----

    [HttpPost("projecten/{projectId:guid}/subprojecten")]
    public async Task<IActionResult> MaakSubproject(Guid projectId, SubprojectInvoer invoer)
    {
        if (!await db.Projecten.AnyAsync(p => p.Id == projectId && p.VerwijderdOp == null)) return NotFound();
        var naam = Leeg(invoer.Naam);
        if (naam is null) return Fout("Geef het subproject een naam, bijvoorbeeld poort oprit.");
        var soort = invoer.Soort ?? "poort";
        if (!SamenstellingService.Soorten.Contains(soort)) return Fout("Onbekend soort subproject.");
        if (invoer.Vleugels is { } v && v is < 0 or > 2) return Fout("Een poort heeft een of twee vleugels.");
        var volgnummer = await db.Subprojecten.CountAsync(s => s.ProjectId == projectId && s.VerwijderdOp == null);
        var sub = new Subproject
        {
            ProjectId = projectId, Naam = naam, Locatie = Leeg(invoer.Locatie), Soort = soort,
            Type = Leeg(invoer.Type), Volgnummer = volgnummer, AangemaaktDoor = claims.MedewerkerId
        };
        db.Subprojecten.Add(sub);
        // Een enkele poort vraagt de maten van een vleugel, een dubbele van twee (Tom 2026-11-18).
        var vleugels = invoer.Vleugels switch
        {
            1 => new[] { "Vleugel" },
            2 => new[] { "Vleugel links", "Vleugel rechts" },
            _ => Array.Empty<string>()
        };
        for (var i = 0; i < vleugels.Length; i++)
            db.SubprojectOnderdelen.Add(new SubprojectOnderdeel
            {
                SubprojectId = sub.Id, Naam = vleugels[i], Volgnummer = i, AangemaaktDoor = claims.MedewerkerId
            });
        await db.SaveChangesAsync();
        return Ok(new { sub.Id });
    }

    [HttpPatch("subprojecten/{id:guid}")]
    public async Task<IActionResult> WijzigSubproject(Guid id, SubprojectInvoer invoer)
    {
        var sub = await db.Subprojecten.FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null);
        if (sub is null) return NotFound();
        var naam = Leeg(invoer.Naam);
        if (naam is null) return Fout("Geef het subproject een naam.");
        var soort = invoer.Soort ?? sub.Soort;
        if (!SamenstellingService.Soorten.Contains(soort)) return Fout("Onbekend soort subproject.");
        sub.Naam = naam; sub.Locatie = Leeg(invoer.Locatie); sub.Soort = soort; sub.Type = Leeg(invoer.Type);
        await db.SaveChangesAsync();
        return Ok(new { sub.Id });
    }

    // Zacht verwijderen. De regels blijven op projectniveau staan, enkel de koppeling valt weg.
    [HttpDelete("subprojecten/{id:guid}")]
    public async Task<IActionResult> VerwijderSubproject(Guid id)
    {
        var sub = await db.Subprojecten.FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null);
        if (sub is null) return NotFound();
        var nu = DateTimeOffset.UtcNow;
        sub.VerwijderdOp = nu;
        var onderdelen = await db.SubprojectOnderdelen.Where(o => o.SubprojectId == id && o.VerwijderdOp == null).ToListAsync();
        foreach (var o in onderdelen) o.VerwijderdOp = nu;
        var regels = await db.Projectregels.Where(r => r.SubprojectId == id && r.VerwijderdOp == null).ToListAsync();
        foreach (var r in regels) { r.SubprojectId = null; r.OnderdeelId = null; }
        await db.SaveChangesAsync();
        return Ok(new { sub.Id, verwijderd = true });
    }

    // ---- Onderdelen ----

    [HttpPost("subprojecten/{subprojectId:guid}/onderdelen")]
    public async Task<IActionResult> MaakOnderdeel(Guid subprojectId, OnderdeelInvoer invoer)
    {
        if (!await db.Subprojecten.AnyAsync(s => s.Id == subprojectId && s.VerwijderdOp == null)) return NotFound();
        var naam = Leeg(invoer.Naam);
        if (naam is null) return Fout("Geef het onderdeel een naam, bijvoorbeeld vleugel links.");
        if (invoer.OuderId is { } ouder
            && !await db.SubprojectOnderdelen.AnyAsync(o => o.Id == ouder && o.SubprojectId == subprojectId && o.VerwijderdOp == null))
            return Fout("Dat bovenliggende onderdeel hoort niet bij dit subproject.");
        var maatFout = ControleerMaten(invoer.BreedteMm, invoer.HoogteMm);
        if (maatFout is not null) return Fout(maatFout);
        var volgnummer = await db.SubprojectOnderdelen.CountAsync(o => o.SubprojectId == subprojectId && o.VerwijderdOp == null);
        var onderdeel = new SubprojectOnderdeel
        {
            SubprojectId = subprojectId, OuderId = invoer.OuderId, Naam = naam,
            BreedteMm = invoer.BreedteMm, HoogteMm = invoer.HoogteMm, Volgnummer = volgnummer,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.SubprojectOnderdelen.Add(onderdeel);
        await db.SaveChangesAsync();
        return Ok(new { onderdeel.Id });
    }

    [HttpPatch("onderdelen/{id:guid}")]
    public async Task<IActionResult> WijzigOnderdeel(Guid id, OnderdeelInvoer invoer)
    {
        var o = await db.SubprojectOnderdelen.FirstOrDefaultAsync(x => x.Id == id && x.VerwijderdOp == null);
        if (o is null) return NotFound();
        var naam = Leeg(invoer.Naam);
        if (naam is null) return Fout("Geef het onderdeel een naam.");
        var maatFout = ControleerMaten(invoer.BreedteMm, invoer.HoogteMm);
        if (maatFout is not null) return Fout(maatFout);
        o.Naam = naam; o.BreedteMm = invoer.BreedteMm; o.HoogteMm = invoer.HoogteMm;
        await db.SaveChangesAsync();
        return Ok(new { o.Id });
    }

    // Zacht verwijderen, samen met de onderdelen eronder.
    [HttpDelete("onderdelen/{id:guid}")]
    public async Task<IActionResult> VerwijderOnderdeel(Guid id)
    {
        var o = await db.SubprojectOnderdelen.FirstOrDefaultAsync(x => x.Id == id && x.VerwijderdOp == null);
        if (o is null) return NotFound();
        var alle = await db.SubprojectOnderdelen
            .Where(x => x.SubprojectId == o.SubprojectId && x.VerwijderdOp == null).ToListAsync();
        var weg = new HashSet<Guid> { o.Id };
        bool erbij;
        do
        {
            erbij = false;
            foreach (var x in alle.Where(x => x.OuderId is { } p && weg.Contains(p) && !weg.Contains(x.Id)))
            { weg.Add(x.Id); erbij = true; }
        } while (erbij);
        var nu = DateTimeOffset.UtcNow;
        foreach (var x in alle.Where(x => weg.Contains(x.Id))) x.VerwijderdOp = nu;
        var regels = await db.Projectregels
            .Where(r => r.OnderdeelId != null && weg.Contains(r.OnderdeelId.Value) && r.VerwijderdOp == null).ToListAsync();
        foreach (var r in regels) r.OnderdeelId = null;
        await db.SaveChangesAsync();
        return Ok(new { o.Id, verwijderd = true });
    }

    static string? ControleerMaten(int? breedte, int? hoogte)
    {
        if (breedte is { } b && (b < 1 || b > 50000)) return "De breedte ligt tussen 1 en 50000 mm.";
        if (hoogte is { } h && (h < 1 || h > 20000)) return "De hoogte ligt tussen 1 en 20000 mm.";
        return null;
    }

    // ---- Regels van het globaal overzicht ----

    [HttpPost("projecten/{projectId:guid}/regels")]
    public async Task<IActionResult> MaakRegel(Guid projectId, RegelInvoer invoer)
    {
        var project = await db.Projecten.AsNoTracking().FirstOrDefaultAsync(p => p.Id == projectId && p.VerwijderdOp == null);
        if (project is null) return NotFound();
        var regel = new Projectregel { ProjectId = projectId, AangemaaktDoor = claims.MedewerkerId };
        var fout = await Vul(regel, invoer, project, nieuw: true);
        if (fout is not null) return Fout(fout);
        regel.Volgnummer = await db.Projectregels.CountAsync(r => r.ProjectId == projectId && r.Rubriek == regel.Rubriek && r.VerwijderdOp == null);
        db.Projectregels.Add(regel);
        await db.SaveChangesAsync();
        return Ok(new { regel.Id });
    }

    [HttpPatch("regels/{id:guid}")]
    public async Task<IActionResult> WijzigRegel(Guid id, RegelInvoer invoer)
    {
        var regel = await db.Projectregels.FirstOrDefaultAsync(r => r.Id == id && r.VerwijderdOp == null);
        if (regel is null) return NotFound();
        var project = await db.Projecten.AsNoTracking().FirstAsync(p => p.Id == regel.ProjectId);
        var fout = await Vul(regel, invoer, project, nieuw: false);
        if (fout is not null) return Fout(fout);
        await db.SaveChangesAsync();
        return Ok(new { regel.Id });
    }

    [HttpDelete("regels/{id:guid}")]
    public async Task<IActionResult> VerwijderRegel(Guid id)
    {
        var regel = await db.Projectregels.FirstOrDefaultAsync(r => r.Id == id && r.VerwijderdOp == null);
        if (regel is null) return NotFound();
        regel.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { regel.Id, verwijderd = true });
    }

    // Controleert de invoer en vult de regel. Geeft een fouttekst of null.
    async Task<string?> Vul(Projectregel regel, RegelInvoer invoer, Project project, bool nieuw)
    {
        if (!SamenstellingService.Rubrieken.Contains(invoer.Rubriek)) return "Onbekende rubriek.";
        var opdracht = invoer.Rubriek == "opdracht";
        var opdrachtSoort = opdracht ? Leeg(invoer.OpdrachtSoort) : null;
        if (opdrachtSoort is not null && !SamenstellingService.OpdrachtSoorten.Contains(opdrachtSoort))
            return "Een opdracht is een plaatsing, automatisatie of herstelling.";

        // Artikel: verplicht buiten opdracht. Code en naam komen uit de catalogus;
        // de omschrijving mag Jef aanvullen, het artikel zelf blijft ongewijzigd.
        string? code = regel.ArtikelCode;
        var omschrijving = Leeg(invoer.Omschrijving);
        if (invoer.ArtikelId is { } artikelId)
        {
            if (artikelId != regel.ArtikelId || nieuw)
            {
                var artikel = await db.Artikelen.AsNoTracking()
                    .FirstOrDefaultAsync(a => a.Id == artikelId && a.VerwijderdOp == null);
                if (artikel is null) return "Dat artikel bestaat niet.";
                code = artikel.Code;
                omschrijving ??= artikel.Naam;
            }
        }
        else
        {
            if (!opdracht) return "Kies een artikel uit de artikeldatabase.";
            code = null;
        }
        if (omschrijving is null) return "Een opdracht heeft een omschrijving nodig.";
        var aantal = invoer.Aantal ?? 1;
        if (aantal <= 0) return "Het aantal moet groter zijn dan nul.";

        // Koppeling met subproject en onderdeel binnen hetzelfde project.
        if (invoer.SubprojectId is { } sid
            && !await db.Subprojecten.AnyAsync(s => s.Id == sid && s.ProjectId == project.Id && s.VerwijderdOp == null))
            return "Dat subproject hoort niet bij dit dossier.";
        if (invoer.OnderdeelId is { } oid)
        {
            if (invoer.SubprojectId is null) return "Kies eerst het subproject van dat onderdeel.";
            if (!await db.SubprojectOnderdelen.AnyAsync(o => o.Id == oid && o.SubprojectId == invoer.SubprojectId && o.VerwijderdOp == null))
                return "Dat onderdeel hoort niet bij dat subproject.";
        }

        // Precies een LSB per regel. Bij een opdracht zonder keuze volgt de LSB de soort.
        var lsb = invoer.LsbType ?? (nieuw && opdracht ? SamenstellingService.StandaardLsb(opdrachtSoort) : null);
        int? plaatsing = null;
        if (lsb == WerkbonType.Plaatsing)
        {
            plaatsing = invoer.LsbPlaatsingNummer ?? 1;
            var hoogsteRegel = await db.Projectregels.Where(r => r.ProjectId == project.Id && r.VerwijderdOp == null)
                .MaxAsync(r => r.LsbPlaatsingNummer) ?? 0;
            var hoogsteBon = await db.Werkbonnen.Where(w => w.ProjectId == project.Id && w.VerwijderdOp == null)
                .MaxAsync(w => w.PlaatsingNummer) ?? 0;
            var hoogste = Math.Max(project.LsbPlaatsingen, Math.Max(hoogsteRegel, hoogsteBon));
            if (plaatsing < 1 || plaatsing > hoogste) return "Die plaatsing bestaat nog niet in dit dossier.";
        }

        regel.Rubriek = invoer.Rubriek;
        regel.SubprojectId = invoer.SubprojectId;
        regel.OnderdeelId = invoer.OnderdeelId;
        regel.ArtikelId = invoer.ArtikelId;
        regel.ArtikelCode = code;
        regel.Omschrijving = omschrijving;
        regel.Aantal = aantal;
        regel.OpdrachtSoort = opdrachtSoort;
        regel.GeplandeDatum = opdracht ? invoer.GeplandeDatum : null;
        regel.LsbType = lsb;
        regel.LsbPlaatsingNummer = plaatsing;
        return null;
    }

    // Jef maakt er een plaatsingskolom bij.
    [HttpPost("projecten/{projectId:guid}/plaatsingen")]
    public async Task<IActionResult> PlaatsingErbij(Guid projectId)
    {
        var project = await db.Projecten.FirstOrDefaultAsync(p => p.Id == projectId && p.VerwijderdOp == null);
        if (project is null) return NotFound();
        if (project.LsbPlaatsingen >= 20) return Fout("Meer dan twintig plaatsingen kan niet.");
        project.LsbPlaatsingen++;
        await db.SaveChangesAsync();
        return Ok(new { project.LsbPlaatsingen });
    }

    // Zet alle regels over naar de bestaande LSB's van het dossier.
    [HttpPost("projecten/{projectId:guid}/naar-lsb")]
    public async Task<IActionResult> NaarLsb(Guid projectId)
    {
        var bonnen = await db.Werkbonnen
            .Where(w => w.ProjectId == projectId && w.VerwijderdOp == null).ToListAsync();
        var nieuw = 0;
        foreach (var bon in bonnen) nieuw += await SamenstellingService.ZetOverNaarBon(db, bon, claims.MedewerkerId);
        await db.SaveChangesAsync();
        // Regels waarvoor nog geen LSB bestaat, zodat het scherm dat kan melden.
        var regels = await db.Projectregels.AsNoTracking()
            .Where(r => r.ProjectId == projectId && r.VerwijderdOp == null && r.LsbType != null).ToListAsync();
        var zonderBon = regels.Count(r => !bonnen.Any(b => SamenstellingService.HoortOpBon(r, b)));
        return Ok(new { nieuw, zonderBon });
    }
}
