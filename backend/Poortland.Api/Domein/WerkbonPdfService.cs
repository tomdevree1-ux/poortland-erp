using Poortland.Api.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace Poortland.Api.Domein;

// De Leverings en Servicebon (LSB): het bestaande werfdocument van Poortland
// als digitale export van de werkbon. Zelfde opbouw als de papieren versie
// (kop, klantblok, uit te voeren werken met OK/NOK, materialen, opmerkingen,
// gepresteerde uren en het akkoord van de klant) in de huisstijl.
public class WerkbonPdfService
{
    // Witte achtergrond (Tom 2026-08-18): de LSB is een werkdocument. De
    // kaders dragen het lichtbruin van Poortland, het logo staat in de kop.
    const string Papier = "#FFFFFF";
    const string Vlak = "#F4EDDE";
    const string Inkt = "#141C15";
    const string Body = "#222E24";
    const string Gedempt = "#6E6450";
    const string Vaag = "#9C8E72";
    const string BronsDiep = "#8A6A3C";
    const string LijnZacht = "#12141C15";
    const string Kader = "#33141C15";
    const string Serif = "Cormorant";
    const string Sans = "Hanken Grotesk";

    public record FotoBijlage(string Moment, string Naam, byte[] Inhoud);

    public static string TypeTekst(Werkbon bon) => bon.Type switch
    {
        WerkbonType.Plaatsing => $"Plaatsing {bon.PlaatsingNummer?.ToString() ?? ""}".Trim(),
        WerkbonType.Automatisatie => "Automatisatie",
        WerkbonType.Onderhoud => "Onderhoud",
        _ => "Herstelling"
    };

    static string Initialen(string naam) => string.Concat(
        naam.Split(' ', StringSplitOptions.RemoveEmptyEntries).Select(d => char.ToUpperInvariant(d[0])));

    // Foto's verkleinen naar jpeg zodat de pdf licht blijft. Formaten die de
    // decoder niet kent (bv. heic) vallen stil weg; de bestandsnaam blijft vermeld.
    static byte[]? VerkleindeJpeg(byte[] inhoud)
    {
        try
        {
            using var beeld = SixLabors.ImageSharp.Image.Load(inhoud);
            var schaal = Math.Min(1f, 1100f / Math.Max(beeld.Width, beeld.Height));
            if (schaal < 1f)
                beeld.Mutate(b => b.Resize((int)(beeld.Width * schaal), (int)(beeld.Height * schaal)));
            using var uit = new MemoryStream();
            beeld.Save(uit, new JpegEncoder { Quality = 78 });
            return uit.ToArray();
        }
        catch { return null; }
    }

    // Het merkblok van Poortland: het P monogram in dubbele rand, zoals op de
    // offerte. Herbruikbaar in kop, voet of als watermerk.
    static void Monogram(IContainer vak, float grootte, string kleur)
    {
        vak.Width(grootte).Height(grootte).Border(grootte / 30f).BorderColor(kleur)
            .Padding(grootte / 14f).Border(grootte / 42f).BorderColor(kleur)
            .AlignCenter().AlignMiddle()
            .Text("P").FontFamily(Serif).SemiBold().FontSize(grootte * 0.45f).FontColor(kleur);
    }

