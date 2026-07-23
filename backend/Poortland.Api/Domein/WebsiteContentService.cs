using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Poortland.Api.Adapters;
using Poortland.Api.Auth;
using Poortland.Api.Data;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Poortland.Api.Domein;

// TS-17: het ERP schrijft en de website leest alleen (content.json plus publieke afgeleiden).
public class WebsiteContentService(PoortlandDbContext db, ClaimsContext claims, SupabaseOpslag opslag)
{
    const string BucketOrigineel = "website_origineel";
    const string BucketPubliek = "website_publiek";
    static readonly string[] ToegelatenTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    const int MaxBytes = 15 * 1024 * 1024;

    static readonly string[] ProductSoorten = ["poort", "overkapping"];
    static readonly string[] PoortTypes = ["hout", "metaal", "hout_metaal"];
    static readonly string[] Uitvoeringen = ["draaipoort", "schuifpoort"];

    public async Task<WebsiteMedia> Upload(Stream bestand, string bestandsnaam, string contentType,
        string titel, string? categorie, string? productSoort, string? poortType, string? poortUitvoering)
    {
        if (!ToegelatenTypes.Contains(contentType))
            throw new DomeinFout("Toegelaten formaten: jpeg, png, webp of heic.");
        if (productSoort is null || !ProductSoorten.Contains(productSoort))
            throw new DomeinFout("Kies of de foto een poort of een overkapping toont.");
        if (productSoort == "poort")
        {
            if (poortType is null || !PoortTypes.Contains(poortType))
                throw new DomeinFout("Kies het poorttype: hout, metaal of de combinatie.");
            if (poortUitvoering is null || !Uitvoeringen.Contains(poortUitvoering))
                throw new DomeinFout("Kies de uitvoering: draaipoort of schuifpoort.");
        }
        else { poortType = null; poortUitvoering = null; }
        using var geheugen = new MemoryStream();
        await bestand.CopyToAsync(geheugen);
        if (geheugen.Length > MaxBytes) throw new DomeinFout("Maximaal 15 MB per foto.");
        var origineel = geheugen.ToArray();

        // EXIF en alle metadata strippen inclusief gps (TS-17 sectie 5, TS-03).
        using var beeld = Image.Load(origineel);
        beeld.Mutate(b => b.AutoOrient());
        beeld.Metadata.ExifProfile = null;
        beeld.Metadata.XmpProfile = null;
        beeld.Metadata.IptcProfile = null;

        var id = Guid.NewGuid();
        var extensie = Path.GetExtension(bestandsnaam);
        if (string.IsNullOrWhiteSpace(extensie)) extensie = ".jpg";
        var padOrigineel = $"{id}/origineel{extensie}";
        await opslag.Upload(BucketOrigineel, padOrigineel, origineel, contentType);

        var web = await MaakAfgeleide(beeld, 1600);
        var thumb = await MaakAfgeleide(beeld, 400);
        await opslag.Upload(BucketOrigineel, $"{id}/web.webp", web.bytes, "image/webp");
        await opslag.Upload(BucketOrigineel, $"{id}/thumb.webp", thumb.bytes, "image/webp");

        var media = new WebsiteMedia
        {
            Id = id, Titel = titel, Categorie = categorie,
            ProductSoort = productSoort, PoortType = poortType, PoortUitvoering = poortUitvoering,
            Volgnummer = (await db.WebsiteMedias.MaxAsync(m => (int?)m.Volgnummer) ?? 0) + 1,
            BestandPadOrigineel = padOrigineel,
            Breedte = web.breedte, Hoogte = web.hoogte,
            AangemaaktDoor = claims.MedewerkerId
        };
        db.WebsiteMedias.Add(media);
        await db.SaveChangesAsync();
        return media;
    }

