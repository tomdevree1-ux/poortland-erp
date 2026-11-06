using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

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
