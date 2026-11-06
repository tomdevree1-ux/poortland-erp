using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// Fotoberichten: de vaste publieke pagina /fotos (migratie 0044 en 0045). Deze
// pagina is bedoeld voor bestaande klanten die een foto van hun geplaatste poort
// met ons delen, zodat Poortland ze bij de realisaties kan tonen. De inzending
// hangt aan geen enkele lead en komt in een eigen sectie van het ERP terecht.
// Publiceren vraagt een eigen vinkje naast het gewone privacyakkoord. Zelfde
// beveiligingsopzet als het webformulier: systeemclaims, snelheidslimiet per ip
// en inhoudsvalidatie van elk bestand.
[ApiController]
[Route("api/v1/fotoberichten")]
public class FotoberichtenController(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag) : ControllerBase
{
    const string Bucket = "foto_inzendingen";
    const int MaxFotos = 20;
    const int MaxBytesPerFoto = 20 * 1024 * 1024;
    static readonly string[] FotoTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

    // ---------- publiek ----------

    [HttpPost("publiek")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("webformulier")]
    [RequestSizeLimit(120 * 1024 * 1024)]
    public async Task<IActionResult> Ontvang(
        [FromForm] string naam,
        [FromForm] string? email,
        [FromForm] string? telefoon,
        [FromForm] string? bericht,
        [FromForm] string? bron,
        [FromForm] string? gemeente,
        [FromForm] int? geplaatstJaar,
        [FromForm] bool privacyAkkoord,
        [FromForm] bool publicatieAkkoord,
        [FromForm] IFormFileCollection fotos)
    {
        claims.VulAlsSysteem();
        await DbClaims.ZetClaims(db, claims, HttpContext.RequestAborted);
        db.IdentiteitJson = claims.NaarJwtClaimsJson();

        if (string.IsNullOrWhiteSpace(naam) || naam.Trim().Length < 2)
            return BadRequest(new { fout = "Gelieve uw naam in te vullen." });
        if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(telefoon))
            return BadRequest(new { fout = "Vul een emailadres of een telefoonnummer in zodat wij u kunnen bereiken." });
        if (!privacyAkkoord)
            return BadRequest(new { fout = "Gelieve akkoord te gaan met de verwerking van uw gegevens." });
        if (fotos is null || fotos.Count == 0)
            return BadRequest(new { fout = "Kies minstens een foto." });
        if (fotos.Count > MaxFotos)
            return BadRequest(new { fout = $"Er kunnen maximaal {MaxFotos} foto's per keer verstuurd worden." });

        var inzending = new Fotobericht
        {
            Naam = Kort(naam, 120)!,
            Email = Kort(email, 160),
            Telefoon = Kort(telefoon, 40),
            Bericht = Kort(bericht, 2000),
            Herkomst = Kort(bron, 60),
            Gemeente = Kort(gemeente, 80),
            GeplaatstJaar = geplaatstJaar is >= 1950 and <= 2100 ? geplaatstJaar : null,
            PrivacyAkkoord = true,
            PrivacyAkkoordOp = DateTimeOffset.UtcNow,
            PublicatieAkkoord = publicatieAkkoord
        };
        db.Fotoberichten.Add(inzending);

        var bewaard = 0;
        foreach (var foto in fotos)
        {
            if (foto.Length == 0 || foto.Length > MaxBytesPerFoto) continue;
            if (!FotoTypes.Contains(foto.ContentType)) continue;
            using var geheugen = new MemoryStream();
            await foto.CopyToAsync(geheugen);
            var bytes = geheugen.ToArray();
            // Inhoud valideren, niet de header (zelfde aanpak als het uploadportaal).
            if (!Bestandsvalidatie.IsGeldigeAfbeelding(bytes) && !IsHeic(bytes)) continue;
            var extensie = Path.GetExtension(foto.FileName);
            if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
            var pad = $"{inzending.Id}/{Guid.NewGuid()}{extensie}";
            await opslag.Upload(Bucket, pad, bytes, foto.ContentType);
            db.FotoberichtBijlagen.Add(new FotoberichtBijlage
            {
                FotoberichtId = inzending.Id,
                Bestandsnaam = Kort(foto.FileName, 200) ?? "foto",
                ContentType = foto.ContentType,
                BestandPad = pad
            });
            bewaard++;
        }
        if (bewaard == 0)
            return BadRequest(new { fout = "Geen geldige foto's gevonden. Gebruik JPG, PNG, WEBP of HEIC tot 20 MB per foto." });

