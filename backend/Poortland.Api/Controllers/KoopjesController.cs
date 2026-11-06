using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

// Beheer van de koopjes uit voorraad. Alleen voor wie de website beheert; de
// publieke site leest ze via content.json en nooit via deze api.
[ApiController]
[Route("api/v1/koopjes")]
[Authorize]
public class KoopjesController(PoortlandDbContext db, KoopjeService dienst) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Lijst()
    {
        var lijst = await db.Koopjes.AsNoTracking()
            .Where(k => k.VerwijderdOp == null)
            .OrderBy(k => k.Volgnummer)
            .Select(k => new
            {
                k.Id, k.Materiaal, k.Model, k.Ral, k.BreedteCm, k.HoogteCm, k.ExtraInfo,
                k.PrijsInclBtw, k.Status, k.Volgnummer, k.VerkochtOp, k.AangemaaktOp,
                fotos = k.Fotos.Where(f => f.VerwijderdOp == null).OrderBy(f => f.Volgnummer)
                    .Select(f => new { f.Id, f.BestandPadWeb, f.BestandPadThumb, f.AltTekst, f.Volgnummer })
                    .ToList()
            })
            .ToListAsync();
        return Ok(lijst);
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(KoopjeService.Invoer invoer) => Ok(await dienst.Maak(invoer));

    [HttpPut("{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Wijzig(Guid id, KoopjeService.Invoer invoer) => Ok(await dienst.Wijzig(id, invoer));

    public record StatusInvoer(KoopjeStatus Status);

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

    [HttpPost("{id:guid}/fotos")]
    [VereistRol("verkoop")]
    [RequestSizeLimit(20 * 1024 * 1024)]
    public async Task<IActionResult> VoegFotoToe(Guid id, IFormFile bestand)
    {
        if (bestand is null || bestand.Length == 0) return BadRequest(new { fout = "Kies een foto." });
        using var stroom = bestand.OpenReadStream();
        var foto = await dienst.VoegFotoToe(id, stroom, bestand.FileName, bestand.ContentType);
        return Ok(new { foto.Id, foto.BestandPadWeb, foto.BestandPadThumb, foto.Volgnummer });
    }

    [HttpDelete("{id:guid}/fotos/{fotoId:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> VerwijderFoto(Guid id, Guid fotoId)
    {
        await dienst.VerwijderFoto(id, fotoId);
        return Ok(new { fotoId, verwijderd = true });
    }

    public record FotoVolgordeInvoer(Guid[] Volgorde);

    [HttpPatch("{id:guid}/fotos/volgorde")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> ZetFotoVolgorde(Guid id, FotoVolgordeInvoer invoer)
    {
        await dienst.ZetFotoVolgorde(id, invoer.Volgorde ?? []);
        return Ok(new { ok = true });
    }
}
