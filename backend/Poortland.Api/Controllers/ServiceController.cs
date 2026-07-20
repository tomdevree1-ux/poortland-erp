using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

// TS-11 Service en nazorg (FR-015): het servicedossier vervangt de telefonische
// klachtenafhandeling. De garantie-indicatie wordt berekend uit het project
// (opleverdatum plus garantiemaanden) en de historiek staat vooringevuld.
[ApiController]
[Route("api/v1/service")]
[Authorize]
public class ServiceController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record ServiceInvoer(Guid KlantId, Guid? ProjectId, string? Klacht, Guid? TechniekerId, DateOnly? GeplandOp);
    public record StatusInvoer(ServicedossierStatus Status);

    static bool BinnenGarantie(Project? project)
    {
        if (project?.VerwachteOpleverdatum is not { } oplever) return false;
        return oplever.AddMonths(project.GarantieMaanden) >= DateOnly.FromDateTime(DateTime.Today);
    }

    async Task<object> Projectie(Servicedossier s)
    {
        var technieker = s.TechniekerId is { } t
            ? await db.Medewerkers.AsNoTracking().Where(m => m.Id == t)
                .Select(m => ($"{m.Voornaam} {m.Naam}").Trim()).FirstOrDefaultAsync()
            : null;
        return new
        {
            s.Id, s.Status, s.GarantieIndicatie, s.Klacht, s.GemeldOp, s.GeplandOp, s.TechniekerId,
            technieker,
            klant = new { s.Klant!.Id, s.Klant.Naam, s.Klant.Voornaam, s.Klant.Bedrijfsnaam, s.Klant.Telefoon, s.Klant.Gemeente },
            project = s.Project is null ? null : new { s.Project.Id, s.Project.Nummer, s.Project.Werfadres, s.Project.GarantieMaanden }
        };
    }

    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] ServicedossierStatus? status)
    {
        var query = db.Servicedossiers.AsNoTracking()
            .Include(s => s.Klant).Include(s => s.Project)
            .Where(s => s.VerwijderdOp == null);
        if (status is { } st) query = query.Where(s => s.Status == st);
        var dossiers = await query.OrderBy(s => s.Status).ThenByDescending(s => s.GemeldOp).Take(200).ToListAsync();
        var lijst = new List<object>();
        foreach (var s in dossiers) lijst.Add(await Projectie(s));
        return Ok(lijst);
    }

    // FR-015: bij een melding binnen de garantie staat alles vooringevuld.
    [HttpPost]
    [VereistRol("verkoop", "planning", "montage")]
    public async Task<IActionResult> Maak(ServiceInvoer invoer)
    {
        Project? project = null;
        if (invoer.ProjectId is { } pid)
            project = await db.Projecten.AsNoTracking().FirstOrDefaultAsync(p => p.Id == pid);
        else
            project = await db.Projecten.AsNoTracking()
                .Where(p => p.KlantId == invoer.KlantId && p.VerwijderdOp == null)
                .OrderByDescending(p => p.AangemaaktOp).FirstOrDefaultAsync();

        var dossier = new Servicedossier
        {
            KlantId = invoer.KlantId,
            ProjectId = project?.Id,
            Klacht = invoer.Klacht,
            TechniekerId = invoer.TechniekerId,
            GeplandOp = invoer.GeplandOp,
            GarantieIndicatie = BinnenGarantie(project),
            GemeldOp = DateTimeOffset.UtcNow,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Servicedossiers.Add(dossier);
        await db.SaveChangesAsync();
        return Ok(new { dossier.Id, dossier.GarantieIndicatie });
    }

    [HttpPatch("{id:guid}")]
    [VereistRol("planning", "montage", "verkoop")]
    public async Task<IActionResult> Wijzig(Guid id, ServiceInvoer invoer)
    {
        var dossier = await db.Servicedossiers.FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null);
        if (dossier is null) return NotFound();
        if (invoer.Klacht is not null) dossier.Klacht = invoer.Klacht;
        dossier.TechniekerId = invoer.TechniekerId;
        dossier.GeplandOp = invoer.GeplandOp;
        await db.SaveChangesAsync();
        return Ok(new { dossier.Id });
    }

    [HttpPost("{id:guid}/status")]
    [VereistRol("planning", "montage")]
    public async Task<IActionResult> ZetStatus(Guid id, StatusInvoer invoer)
    {
        var dossier = await db.Servicedossiers.FirstOrDefaultAsync(s => s.Id == id && s.VerwijderdOp == null);
        if (dossier is null) return NotFound();
        dossier.Status = invoer.Status;
        await db.SaveChangesAsync();
        return Ok(new { dossier.Id, dossier.Status });
    }
}

