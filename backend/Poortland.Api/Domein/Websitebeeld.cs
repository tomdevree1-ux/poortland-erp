using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Poortland.Api.Domein;

// Gedeelde beeldverwerking voor alles wat op de publieke website belandt:
// metadata strippen (ook gps) en twee webp afgeleiden maken. Stond eerst enkel
// in WebsiteContentService; de koopjes gebruiken precies dezelfde regels, dus
// staat het hier een niveau hoger (audit 2026-10-05).
public static class Websitebeeld
{
    public const int MaxBytes = 15 * 1024 * 1024;
    public static readonly string[] ToegelatenTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];

    // Laadt het beeld, zet het rechtop en verwijdert exif, xmp en iptc.
    public static Image Open(byte[] origineel)
    {
        var beeld = Image.Load(origineel);
        beeld.Mutate(b => b.AutoOrient());
        beeld.Metadata.ExifProfile = null;
        beeld.Metadata.XmpProfile = null;
        beeld.Metadata.IptcProfile = null;
        return beeld;
    }

    public static async Task<(byte[] bytes, int breedte, int hoogte)> Afgeleide(Image bron, int maxBreedte)
    {
        using var kopie = bron.Clone(b =>
        {
            if (bron.Width > maxBreedte) b.Resize(maxBreedte, 0);
        });
        using var uit = new MemoryStream();
        await kopie.SaveAsync(uit, new WebpEncoder { Quality = 80 });
        return (uit.ToArray(), kopie.Width, kopie.Height);
    }
}
