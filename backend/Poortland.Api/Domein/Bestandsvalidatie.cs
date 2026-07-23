using SixLabors.ImageSharp;

namespace Poortland.Api.Domein;

// Uploadvalidatie op de inhoud, niet op de door de client opgegeven Content-Type
// (audit sectie 7). Een aanvaller kan de header vervalsen; de bytes liegen niet.
public static class Bestandsvalidatie
{
    // Een echte afbeelding laat zich door ImageSharp laden; anders is het geen
    // afbeelding ongeacht wat de header beweert. Zelfde API als het websitepad.
    public static bool IsGeldigeAfbeelding(byte[] inhoud)
    {
        try { using var beeld = Image.Load(inhoud); return true; }
        catch { return false; }
    }

    // PDF begint met de magische bytes %PDF-. Voldoende om vermomde bestanden te weren.
    public static bool IsGeldigePdf(byte[] inhoud) =>
        inhoud.Length > 4 && inhoud[0] == 0x25 && inhoud[1] == 0x50 && inhoud[2] == 0x44
        && inhoud[3] == 0x46 && inhoud[4] == 0x2D;
}
