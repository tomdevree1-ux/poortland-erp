using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

public record LeadInvoer(LeadKanaal Kanaal, string? Naam, string? Voornaam, string? Email, string? Telefoon,
    string? EersteVraag, Guid? EigenaarId, DateOnly? Opvolgdatum,
    string? TypeAanvraag, string? Gemeente, string? GewensteTiming);
public record LeadWijziging(string? Naam, string? Voornaam, string? Email, string? Telefoon, string? EersteVraag,
    string? TypeAanvraag, string? KlantType, string? Bedrijfsnaam, string? BtwNummer,
    string? Straat, string? Postcode, string? Gemeente, string? GewensteTiming, DateOnly? Opvolgdatum,
    string? WizardGegevens);
public record KwalificatieInvoer(decimal? Prijsindicatie, DateOnly? Opvolgdatum);
public record VerliesInvoer(string Reden);

[ApiController]
[Route("api/v1/leads")]
[Authorize]
public class LeadsController(PoortlandDbContext db, ClaimsContext claims, LeadService service,
    SupabaseOpslag opslag) : ControllerBase
{
    const string BucketUploads = "lead_uploads";
    static readonly string[] FotoTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];

    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] LeadStatus? status, [FromQuery] LeadKanaal? kanaal,
        [FromQuery] Guid? eigenaar, [FromQuery] string? zoek, [FromQuery] bool archief = false)
    {
        var query = db.Leads.AsNoTracking().Where(l => l.VerwijderdOp == null);
        query = archief ? query.Where(l => l.GearchiveerdOp != null) : query.Where(l => l.GearchiveerdOp == null);
        if (status is { } s) query = query.Where(l => l.Status == s);
        if (kanaal is { } k) query = query.Where(l => l.Kanaal == k);
        if (eigenaar is { } e) query = query.Where(l => l.EigenaarId == e);
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            var patroon = $"%{zoek}%";
            query = query.Where(l => EF.Functions.ILike(l.Naam ?? "", patroon)
                || EF.Functions.ILike(l.Voornaam ?? "", patroon)
                || EF.Functions.ILike(l.Email ?? "", patroon)
                || EF.Functions.ILike(l.Gemeente ?? "", patroon)
                || EF.Functions.ILike(l.EersteVraag ?? "", patroon));
        }
        var leads = await query.OrderByDescending(l => l.AangemaaktOp).Take(200).ToListAsync();
        return Ok(leads);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var lead = await db.Leads.AsNoTracking()
            .Include(l => l.Bijlagen.Where(b => b.VerwijderdOp == null))
            .FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        var fotos = new List<object>();
        foreach (var b in lead.Bijlagen)
            fotos.Add(new { b.Id, b.Bestandsnaam, url = await opslag.SignedUrl(BucketUploads, b.BestandPad, 600) });
        return Ok(new
        {
            lead.Id, lead.KlantId, lead.Kanaal, lead.Status, lead.EigenaarId, lead.Opvolgdatum,
            lead.Naam, lead.Voornaam, lead.Email, lead.Telefoon, lead.EersteVraag, lead.Prijsindicatie,
            lead.VerliesReden, lead.OmgezetProjectId, lead.TypeAanvraag,
            lead.KlantType, lead.Bedrijfsnaam, lead.BtwNummer, lead.Straat, lead.Postcode, lead.Gemeente,
            lead.GewensteTiming, lead.PrivacyAkkoord, lead.PrivacyAkkoordOp, lead.WizardGegevens,
            lead.GearchiveerdOp, lead.AangemaaktOp, fotos
        });
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(LeadInvoer invoer)
    {
        var lead = new Lead
        {
            Kanaal = invoer.Kanaal, Naam = invoer.Naam, Voornaam = invoer.Voornaam, Email = invoer.Email, Telefoon = invoer.Telefoon,
            EersteVraag = invoer.EersteVraag, Opvolgdatum = invoer.Opvolgdatum,
            TypeAanvraag = invoer.TypeAanvraag, Gemeente = invoer.Gemeente,
            GewensteTiming = invoer.GewensteTiming,
            EigenaarId = invoer.EigenaarId ?? claims.MedewerkerId!.Value,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Leads.Add(lead);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Detail), new { id = lead.Id }, lead);
    }

    // Alle contactvelden en de wizard blijven bewerkbaar in het ERP.
    [HttpPatch("{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Wijzig(Guid id, LeadWijziging invoer)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        if (invoer.Naam is not null) lead.Naam = invoer.Naam;
        if (invoer.Voornaam is not null) lead.Voornaam = invoer.Voornaam;
        if (invoer.Email is not null) lead.Email = invoer.Email;
        if (invoer.Telefoon is not null) lead.Telefoon = invoer.Telefoon;
        if (invoer.EersteVraag is not null) lead.EersteVraag = invoer.EersteVraag;
        if (invoer.TypeAanvraag is not null) lead.TypeAanvraag = invoer.TypeAanvraag;
        if (invoer.KlantType is not null) lead.KlantType = invoer.KlantType;
        if (invoer.Bedrijfsnaam is not null) lead.Bedrijfsnaam = invoer.Bedrijfsnaam;
        if (invoer.BtwNummer is not null) lead.BtwNummer = invoer.BtwNummer;
        if (invoer.Straat is not null) lead.Straat = invoer.Straat;
        if (invoer.Postcode is not null) lead.Postcode = invoer.Postcode;
        if (invoer.Gemeente is not null) lead.Gemeente = invoer.Gemeente;
        if (invoer.GewensteTiming is not null) lead.GewensteTiming = invoer.GewensteTiming;
        if (invoer.Opvolgdatum is { } datum) lead.Opvolgdatum = datum;
        if (invoer.WizardGegevens is not null) lead.WizardGegevens = invoer.WizardGegevens;
        await db.SaveChangesAsync();
        return Ok(lead);
    }

    // FR-001: publieke captatie vanaf de website met Turnstile (TS-04 sectie 2).
    // Het contactformulier en de offertewizard komen hier samen binnen.
    [HttpPost("webformulier")]
    [AllowAnonymous]
    [RequestSizeLimit(60 * 1024 * 1024)]
    public async Task<IActionResult> Webformulier([FromForm] WebformulierInvoer invoer,
        [FromServices] TurnstileValidator turnstile)
    {
        if (!await turnstile.Valideer(invoer.TurnstileToken, HttpContext.Connection.RemoteIpAddress?.ToString()))
            return BadRequest(new { fout = "Verificatie mislukt. Probeer opnieuw." });
        if (!invoer.PrivacyAkkoord)
            return BadRequest(new { fout = "Ga akkoord met de verwerking van je gegevens." });
        if (invoer.Fotos is { Count: > 5 })
            return BadRequest(new { fout = "Maximaal 5 foto's per aanvraag." });

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

        var lead = new Lead
        {
            Kanaal = invoer.Soort == "offerteaanvraag" ? LeadKanaal.OfferteaanvraagWebsite : LeadKanaal.ContactWebsite,
            Naam = invoer.Naam, Voornaam = invoer.Voornaam, Email = invoer.Email, Telefoon = invoer.Telefoon,
            Straat = invoer.Straat, Postcode = invoer.Postcode, Gemeente = invoer.Gemeente,
            KlantType = invoer.KlantType, Bedrijfsnaam = invoer.Bedrijfsnaam, BtwNummer = invoer.BtwNummer,
            EersteVraag = invoer.Vraag,
            TypeAanvraag = invoer.TypeAanvraag, GewensteTiming = invoer.GewensteTiming,
            PrivacyAkkoord = true, PrivacyAkkoordOp = DateTimeOffset.UtcNow,
            WizardGegevens = string.IsNullOrWhiteSpace(invoer.WizardGegevens) ? null : invoer.WizardGegevens,
            EigenaarId = eigenaar,
            Opvolgdatum = DateOnly.FromDateTime(DateTime.Today.AddDays(2))
        };
        db.Leads.Add(lead);
        await db.SaveChangesAsync();

        if (invoer.Fotos is not null)
        {
            foreach (var foto in invoer.Fotos)
            {
                if (foto.Length == 0 || foto.Length > 10 * 1024 * 1024) continue;
                if (!FotoTypes.Contains(foto.ContentType)) continue;
                await BewaarFoto(lead.Id, foto);
            }
            await db.SaveChangesAsync();
        }
        return Ok(new { boodschap = "Bedankt. We nemen binnen twee werkdagen contact op." });
    }

    public record WebformulierInvoer(string? Soort, string Naam, string? Voornaam, string Email, string? Telefoon,
        string? Straat, string? Postcode, string? Gemeente, string? TypeAanvraag, string? GewensteTiming,
        string? KlantType, string? Bedrijfsnaam, string? BtwNummer, string? Vraag,
        bool PrivacyAkkoord, string? WizardGegevens, string? TurnstileToken, IFormFileCollection? Fotos);

    async Task BewaarFoto(Guid leadId, IFormFile foto)
    {
        var extensie = Path.GetExtension(foto.FileName);
        if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
        var pad = $"{leadId}/{Guid.NewGuid()}{extensie}";
        using var geheugen = new MemoryStream();
        await foto.CopyToAsync(geheugen);
        await opslag.Upload(BucketUploads, pad, geheugen.ToArray(), foto.ContentType);
        db.LeadBijlagen.Add(new LeadBijlage
        {
            LeadId = leadId, Bestandsnaam = foto.FileName, ContentType = foto.ContentType, BestandPad = pad,
            AangemaaktDoor = claims.MedewerkerId
        });
    }

    [HttpPost("{id:guid}/fotos")]
    [VereistRol("verkoop")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    public async Task<IActionResult> UploadFoto(Guid id, [FromForm] IFormFile bestand)
    {
        if (!FotoTypes.Contains(bestand.ContentType))
            return BadRequest(new { fout = "Toegelaten formaten: jpeg, png, webp of heic." });
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        await BewaarFoto(id, bestand);
        await db.SaveChangesAsync();
        return Ok(new { boodschap = "Foto toegevoegd." });
    }

    [HttpDelete("{id:guid}/fotos/{bijlageId:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> VerwijderFoto(Guid id, Guid bijlageId)
    {
        var bijlage = await db.LeadBijlagen.FirstOrDefaultAsync(b => b.Id == bijlageId && b.LeadId == id && b.VerwijderdOp == null);
        if (bijlage is null) return NotFound();
        bijlage.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete, opruiming volgt retentie
        await db.SaveChangesAsync();
        return Ok(new { bijlage.Id, verwijderd = true });
    }

    // Archiveren haalt de lead uit de inbox zonder het statusmodel te raken.
    [HttpPost("{id:guid}/archiveer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Archiveer(Guid id)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        lead.GearchiveerdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { lead.Id, gearchiveerd = true });
    }

    [HttpPost("{id:guid}/herstel")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Herstel(Guid id)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        lead.GearchiveerdOp = null;
        await db.SaveChangesAsync();
        return Ok(new { lead.Id, gearchiveerd = false });
    }

    // Verwijderen is aan de beheerder (rollenmatrix: lead D) en blijft soft delete.
    [HttpDelete("{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Verwijder(Guid id)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        lead.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { lead.Id, verwijderd = true });
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

    [HttpPost("{id:guid}/heractiveer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Heractiveer(Guid id) => Ok(await service.Heractiveer(id));
}