    static async Task<(byte[] bytes, int breedte, int hoogte)> MaakAfgeleide(Image bron, int maxBreedte)
    {
        using var kopie = bron.Clone(b =>
        {
            if (bron.Width > maxBreedte)
                b.Resize(maxBreedte, 0);
        });
        using var uit = new MemoryStream();
        await kopie.SaveAsync(uit, new WebpEncoder { Quality = 80 });
        return (uit.ToArray(), kopie.Width, kopie.Height);
    }

    public async Task<WebsiteMedia> Publiceer(Guid id)
    {
        var media = await db.WebsiteMedias.FirstOrDefaultAsync(m => m.Id == id)
            ?? throw new DomeinFout("Foto niet gevonden.");
        var web = await opslag.Download(BucketOrigineel, $"{id}/web.webp");
        var thumb = await opslag.Download(BucketOrigineel, $"{id}/thumb.webp");
        var hash = Convert.ToHexString(SHA256.HashData(web))[..8].ToLowerInvariant();
        var padWeb = $"media/{id}-{hash}.webp";
        var padThumb = $"media/{id}-{hash}-thumb.webp";
        // Onveranderlijke bestandsnamen dus agressief cachebaar (TS-17 sectie 3).
        await opslag.Upload(BucketPubliek, padWeb, web, "image/webp", "public, max-age=31536000, immutable");
        await opslag.Upload(BucketPubliek, padThumb, thumb, "image/webp", "public, max-age=31536000, immutable");
        media.BestandPadWeb = padWeb;
        media.BestandPadThumb = padThumb;
        media.Status = WebsiteContentStatus.Gepubliceerd;
        await db.SaveChangesAsync();
        await HerbouwContentJson();
        return media;
    }

    public async Task<WebsiteMedia> Depubliceer(Guid id)
    {
        var media = await db.WebsiteMedias.FirstOrDefaultAsync(m => m.Id == id)
            ?? throw new DomeinFout("Foto niet gevonden.");
        var oudeWeb = media.BestandPadWeb;
        var oudeThumb = media.BestandPadThumb;
        media.Status = WebsiteContentStatus.Concept;
        await db.SaveChangesAsync();
        if (oudeWeb is not null || oudeThumb is not null)
            await opslag.Verwijder(BucketPubliek, new[] { oudeWeb, oudeThumb }.Where(p => p is not null).Cast<string>().ToArray());
        media.BestandPadWeb = null;
        media.BestandPadThumb = null;
        await db.SaveChangesAsync();
        await HerbouwContentJson();
        return media;
    }

    // Twee gepubliceerde banners mogen elkaar niet overlappen in periode (TS-17).
    async Task ControleerGeenOverlap(Guid id, DateOnly van, DateOnly tot)
    {
        if (tot < van) throw new DomeinFout("De einddatum ligt voor de begindatum.");
        var overlap = await db.WebsitePopups.AsNoTracking().AnyAsync(p =>
            p.Id != id && p.Status == WebsiteContentStatus.Gepubliceerd && p.VerwijderdOp == null
            && p.ActiefVan <= tot && p.ActiefTot >= van);
        if (overlap) throw new DomeinFout("Er is al een banner gepubliceerd die met deze periode overlapt. Kies een andere periode of trek de andere eerst in.");
    }