        // Iedereen met een verkoopsrol krijgt een melding; de inzending hoort
        // immers nog bij niemand.
        var verkopers = await db.MedewerkerRollen.AsNoTracking()
            .Where(r => r.Rol == Rol.Verkoop)
            .Select(r => r.MedewerkerId).Distinct().ToListAsync();
        foreach (var medewerkerId in verkopers)
            db.Notificaties.Add(new Notificatie
            {
                MedewerkerId = medewerkerId,
                Type = "fotoberichtOntvangen",
                Titel = "Nieuwe foto's ontvangen",
                Boodschap = $"{bewaard} foto('s) van {inzending.Naam}"
                    + (inzending.PublicatieAkkoord ? ", mag online getoond worden" : ""),
                EntiteitType = "fotobericht",
                EntiteitId = inzending.Id
            });

        await db.SaveChangesAsync();
        return Ok(new
        {
            boodschap = "Bedankt, uw foto's zijn goed aangekomen.",
            ontvangen = bewaard
        });
    }

    // ---------- intern ----------

    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] string? status, [FromQuery] string? zoek)
    {
        var vraag = db.Fotoberichten.AsNoTracking().Where(f => f.VerwijderdOp == null);
        if (status == "nieuw") vraag = vraag.Where(f => f.Status == FotoberichtStatus.Nieuw);
        if (status == "behandeld") vraag = vraag.Where(f => f.Status == FotoberichtStatus.Behandeld);
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            var t = $"%{zoek.Trim()}%";
            vraag = vraag.Where(f => EF.Functions.ILike(f.Naam, t)
                || (f.Email != null && EF.Functions.ILike(f.Email, t))
                || (f.Telefoon != null && EF.Functions.ILike(f.Telefoon, t)));
        }
        var lijst = await vraag
            .OrderByDescending(f => f.AangemaaktOp)
            .Select(f => new
            {
                f.Id, f.Naam, f.Email, f.Telefoon, f.Bericht, f.Herkomst, f.Status,
                f.Gemeente, f.GeplaatstJaar, f.PublicatieAkkoord,
                f.LeadId, f.BehandeldOp, f.AangemaaktOp,
                aantalFotos = f.Bijlagen.Count(b => b.VerwijderdOp == null)
            })
            .Take(200).ToListAsync();
        var openstaand = await db.Fotoberichten.CountAsync(f =>
            f.VerwijderdOp == null && f.Status == FotoberichtStatus.Nieuw);
        return Ok(new { lijst, openstaand });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var bericht = await db.Fotoberichten.AsNoTracking()
            .Include(f => f.Bijlagen.Where(b => b.VerwijderdOp == null))
            .FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (bericht is null) return NotFound();
        var fotos = await Task.WhenAll(bericht.Bijlagen.Select(async b =>
            (object)new { b.Id, b.Bestandsnaam, url = await opslag.SignedUrl(Bucket, b.BestandPad, 600) }));
        return Ok(new
        {
            bericht.Id, bericht.Naam, bericht.Email, bericht.Telefoon, bericht.Bericht, bericht.Herkomst,
            bericht.Gemeente, bericht.GeplaatstJaar, bericht.PublicatieAkkoord,
            bericht.Status, bericht.LeadId, bericht.BehandeldOp, bericht.AangemaaktOp, fotos
        });
    }

    public record StatusInvoer(string Status);

    [HttpPatch("{id:guid}/status")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> ZetStatus(Guid id, StatusInvoer invoer)
    {
        var bericht = await db.Fotoberichten.FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (bericht is null) return NotFound();
        var behandeld = invoer.Status == "behandeld";
        bericht.Status = behandeld ? FotoberichtStatus.Behandeld : FotoberichtStatus.Nieuw;
        bericht.BehandeldOp = behandeld ? DateTimeOffset.UtcNow : null;
        bericht.BehandeldDoor = behandeld ? claims.MedewerkerId : null;
        await db.SaveChangesAsync();
        return Ok(new { bericht.Id, bericht.Status, bericht.BehandeldOp });
    }

    public record KoppelInvoer(Guid? LeadId);

    // De foto's verhuizen mee naar de lead zodat ze op de leadfiche verschijnen.
    // Een kopie in de bucket van de lead, de inzending blijft als spoor bestaan.
    [HttpPost("{id:guid}/koppel")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Koppel(Guid id, KoppelInvoer invoer)
    {
        var bericht = await db.Fotoberichten
            .Include(f => f.Bijlagen.Where(b => b.VerwijderdOp == null))
            .FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (bericht is null) return NotFound();

        Lead? lead = null;
        if (invoer.LeadId is Guid leadId)
        {
            lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == leadId && l.VerwijderdOp == null);
            if (lead is null) return NotFound(new { fout = "Deze lead bestaat niet." });
        }
        else
        {
            // Nieuwe lead uit de inzending; de medewerker vult de rest later aan.
            lead = new Lead
            {
                Kanaal = LeadKanaal.ContactWebsite,
                Status = LeadStatus.Nieuw,
                EigenaarId = claims.MedewerkerId!.Value,
                Naam = bericht.Naam,
                Email = bericht.Email,
                Telefoon = bericht.Telefoon,
                EersteVraag = bericht.Bericht ?? "Foto's bezorgd via de fotopagina.",
                PrivacyAkkoord = bericht.PrivacyAkkoord,
                PrivacyAkkoordOp = bericht.PrivacyAkkoordOp
            };
            db.Leads.Add(lead);
        }

        foreach (var bijlage in bericht.Bijlagen)
        {
            var bytes = await opslag.Download(Bucket, bijlage.BestandPad);
            var extensie = Path.GetExtension(bijlage.BestandPad);
            var pad = $"{lead.Id}/{Guid.NewGuid()}{extensie}";
            await opslag.Upload("lead_uploads", pad, bytes, bijlage.ContentType);
            db.LeadBijlagen.Add(new LeadBijlage
            {
                LeadId = lead.Id, Bestandsnaam = bijlage.Bestandsnaam,
                ContentType = bijlage.ContentType, BestandPad = pad
            });
        }

        bericht.LeadId = lead.Id;
        bericht.Status = FotoberichtStatus.Behandeld;
        bericht.BehandeldOp = DateTimeOffset.UtcNow;
        bericht.BehandeldDoor = claims.MedewerkerId;
        await db.SaveChangesAsync();
        return Ok(new { bericht.Id, leadId = lead.Id, aantalFotos = bericht.Bijlagen.Count });
    }

    [HttpDelete("{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Verwijder(Guid id)
    {
        var bericht = await db.Fotoberichten.FirstOrDefaultAsync(f => f.Id == id && f.VerwijderdOp == null);
        if (bericht is null) return NotFound();
        bericht.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete, opruiming volgt retentie
        await db.SaveChangesAsync();
        return Ok(new { bericht.Id, verwijderd = true });
    }

    static string? Kort(string? waarde, int max)
    {
        if (string.IsNullOrWhiteSpace(waarde)) return null;
        var schoon = waarde.Trim();
        return schoon.Length <= max ? schoon : schoon[..max];
    }

    // HEIC/HEIF: iso-container met "ftyp" op positie 4 en een heif-merk erna.
    static bool IsHeic(byte[] b)
    {
        if (b.Length < 12) return false;
        if (b[4] != (byte)'f' || b[5] != (byte)'t' || b[6] != (byte)'y' || b[7] != (byte)'p') return false;
        var merk = System.Text.Encoding.ASCII.GetString(b, 8, 4);
        return merk is "heic" or "heix" or "hevc" or "heif" or "mif1" or "msf1";
    }
}
