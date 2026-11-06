using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Controllers;

public record KlantInvoer(KlantType Type, string Naam, string? Voornaam, string? Bedrijfsnaam, string? BtwNummer, string? Straat, string? Postcode,
    string? Gemeente, string? Email, string? Telefoon, Taal Communicatietaal, string? Communicatievoorkeur);
public record ContactmomentInvoer(Guid? ProjectId, string Type, string? Notitie);
public record ContactpersoonInvoer(string Naam, string? Voornaam, string? Functie, string? Email, string? Telefoon,
    KlantType Type = KlantType.Particulier, string? Bedrijfsnaam = null, string? BtwNummer = null, bool OntvangtOfferte = false);

[ApiController]
[Route("api/v1/klanten")]
[Authorize]
public class KlantenController(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag) : ControllerBase
{
    const string BucketUploads = "lead_uploads";

    [HttpGet]
    public async Task<IActionResult> Lijst([FromQuery] string? zoek)
    {
        var query = db.Klanten.AsNoTracking().Where(k => k.VerwijderdOp == null);
        if (!string.IsNullOrWhiteSpace(zoek))
        {
            // Serverzijdig zoeken met relevantie en fouttolerantie (0027, zoekregels README).
            var ids = await db.Database
                .SqlQuery<Guid>($@"select id as ""Value"" from zoek_klanten({zoek})")
                .ToListAsync();
            var treffers = await query.Where(k => ids.Contains(k.Id)).ToListAsync();
            return Ok(ids.Select(i => treffers.FirstOrDefault(k => k.Id == i)).Where(k => k is not null)
                .Select(k => Lijstrij(k!)).ToList());
        }
        var lijst = await query.OrderBy(k => k.Naam).Take(200).ToListAsync();
        return Ok(lijst.Select(Lijstrij));
    }

