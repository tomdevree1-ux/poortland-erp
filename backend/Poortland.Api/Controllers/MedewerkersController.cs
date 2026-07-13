using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

[ApiController]
[Route("api/v1/medewerkers")]
[Authorize]
public class MedewerkersController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record UitnodigingInvoer(string Email, string Naam, List<Rol> Rollen);
    public record RollenInvoer(List<Rol> Rollen);
    public record ActiefInvoer(bool IsActief);

    [HttpGet("mij")]
    public async Task<IActionResult> Mij()
    {
        var medewerker = await db.Medewerkers.AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == claims.MedewerkerId);
        return Ok(new { medewerker, rollen = claims.Rollen });
    }

    // Namen voor keuzelijsten, beschikbaar voor elke rol (view medewerker_overzicht).
    [HttpGet("overzicht")]
    public async Task<IActionResult> Overzicht() =>
        Ok(await db.Database.SqlQuery<MedewerkerKeuze>(
            $@"select id as ""Id"", naam as ""Naam"" from medewerker_keuzes() where is_actief order by naam")
            .ToListAsync());
    public record MedewerkerKeuze(Guid Id, string Naam);

    [HttpGet]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Lijst() =>
        Ok(await db.Medewerkers.AsNoTracking()
            .Include(m => m.Rollen)
            .Where(m => m.VerwijderdOp == null)
            .OrderBy(m => m.Naam)
            .Select(m => new { m.Id, m.Naam, m.Email, m.Telefoon, m.IsActief,
                Rollen = m.Rollen.Select(r => r.Rol) })
            .ToListAsync());

    // Geen open registratie: de beheerder nodigt uit (TS-02 sectie 2, LOGIN-01).
    [HttpPost("uitnodigen")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> NodigUit(UitnodigingInvoer invoer, [FromServices] SupabaseAdmin admin)
    {
        await admin.NodigUit(invoer.Email, invoer.Naam);
        // De databanktrigger maakte de medewerker aan bij de auth insert.
        var medewerker = await db.Medewerkers.FirstOrDefaultAsync(m => m.Email == invoer.Email.ToLowerInvariant())
            ?? await db.Medewerkers.FirstOrDefaultAsync(m => m.Email == invoer.Email);
        if (medewerker is null) return StatusCode(500, new { fout = "Uitnodiging verstuurd maar de medewerker is niet gevonden." });
        medewerker.Naam = invoer.Naam;
        foreach (var rol in invoer.Rollen.Distinct())
            db.MedewerkerRollen.Add(new MedewerkerRol { MedewerkerId = medewerker.Id, Rol = rol });
        await db.SaveChangesAsync();
        return Ok(new { medewerker.Id, medewerker.Email, rollen = invoer.Rollen });
    }

    [HttpPut("{id:guid}/rollen")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> ZetRollen(Guid id, RollenInvoer invoer)
    {
        var bestaand = await db.MedewerkerRollen.Where(r => r.MedewerkerId == id).ToListAsync();
        db.MedewerkerRollen.RemoveRange(bestaand);
        foreach (var rol in invoer.Rollen.Distinct())
            db.MedewerkerRollen.Add(new MedewerkerRol { MedewerkerId = id, Rol = rol });
        await db.SaveChangesAsync();
        return Ok(new { id, rollen = invoer.Rollen });
    }

    // LOGIN-03: deactiveren blokkeert de toegang bij het eerstvolgende verzoek.
    [HttpPatch("{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Wijzig(Guid id, ActiefInvoer invoer)
    {
        var medewerker = await db.Medewerkers.FirstOrDefaultAsync(m => m.Id == id && m.VerwijderdOp == null);
        if (medewerker is null) return NotFound();
        medewerker.IsActief = invoer.IsActief;
        await db.SaveChangesAsync();
        return Ok(new { medewerker.Id, medewerker.IsActief });
    }
}