    public byte[] Genereer(Werkbon bon, string plaatserNaam, Bedrijfsgegevens bedrijf,
        byte[]? handtekening, IReadOnlyList<FotoBijlage> fotos, string logoVariant = "kop",
        string? contact = null, string? bonOpmerking = null)
    {
        var klant = bon.Project?.Klant;
        var klantPersoon = klant is null ? "" : ($"{klant.Voornaam} {klant.Naam}").Trim();
        var klantNaam = klant is null ? "—"
            : (!string.IsNullOrWhiteSpace(klant.Bedrijfsnaam) ? $"{klant.Bedrijfsnaam} ({klantPersoon})" : klantPersoon);
        var regels = bon.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.AangemaaktOp).ToList();
        // LSB indeling: werk en meerwerk bovenaan als uit te voeren werken,
        // materiaal onderaan bij geleverde gebruikte materialen en onderdelen.
        // De werkbon schrijft "uitgevoerd_werk"; "werk" stond hier eerder als
        // enige waarde en liet elke gewone werkregel van de bon verdwijnen.
        var werken = regels.Where(r => r.Soort is "uitgevoerd_werk" or "werk" or "meerwerk").ToList();
        var materialen = regels.Where(r => r.Soort == "materiaal").ToList();
        string? totaalUren = null;
        if (bon.UrenBegin is { } ub && bon.UrenEinde is { } ue && ue > ub)
        {
            var duur = ue.ToTimeSpan() - ub.ToTimeSpan();
            totaalUren = $"{(int)duur.TotalHours}u {duur.Minutes:00}m";
        }
        var fotoJpegs = fotos.Select(f => (f.Moment, f.Naam, Jpeg: VerkleindeJpeg(f.Inhoud))).ToList();

