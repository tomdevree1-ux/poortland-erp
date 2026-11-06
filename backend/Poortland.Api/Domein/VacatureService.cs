using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

// Vacatures op de website (overleg 2026-10-05). Een vacature bestaat uit een
// titel, een korte intro en vrije blokken met opsommingen, bijvoorbeeld Taken,
// Skills, Opleiding en Wij bieden. Zo kan een vacature groeien zonder dat de
// databank mee moet. Solliciteren gebeurt per mail, er worden geen cv's bewaard.
public class VacatureService(PoortlandDbContext db, ClaimsContext claims, WebsiteContentService website)
{
    public record Blok(string Kop, string[] Punten);
    public record Invoer(string Titel, string? Intro, Blok[] Blokken);

    public async Task<Vacature> Maak(Invoer invoer)
    {
        var vacature = new Vacature
        {
            Titel = Verplicht(invoer.Titel),
            Intro = Leeg(invoer.Intro),
            Blokken = NaarJson(invoer.Blokken),
            Volgnummer = (await db.Vacatures.MaxAsync(v => (int?)v.Volgnummer) ?? 0) + 1,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Vacatures.Add(vacature);
        await db.SaveChangesAsync();
        return vacature;
    }

    public async Task<Vacature> Wijzig(Guid id, Invoer invoer)
    {
        var vacature = await Zoek(id);
        vacature.Titel = Verplicht(invoer.Titel);
        vacature.Intro = Leeg(invoer.Intro);
        vacature.Blokken = NaarJson(invoer.Blokken);
        await db.SaveChangesAsync();
        if (vacature.Status == VacatureStatus.Zichtbaar) await website.HerbouwContentJson();
        return vacature;
    }

    public async Task<Vacature> ZetStatus(Guid id, VacatureStatus status)
    {
        var vacature = await Zoek(id);
        vacature.Status = status;
        if (status == VacatureStatus.Zichtbaar)
        {
            vacature.GepubliceerdOp ??= DateTimeOffset.UtcNow;
            vacature.GepubliceerdDoor ??= claims.MedewerkerId;
        }
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
        return vacature;
    }

    public async Task Verwijder(Guid id)
    {
        var vacature = await Zoek(id);
        vacature.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete, opruiming volgt retentie
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
    }

    public async Task Verplaats(Guid id, int richting)
    {
        var lijst = await db.Vacatures.Where(v => v.VerwijderdOp == null)
            .OrderBy(v => v.Volgnummer).ToListAsync();
        var i = lijst.FindIndex(v => v.Id == id);
        var j = i + (richting < 0 ? -1 : 1);
        if (i < 0 || j < 0 || j >= lijst.Count) return;
        (lijst[i].Volgnummer, lijst[j].Volgnummer) = (lijst[j].Volgnummer, lijst[i].Volgnummer);
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
    }

    async Task<Vacature> Zoek(Guid id) =>
        await db.Vacatures.FirstOrDefaultAsync(v => v.Id == id && v.VerwijderdOp == null)
        ?? throw new DomeinFout("Vacature niet gevonden.");

    static string Verplicht(string titel) => string.IsNullOrWhiteSpace(titel)
        ? throw new DomeinFout("Geef de vacature een titel, bijvoorbeeld Monteur of plaatser.")
        : titel.Trim();

    static string? Leeg(string? w) => string.IsNullOrWhiteSpace(w) ? null : w.Trim();

    static string NaarJson(Blok[]? blokken)
    {
        var schoon = (blokken ?? [])
            .Where(b => !string.IsNullOrWhiteSpace(b.Kop) || (b.Punten ?? []).Any(p => !string.IsNullOrWhiteSpace(p)))
            .Select(b => new
            {
                kop = (b.Kop ?? "").Trim(),
                punten = (b.Punten ?? []).Where(p => !string.IsNullOrWhiteSpace(p)).Select(p => p.Trim()).ToArray()
            })
            .ToArray();
        return JsonSerializer.Serialize(schoon);
    }
}
