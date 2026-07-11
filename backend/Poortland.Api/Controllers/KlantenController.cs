using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

public record KlantInvoer(KlantType Type, string Naam, string? BtwNummer, string? Straat, string? Postcode,
    string? Gemeente, string? Email, string? Telefoon, Taal Communicatietaal, string? Communicatievoorkeur);
public record ContactmomentInvoer(Guid? ProjectId, string Type, string? Notitie);

[ApiController]
[Route("api/v1/klanten")]
[Authorize]
public class KlantenController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] string? zoek)
    {
        var query = db.Klanten.AsNoTracking().Where(k => k.VerwijderdOp == null);
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            var patroon = $"%{zoek}%";
            query = query.Where(k => EF.Functions.ILike(k.Naam, patroon)
                || EF.Functions.ILike(k.Gemeente ?? "", patroon)
                || EF.Functions.ILike(k.Email ?? "", patroon));
        }
        return Ok(await query.OrderBy(k => k.Naam).Take(200).ToListAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var klant = await db.Klanten.AsNoTracking()
            .Include(k => k.Contactpersonen.Where(c => c.VerwijderdOp == null))
            .FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null);
        if (klant is null) return NotFound();
        var projecten = await db.Projecten.AsNoTracking()
            .Where(p => p.KlantId == id && p.VerwijderdOp == null)
            .OrderByDescending(p => p.AangemaaktOp).ToListAsync();
        var momenten = await db.Contactmomenten.AsNoTracking()
            .Where(c => c.KlantId == id && c.VerwijderdOp == null)
            .OrderByDescending(c => c.Datum).Take(50).ToListAsync();
        return Ok(new { klant, projecten, contactmomenten = momenten });
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(KlantInvoer invoer)
    {
        var klant = new Klant
        {
            Type = invoer.Type, Naam = invoer.Naam, BtwNummer = invoer.BtwNummer, Straat = invoer.Straat,
            Postcode = invoer.Postcode, Gemeente = invoer.Gemeente, Email = invoer.Email,
            Telefoon = invoer.Telefoon, Communicatietaal = invoer.Communicatietaal,
            Communicatievoorkeur = invoer.Communicatievoorkeur, AangemaaktDoor = claims.MedewerkerId
        };
        db.Klanten.Add(klant);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Detail), new { id = klant.Id }, klant);
    }

    [HttpPatch("{id:guid}")]
    [VereistRol("verkoop", "planning", "boekhouding")]
    public async Task<IActionResult> Wijzig(Guid id, KlantInvoer invoer)
    {
        var klant = await db.Klanten.FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null);
        if (klant is null) return NotFound();
        klant.Type = invoer.Type; klant.Naam = invoer.Naam; klant.BtwNummer = invoer.BtwNummer;
        klant.Straat = invoer.Straat; klant.Postcode = invoer.Postcode; klant.Gemeente = invoer.Gemeente;
        klant.Email = invoer.Email; klant.Telefoon = invoer.Telefoon;
        klant.Communicatietaal = invoer.Communicatietaal; klant.Communicatievoorkeur = invoer.Communicatievoorkeur;
        await db.SaveChangesAsync();
        return Ok(klant);
    }

    [HttpPost("{id:guid}/contactmomenten")]
    [VereistRol("verkoop", "planning", "boekhouding")]
    public async Task<IActionResult> LogContactmoment(Guid id, ContactmomentInvoer invoer)
    {
        var moment = new Contactmoment
        {
            KlantId = id, ProjectId = invoer.ProjectId, MedewerkerId = claims.MedewerkerId!.Value,
            Type = invoer.Type, Datum = DateTimeOffset.UtcNow, Notitie = invoer.Notitie,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Contactmomenten.Add(moment);
        await db.SaveChangesAsync();
        return Ok(moment);
    }
}
