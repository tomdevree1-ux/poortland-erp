using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

[ApiController]
[Route("api/v1/projecten")]
[Authorize]
public class ProjectenController(PoortlandDbContext db) : ControllerBase
{
    // FR-006: dossieroverzicht met zoeken en filteren (TS-06 sectie 3).
    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] OrderStatus? status, [FromQuery] string? zoek)
    {
        var query = db.Projecten.AsNoTracking()
            .Include(p => p.Klant)
            .Where(p => p.VerwijderdOp == null);
        if (status is { } s) query = query.Where(p => p.Status == s);
        List<Guid>? zoekIds = null;
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            // Serverzijdig zoeken met relevantie en fouttolerantie (0027, zoekregels README).
            zoekIds = await db.Database
                .SqlQuery<Guid>($@"select id as ""Value"" from zoek_projecten({zoek})")
                .ToListAsync();
            query = query.Where(p => zoekIds.Contains(p.Id));
        }
        var projecten = await query.OrderByDescending(p => p.AangemaaktOp).Take(200)
            .Select(p => new
            {
                p.Id, p.Nummer, p.Werfadres, p.Omschrijving, p.Status, p.GarantieMaanden, p.VerwachteOpleverdatum,
                p.AangemaaktOp,
                Klant = new { p.Klant!.Id, p.Klant.Naam, p.Klant.Voornaam, p.Klant.Bedrijfsnaam, p.Klant.Gemeente },
                OfferteWaarde = p.Offertes.Where(o => o.VerwijderdOp == null)
                    .OrderByDescending(o => o.VersieOfferte)
                    .Select(o => (decimal?)o.TotaalExclBtw).FirstOrDefault()
            })
            .ToListAsync();
        if (zoekIds is not null)
            projecten = zoekIds.Select(i => projecten.FirstOrDefault(p => p.Id == i))
                .Where(p => p is not null).ToList()!;
        return Ok(projecten);
    }

    // FR-006: het volledige dossier op 1 scherm (TS-06 sectie 2).
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var project = await db.Projecten.AsNoTracking()
            .Include(p => p.Klant)
            .FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null);
        if (project is null) return NotFound();
        var offertes = await db.Offertes.AsNoTracking()
            .Where(o => o.ProjectId == id && o.VerwijderdOp == null)
            .OrderByDescending(o => o.VersieOfferte).ToListAsync();
        var order = await db.Orders.AsNoTracking()
            .Where(o => offertes.Select(x => x.Id).Contains(o.OfferteId) && o.VerwijderdOp == null)
            .FirstOrDefaultAsync();
        var communicatie = await db.Communicaties.AsNoTracking()
            .Where(c => c.ProjectId == id && c.VerwijderdOp == null)
            .OrderByDescending(c => c.VerzondenOp).Take(50).ToListAsync();
        var contactmomenten = await db.Contactmomenten.AsNoTracking()
            .Where(c => c.ProjectId == id && c.VerwijderdOp == null)
            .OrderByDescending(c => c.Datum).Take(50).ToListAsync();
        return Ok(new { project, offertes, order, communicatie, contactmomenten });
    }
}
