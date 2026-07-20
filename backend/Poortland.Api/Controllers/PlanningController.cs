using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

// TS-08 Planning: de centrale planning per projectfase met medewerker of ploeg.
// FR-010: een toewijzing is zichtbaar in de centrale planning, het persoonlijke
// werkschema en het projectdossier (allemaal dezelfde planningsitems, SSOT).
[ApiController]
[Route("api/v1")]
[Authorize]
public class PlanningController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record ItemInvoer(Guid ProjectId, Projectfase Fase, Guid? MedewerkerId, Guid? PloegId,
        DateOnly GeplandeDatum, string? Status, string? BenodigdeMaterialen, string? Klantafspraken);
    public record PloegInvoer(string Naam, bool? IsActief, List<Guid>? Leden);

    async Task<IActionResult> ItemLijst(IQueryable<Planningsitem> query)
    {
        var items = await query
            .Include(p => p.Project!).ThenInclude(pr => pr.Klant)
            .OrderBy(p => p.GeplandeDatum).ThenBy(p => p.Fase)
            .Take(500)
            .ToListAsync();
        var medewerkers = await db.Medewerkers.AsNoTracking().Where(m => m.VerwijderdOp == null)
            .ToDictionaryAsync(m => m.Id, m => ($"{m.Voornaam} {m.Naam}").Trim());
        var ploegen = await db.Ploegen.AsNoTracking().Where(p => p.VerwijderdOp == null)
            .ToDictionaryAsync(p => p.Id, p => p.Naam);
        return Ok(items.Select(p => new
        {
            p.Id, p.ProjectId, p.Fase, p.GeplandeDatum, p.Status, p.BenodigdeMaterialen, p.Klantafspraken,
            p.MedewerkerId, p.PloegId,
            toegewezene = p.PloegId is { } pl && ploegen.TryGetValue(pl, out var pn) ? pn
                : (p.MedewerkerId is { } me && medewerkers.TryGetValue(me, out var mn) ? mn : "—"),
            project = new
            {
                p.Project!.Id, p.Project.Nummer, p.Project.Werfadres,
                klant = new { p.Project.Klant!.Naam, p.Project.Klant.Voornaam, p.Project.Klant.Bedrijfsnaam }
            }
        }));
    }

    // Centrale planning binnen een periode (weekweergave).
    [HttpGet("planning")]
    public Task<IActionResult> Lijst([FromQuery] DateOnly van, [FromQuery] DateOnly tot) =>
        ItemLijst(db.Planningsitems.AsNoTracking()
            .Where(p => p.VerwijderdOp == null && p.GeplandeDatum >= van && p.GeplandeDatum <= tot));

    // Persoonlijk werkschema: eigen toewijzingen en die van de eigen ploeg(en).
    [HttpGet("planning/mijn")]
    public Task<IActionResult> Mijn()
    {
        var mijnId = claims.MedewerkerId!.Value;
        var vandaag = DateOnly.FromDateTime(DateTime.Today);
        var mijnPloegen = db.PloegLeden.Where(l => l.MedewerkerId == mijnId).Select(l => l.PloegId);
        return ItemLijst(db.Planningsitems.AsNoTracking()
            .Where(p => p.VerwijderdOp == null && p.GeplandeDatum >= vandaag
                && (p.MedewerkerId == mijnId || (p.PloegId != null && mijnPloegen.Contains(p.PloegId.Value)))));
    }

    // Faseplanning per project voor het dossier.
    [HttpGet("projecten/{projectId:guid}/planning")]
    public Task<IActionResult> VanProject(Guid projectId) =>
        ItemLijst(db.Planningsitems.AsNoTracking()
            .Where(p => p.VerwijderdOp == null && p.ProjectId == projectId));

    [HttpPost("planning")]
    [VereistRol("planning")]
    public async Task<IActionResult> Maak(ItemInvoer invoer)
    {
        if (invoer.MedewerkerId is null && invoer.PloegId is null)
            return BadRequest(new { fout = "Wijs een medewerker of een ploeg toe." });
        var item = new Planningsitem
        {
            ProjectId = invoer.ProjectId, Fase = invoer.Fase,
            MedewerkerId = invoer.MedewerkerId, PloegId = invoer.PloegId,
            GeplandeDatum = invoer.GeplandeDatum, Status = invoer.Status ?? "gepland",
            BenodigdeMaterialen = invoer.BenodigdeMaterialen, Klantafspraken = invoer.Klantafspraken,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Planningsitems.Add(item);
        await db.SaveChangesAsync();

        // FR-010: de toegewezen medewerker ziet het meteen; een notificatie helpt daarbij.
        if (invoer.MedewerkerId is { } toegewezen && toegewezen != claims.MedewerkerId)
            db.Notificaties.Add(new Notificatie
            {
                MedewerkerId = toegewezen, Type = "planning",
                Titel = $"Ingepland op {invoer.GeplandeDatum:dd-MM-yyyy}",
                Boodschap = $"Fase {invoer.Fase} is aan jou toegewezen.",
                EntiteitType = "project", EntiteitId = invoer.ProjectId,
                AangemaaktDoor = claims.MedewerkerId
            });
        await db.SaveChangesAsync();
        return Ok(new { item.Id });
    }

    [HttpPatch("planning/{id:guid}")]
    [VereistRol("planning")]
    public async Task<IActionResult> Wijzig(Guid id, ItemInvoer invoer)
    {
        var item = await db.Planningsitems.FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null);
        if (item is null) return NotFound();
        item.Fase = invoer.Fase;
        item.MedewerkerId = invoer.MedewerkerId;
        item.PloegId = invoer.PloegId;
        item.GeplandeDatum = invoer.GeplandeDatum;
        if (invoer.Status is not null) item.Status = invoer.Status;
        item.BenodigdeMaterialen = invoer.BenodigdeMaterialen;
        item.Klantafspraken = invoer.Klantafspraken;
        await db.SaveChangesAsync();
        return Ok(new { item.Id });
    }

    [HttpDelete("planning/{id:guid}")]
    [VereistRol("planning")]
    public async Task<IActionResult> Verwijder(Guid id)
    {
        var item = await db.Planningsitems.FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null);
        if (item is null) return NotFound();
        item.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { item.Id, verwijderd = true });
    }

    [HttpGet("ploegen")]
    public async Task<IActionResult> Ploegen() =>
        Ok(await db.Ploegen.AsNoTracking()
            .Include(p => p.Leden)
            .Where(p => p.VerwijderdOp == null)
            .OrderBy(p => p.Naam)
            .Select(p => new { p.Id, p.Naam, p.IsActief, leden = p.Leden.Select(l => l.MedewerkerId) })
            .ToListAsync());

    [HttpPost("ploegen")]
    [VereistRol("planning")]
    public async Task<IActionResult> MaakPloeg(PloegInvoer invoer)
    {
        var ploeg = new Ploeg { Naam = invoer.Naam, IsActief = invoer.IsActief ?? true, AangemaaktDoor = claims.MedewerkerId };
        db.Ploegen.Add(ploeg);
        await db.SaveChangesAsync();
        foreach (var lid in (invoer.Leden ?? []).Distinct())
            db.PloegLeden.Add(new PloegLid { PloegId = ploeg.Id, MedewerkerId = lid });
        await db.SaveChangesAsync();
        return Ok(new { ploeg.Id });
    }

    [HttpPut("ploegen/{id:guid}")]
    [VereistRol("planning")]
    public async Task<IActionResult> WijzigPloeg(Guid id, PloegInvoer invoer)
    {
        var ploeg = await db.Ploegen.Include(p => p.Leden).FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null);
        if (ploeg is null) return NotFound();
        ploeg.Naam = invoer.Naam;
        if (invoer.IsActief is { } actief) ploeg.IsActief = actief;
        if (invoer.Leden is not null)
        {
            db.PloegLeden.RemoveRange(ploeg.Leden);
            foreach (var lid in invoer.Leden.Distinct())
                db.PloegLeden.Add(new PloegLid { PloegId = ploeg.Id, MedewerkerId = lid });
        }
        await db.SaveChangesAsync();
        return Ok(new { ploeg.Id });
    }
}

