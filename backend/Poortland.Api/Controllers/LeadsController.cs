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
    string? TypeAanvraag, string? Gemeente, string? GewensteTiming,
    string? KlantType, string? Bedrijfsnaam, string? BtwNummer, string? Straat, string? Postcode,
    List<ContactpersoonInvoer>? Contactpersonen = null);
public record LeadWijziging(string? Naam, string? Voornaam, string? Email, string? Telefoon, string? EersteVraag,
    string? TypeAanvraag, string? KlantType, string? Bedrijfsnaam, string? BtwNummer,
    string? Straat, string? Postcode, string? Gemeente, string? GewensteTiming, DateOnly? Opvolgdatum,
    decimal? Prijsindicatie, string? WizardGegevens);
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
            // Serverzijdig zoeken met relevantie en fouttolerantie (0027, zoekregels README).
            var ids = await db.Database
                .SqlQuery<Guid>($@"select id as ""Value"" from zoek_leads({zoek}, {archief})")
                .ToListAsync();
            var treffers = await query.Where(l => ids.Contains(l.Id)).ToListAsync();
            return Ok(ids.Select(i => treffers.FirstOrDefault(l => l.Id == i)).Where(l => l is not null)
                .Select(l => Lijstrij(l!)).ToList());
        }
        var leads = await query.OrderByDescending(l => l.AangemaaktOp).Take(200).ToListAsync();
        return Ok(leads.Select(Lijstrij));
    }

    // Smalle lijstprojectie zonder de wizardblob en detailvelden (audit performantie 3).
    static object Lijstrij(Lead l) => new
    {
        l.Id, l.Kanaal, l.Status, l.EigenaarId, l.Naam, l.Voornaam, l.Email, l.Telefoon,
        l.EersteVraag, l.Prijsindicatie, l.Opvolgdatum, l.TypeAanvraag, l.KlantType,
        l.Bedrijfsnaam, l.BtwNummer, l.Gemeente, l.GearchiveerdOp, l.OmgezetProjectId, l.AangemaaktOp
    };

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id, [FromServices] IConfiguration config)
    {
        var lead = await db.Leads.AsNoTracking()
            .Include(l => l.Bijlagen.Where(b => b.VerwijderdOp == null))
            .FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        // Signed urls parallel ophalen (audit snelheid 1).
        var fotos = await Task.WhenAll(lead.Bijlagen.Select(async b =>
            (object)new { b.Id, b.Bestandsnaam, url = await opslag.SignedUrl(BucketUploads, b.BestandPad, 600) }));
        // Contactpersonen van deze lead; na omzetting zijn ze ook aan de klant
        // gekoppeld en dus op beide fiches dezelfde bron (migratie 0039).
        var contactpersonen = await db.Contactpersonen.AsNoTracking()
            .Where(c => c.LeadId == id && c.VerwijderdOp == null)
            .OrderBy(c => c.AangemaaktOp).ToListAsync();
        // Fotostatus (feedback 2026-08-06): foto's aanwezig = ontvangen, anders
        // actieve uploadlink = link verstuurd, anders nog geen foto's.
        var tokenActief = lead.UploadToken != null && lead.UploadTokenGeldigTot > DateTimeOffset.UtcNow;
        var fotoStatus = fotos.Length > 0 ? "fotosOntvangen" : tokenActief ? "linkVerstuurd" : "nogGeenFotos";
        return Ok(new
        {
            lead.Id, lead.KlantId, lead.Kanaal, lead.Status, lead.EigenaarId, lead.Opvolgdatum,
            lead.Naam, lead.Voornaam, lead.Email, lead.Telefoon, lead.EersteVraag, lead.Prijsindicatie,
            lead.VerliesReden, lead.OmgezetProjectId, lead.TypeAanvraag,
            lead.KlantType, lead.Bedrijfsnaam, lead.BtwNummer, lead.Straat, lead.Postcode, lead.Gemeente,
            lead.GewensteTiming, lead.PrivacyAkkoord, lead.PrivacyAkkoordOp, lead.WizardGegevens,
            lead.GearchiveerdOp, lead.AangemaaktOp, fotos, contactpersonen,
            lead.UploadToken, lead.UploadTokenGeldigTot, lead.UploadLinkVerstuurdOp, tokenActief, fotoStatus,
            uploadUrl = lead.UploadToken == null ? null :
                $"{(config["Site:Origin"] ?? config["Frontend:Origin"] ?? "").TrimEnd('/')}/upload/{lead.UploadToken}"
        });
    }

    // Foto-opvraag: genereer een cryptografisch veilige uploadlink voor deze lead.
    // Opnieuw genereren overschrijft de oude token (de oude link vervalt vanzelf).
    [HttpPost("{id:guid}/uploadlink")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> MaakUploadlink(Guid id, [FromServices] IConfiguration config)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        var token = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(32))
            .Replace('+', '-').Replace('/', '_').TrimEnd('=');
        lead.UploadToken = token;
        lead.UploadTokenGeldigTot = DateTimeOffset.UtcNow.AddDays(30);
        lead.UploadLinkVerstuurdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        // De link leeft op de publieke website. Site:Origin komt uit de omgevings-
        // configuratie (rol_uit.sh) en past zich dus vanzelf aan per omgeving,
        // inclusief het echte productiedomein.
        var siteOrigin = (config["Site:Origin"] ?? config["Frontend:Origin"] ?? "").TrimEnd('/');
        return Ok(new { token, geldigTot = lead.UploadTokenGeldigTot, url = $"{siteOrigin}/upload/{token}" });
    }

    // Uploadlink manueel intrekken.
    [HttpDelete("{id:guid}/uploadlink")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> TrekUploadlinkIn(Guid id)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (lead is null) return NotFound();
        lead.UploadToken = null;
        lead.UploadTokenGeldigTot = null;
        await db.SaveChangesAsync();
        return Ok(new { ingetrokken = true });
    }

    // Contactpersonen bij de lead: zelfde venster en velden als bij de klant.
    // Bij de omzetting koppelt de service ze automatisch aan de nieuwe klant.
    [HttpPost("{id:guid}/contactpersonen")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> MaakContactpersoon(Guid id, ContactpersoonInvoer invoer)
    {
        var bestaat = await db.Leads.AnyAsync(l => l.Id == id && l.VerwijderdOp == null);
        if (!bestaat) return NotFound();
        var persoon = new Contactpersoon
        {
            LeadId = id, Naam = invoer.Naam, Voornaam = invoer.Voornaam, Functie = invoer.Functie,
            Email = invoer.Email, Telefoon = invoer.Telefoon,
            Type = invoer.Type,
            Bedrijfsnaam = invoer.Type == KlantType.Bedrijf ? invoer.Bedrijfsnaam : null,
            BtwNummer = invoer.Type == KlantType.Bedrijf ? invoer.BtwNummer : null,
            OntvangtOfferte = invoer.OntvangtOfferte,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Contactpersonen.Add(persoon);
        await db.SaveChangesAsync();
        return Ok(persoon);
    }

    [HttpPatch("{id:guid}/contactpersonen/{persoonId:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> WijzigContactpersoon(Guid id, Guid persoonId, ContactpersoonInvoer invoer)
    {
        var persoon = await db.Contactpersonen
            .FirstOrDefaultAsync(c => c.Id == persoonId && c.LeadId == id && c.VerwijderdOp == null);
        if (persoon is null) return NotFound();
        persoon.Naam = invoer.Naam; persoon.Voornaam = invoer.Voornaam; persoon.Functie = invoer.Functie;
        persoon.Email = invoer.Email; persoon.Telefoon = invoer.Telefoon;
        persoon.Type = invoer.Type;
        persoon.Bedrijfsnaam = invoer.Type == KlantType.Bedrijf ? invoer.Bedrijfsnaam : null;
        persoon.BtwNummer = invoer.Type == KlantType.Bedrijf ? invoer.BtwNummer : null;
        persoon.OntvangtOfferte = invoer.OntvangtOfferte;
        await db.SaveChangesAsync();
        return Ok(persoon);
    }

    [HttpDelete("{id:guid}/contactpersonen/{persoonId:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> VerwijderContactpersoon(Guid id, Guid persoonId)
    {
        var persoon = await db.Contactpersonen
            .FirstOrDefaultAsync(c => c.Id == persoonId && c.LeadId == id && c.VerwijderdOp == null);
        if (persoon is null) return NotFound();
        persoon.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete (TS-01)
        await db.SaveChangesAsync();
        return Ok(new { persoon.Id, verwijderd = true });
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
            KlantType = invoer.KlantType,
            Bedrijfsnaam = invoer.KlantType == "bedrijf" ? invoer.Bedrijfsnaam : null,
            BtwNummer = invoer.KlantType == "bedrijf" ? invoer.BtwNummer : null,
            Straat = invoer.Straat, Postcode = invoer.Postcode,
            EigenaarId = invoer.EigenaarId ?? claims.MedewerkerId!.Value,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Leads.Add(lead);
        // Eerst de lead bewaren: EF kent de koppeling contactpersoon-lead niet als
        // relatie, dus in een gezamenlijke save kan de contactpersoon vóór de lead
        // vertrekken en dan schendt de insert de foreign key.
        await db.SaveChangesAsync();
        // Extra contactpersonen die meteen bij het aanmaken meegegeven worden
        // (feedback 2026-08-06): zelfde velden als het losse endpoint hieronder.
        var personen = (invoer.Contactpersonen ?? []).Where(p => !string.IsNullOrWhiteSpace(p.Naam)).ToList();
        if (personen.Count > 0)
        {
            foreach (var p in personen)
            {
                db.Contactpersonen.Add(new Contactpersoon
                {
                    LeadId = lead.Id, Naam = p.Naam, Voornaam = p.Voornaam, Functie = p.Functie,
                    Email = p.Email, Telefoon = p.Telefoon,
                    Type = p.Type,
                    Bedrijfsnaam = p.Type == KlantType.Bedrijf ? p.Bedrijfsnaam : null,
                    BtwNummer = p.Type == KlantType.Bedrijf ? p.BtwNummer : null,
                    OntvangtOfferte = p.OntvangtOfferte,
                    AangemaaktDoor = claims.MedewerkerId
                });
            }
            await db.SaveChangesAsync();
        }
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
        if (invoer.Prijsindicatie is { } prijs) lead.Prijsindicatie = prijs;
        if (invoer.WizardGegevens is not null) lead.WizardGegevens = invoer.WizardGegevens;
        await db.SaveChangesAsync();
        return Ok(lead);
    }

    // FR-001: publieke captatie vanaf de website met Turnstile (TS-04 sectie 2).
    // Het contactformulier en de offertewizard komen hier samen binnen.
    [HttpPost("webformulier")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("webformulier")]
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
        db.IdentiteitJson = claims.NaarJwtClaimsJson();
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
                await BewaarFoto(lead.Id, foto); // valideert de inhoud en slaat vervalste bestanden over
            }
            await db.SaveChangesAsync();
        }
        return Ok(new { boodschap = "Bedankt. We nemen binnen twee werkdagen contact op." });
    }

    public record WebformulierInvoer(string? Soort, string Naam, string? Voornaam, string Email, string? Telefoon,
        string? Straat, string? Postcode, string? Gemeente, string? TypeAanvraag, string? GewensteTiming,
        string? KlantType, string? Bedrijfsnaam, string? BtwNummer, string? Vraag,
        bool PrivacyAkkoord, string? WizardGegevens, string? TurnstileToken, IFormFileCollection? Fotos);

    async Task<bool> BewaarFoto(Guid leadId, IFormFile foto)
    {
        using var geheugen = new MemoryStream();
        await foto.CopyToAsync(geheugen);
        var bytes = geheugen.ToArray();
        // Inhoud valideren, niet de header (audit sectie 7): geen echte afbeelding, geen opslag.
        if (!Bestandsvalidatie.IsGeldigeAfbeelding(bytes)) return false;
        var extensie = Path.GetExtension(foto.FileName);
        if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
        var pad = $"{leadId}/{Guid.NewGuid()}{extensie}";
        await opslag.Upload(BucketUploads, pad, bytes, foto.ContentType);
        db.LeadBijlagen.Add(new LeadBijlage
        {
            LeadId = leadId, Bestandsnaam = foto.FileName, ContentType = foto.ContentType, BestandPad = pad,
            AangemaaktDoor = claims.MedewerkerId
        });
        return true;
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
        if (!await BewaarFoto(id, bestand))
            return BadRequest(new { fout = "Dit bestand is geen geldige afbeelding." });
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