        return Document.Create(document => document.Page(pagina =>
        {
            pagina.Size(PageSizes.A4);
            pagina.MarginHorizontal(40);
            pagina.MarginVertical(32);
            pagina.PageColor(Papier);
            pagina.DefaultTextStyle(t => t.FontFamily(Sans).FontSize(9).FontColor(Body));

            // Variant watermerk: het monogram heel licht grijs achter de inhoud
            if (logoVariant == "watermerk")
                pagina.Background().AlignCenter().AlignMiddle()
                    .Element(e => Monogram(e, 340, "#10141C15"));

            pagina.Content().Column(inhoud =>
            {
                // Titelband zoals op de papieren bon
                inhoud.Item().Border(1.4f).BorderColor(Inkt).Background(Vlak).Padding(8).AlignCenter()
                    .Text("LEVERINGS- & SERVICEBON / BON DE LIVRAISON & SERVICE")
                    .FontSize(11).Bold().LetterSpacing(0.08f).FontColor(Inkt);

                // Kopblok: bedrijf links, klant midden, datum en team rechts
                inhoud.Item().BorderLeft(1.4f).BorderRight(1.4f).BorderBottom(1.4f).BorderColor(Inkt).Row(kop =>
                {
                    kop.ConstantItem(160).BorderRight(1).BorderColor(Kader).Padding(8).Row(merk =>
                    {
                        // Variant kop: het monogram naast de bedrijfsgegevens
                        if (logoVariant == "kop")
                        {
                            merk.ConstantItem(34).AlignMiddle().Element(e => Monogram(e, 34, Inkt));
                            merk.ConstantItem(8);
                        }
                        merk.RelativeItem().Column(b =>
                        {
                            b.Item().Text(bedrijf.Naam).FontFamily(Serif).FontSize(12).SemiBold().FontColor(Inkt);
                            b.Item().PaddingTop(2).Text(bedrijf.Straat).FontSize(7.5f).FontColor(Gedempt);
                            b.Item().Text($"{bedrijf.Postcode} {bedrijf.Gemeente}").FontSize(7.5f).FontColor(Gedempt);
                            b.Item().PaddingTop(2).Text($"Tel. {bedrijf.Telefoon}").FontSize(7).FontColor(Gedempt);
                            b.Item().Text($"Btw {bedrijf.Btw}").FontSize(7).FontColor(Gedempt);
                        });
                    });
                    kop.RelativeItem().BorderRight(1).BorderColor(Kader).Padding(8).Column(k =>
                    {
                        void Rij(string label, string waarde)
                        {
                            k.Item().PaddingVertical(1.5f).Row(r =>
                            {
                                r.ConstantItem(38).Text(label).FontSize(7.5f).Bold().FontColor(Gedempt);
                                r.RelativeItem().Text(waarde).FontSize(8.5f);
                            });
                        }
                        // Op de papieren bon staat bij Adres het WERFadres, want
                        // daar rijdt de ploeg naartoe. Het facturatieadres van de
                        // klant staat er enkel onder wanneer het verschilt.
                        var klantAdres = $"{klant?.Straat ?? ""} {klant?.Postcode ?? ""} {klant?.Gemeente ?? ""}".Trim();
                        var werf = string.IsNullOrWhiteSpace(bon.Project?.Werfadres) ? null : bon.Project!.Werfadres;
                        Rij("Klant:", klantNaam);
                        Rij("Adres:", werf ?? (klantAdres == "" ? "—" : klantAdres));
                        if (werf is not null && klantAdres != "" && !werf.Equals(klantAdres, StringComparison.OrdinalIgnoreCase))
                            Rij("Facturatie:", klantAdres);
                        // Contactpersoon met zijn eigen nummer, zoals op het papier.
                        Rij("Tel:", contact ?? klant?.Telefoon ?? "—");
                    });
                    kop.ConstantItem(150).Padding(8).Column(d =>
                    {
                        d.Item().Row(r =>
                        {
                            r.ConstantItem(40).Text("Datum:").FontSize(7.5f).Bold().FontColor(Gedempt);
                            r.RelativeItem().Text(bon.Uitvoeringsdatum is { } dd ? $"{dd:d/MM/yyyy}" : "—").FontSize(8.5f);
                        });
                        d.Item().PaddingTop(3).Row(r =>
                        {
                            r.ConstantItem(40).Text("Team:").FontSize(7.5f).Bold().FontColor(Gedempt);
                            r.RelativeItem().Text(plaatserNaam).FontSize(8.5f);
                        });
                        d.Item().PaddingTop(3).Row(r =>
                        {
                            r.ConstantItem(40).Text("Dossier:").FontSize(7.5f).Bold().FontColor(Gedempt);
                            r.RelativeItem().Text(bon.Project?.Nummer.ToString() ?? "—").FontSize(8.5f);
                        });
                    });
                });

                // Opmerking en info klant
                inhoud.Item().BorderLeft(1.4f).BorderRight(1.4f).BorderBottom(1.4f).BorderColor(Inkt)
                    .Padding(8).Row(o =>
                {
                    o.ConstantItem(92).Text("OPMERKING -\nINFO KLANT:").FontSize(7.5f).Bold().FontColor(Gedempt);
                    // Eerst wat op deze bon genoteerd is, anders de omschrijving
                    // van het dossier als terugval.
                    o.RelativeItem().Text(bonOpmerking ?? bon.Project?.Omschrijving ?? "").FontSize(8.5f);
                });

                // Type als titel, zoals op de papieren bon
                inhoud.Item().BorderLeft(1.4f).BorderRight(1.4f).BorderBottom(1.4f).BorderColor(Inkt)
                    .Background(Vlak).Padding(6).AlignCenter()
                    .Text(TypeTekst(bon)).FontFamily(Serif).FontSize(16).SemiBold().FontColor(Inkt);

                inhoud.Item().BorderLeft(1.4f).BorderRight(1.4f).BorderBottom(1.4f).BorderColor(Inkt)
                    .Padding(8).Text("Uit te voeren werken - omschrijving/diagnose probleem")
                    .FontSize(9.5f).Bold().FontColor(Inkt);

                // Werkregels met OK / NOK vakjes
                inhoud.Item().MinHeight(150).Column(w =>
                {
                    var nummer = 1;
                    foreach (var r in werken)
                    {
                        w.Item().PaddingTop(8).Row(rij =>
                        {
                            rij.ConstantItem(24).Text($"{nummer++}.").FontSize(8.5f);
                            rij.RelativeItem().Text(
                                (r.ArtikelCode is null ? "" : $"{r.ArtikelCode}  ")
                                + r.Omschrijving
                                + (r.Aantal is { } a ? $" ({a:0.##}{(r.Eenheid is null ? "" : $" {r.Eenheid}")})" : "")
                                + (r.Soort == "meerwerk" ? " — meerwerk" : "")
                                + (r.AfwijkingVanStuklijst ? " — afwijking van stuklijst" : ""))
                                .FontSize(8.5f).LineHeight(1.35f);
                            rij.ConstantItem(34).AlignRight().Border(1).BorderColor(Inkt).Padding(2.5f)
                                .AlignCenter().Text("OK").FontSize(7.5f).Bold();
                            rij.ConstantItem(6);
                            rij.ConstantItem(34).Border(1).BorderColor(Inkt).Padding(2.5f)
                                .AlignCenter().Text("NOK").FontSize(7.5f).Bold();
                        });
                    }
                    if (werken.Count == 0)
                        w.Item().PaddingTop(8).Text("—").FontSize(8.5f).FontColor(Vaag);
                });

                // Geleverde gebruikte materialen en onderdelen
                inhoud.Item().PaddingTop(10).Border(1.4f).BorderColor(Inkt).Column(m =>
                {
                    m.Item().BorderBottom(1).BorderColor(Kader).Padding(7).Text(t =>
                    {
                        t.Span("Geleverde gebruikte materialen & onderdelen  ").FontSize(9.5f).Bold().FontColor(Inkt);
                        t.Span("(in geval herstellingen of extra, niet voorziene materialen bij plaatsing en automatisering)")
                            .FontSize(6.5f).FontColor(Vaag);
                    });
                    m.Item().MinHeight(46).Padding(7).Column(lijst =>
                    {
                        foreach (var r in materialen)
                            lijst.Item().PaddingVertical(1.5f).Text(
                                $"{(r.Aantal is { } a ? $"{a:0.##} {r.Eenheid ?? "st"} · " : "")}"
                                + (r.ArtikelCode is null ? "" : $"{r.ArtikelCode}  ") + r.Omschrijving
                                + (r.AfwijkingVanStuklijst ? " — afwijking van stuklijst" : ""))
                                .FontSize(8.5f);
                    });
                });

                // Opmerkingen dienst
                inhoud.Item().PaddingTop(10).Border(1.4f).BorderColor(Inkt).Column(o =>
                {
                    o.Item().BorderBottom(1).BorderColor(Kader).Padding(7)
                        .Text("Opmerkingen dienst plaatsing/herstelling - nog verder af te werken")
                        .FontSize(9.5f).Bold().FontColor(Inkt);
                    o.Item().MinHeight(46).Padding(7).Text(bon.Opmerkingen ?? "").FontSize(8.5f).LineHeight(1.4f);
                });

                // Gepresteerde uren
                inhoud.Item().PaddingTop(10).Border(1.4f).BorderColor(Inkt).Column(u =>
                {
                    u.Item().BorderBottom(1).BorderColor(Kader).Padding(7)
                        .Text("Gepresteerde uren op werf – mains d'oeuvres sur chantier")
                        .FontSize(9.5f).Bold().FontColor(Inkt);
                    u.Item().Table(tabel =>
                    {
                        tabel.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(1.3f); c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn();
                            c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn();
                        });
                        void Kop(string tekst)
                        {
                            tabel.Cell().BorderBottom(1).BorderRight(1).BorderColor(Kader).Padding(4)
                                .AlignCenter().Text(tekst).FontSize(6.5f).Bold().FontColor(Gedempt);
                        }
                        Kop("Datum - Date"); Kop("Initialen wn 1"); Kop("Initialen wn 2"); Kop("Aantal wn");
                        Kop("Vanaf - de"); Kop("Tot - à"); Kop("Totaal - total");
                        void Rij(string? datum, string? i1, string? i2, string? aantal, string? van, string? tot, string? totaal)
                        {
                            foreach (var w in new[] { datum, i1, i2, aantal, van, tot, totaal })
                                tabel.Cell().BorderBottom(1).BorderRight(1).BorderColor(Kader).Padding(5)
                                    .AlignCenter().Text(w ?? " ").FontSize(8);
                        }
                        Rij(bon.Uitvoeringsdatum is { } dd ? $"{dd:d/MM/yy}" : null,
                            Initialen(plaatserNaam), null, "1",
                            bon.UrenBegin is { } b2 ? $"{b2:HH\\:mm}" : null,
                            bon.UrenEinde is { } e2 ? $"{e2:HH\\:mm}" : null,
                            totaalUren);
                        Rij(null, null, null, null, null, null, null);
                        Rij(null, null, null, null, null, null, null);
                    });
                });

                // Foto's voor en na (digitale aanvulling op de papieren bon)
                void FotoBlok(string label, string moment)
                {
                    var reeks = fotoJpegs.Where(f => f.Moment == moment).ToList();
                    if (reeks.Count == 0) return;
                    inhoud.Item().PaddingTop(10).Column(blok =>
                    {
                        blok.Item().Text(label).FontSize(8).Bold().LetterSpacing(0.14f).FontColor(BronsDiep);
                        blok.Item().PaddingTop(4).Row(rij =>
                        {
                            foreach (var (i, foto) in reeks.Take(3).Select((f, i) => (i, f)))
                            {
                                if (i > 0) rij.ConstantItem(8);
                                rij.RelativeItem().Column(cel =>
                                {
                                    if (foto.Jpeg is not null)
                                        cel.Item().Border(1).BorderColor(LijnZacht).Padding(3).Image(foto.Jpeg).FitWidth();
                                    else
                                        cel.Item().Background(Vlak).Border(1).BorderColor(LijnZacht).Padding(10)
                                            .Text("(niet weer te geven)").FontSize(7).FontColor(Vaag);
                                    cel.Item().PaddingTop(2).Text(foto.Naam).FontSize(6.5f).FontColor(Vaag);
                                });
                            }
                            for (var i = reeks.Count; i < 3; i++) { rij.ConstantItem(8); rij.RelativeItem(); }
                        });
                        if (reeks.Count > 3)
                            blok.Item().PaddingTop(3).Text($"En nog {reeks.Count - 3} foto('s) in het dossier.")
                                .FontSize(7).FontColor(Vaag);
                    });
                }
                FotoBlok("FOTO'S VOOR", "voor");
                FotoBlok("FOTO'S NA", "na");

                // Akkoord van de klant
                inhoud.Item().PaddingTop(10).Row(akkoord =>
                {
                    akkoord.ConstantItem(250).Border(1.4f).BorderColor(Inkt).Background(Vlak)
                        .Padding(9).MinHeight(64).Column(k =>
                    {
                        k.Item().Text("Voor akkoord, de klant · Pour accord, le client")
                            .FontSize(7.5f).Bold().FontColor(Gedempt);
                        k.Item().Text("(naam + handtekening / nom + signature)").FontSize(6.5f).FontColor(Vaag);
                        if (handtekening is not null)
                        {
                            k.Item().PaddingTop(3).MaxHeight(46).AlignLeft().Image(handtekening).FitHeight();
                            k.Item().PaddingTop(2).Text(
                                $"{klantPersoon} · digitaal getekend op {bon.GetekendOp:d/MM/yyyy 'om' HH:mm}"
                                + (bon.GpsLat is not null ? $" · gps {bon.GpsLat:0.####}, {bon.GpsLon:0.####}" : ""))
                                .FontSize(6.5f).FontColor(Vaag);
                        }
                        else k.Item().MinHeight(34);
                    });
                    akkoord.RelativeItem();
                });
            });

            pagina.Footer().PaddingTop(8).Row(voet =>
            {
                // Variant voet: klein monogram naast de bedrijfsnaam
                if (logoVariant == "voet")
                {
                    voet.ConstantItem(16).Element(e => Monogram(e, 16, Vaag));
                    voet.ConstantItem(6);
                }
                voet.RelativeItem().AlignMiddle().Text($"{bedrijf.Naam} · {bedrijf.Gemeente}").FontSize(6.5f).FontColor(Vaag);
                voet.RelativeItem().AlignRight().Text(t =>
                {
                    t.DefaultTextStyle(s => s.FontSize(6.5f).FontColor(Vaag));
                    t.Span($"LSB {TypeTekst(bon)} · dossier {bon.Project?.Nummer.ToString() ?? "—"} · blad ");
                    t.CurrentPageNumber();
                    t.Span(" van ");
                    t.TotalPages();
                });
            });
        })).GeneratePdf();
    }
}
