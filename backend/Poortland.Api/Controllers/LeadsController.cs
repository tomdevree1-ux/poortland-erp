using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

public record LeadInvoer(LeadKanaal Kanaal, string? Naam, string? Email, string? Telefoon,
    string? EersteVraag, Guid? EigenaarId, DateOnly? Opvolgdatum);
public record WebformulierInvoer(string Naam, string Email, string? Telefoon, string Vraag, string? TurnstileToken);
public record KwalificatieInvoer(decimal? Prijsindicatie, DateOnly? Opvolgdatum);
public record VerliesInvoer(string Reden);

[ApiController]
[Route("api/v1/leads")]
[Authorize]
public class LeadsController(PoortlandDbContext db, ClaimsContext claims, LeadService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] LeadStatus? status, [FromQuery] LeadKanaal? kanaal,
        [FromQuery] Guid? eigenaar, [FromQuery] string? zoek)
    {
        var query = db.Leads.AsNoTracking().Where(l => l.VerwijderdOp == null);
        if (status is { } s) query = query.Where(l => l.Status == s);
        if (kanaal is { } k) query = query.Where(l => l.Kanaal == k);
        if (eigenaar is { } e) query = query.Where(l => l.EigenaarId == e);
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            var patroon = $"%{zoek}%";
            query = query.Where(l => EF.Functions.ILike(l.Naam ?? "", patroon)
                || EF.Functions.ILike(l.Email ?? "", patroon)
                || EF.Functions.ILike(l.EersteVraag ?? "", patroon));
        }
        var leads = await query.OrderByDescending(l => l.AangemaaktOp).Take(200).ToListAsync();
        return Ok(leads);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var lead = await db.Leads.AsNoTracking().FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        return lead is null ? NotFound() : Ok(lead);
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(LeadInvoer invoer)
    {
        var lead = new Lead
        {
            Kanaal = invoer.Kanaal, Naam = invoer.Naam, Email = invoer.Email, Telefoon = invoer.Telefoon,
            EersteVraag = invoer.EersteVraag, Opvolgdatum = invoer.Opvolgdatum,
            EigenaarId = invoer.EigenaarId ?? claims.MedewerkerId!.Value,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Leads.Add(lead);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Detail), new { id = lead.Id }, lead);
    }

    // FR-001: het publieke webformulier, beschermd met Turnstile (TS-04 sectie 2).
    [HttpPost("webformulier")]
    [AllowAnonymous]
    public async Task<IActionResult> Webformulier(WebformulierInvoer invoer,
        [FromServices] TurnstileValidator turnstile)
    {
        if (!await turnstile.Valideer(invoer.TurnstileToken, HttpContext.Connection.RemoteIpAddress?.ToString()))
            return BadRequest(new { fout = "Verificatie mislukt. Probeer opnieuw." });

        claims.VulAlsSysteem();
        await DbClaims.ZetClaims(db, claims, HttpContext.RequestAborted);
        var eigenaar = await db.Database
            .SqlQuery<Guid>($@"select m.id as ""Value"" from medewerker m
                join medewerker_rol r on r.medewerker_id = m.id
                where m.is_actief and m.verwijderd_op is null and r.rol in ('verkoop','beheerder')
                order by r.rol desc limit 1")
            .FirstOrDefaultAsync();
        if (eigenaar == Guid.Empty)
            return StatusCode(503, new { fout = "Nog geen medewerkers ingericht." });
        db.Leads.Add(new Lead
        {
            Kanaal = LeadKanaal.Webformulier, Naam = invoer.Naam, Email = invoer.Email,
            Telefoon = invoer.Telefoon, EersteVraag = invoer.Vraag, EigenaarId = eigenaar,
            Opvolgdatum = DateOnly.FromDateTime(DateTime.Today.AddDays(2))
        });
        await db.SaveChangesAsync();
        return Ok(new { boodschap = "Bedankt. We nemen snel contact op." });
    }

    [HttpPost("{id:guid}/kwalificeer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Kwalificeer(Guid id, KwalificatieInvoer invoer) =>
        Ok(await service.Kwalificeer(id, invoer.Prijsindicatie, invoer.Opvolgdatum));

    [HttpPost("{id:guid}/omzetten")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Omzetten(Guid id, OmzettenVerzoek verzoek)
    {
        var (lead, project) = await service.Omzetten(id, verzoek);
        return Ok(new { lead, projectId = project.Id });
    }

    [HttpPost("{id:guid}/verliezen")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Verliezen(Guid id, VerliesInvoer invoer) =>
        Ok(await service.Verliezen(id, invoer.Reden));
}
