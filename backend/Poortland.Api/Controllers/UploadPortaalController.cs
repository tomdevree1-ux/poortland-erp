using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Adapters;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// Publiek uploadportaal voor de foto-opvraag (feedback 2026-08-06). De klant
// bereikt dit zonder login via een unieke token; er staat geen lead-id of
// persoonsgegeven in de URL. Zelfde beveiligingsopzet als het webformulier:
// systeemclaims, snelheidslimiet per ip en inhoudsvalidatie van elk bestand.
[ApiController]
[Route("api/v1/uploadportaal")]
public class UploadPortaalController(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag) : ControllerBase
{
    const string BucketUploads = "lead_uploads";
    const int MaxFotos = 20;
    const int MaxBytesPerFoto = 20 * 1024 * 1024;
    static readonly string[] FotoTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

    async Task<Lead?> LeadBijToken(string token)
    {
        claims.VulAlsSysteem();
        await DbClaims.ZetClaims(db, claims, HttpContext.RequestAborted);
        db.IdentiteitJson = claims.NaarJwtClaimsJson();
        if (string.IsNullOrWhiteSpace(token) || token.Length < 20) return null;
        return await db.Leads
            .Include(l => l.Bijlagen.Where(b => b.VerwijderdOp == null))
            .FirstOrDefaultAsync(l => l.UploadToken == token && l.VerwijderdOp == null
                && l.UploadTokenGeldigTot > DateTimeOffset.UtcNow);
    }

    // Validatie van de link plus de melding "reeds X foto's ontvangen".
    [HttpGet("{token}")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("webformulier")]
    public async Task<IActionResult> Info(string token)
    {
        var lead = await LeadBijToken(token);
        if (lead is null)
            return NotFound(new { fout = "Deze uploadlink is niet meer geldig. Vraag gerust een nieuwe link aan." });
        return Ok(new { ok = true, aantalFotos = lead.Bijlagen.Count, maxFotos = MaxFotos });
    }

    [HttpPost("{token}/fotos")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("webformulier")]
    [RequestSizeLimit(120 * 1024 * 1024)]
    public async Task<IActionResult> Upload(string token, [FromForm] IFormFileCollection fotos)
    {
        var lead = await LeadBijToken(token);
        if (lead is null)
            return NotFound(new { fout = "Deze uploadlink is niet meer geldig. Vraag gerust een nieuwe link aan." });
        if (fotos is null || fotos.Count == 0)
            return BadRequest(new { fout = "Kies minstens een foto." });
        if (lead.Bijlagen.Count + fotos.Count > MaxFotos)
            return BadRequest(new { fout = $"Er kunnen maximaal {MaxFotos} foto's per aanvraag ontvangen worden. Er zijn er al {lead.Bijlagen.Count}." });

        var bewaard = 0;
        foreach (var foto in fotos)
        {
            if (foto.Length == 0 || foto.Length > MaxBytesPerFoto) continue;
            if (!FotoTypes.Contains(foto.ContentType)) continue;
            using var geheugen = new MemoryStream();
            await foto.CopyToAsync(geheugen);
            var bytes = geheugen.ToArray();
            // Inhoud valideren, niet de header: ImageSharp voor jpg/png/webp, en
            // voor heic/heif de magische bytes (ftyp met een heif-merk).
            if (!Bestandsvalidatie.IsGeldigeAfbeelding(bytes) && !IsHeic(bytes)) continue;
            var extensie = Path.GetExtension(foto.FileName);
            if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
            var pad = $"{lead.Id}/{Guid.NewGuid()}{extensie}";
            await opslag.Upload(BucketUploads, pad, bytes, foto.ContentType);
            db.LeadBijlagen.Add(new LeadBijlage
            {
                LeadId = lead.Id, Bestandsnaam = foto.FileName, ContentType = foto.ContentType, BestandPad = pad
            });
            bewaard++;
        }
        if (bewaard == 0)
            return BadRequest(new { fout = "Geen geldige foto's gevonden. Gebruik JPG, PNG, WEBP of HEIC tot 20 MB per foto." });

        // Notificatie voor de verantwoordelijke medewerker; de fotostatus volgt
        // automatisch omdat ze afgeleid wordt van de aanwezige foto's.
        db.Notificaties.Add(new Notificatie
        {
            MedewerkerId = lead.EigenaarId,
            Type = "fotosOntvangen",
            Titel = "Foto's ontvangen via uploadlink",
            Boodschap = $"{bewaard} foto('s) ontvangen voor de aanvraag van {lead.Voornaam} {lead.Naam}".Trim(),
            EntiteitType = "lead",
            EntiteitId = lead.Id
        });
        await db.SaveChangesAsync();
        return Ok(new
        {
            boodschap = "Bedankt! Uw foto's werden succesvol ontvangen. Ons team bekijkt uw aanvraag zo snel mogelijk.",
            ontvangen = bewaard,
            totaal = lead.Bijlagen.Count
        });
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
