using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

[ApiController]
[Route("api/v1/opvolgtaken")]
[Authorize]
public class OpvolgtakenController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record StatusInvoer(OpvolgtaakStatus Status);

    [HttpGet]
    public async Task<IActionResult> Mijn() =>
        Ok(await db.Opvolgtaken.AsNoTracking()
            .Where(t => t.MedewerkerId == claims.MedewerkerId && t.Status == OpvolgtaakStatus.Open && t.VerwijderdOp == null)
            .OrderBy(t => t.DueDatum).ToListAsync());

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Wijzig(Guid id, StatusInvoer invoer)
    {
        var taak = await db.Opvolgtaken.FirstOrDefaultAsync(t => t.Id == id && t.VerwijderdOp == null);
        if (taak is null) return NotFound();
        taak.Status = invoer.Status;
        await db.SaveChangesAsync();
        return Ok(taak);
    }
}
