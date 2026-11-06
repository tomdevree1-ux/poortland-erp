using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;

namespace Poortland.Api.Domein;

// Koopjes: poorten en overkappingen uit voorraad die Jef zelf online zet
// (overleg 2026-10-05). Beeldverwerking en publicatie volgen exact de regels van
// het websitebeheer: metadata strippen, twee webp afgeleiden, en de site leest
// alleen content.json.
public class KoopjeService(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag,
    WebsiteContentService website)
{
    const string BucketOrigineel = "website_origineel";
    const string BucketPubliek = "website_publiek";
    const int MaxFotos = 12;

    public record Invoer(string Materiaal, string? Model, string? Ral, int? BreedteCm, int? HoogteCm,
        string? ExtraInfo, decimal? PrijsInclBtw);

    public async Task<Koopje> Maak(Invoer invoer)
    {
        Controleer(invoer);
        var koopje = new Koopje
        {
            Materiaal = invoer.Materiaal.Trim(),
            Model = Leeg(invoer.Model),
            Ral = Leeg(invoer.Ral),
            BreedteCm = invoer.BreedteCm,
            HoogteCm = invoer.HoogteCm,
            ExtraInfo = Leeg(invoer.ExtraInfo),
            PrijsInclBtw = invoer.PrijsInclBtw,
            Volgnummer = (await db.Koopjes.MaxAsync(k => (int?)k.Volgnummer) ?? 0) + 1,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.Koopjes.Add(koopje);
        await db.SaveChangesAsync();
        return koopje;
    }

    public async Task<Koopje> Wijzig(Guid id, Invoer invoer)
    {
        Controleer(invoer);
        var koopje = await Zoek(id);
        koopje.Materiaal = invoer.Materiaal.Trim();
        koopje.Model = Leeg(invoer.Model);
        koopje.Ral = Leeg(invoer.Ral);
        koopje.BreedteCm = invoer.BreedteCm;
        koopje.HoogteCm = invoer.HoogteCm;
        koopje.ExtraInfo = Leeg(invoer.ExtraInfo);
        koopje.PrijsInclBtw = invoer.PrijsInclBtw;
        await db.SaveChangesAsync();
        await VerversAlsZichtbaar(koopje);
        return koopje;
    }

    // Statuswissel. Verkocht blijft met een label op de site staan tot het
    // koopje zelf verborgen wordt, dat toont dat er beweging in de voorraad zit.
    public async Task<Koopje> ZetStatus(Guid id, KoopjeStatus status)
    {
        var koopje = await Zoek(id);
        if (status == KoopjeStatus.Zichtbaar && !await db.KoopjeFotos.AnyAsync(f => f.KoopjeId == id && f.VerwijderdOp == null))
            throw new DomeinFout("Voeg eerst minstens een foto toe voor je dit koopje online zet.");
        koopje.Status = status;
        koopje.VerkochtOp = status == KoopjeStatus.Verkocht ? DateTimeOffset.UtcNow : null;
        if (status is KoopjeStatus.Zichtbaar or KoopjeStatus.Verkocht)
        {
            koopje.GepubliceerdOp ??= DateTimeOffset.UtcNow;
            koopje.GepubliceerdDoor ??= claims.MedewerkerId;
        }
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
        return koopje;
    }

    public async Task Verwijder(Guid id)
    {
        var koopje = await Zoek(id);
        koopje.VerwijderdOp = DateTimeOffset.UtcNow; // soft delete, opruiming volgt retentie
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
    }

    public async Task<KoopjeFoto> VoegFotoToe(Guid koopjeId, Stream bestand, string bestandsnaam, string contentType)
    {
        var koopje = await Zoek(koopjeId);
        if (!Websitebeeld.ToegelatenTypes.Contains(contentType))
            throw new DomeinFout("Toegelaten formaten: jpeg, png, webp of heic.");
        var aantal = await db.KoopjeFotos.CountAsync(f => f.KoopjeId == koopjeId && f.VerwijderdOp == null);
        if (aantal >= MaxFotos) throw new DomeinFout($"Maximaal {MaxFotos} foto's per koopje.");

        using var geheugen = new MemoryStream();
        await bestand.CopyToAsync(geheugen);
        if (geheugen.Length > Websitebeeld.MaxBytes) throw new DomeinFout("Maximaal 15 MB per foto.");
        var origineel = geheugen.ToArray();

        using var beeld = Websitebeeld.Open(origineel);
        var id = Guid.NewGuid();
        var extensie = Path.GetExtension(bestandsnaam);
        if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
        var padOrigineel = $"koopje/{id}/origineel{extensie}";
        await opslag.Upload(BucketOrigineel, padOrigineel, origineel, contentType);

        var web = await Websitebeeld.Afgeleide(beeld, 1600);
        var thumb = await Websitebeeld.Afgeleide(beeld, 500);
        var hash = Convert.ToHexString(SHA256.HashData(web.bytes))[..8].ToLowerInvariant();
        var padWeb = $"koopje/{id}-{hash}.webp";
        var padThumb = $"koopje/{id}-{hash}-thumb.webp";
        // Onveranderlijke bestandsnamen, dus agressief cachebaar.
        await opslag.Upload(BucketPubliek, padWeb, web.bytes, "image/webp", "public, max-age=31536000, immutable");
        await opslag.Upload(BucketPubliek, padThumb, thumb.bytes, "image/webp", "public, max-age=31536000, immutable");

        var foto = new KoopjeFoto
        {
            Id = id, KoopjeId = koopjeId,
            BestandPadOrigineel = padOrigineel, BestandPadWeb = padWeb, BestandPadThumb = padThumb,
            Breedte = web.breedte, Hoogte = web.hoogte,
            Volgnummer = (await db.KoopjeFotos.Where(f => f.KoopjeId == koopjeId)
                .MaxAsync(f => (int?)f.Volgnummer) ?? 0) + 1,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.KoopjeFotos.Add(foto);
        await db.SaveChangesAsync();
        await VerversAlsZichtbaar(koopje);
        return foto;
    }

    public async Task VerwijderFoto(Guid koopjeId, Guid fotoId)
    {
        var foto = await db.KoopjeFotos.FirstOrDefaultAsync(f =>
            f.Id == fotoId && f.KoopjeId == koopjeId && f.VerwijderdOp == null)
            ?? throw new DomeinFout("Foto niet gevonden.");
        foto.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        var paden = new[] { foto.BestandPadWeb, foto.BestandPadThumb }.Where(p => p is not null).Cast<string>().ToArray();
        if (paden.Length > 0) await opslag.Verwijder(BucketPubliek, paden);
        await VerversAlsZichtbaar(await Zoek(koopjeId));
    }

    // Volgorde van de foto's; de eerste is het coverbeeld op het overzicht.
    public async Task ZetFotoVolgorde(Guid koopjeId, Guid[] volgorde)
    {
        var fotos = await db.KoopjeFotos.Where(f => f.KoopjeId == koopjeId && f.VerwijderdOp == null).ToListAsync();
        for (var i = 0; i < volgorde.Length; i++)
        {
            var foto = fotos.FirstOrDefault(f => f.Id == volgorde[i]);
            if (foto is not null) foto.Volgnummer = i + 1;
        }
        await db.SaveChangesAsync();
        await VerversAlsZichtbaar(await Zoek(koopjeId));
    }

    // Volgorde van de koopjes onderling op de website.
    public async Task Verplaats(Guid id, int richting)
    {
        var lijst = await db.Koopjes.Where(k => k.VerwijderdOp == null)
            .OrderBy(k => k.Volgnummer).ToListAsync();
        var i = lijst.FindIndex(k => k.Id == id);
        var j = i + (richting < 0 ? -1 : 1);
        if (i < 0 || j < 0 || j >= lijst.Count) return;
        (lijst[i].Volgnummer, lijst[j].Volgnummer) = (lijst[j].Volgnummer, lijst[i].Volgnummer);
        await db.SaveChangesAsync();
        await website.HerbouwContentJson();
    }

    async Task<Koopje> Zoek(Guid id) =>
        await db.Koopjes.FirstOrDefaultAsync(k => k.Id == id && k.VerwijderdOp == null)
        ?? throw new DomeinFout("Koopje niet gevonden.");

    async Task VerversAlsZichtbaar(Koopje koopje)
    {
        if (koopje.Status is KoopjeStatus.Zichtbaar or KoopjeStatus.Verkocht)
            await website.HerbouwContentJson();
    }

    static void Controleer(Invoer invoer)
    {
        if (string.IsNullOrWhiteSpace(invoer.Materiaal))
            throw new DomeinFout("Vul het materiaal in, bijvoorbeeld staal, aluminium of massief hout.");
        if (invoer.PrijsInclBtw is < 0) throw new DomeinFout("De prijs kan niet negatief zijn.");
    }

    static string? Leeg(string? w) => string.IsNullOrWhiteSpace(w) ? null : w.Trim();
}
