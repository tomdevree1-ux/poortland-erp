using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

public record OmzettenVerzoek(Guid? KlantId, NieuweKlant? NieuweKlant, string Werfadres, string? Omschrijving);
public record NieuweKlant(KlantType Type, string Naam, string? BtwNummer, string? Straat, string? Postcode,
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

    // TS-04 sectie 4: omzetting maakt of koppelt een klant en maakt het project.
    public async Task<(Lead lead, Project project)> Omzetten(Guid id, OmzettenVerzoek verzoek)
    {
        var lead = await db.Leads.FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new DomeinFout("Lead niet gevonden.");
        if (lead.Status != LeadStatus.Gekwalificeerd)
            throw new DomeinFout("Enkel een gekwalificeerde lead kan omgezet worden.");

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
                Type = n.Type, Naam = n.Naam, BtwNummer = n.BtwNummer, Straat = n.Straat,
                Postcode = n.Postcode, Gemeente = n.Gemeente ?? lead.Gemeente,
                Email = n.Email ?? lead.Email, Telefoon = n.Telefoon ?? lead.Telefoon,
                Communicatietaal = n.Communicatietaal,
                AangemaaktDoor = claims.MedewerkerId
            };
            db.Klanten.Add(klant);
        }

        var project = new Project
        {
            Klant = klant,
            Werfadres = verzoek.Werfadres,
            Omschrijving = verzoek.Omschrijving ?? lead.EersteVraag,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Projecten.Add(project);

        lead.Status = LeadStatus.Omgezet;
        lead.OmgezetProjectId = project.Id;
        lead.KlantId = klant.Id;
        await db.SaveChangesAsync();
        return (lead, project);
    }
}
