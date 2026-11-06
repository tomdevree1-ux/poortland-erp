using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// Beheer van de vacatures. De publieke site leest ze via content.json.
[ApiController]
[Route("api/v1/vacatures")]
[Authorize]
public class VacaturesController(PoortlandDbContext db, VacatureService dienst) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Lijst()
    {
        var lijst = await db.Vacatures.AsNoTracking()
            .Where(v => v.VerwijderdOp == null)
            .OrderBy(v => v.Volgnummer)
            .Select(v => new { v.Id, v.Titel, v.Intro, v.Blokken, v.Status, v.Volgnummer, v.AangemaaktOp })
            .ToListAsync();
        return Ok(lijst);
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(VacatureService.Invoer invoer) => Ok(await dienst.Maak(invoer));

    [HttpPut("{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Wijzig(Guid id, VacatureService.Invoer invoer) => Ok(await dienst.Wijzig(id, invoer));

    public record StatusInvoer(VacatureStatus Status);

    [HttpPatch("{id:guid}/status")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> ZetStatus(Guid id, StatusInvoer invoer) => Ok(await dienst.ZetStatus(id, invoer.Status));

    public record VerplaatsInvoer(int Richting);

    [HttpPatch("{id:guid}/volgorde")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Verplaats(Guid id, VerplaatsInvoer invoer)
    {
        await dienst.Verplaats(id, invoer.Richting);
        return Ok(new { ok = true });
    }

    [HttpDelete("{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Verwijder(Guid id)
    {
        await dienst.Verwijder(id);
        return Ok(new { id, verwijderd = true });
    }
}