// Notificaties: het belletje in de topbar (eigen rijen via RLS).
[ApiController]
[Route("api/v1/notificaties")]
[Authorize]
public class NotificatiesController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Lijst()
    {
        var mijnId = claims.MedewerkerId!.Value;
        var lijst = await db.Notificaties.AsNoTracking()
            .Where(n => n.MedewerkerId == mijnId && n.VerwijderdOp == null)
            .OrderByDescending(n => n.AangemaaktOp)
            .Take(25)
            .Select(n => new { n.Id, n.Type, n.Titel, n.Boodschap, n.EntiteitType, n.EntiteitId, n.GelezenOp, n.AangemaaktOp })
            .ToListAsync();
        var ongelezen = await db.Notificaties
            .CountAsync(n => n.MedewerkerId == mijnId && n.VerwijderdOp == null && n.GelezenOp == null);
        return Ok(new { ongelezen, lijst });
    }

    [HttpPost("{id:guid}/gelezen")]
    public async Task<IActionResult> Gelezen(Guid id)
    {
        var notificatie = await db.Notificaties
            .FirstOrDefaultAsync(n => n.Id == id && n.MedewerkerId == claims.MedewerkerId && n.VerwijderdOp == null);
        if (notificatie is null) return NotFound();
        notificatie.GelezenOp ??= DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { notificatie.Id, gelezen = true });
    }

    [HttpPost("alles-gelezen")]
    public async Task<IActionResult> AllesGelezen()
    {
        var open = await db.Notificaties
            .Where(n => n.MedewerkerId == claims.MedewerkerId && n.VerwijderdOp == null && n.GelezenOp == null)
            .ToListAsync();
        foreach (var n in open) n.GelezenOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { gelezen = open.Count });
    }
}
