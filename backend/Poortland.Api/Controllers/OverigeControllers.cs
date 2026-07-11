using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

[ApiController]
[Route("api/v1/artikelen")]
[Authorize]
public class ArtikelenController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record ArtikelInvoer(string Code, string Omschrijving, ArtikelEenheid Eenheid, decimal Basisprijs,
        BtwTarief BtwDefault, bool IsActief);

    [HttpGet]
    public async Task<IActionResult> Lijst() =>
        Ok(await db.Artikelen.AsNoTracking()
            .Where(a => a.VerwijderdOp == null && a.IsActief)
            .OrderBy(a => a.Code).ToListAsync());

    [HttpPost]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Maak(ArtikelInvoer invoer)
    {
        var artikel = new Artikel
        {
            Code = invoer.Code, Omschrijving = invoer.Omschrijving, Eenheid = invoer.Eenheid,
            Basisprijs = invoer.Basisprijs, BtwDefault = invoer.BtwDefault, IsActief = invoer.IsActief,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Artikelen.Add(artikel);
        await db.SaveChangesAsync();
        return Ok(artikel);
    }

    [HttpPatch("{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Wijzig(Guid id, ArtikelInvoer invoer)
    {
        var artikel = await db.Artikelen.FirstOrDefaultAsync(a => a.Id == id && a.VerwijderdOp == null);
        if (artikel is null) return NotFound();
        artikel.Code = invoer.Code; artikel.Omschrijving = invoer.Omschrijving; artikel.Eenheid = invoer.Eenheid;
        artikel.Basisprijs = invoer.Basisprijs; artikel.BtwDefault = invoer.BtwDefault; artikel.IsActief = invoer.IsActief;
        await db.SaveChangesAsync();
        return Ok(artikel);
    }
}

[ApiController]
[Route("api/v1/opvolgtaken")]
[Authorize]
public class OpvolgtakenController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    public record StatusInvoer(OpvolgtaakStatus Status);

    [HttpGet]
    public async Task<IActionResult> Mijn() =>
        Ok(await db.Opvolgtaken.AsNoTracking()
            .Where(t => t.MedewerkerId == claims.MedewerkerId && t.Status == OpvolgtaakStatus.Open && t.VerwijderdOp == null)
            .OrderBy(t => t.DueDatum).ToListAsync());

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Wijzig(Guid id, StatusInvoer invoer)
    {
        var taak = await db.Opvolgtaken.FirstOrDefaultAsync(t => t.Id == id && t.VerwijderdOp == null);
        if (taak is null) return NotFound();
        taak.Status = invoer.Status;
        await db.SaveChangesAsync();
        return Ok(taak);
    }
}

[ApiController]
[Route("api/v1/dashboard")]
[Authorize]
public class DashboardController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Kerncijfers()
    {
        var kwartaalStart = new DateOnly(DateTime.Today.Year, ((DateTime.Today.Month - 1) / 3) * 3 + 1, 1);
        var kwartaalStartUtc = new DateTimeOffset(kwartaalStart.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        return Ok(new
        {
            openLeads = await db.Leads.CountAsync(l =>
                (l.Status == LeadStatus.Nieuw || l.Status == LeadStatus.Gekwalificeerd) && l.VerwijderdOp == null),
            verzondenOffertes = await db.Offertes.CountAsync(o =>
                o.Status == OfferteStatus.Verzonden && o.VerwijderdOp == null),
            actieveOrders = await db.Orders.CountAsync(o =>
                o.Status != OrderStatus.Afgesloten && o.Status != OrderStatus.Geannuleerd && o.VerwijderdOp == null),
            mijnOpenTaken = await db.Opvolgtaken.CountAsync(t =>
                t.MedewerkerId == claims.MedewerkerId && t.Status == OpvolgtaakStatus.Open && t.VerwijderdOp == null),
            omzetKwartaal = await db.Offertes
                .Where(o => o.Status == OfferteStatus.Goedgekeurd && o.BeslistOp >= kwartaalStartUtc && o.VerwijderdOp == null)
                .SumAsync(o => (decimal?)o.TotaalExclBtw) ?? 0
        });
    }
}

[ApiController]
[Route("gezond")]
public class GezondheidController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public IActionResult Gezond() => Ok(new { status = "gezond", tijd = DateTimeOffset.UtcNow });
}