    // Elke banner (ook een gepubliceerde) bewerkbaar; een gepubliceerde wijziging
    // gaat meteen naar de site.
    public async Task<WebsitePopup> WijzigPopup(Guid id, string titel, string bodyTekst, DateOnly van, DateOnly tot)
    {
        var popup = await db.WebsitePopups.FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null)
            ?? throw new DomeinFout("Banner niet gevonden.");
        if (popup.Status == WebsiteContentStatus.Gepubliceerd) await ControleerGeenOverlap(id, van, tot);
        popup.Titel = titel; popup.BodyTekst = bodyTekst; popup.ActiefVan = van; popup.ActiefTot = tot;
        await db.SaveChangesAsync();
        if (popup.Status == WebsiteContentStatus.Gepubliceerd) await HerbouwContentJson();
        return popup;
    }

    public async Task<WebsitePopup> PubliceerPopup(Guid id)
    {
        var popup = await db.WebsitePopups.FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null)
            ?? throw new DomeinFout("Banner niet gevonden.");
        await ControleerGeenOverlap(id, popup.ActiefVan, popup.ActiefTot);
        popup.Status = WebsiteContentStatus.Gepubliceerd;
        try { await db.SaveChangesAsync(); }
        catch (Npgsql.PostgresException e) when (e.SqlState == "23505")
        {
            // Oude max-1 index tot migratie 0034 toegepast is: nette melding.
            throw new DomeinFout("Er is al een gepubliceerde banner. Trek die eerst in of plan een niet overlappende periode.");
        }
        await HerbouwContentJson();
        return popup;
    }

    public async Task<WebsitePopup> DepubliceerPopup(Guid id)
    {
        var popup = await db.WebsitePopups.FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new DomeinFout("Popup niet gevonden.");
        popup.Status = WebsiteContentStatus.Gearchiveerd;
        await db.SaveChangesAsync();
        await HerbouwContentJson();
        return popup;
    }

    // Banner verwijderen (soft delete, TS-01) en meteen van de site halen als
    // hij nog getoond werd.
    public async Task VerwijderPopup(Guid id)
    {
        var popup = await db.WebsitePopups.FirstOrDefaultAsync(p => p.Id == id && p.VerwijderdOp == null)
            ?? throw new DomeinFout("Banner niet gevonden.");
        popup.VerwijderdOp = DateTimeOffset.UtcNow;
        await db.SaveChangesAsync();
        await HerbouwContentJson();
    }

    // Het contract met de website: 1 json bestand met korte cache (TS-17 sectie 3).
    public async Task HerbouwContentJson()
    {
        var fotos = await db.WebsiteMedias.AsNoTracking()
            .Where(m => m.Status == WebsiteContentStatus.Gepubliceerd && m.VerwijderdOp == null)
            .OrderBy(m => m.Volgnummer)
            .Select(m => new
            {
                url = opslag.PubliekeUrl(BucketPubliek, m.BestandPadWeb!),
                thumb = opslag.PubliekeUrl(BucketPubliek, m.BestandPadThumb!),
                alt = m.AltTekst, categorie = m.Categorie,
                productSoort = m.ProductSoort, poortType = m.PoortType, uitvoering = m.PoortUitvoering,
                breedte = m.Breedte, hoogte = m.Hoogte
            })
            .ToListAsync();
        var vandaag = DateOnly.FromDateTime(DateTime.Today);
        var popupRij = await db.WebsitePopups.AsNoTracking()
            .Where(p => p.Status == WebsiteContentStatus.Gepubliceerd && p.VerwijderdOp == null
                && p.ActiefVan <= vandaag && p.ActiefTot >= vandaag)
            .Select(p => new { p.Id, p.Titel, p.BodyTekst, p.ActiefVan, p.ActiefTot, p.GewijzigdOp })
            .FirstOrDefaultAsync();
        // Sleutel per bannerversie: een nieuwe of gewijzigde banner toont opnieuw,
        // ook als de bezoeker de vorige al sloot (frequentiecap geldt per versie).
        var popup = popupRij is null ? null : new
        {
            sleutel = $"{popupRij.Id}:{popupRij.GewijzigdOp.ToUnixTimeSeconds()}",
            titel = popupRij.Titel, body = popupRij.BodyTekst, van = popupRij.ActiefVan, tot = popupRij.ActiefTot
        };
        // 1 dag: een bezoeker ziet dezelfde banner hoogstens 1 keer per dag.
        var inhoud = new { versie = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), popup, popupFrequentieDagen = 1, fotos };
        var json = JsonSerializer.SerializeToUtf8Bytes(inhoud,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        // Geen cache op content.json zodat intrekken en publiceren meteen doorkomen.
        await opslag.Upload(BucketPubliek, "content.json", json, "application/json", "no-cache");
    }
}