// TS-12 Rapportering: kerncijfers en trends voor de zaakvoerder, rechtstreeks
// uit de operationele tabellen (geen aparte datalaag in deze fase).
[ApiController]
[Route("api/v1/rapporten")]
[Authorize]
public class RapportenController(PoortlandDbContext db) : ControllerBase
{
    [HttpGet("overzicht")]
    public async Task<IActionResult> Overzicht()
    {
        var vandaag = DateTimeOffset.UtcNow;
        var start = new DateTimeOffset(new DateTime(vandaag.Year, vandaag.Month, 1, 0, 0, 0, DateTimeKind.Utc)).AddMonths(-11);

        // Omzet: goedgekeurde offertes per maand (excl btw).
        var goedgekeurd = await db.Offertes.AsNoTracking()
            .Where(o => o.VerwijderdOp == null && o.Status == OfferteStatus.Goedgekeurd && o.GewijzigdOp >= start)
            .Select(o => new { o.GewijzigdOp, o.TotaalExclBtw })
            .ToListAsync();
        var leadsRuw = await db.Leads.AsNoTracking()
            .Where(l => l.VerwijderdOp == null && l.AangemaaktOp >= start)
            .Select(l => new { l.AangemaaktOp, l.Status })
            .ToListAsync();
        var maanden = Enumerable.Range(0, 12).Select(i => start.AddMonths(i)).Select(m => new
        {
            maand = $"{m.Year}-{m.Month:00}",
            omzet = goedgekeurd.Where(o => o.GewijzigdOp.Year == m.Year && o.GewijzigdOp.Month == m.Month).Sum(o => o.TotaalExclBtw),
            leads = leadsRuw.Count(l => l.AangemaaktOp.Year == m.Year && l.AangemaaktOp.Month == m.Month),
            omgezet = leadsRuw.Count(l => l.AangemaaktOp.Year == m.Year && l.AangemaaktOp.Month == m.Month && l.Status == LeadStatus.Omgezet)
        }).ToList();

        // Doorlooptijd: verzonden naar goedgekeurd in dagen.
        var doorlooptijden = await db.Offertes.AsNoTracking()
            .Where(o => o.VerwijderdOp == null && o.Status == OfferteStatus.Goedgekeurd && o.VerzondenOp != null)
            .Select(o => new { o.VerzondenOp, o.GewijzigdOp })
            .ToListAsync();
        var gemiddeldeDoorlooptijd = doorlooptijden.Count > 0
            ? Math.Round(doorlooptijden.Average(o => (o.GewijzigdOp - o.VerzondenOp!.Value).TotalDays), 1)
            : (double?)null;

        var totaalLeads = leadsRuw.Count;
        var totaalOmgezet = leadsRuw.Count(l => l.Status == LeadStatus.Omgezet);

        var orderStatussen = await db.Orders.AsNoTracking()
            .Where(o => o.VerwijderdOp == null)
            .GroupBy(o => o.Status)
            .Select(g => new { status = g.Key, aantal = g.Count() })
            .ToListAsync();
        // Defensief: zolang migratie 0029 en 0030 niet toegepast zijn bestaan deze
        // tabellen nog niet; het dashboard mag daar niet op omvallen.
        int serviceOpen = 0, werkbonnenOpen = 0;
        try
        {
            serviceOpen = await db.Servicedossiers.CountAsync(s =>
                s.VerwijderdOp == null && s.Status != ServicedossierStatus.Afgesloten);
            werkbonnenOpen = await db.Werkbonnen.CountAsync(w =>
                w.VerwijderdOp == null && (w.Status == WerkbonStatus.Open || w.Status == WerkbonStatus.Uitgevoerd));
        }
        catch (Npgsql.PostgresException) { }

        return Ok(new
        {
            maanden,
            leadconversie = totaalLeads > 0 ? Math.Round(100.0 * totaalOmgezet / totaalLeads, 1) : 0,
            totaalLeads,
            totaalOmgezet,
            gemiddeldeDoorlooptijd,
            orderStatussen,
            serviceOpen,
            werkbonnenOpen
        });
    }
}
