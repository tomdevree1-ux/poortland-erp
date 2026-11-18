using Microsoft.EntityFrameworkCore;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

// Zet de regels van het globaal overzicht over naar de Leverings en Servicebon
// (LSB) die erbij hoort. Een regel komt op hoogstens een LSB: het type van de
// bon moet overeenkomen en bij een plaatsing ook het plaatsingsnummer. Een regel
// die al op de bon staat, komt er nooit een tweede keer op (migratie 0051).
public static class SamenstellingService
{
    public static readonly string[] Rubrieken = ["accessoires", "automatisering", "hekwerk", "opdracht"];
    public static readonly string[] Soorten = ["poort", "afsluiting", "garagepoort", "overkapping"];
    public static readonly string[] OpdrachtSoorten = ["plaatsing", "automatisatie", "herstelling"];

    // Hoort deze regel op deze bon?
    public static bool HoortOpBon(Projectregel r, Werkbon bon) =>
        r.LsbType == bon.Type
        && (bon.Type != WerkbonType.Plaatsing || r.LsbPlaatsingNummer == bon.PlaatsingNummer);

    // De LSB die bij een opdracht hoort als Jef zelf niets koos.
    public static WerkbonType? StandaardLsb(string? opdrachtSoort) => opdrachtSoort switch
    {
        "plaatsing" => WerkbonType.Plaatsing,
        "automatisatie" => WerkbonType.Automatisatie,
        "herstelling" => WerkbonType.Herstelling,
        _ => null
    };

    public static string Eenheid(ArtikelEenheid e) => e switch
    {
        ArtikelEenheid.LopendeMeter => "m",
        ArtikelEenheid.VierkanteMeter => "m2",
        _ => "stuk"
    };

    // Voegt de ontbrekende regels toe aan de bon. Geeft het aantal nieuwe regels.
    // Een getekende of gefactureerde bon wijzigt niet meer.
    public static async Task<int> ZetOverNaarBon(PoortlandDbContext db, Werkbon bon, Guid? medewerkerId)
    {
        if (bon.Status is WerkbonStatus.KlantGetekend or WerkbonStatus.VerwerktInFacturatie) return 0;
        var regels = await db.Projectregels.AsNoTracking()
            .Where(r => r.ProjectId == bon.ProjectId && r.VerwijderdOp == null && r.LsbType == bon.Type)
            .OrderBy(r => r.Rubriek).ThenBy(r => r.Volgnummer).ThenBy(r => r.AangemaaktOp)
            .ToListAsync();
        regels = regels.Where(r => HoortOpBon(r, bon)).ToList();
        if (regels.Count == 0) return 0;
        var alAanwezig = await db.Werkbonregels.AsNoTracking()
            .Where(w => w.WerkbonId == bon.Id && w.VerwijderdOp == null && w.ProjectregelId != null)
            .Select(w => w.ProjectregelId!.Value).ToListAsync();
        var artikelIds = regels.Where(r => r.ArtikelId != null).Select(r => r.ArtikelId!.Value).Distinct().ToList();
        var eenheden = await db.Artikelen.AsNoTracking()
            .Where(a => artikelIds.Contains(a.Id))
            .ToDictionaryAsync(a => a.Id, a => Eenheid(a.Eenheid));
        var nieuw = 0;
        foreach (var r in regels.Where(r => !alAanwezig.Contains(r.Id)))
        {
            db.Werkbonregels.Add(new Werkbonregel
            {
                WerkbonId = bon.Id,
                Soort = r.Rubriek == "opdracht" ? "uitgevoerd_werk" : "materiaal",
                Omschrijving = r.Omschrijving,
                Aantal = r.Aantal,
                Eenheid = r.ArtikelId is { } a && eenheden.TryGetValue(a, out var e) ? e : null,
                ArtikelId = r.ArtikelId,
                ArtikelCode = r.ArtikelCode,
                ProjectregelId = r.Id,
                AangemaaktDoor = medewerkerId
            });
            nieuw++;
        }
        return nieuw;
    }
}
