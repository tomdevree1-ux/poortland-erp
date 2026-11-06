using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

// De catalogus van Poortland: 910 artikelen uit het bestand van 25 september
// 2026, in de indeling van Poortland zelf. De lijst is te groot om in een keer
// te tonen, dus zoeken en filteren gebeurt in de databank en niet in het scherm.
[ApiController]
[Route("api/v1/artikelen")]
[Authorize]
public class ArtikelenController(PoortlandDbContext db, ClaimsContext claims) : ControllerBase
{
    const int PaginaGrootte = 50;

    public record ArtikelInvoer(string Code, string Naam, string Omschrijving, ArtikelEenheid Eenheid,
        decimal Basisprijs, BtwTarief BtwDefault, bool IsActief,
        string? Categorie1, string? Categorie2, string? Leverancier, string? LeverancierNummer,
        string? Merk, string? Model, string? Type, string? StdMaten);

    static string? Leeg(string? v) => string.IsNullOrWhiteSpace(v) ? null : v.Trim();

    IQueryable<Artikel> Basis(string? zoek, string? categorie1, string? categorie2,
        string? leverancier, string? merk, bool alleenActief)
    {
        var q = db.Artikelen.AsNoTracking().Where(a => a.VerwijderdOp == null);
        if (alleenActief) q = q.Where(a => a.IsActief);
        if (Leeg(categorie1) is { } c1) q = q.Where(a => a.Categorie1 == c1);
        if (Leeg(categorie2) is { } c2) q = q.Where(a => a.Categorie2 == c2);
        if (Leeg(leverancier) is { } lv) q = q.Where(a => a.Leverancier == lv);
        if (Leeg(merk) is { } mk) q = q.Where(a => a.Merk == mk);
        if (Leeg(zoek) is { } z)
        {
            var t = $"%{z}%";
            q = q.Where(a => EF.Functions.ILike(a.Naam, t)
                || EF.Functions.ILike(a.Code, t)
                || (a.Merk != null && EF.Functions.ILike(a.Merk, t))
                || (a.LeverancierNummer != null && EF.Functions.ILike(a.LeverancierNummer, t)));
        }
        return q;
    }

    [HttpGet]
    public async Task<IActionResult> Lijst(string? zoek, string? categorie1, string? categorie2,
        string? leverancier, string? merk, bool alleenActief = true, int pagina = 0)
    {
        var q = Basis(zoek, categorie1, categorie2, leverancier, merk, alleenActief);
        var aantal = await q.CountAsync();
        var rijen = await q.OrderBy(a => a.Code)
            .Skip(Math.Max(pagina, 0) * PaginaGrootte).Take(PaginaGrootte)
            .Select(a => new
            {
                a.Id, a.Code, a.Naam, a.Eenheid, a.Basisprijs, a.BtwDefault, a.IsActief,
                a.Categorie1, a.Categorie2, a.Leverancier, a.Merk, a.PrijsOntbreekt
            }).ToListAsync();
        return Ok(new { aantal, pagina, paginaGrootte = PaginaGrootte, rijen });
    }

    // De keuzelijsten van de filters, rechtstreeks uit de gegevens zodat ze
    // meegroeien wanneer Poortland een categorie of leverancier toevoegt.
    [HttpGet("filters")]
    public async Task<IActionResult> Filters()
    {
        var basis = db.Artikelen.AsNoTracking().Where(a => a.VerwijderdOp == null);
        return Ok(new
        {
            categorieen = await basis.Where(a => a.Categorie1 != null)
                .GroupBy(a => new { C1 = a.Categorie1!, C2 = a.Categorie2 })
                .Select(g => new { g.Key.C1, g.Key.C2, aantal = g.Count() })
                .OrderBy(x => x.C1).ThenBy(x => x.C2).ToListAsync(),
            leveranciers = await basis.Where(a => a.Leverancier != null)
                .GroupBy(a => a.Leverancier!).Select(g => new { naam = g.Key, aantal = g.Count() })
                .OrderBy(x => x.naam).ToListAsync(),
            merken = await basis.Where(a => a.Merk != null)
                .GroupBy(a => a.Merk!).Select(g => new { naam = g.Key, aantal = g.Count() })
                .OrderBy(x => x.naam).ToListAsync()
        });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var a = await db.Artikelen.AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.VerwijderdOp == null);
        return a is null ? NotFound() : Ok(a);
    }

    [HttpPost]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Maak(ArtikelInvoer invoer)
    {
        if (string.IsNullOrWhiteSpace(invoer.Code) || string.IsNullOrWhiteSpace(invoer.Naam))
            return BadRequest(new { fout = "Code en naam zijn verplicht." });
        if (await db.Artikelen.AnyAsync(a => a.Code == invoer.Code && a.VerwijderdOp == null))
            return BadRequest(new { fout = $"De code {invoer.Code} bestaat al." });
        var artikel = new Artikel { AangemaaktDoor = claims.MedewerkerId };
        Vul(artikel, invoer);
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
        if (string.IsNullOrWhiteSpace(invoer.Naam))
            return BadRequest(new { fout = "De naam is verplicht." });
        Vul(artikel, invoer);
        await db.SaveChangesAsync();
        return Ok(artikel);
    }

    [HttpDelete("{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Verwijder(Guid id)
    {
        var artikel = await db.Artikelen.FirstOrDefaultAsync(a => a.Id == id && a.VerwijderdOp == null);
        if (artikel is null) return NotFound();
        artikel.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        return Ok(new { id, verwijderd = true });
    }

    static void Vul(Artikel a, ArtikelInvoer i)
    {
        a.Code = i.Code.Trim();
        a.Naam = i.Naam.Trim();
        a.Omschrijving = Leeg(i.Omschrijving) ?? i.Naam.Trim();
        a.Eenheid = i.Eenheid;
        a.Basisprijs = i.Basisprijs;
        // Zodra er een prijs ingevuld is, verdwijnt de markering dat ze ontbreekt.
        a.PrijsOntbreekt = i.Basisprijs <= 0;
        a.BtwDefault = i.BtwDefault;
        a.IsActief = i.IsActief;
        a.Categorie1 = Leeg(i.Categorie1);
        a.Categorie2 = Leeg(i.Categorie2);
        a.Leverancier = Leeg(i.Leverancier);
        a.LeverancierNummer = Leeg(i.LeverancierNummer);
        a.Merk = Leeg(i.Merk);
        a.Model = Leeg(i.Model);
        a.Type = Leeg(i.Type);
        a.StdMaten = Leeg(i.StdMaten);
    }
}