    // Smalle lijstprojectie zonder audit- en systeemkolommen (audit snelheid 3).
    static object Lijstrij(Klant k) => new
    {
        k.Id, k.Type, k.Naam, k.Voornaam, k.Bedrijfsnaam, k.BtwNummer,
        k.Straat, k.Postcode, k.Gemeente, k.Email, k.Telefoon, k.Communicatietaal
    };

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Detail(Guid id)
    {
        var klant = await db.Klanten.AsNoTracking()
            .Include(k => k.Contactpersonen.Where(c => c.VerwijderdOp == null))
            .FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null);
        if (klant is null) return NotFound();
        var projecten = await db.Projecten.AsNoTracking()
            .Where(p => p.KlantId == id && p.VerwijderdOp == null)
            .OrderByDescending(p => p.AangemaaktOp).ToListAsync();
        var momenten = await db.Contactmomenten.AsNoTracking()
            .Where(c => c.KlantId == id && c.VerwijderdOp == null)
            .OrderByDescending(c => c.Datum).Take(50).ToListAsync();
        // Herkomst: de leads die naar deze klant omgezet zijn, met hun foto's.
        // Een koppeling, geen kopie: de foto's blijven bij de lead horen en zijn
        // op beide fiches dezelfde bron (feedback 2026-08-06).
        var leads = await db.Leads.AsNoTracking()
            .Include(l => l.Bijlagen.Where(b => b.VerwijderdOp == null))
            .Where(l => l.KlantId == id && l.VerwijderdOp == null)
            .OrderByDescending(l => l.AangemaaktOp).ToListAsync();
        var leadFotos = await Task.WhenAll(leads.SelectMany(l => l.Bijlagen).Select(async b =>
            (object)new { b.Id, b.Bestandsnaam, url = await opslag.SignedUrl(BucketUploads, b.BestandPad, 600) }));
        var herkomst = leads.Select(l => new
        {
            l.Id, l.Naam, l.Voornaam, l.Kanaal, l.TypeAanvraag, l.GewensteTiming, l.AangemaaktOp
        });
        return Ok(new { klant, projecten, contactmomenten = momenten, herkomstLeads = herkomst, leadFotos });
    }

    [HttpPost]
    [VereistRol("verkoop")]
    public async Task<IActionResult> Maak(KlantInvoer invoer)
    {
        var klant = new Klant
        {
            Type = invoer.Type, Naam = invoer.Naam, Voornaam = invoer.Voornaam,
            Bedrijfsnaam = invoer.Type == KlantType.Bedrijf ? invoer.Bedrijfsnaam : null,
            BtwNummer = invoer.BtwNummer, Straat = invoer.Straat,
            Postcode = invoer.Postcode, Gemeente = invoer.Gemeente, Email = invoer.Email,
            Telefoon = invoer.Telefoon, Communicatietaal = invoer.Communicatietaal,
            Communicatievoorkeur = invoer.Communicatievoorkeur, AangemaaktDoor = claims.MedewerkerId
        };
        db.Klanten.Add(klant);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Detail), new { id = klant.Id }, klant);
    }

    [HttpPatch("{id:guid}")]
    [VereistRol("verkoop", "planning", "boekhouding")]
    public async Task<IActionResult> Wijzig(Guid id, KlantInvoer invoer)
    {
        var klant = await db.Klanten.FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null);
        if (klant is null) return NotFound();
        klant.Type = invoer.Type; klant.Naam = invoer.Naam; klant.Voornaam = invoer.Voornaam;
        klant.Bedrijfsnaam = invoer.Type == KlantType.Bedrijf ? invoer.Bedrijfsnaam : null;
        klant.BtwNummer = invoer.BtwNummer;
        klant.Straat = invoer.Straat; klant.Postcode = invoer.Postcode; klant.Gemeente = invoer.Gemeente;
        klant.Email = invoer.Email; klant.Telefoon = invoer.Telefoon;
        klant.Communicatietaal = invoer.Communicatietaal;
        // Niet meegestuurd betekent behouden: geen enkel scherm bewerkt de
        // voorkeur vandaag en een volledige vervanging zou ze anders wissen.
        if (invoer.Communicatievoorkeur is not null) klant.Communicatievoorkeur = invoer.Communicatievoorkeur;
        await db.SaveChangesAsync();
        return Ok(klant);
    }

    // Verwijderen is aan de beheerder (rollenmatrix: klant D) en blijft soft delete.
    // Een klant met dossiers kan mee met zijn dossiers gearchiveerd worden
    // (dossiersMee=true): alles gaat in een beweging uit de werking en de audit
    // trail bewaart de volledige historiek. Zonder die keuze blijft de beveiliging
    // dat er geen verweesde dossiers kunnen ontstaan.
    [HttpDelete("{id:guid}")]
    [VereistRol("beheerder")]
    public async Task<IActionResult> Verwijder(Guid id, [FromQuery] bool dossiersMee = false)
    {
        var klant = await db.Klanten.FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null);
        if (klant is null) return NotFound();
        var dossiers = await db.Projecten.Where(p => p.KlantId == id && p.VerwijderdOp == null).ToListAsync();
        if (dossiers.Count > 0 && !dossiersMee)
            return Conflict(new { fout = "Deze klant heeft nog dossiers. Vink aan om ze mee te archiveren." });
        var nu = DateTimeOffset.UtcNow;
        foreach (var dossier in dossiers) dossier.VerwijderdOp = nu;
        klant.VerwijderdOp = nu;
        await db.SaveChangesAsync();
        return Ok(new { klant.Id, verwijderd = true, dossiersGearchiveerd = dossiers.Count });
    }

    // Contactpersonen bij de klant: tuinman, architect, elektricien, concierge...
    [HttpPost("{id:guid}/contactpersonen")]
    [VereistRol("verkoop")]
    public async Task<IActionResult> MaakContactpersoon(Guid id, ContactpersoonInvoer invoer)
    {
        var persoon = new Contactpersoon
        {
            KlantId = id, Naam = invoer.Naam, Voornaam = invoer.Voornaam, Functie = invoer.Functie,
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
            .FirstOrDefaultAsync(c => c.Id == persoonId && c.KlantId == id && c.VerwijderdOp == null);
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
            .FirstOrDefaultAsync(c => c.Id == persoonId && c.KlantId == id && c.VerwijderdOp == null);
        if (persoon is null) return NotFound();
        persoon.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete (TS-01)
        await db.SaveChangesAsync();
        return Ok(new { persoon.Id, verwijderd = true });
    }

    [HttpPost("{id:guid}/contactmomenten")]
    [VereistRol("verkoop", "planning", "boekhouding")]
    public async Task<IActionResult> LogContactmoment(Guid id, ContactmomentInvoer invoer)
    {
        var moment = new Contactmoment
        {
            KlantId = id, ProjectId = invoer.ProjectId, MedewerkerId = claims.MedewerkerId!.Value,
            Type = invoer.Type, Datum = DateTimeOffset.UtcNow, Notitie = invoer.Notitie,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Contactmomenten.Add(moment);
        await db.SaveChangesAsync();
        return Ok(moment);
    }
}
