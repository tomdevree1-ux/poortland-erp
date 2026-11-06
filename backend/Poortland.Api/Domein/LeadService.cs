using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

public record OmzettenVerzoek(Guid? KlantId, NieuweKlant? NieuweKlant, string Werfadres, string? Omschrijving);
public record NieuweKlant(KlantType Type, string Naam, string? Voornaam, string? Bedrijfsnaam, string? BtwNummer, string? Straat, string? Postcode,
    string? Gemeente, string? Email, string? Telefoon, Taal Communicatietaal = Taal.Nl);

public class LeadService(PoortlandDbContext db, ClaimsContext claims)
{
    public async Task<Lead> Kwalificeer(Guid id, decimal? prijsindicatie, DateOnly? opvolgdatum)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new DomeinFout("Lead niet gevonden.");
        lead.Status = LeadStatus.Gekwalificeerd;
        lead.Prijsindicatie = prijsindicatie ?? lead.Prijsindicatie;
        lead.Opvolgdatum = opvolgdatum ?? lead.Opvolgdatum;
        await db.SaveChangesAsync();
        return lead;
    }

    public async Task<Lead> Verliezen(Guid id, string reden)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new DomeinFout("Lead niet gevonden.");
        lead.Status = LeadStatus.Verloren;
        lead.VerliesReden = reden;
        await db.SaveChangesAsync();
        return lead;
    }

    // Een verloren lead terug in de inbox brengen (verloren -> nieuw).
    public async Task<Lead> Heractiveer(Guid id)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new DomeinFout("Lead niet gevonden.");
        if (lead.Status != LeadStatus.Verloren)
            throw new DomeinFout("Enkel een verloren lead kan opnieuw geactiveerd worden.");
        lead.Status = LeadStatus.Nieuw;
        lead.VerliesReden = null;
        await db.SaveChangesAsync();
        return lead;
    }

    // TS-04 sectie 4: omzetting maakt of koppelt een klant en maakt het project.
    public async Task<(Lead lead, Project project)> Omzetten(Guid id, OmzettenVerzoek verzoek)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new DomeinFout("Lead niet gevonden.");
        // Direct omzetten mag ook zonder de tussenstap kwalificeren (nieuw of gekwalificeerd).
        if (lead.Status != LeadStatus.Nieuw && lead.Status != LeadStatus.Gekwalificeerd)
            throw new DomeinFout("Enkel een openstaande lead kan omgezet worden.");

        Klant klant;
        if (verzoek.KlantId is { } bestaandId)
        {
            klant = await db.Klanten.FirstOrDefaultAsync(k => k.Id == bestaandId)
                ?? throw new DomeinFout("Klant niet gevonden.");
        }
        else
        {
            var n = verzoek.NieuweKlant ?? throw new DomeinFout("Kies een bestaande klant of geef een nieuwe op.");
            klant = new Klant
            {
                Type = n.Type, Naam = n.Naam, Voornaam = n.Voornaam ?? lead.Voornaam,
                Bedrijfsnaam = n.Bedrijfsnaam ?? lead.Bedrijfsnaam, BtwNummer = n.BtwNummer ?? lead.BtwNummer,
                Straat = n.Straat ?? lead.Straat, Postcode = n.Postcode ?? lead.Postcode, Gemeente = n.Gemeente ?? lead.Gemeente,
                Email = n.Email ?? lead.Email, Telefoon = n.Telefoon ?? lead.Telefoon,
                Communicatietaal = n.Communicatietaal,
                AangemaaktDoor = claims.MedewerkerId
            };
            db.Klanten.Add(klant);
        }

        // Type aanvraag en gewenste timing reizen mee in de dossieromschrijving
        // zodat die context niet enkel op de lead achterblijft (veldenaudit).
        var kop = new List<string>();
        if (!string.IsNullOrWhiteSpace(lead.TypeAanvraag)) kop.Add($"Type aanvraag: {lead.TypeAanvraag}");
        if (!string.IsNullOrWhiteSpace(lead.GewensteTiming)) kop.Add($"Gewenste timing: {lead.GewensteTiming}");
        var basis = verzoek.Omschrijving ?? lead.EersteVraag;
        var omschrijving = kop.Count == 0 ? basis
            : string.Join(" · ", kop) + (string.IsNullOrWhiteSpace(basis) ? "" : $"\n\n{basis}");

        var project = new Project
        {
            Klant = klant,
            Werfadres = verzoek.Werfadres,
            Omschrijving = omschrijving,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Projecten.Add(project);

        // OmgezetProjectId is een los veld zonder navigatie, dus EF kent de volgorde niet:
        // eerst de klant en het project wegschrijven, daarna pas de lead ernaar laten wijzen.
        // Anders kan de lead-update vóór de project-insert lopen (foreign key fout).
        await using var transactie = await db.Database.BeginTransactionAsync();
        await db.SaveChangesAsync();

        lead.Status = LeadStatus.Omgezet;
        lead.OmgezetProjectId = project.Id;
        lead.KlantId = klant.Id;
        // Contactpersonen van de lead reizen mee naar de klant: een koppeling, geen
        // kopie, zodat beide fiches dezelfde bron tonen (feedback 2026-08-06).
        var personen = await db.Contactpersonen
            .Where(c => c.LeadId == lead.Id && c.KlantId == null && c.VerwijderdOp == null)
            .ToListAsync();
        foreach (var p in personen) p.KlantId = klant.Id;
        await db.SaveChangesAsync();
        await transactie.CommitAsync();
        return (lead, project);
    }
}
