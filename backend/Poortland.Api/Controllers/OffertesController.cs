using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using Poortland.Api.Domein;

namespace Poortland.Api.Controllers;

public record WeigerInvoer(string Reden);
public record HeractiveerInvoer(DateOnly NieuweGeldigheid);
public record MaakOfferteInvoer(Taal? Taal, OfferteSoort? Soort);

[ApiController]
[Route("api/v1")]
[Authorize]
public class OffertesController(OfferteService service) : ControllerBase
{
    [HttpPost("projecten/{projectId:guid}/offertes")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(Guid projectId, MaakOfferteInvoer invoer) =>
        Ok(await service.Maak(projectId, invoer.Taal, invoer.Soort ?? OfferteSoort.Offerte));

    [HttpGet("offertes/{id:guid}")]
    public async Task<IActionResult> Detail(Guid id) => Ok(await service.Laad(id));

    [HttpPatch("offertes/{id:guid}")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Bewaar(Guid id, OfferteInvoer invoer) =>
        Ok(await service.BewaarInhoud(id, invoer));

    // Een prijsraming omzetten naar een offerte na het plaatsbezoek.
    [HttpPost("offertes/{id:guid}/naar-offerte")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> NaarOfferte(Guid id) => Ok(await service.ZetOmNaarOfferte(id));

    [HttpPost("offertes/{id:guid}/nieuwe-versie")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> NieuweVersie(Guid id) => Ok(await service.NieuweVersie(id));

    [HttpPost("offertes/{id:guid}/verzenden")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Verzenden(Guid id) => Ok(await service.Verzenden(id));

    [HttpPost("offertes/{id:guid}/akkoord")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Akkoord(Guid id)
    {
        var (offerte, order) = await service.Akkoord(id);
        return Ok(new { offerte, order });
    }

    [HttpPost("offertes/{id:guid}/weigeren")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Weigeren(Guid id, WeigerInvoer invoer) =>
        Ok(await service.Weigeren(id, invoer.Reden));

    [HttpPost("offertes/{id:guid}/heractiveren")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Heractiveren(Guid id, HeractiveerInvoer invoer) =>
        Ok(await service.Heractiveren(id, invoer.NieuweGeldigheid));

    [HttpGet("offertes/{id:guid}/pdf")]
    public async Task<IActionResult> Pdf(Guid id)
    {
        var (bytes, offerte) = await service.GenereerPdf(id);
        return File(bytes, "application/pdf", $"{offerte.Nummer}.pdf");
    }
}
