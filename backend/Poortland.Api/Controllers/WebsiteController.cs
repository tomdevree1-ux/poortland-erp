using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// TS-17 Websitebeheer: foto's en de popup, achter login met RLS als tweede laag.
[ApiController]
[Route("api/v1/website")]
[Authorize]
public class WebsiteController(PoortlandDbContext db, ClaimsContext claims,
    WebsiteContentService service, SupabaseOpslag opslag) : ControllerBase
{
    public record MediaWijziging(string? Titel, string? AltTekst, string? Categorie, int? Volgnummer,
        bool? PersonenInBeeld, bool? ToestemmingBevestigd,
        string? ProductSoort, string? PoortType, string? PoortUitvoering);
    public record PopupInvoer(string Titel, string BodyTekst, DateOnly ActiefVan, DateOnly ActiefTot);

    [HttpGet("media")]
    public async Task<IActionResult> Media([FromQuery] WebsiteContentStatus? status)
    {
        var query = db.WebsiteMedias.AsNoTracking().Where(m => m.VerwijderdOp == null);
        if (status is { } s) query = query.Where(m => m.Status == s);
        var lijst = await query.OrderBy(m => m.Volgnummer).ToListAsync();
        var resultaat = new List<object>();
        foreach (var m in lijst)
        {
            // Voorbeeld in het ERP via een kortlevende signed URL op het private origineel.
            // Weerbaar per foto: een ontbrekend bestand blokkeert nooit de hele lijst.
            string? voorbeeld = null;
            try
            {
                voorbeeld = m.BestandPadThumb is not null && m.Status == WebsiteContentStatus.Gepubliceerd
                    ? opslag.PubliekeUrl("website_publiek", m.BestandPadThumb)
                    : await opslag.SignedUrl("website_origineel", $"{m.Id}/thumb.webp");
            }
            catch { /* voorbeeld blijft leeg en de kaart toont een plaatshouder */ }
            resultaat.Add(new { m.Id, m.Titel, m.AltTekst, m.Categorie, m.Volgnummer, m.Status,
                m.ProductSoort, m.PoortType, m.PoortUitvoering,
                m.Breedte, m.Hoogte, m.PersonenInBeeld, m.ToestemmingBevestigd, m.GepubliceerdOp, voorbeeld });
        }
        return Ok(resultaat);
    }

    [HttpPost("media")]
    [VereistRol("verkoop")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    public async Task<IActionResult> Upload([FromForm] IFormFile bestand, [FromForm] string titel,
        [FromForm] string? categorie, [FromForm] string? productSoort,
        [FromForm] string? poortType, [FromForm] string? poortUitvoering)
    {
        await using var stream = bestand.OpenReadStream();
        var media = await service.Upload(stream, bestand.FileName, bestand.ContentType, titel,
            categorie, productSoort, poortType, poortUitvoering);
        return Ok(media);
    }

    [HttpPatch("media/{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> WijzigMedia(Guid id, MediaWijziging invoer)
    {
        var media = await db.WebsiteMedias.FirstOrDefaultAsync(m => m.Id == id && m.VerwijderdOp == null);
        if (media is null) return NotFound();
        if (invoer.Titel is not null) media.Titel = invoer.Titel;
        if (invoer.AltTekst is not null) media.AltTekst = invoer.AltTekst;
        if (invoer.Categorie is not null) media.Categorie = invoer.Categorie;
        if (invoer.Volgnummer is { } v) media.Volgnummer = v;
        if (invoer.PersonenInBeeld is { } p) media.PersonenInBeeld = p;
        if (invoer.ToestemmingBevestigd is { } t) media.ToestemmingBevestigd = t;
        if (invoer.ProductSoort is not null) media.ProductSoort = invoer.ProductSoort;
        if (invoer.PoortType is not null) media.PoortType = invoer.PoortType == "" ? null : invoer.PoortType;
        if (invoer.PoortUitvoering is not null) media.PoortUitvoering = invoer.PoortUitvoering == "" ? null : invoer.PoortUitvoering;
        if (media.ProductSoort == "overkapping") { media.PoortType = null; media.PoortUitvoering = null; }
        await db.SaveChangesAsync();
        if (media.Status == WebsiteContentStatus.Gepubliceerd) await service.HerbouwContentJson();
        return Ok(media);
    }

    [HttpPost("media/{id:guid}/publiceer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Publiceer(Guid id) => Ok(await service.Publiceer(id));

    [HttpPost("media/{id:guid}/depubliceer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Depubliceer(Guid id) => Ok(await service.Depubliceer(id));

    [HttpDelete("media/{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> VerwijderMedia(Guid id)
    {
        var media = await db.WebsiteMedias.FirstOrDefaultAsync(m => m.Id == id && m.VerwijderdOp == null);
        if (media is null) return NotFound();
        if (media.Status == WebsiteContentStatus.Gepubliceerd)
            return BadRequest(new { fout = "Depubliceer eerst en verwijder daarna." });
        media.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete (TS-01)
        await db.SaveChangesAsync();
        return Ok(new { media.Id, verwijderd = true });
    }

    [HttpGet("popup")]
    public async Task<IActionResult> Popup()
    {
        var actueel = await db.WebsitePopups.AsNoTracking()
            .Where(p => p.VerwijderdOp == null)
            .OrderByDescending(p => p.GewijzigdOp).Take(10).ToListAsync();
        return Ok(actueel);
    }

    [HttpPut("popup")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> ZetPopup(PopupInvoer invoer)
    {
        var concept = await db.WebsitePopups
            .FirstOrDefaultAsync(p => p.Status == WebsiteContentStatus.Concept && p.VerwijderdOp == null);
        if (concept is null)
        {
            concept = new WebsitePopup { AangemaaktDoor = claims.MedewerkerId };
            db.WebsitePopups.Add(concept);
        }
        concept.Titel = invoer.Titel;
        concept.BodyTekst = invoer.BodyTekst;
        concept.ActiefVan = invoer.ActiefVan;
        concept.ActiefTot = invoer.ActiefTot;
        await db.SaveChangesAsync();
        return Ok(concept);
    }

    [HttpPost("popup/{id:guid}/publiceer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> PubliceerPopup(Guid id) => Ok(await service.PubliceerPopup(id));

    [HttpPost("popup/{id:guid}/depubliceer")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> DepubliceerPopup(Guid id) => Ok(await service.DepubliceerPopup(id));
}
