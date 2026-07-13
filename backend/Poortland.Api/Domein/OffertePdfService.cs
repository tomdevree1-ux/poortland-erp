using Poortland.Api.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Poortland.Api.Domein;

public record Bedrijfsgegevens(string Naam, string Straat, string Postcode, string Gemeente,
    string Telefoon, string Btw);

// De goedgekeurde offertelayout (Poortland offerte layout.pdf) als generator.
// Huisstijl: papier van rand tot rand, Cormorant koppen, bronzen accenten.
public class OffertePdfService
{
    const string Papier = "#FAF6EE";
    const string Vlak = "#FFFDF8";
    const string Inkt = "#141C15";
    const string Body = "#222E24";
    const string Gedempt = "#6E6450";
    const string Vaag = "#9C8E72";
    const string Brons = "#A6824C";
    const string BronsDiep = "#8A6A3C";
    const string LijnZacht = "#12141C15";
    const string Hairline = "#73A6824C";
    const string Serif = "Cormorant";
    const string Sans = "Hanken Grotesk";

    public byte[] Genereer(Offerte offerte, Bedrijfsgegevens bedrijf, string voorwaarden, int voorschotPct)
    {
        var klant = offerte.Project?.Klant;
        var klantNaam = klant is null ? "—" : ($"{klant.Voornaam} {klant.Naam}").Trim();
        var regels = offerte.Regels.Where(r => r.VerwijderdOp == null).OrderBy(r => r.Volgnummer).ToList();
        var producten = regels.Where(r => r.Soort == "product" || r.Soort == "vrij").ToList();
        var opties = regels.Where(r => r.Soort == "optie" || r.Soort == "accessoire").ToList();
        var subtotaal = Prijsmotor.Rond(regels.Sum(r => r.Totaal));
        var korting = Prijsmotor.Rond(subtotaal - offerte.TotaalExclBtw);
        var perTarief = Prijsmotor.Totalen(
            regels.Select(r => (r.Totaal, r.Btw)).ToList(),
            offerte.KortingPercentage, offerte.KortingBedrag).perTarief;
        var voorschot = Prijsmotor.Rond(offerte.TotaalInclBtw * voorschotPct / 100m);

        return Document.Create(document => document.Page(pagina =>
        {
            pagina.Size(PageSizes.A4);
            pagina.MarginHorizontal(46);
            pagina.MarginVertical(34);
            pagina.PageColor(Papier);
            pagina.DefaultTextStyle(t => t.FontFamily(Sans).FontSize(9).FontColor(Body));

            pagina.Header().Column(kop =>
            {
                kop.Item().Row(rij =>
                {
                    rij.RelativeItem().Row(merk =>
                    {
                        merk.ConstantItem(42).Height(42).Border(1.4f).BorderColor(Inkt)
                            .Padding(3).Border(1).BorderColor("#4D141C15")
                            .AlignCenter().AlignMiddle()
                            .Text("P").FontFamily(Serif).SemiBold().FontSize(19).FontColor(Inkt);
                        merk.ConstantItem(12);
                        merk.RelativeItem().AlignMiddle().Column(tekst =>
                        {
                            tekst.Item().Text("POORTLAND").FontSize(12).SemiBold().LetterSpacing(0.28f).FontColor(Inkt);
                            tekst.Item().PaddingTop(2).Text("POORTEN EN OVERKAPPINGEN").FontSize(5.5f).LetterSpacing(0.22f).FontColor(Gedempt);
                            tekst.Item().PaddingTop(1).Text("OP MAAT").FontSize(5.5f).LetterSpacing(0.22f).FontColor(Gedempt);
                        });
                    });
                    rij.ConstantItem(170).AlignRight().Column(gegevens =>
                    {
                        gegevens.Item().AlignRight().Text(bedrijf.Naam).FontSize(8).SemiBold().FontColor(Inkt);
                        gegevens.Item().AlignRight().Text(bedrijf.Straat).FontSize(7.5f).FontColor(Gedempt);
                        gegevens.Item().AlignRight().Text($"{bedrijf.Postcode} {bedrijf.Gemeente}").FontSize(7.5f).FontColor(Gedempt);
                        gegevens.Item().AlignRight().Text($"Tel. {bedrijf.Telefoon}").FontSize(7.5f).FontColor(Gedempt);
                        gegevens.Item().AlignRight().Text($"Btw {bedrijf.Btw}").FontSize(7.5f).FontColor(Gedempt);
                    });
                });
                kop.Item().PaddingTop(14).LineHorizontal(1).LineColor(Hairline);
            });

            pagina.Content().PaddingTop(12).Column(inhoud =>
            {
                inhoud.Spacing(12);

                inhoud.Item().Column(titel =>
                {
                    titel.Item().Text("VRIJBLIJVENDE PRIJSOPGAVE").FontSize(7.5f).Bold().LetterSpacing(0.22f).FontColor(BronsDiep);
                    titel.Item().Text("Offerte").FontFamily(Serif).FontSize(26).Medium().FontColor(Inkt);
                });

                inhoud.Item().Background(Vlak).Border(1).BorderColor(LijnZacht).Padding(10).Row(meta =>
                {
                    void MetaCel(QuestPDF.Infrastructure.IContainer cel, string label, string waarde)
                    {
                        cel.Column(k =>
                        {
                            k.Item().Text(label).FontSize(6.5f).Bold().LetterSpacing(0.16f).FontColor(Gedempt);
                            k.Item().PaddingTop(2).Text(waarde).FontSize(8.5f).SemiBold().FontColor(Inkt);
                        });
                    }
                    MetaCel(meta.RelativeItem(), "NUMMER", offerte.Nummer);
                    MetaCel(meta.RelativeItem(), "DATUM", $"{DateTime.Today:dd/MM/yyyy}");
                    MetaCel(meta.RelativeItem(), "VERSIE", $"v{offerte.VersieOfferte}");
                    MetaCel(meta.RelativeItem(), "GELDIG TOT", $"{offerte.GeldigTot:dd/MM/yyyy}");
                });

                inhoud.Item().Row(partijen =>
                {
                    void Partij(QuestPDF.Infrastructure.IContainer vak, string label, IEnumerable<string> regels)
                    {
                        vak.Background(Vlak).Border(1).BorderColor(LijnZacht).Padding(11).Column(k =>
                        {
                            k.Item().Text(label).FontSize(7.5f).Bold().LetterSpacing(0.22f).FontColor(BronsDiep);
                            k.Item().PaddingTop(5).Column(binnen =>
                            {
                                foreach (var regel in regels.Where(r => !string.IsNullOrWhiteSpace(r)))
                                    binnen.Item().Text(regel).FontSize(8.5f).LineHeight(1.4f);
                            });
                        });
                    }
                    Partij(partijen.RelativeItem(), "KLANT", new[]
                    {
                        klantNaam,
                        klant?.Straat ?? "",
                        $"{klant?.Postcode} {klant?.Gemeente}".Trim(),
                        klant?.Telefoon ?? "",
                        klant?.BtwNummer is null ? "" : $"Btw {klant.BtwNummer}"
                    });
                    partijen.ConstantItem(14);
                    Partij(partijen.RelativeItem(), "WERF", new[]
                    {
                        offerte.Project?.Werfadres ?? "—",
                        offerte.Project?.Omschrijving ?? ""
                    });
                });

                inhoud.Item().Table(tabel =>
                {
                    tabel.ColumnsDefinition(kolommen =>
                    {
                        kolommen.ConstantColumn(22);
                        kolommen.RelativeColumn();
                        kolommen.ConstantColumn(42);
                        kolommen.ConstantColumn(44);
                        kolommen.ConstantColumn(64);
                        kolommen.ConstantColumn(64);
                    });
                    tabel.Header(hoofd =>
                    {
                        void Kop(string tekst, bool rechts = false)
                        {
                            var cel = hoofd.Cell().BorderBottom(1.2f).BorderColor(Inkt).PaddingBottom(4);
                            (rechts ? cel.AlignRight() : cel)
                                .Text(tekst).FontSize(6.8f).Bold().LetterSpacing(0.14f).FontColor(Gedempt);
                        }
                        Kop("NR"); Kop("OMSCHRIJVING"); Kop("AANTAL", true); Kop("EENHEID");
                        Kop("EENHEIDSPRIJS", true); Kop("TOTAAL", true);
                    });

                    var nummer = 1;
                    void Regel(Offerteregel r, string label)
                    {
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6)
                            .Text(label).FontSize(8.5f);
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6).PaddingRight(8)
                            .Text(r.Omschrijving).FontSize(8.5f);
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6).AlignRight()
                            .Text($"{r.Aantal:0.##}").FontSize(8.5f);
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6).PaddingLeft(6)
                            .Text(EenheidTekst(r.Eenheid)).FontSize(8.5f).FontColor(Gedempt);
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6).AlignRight()
                            .Text($"€ {r.Eenheidsprijs:N2}").FontSize(8.5f);
                        tabel.Cell().BorderBottom(1).BorderColor(LijnZacht).PaddingVertical(6).AlignRight()
                            .Text($"€ {r.Totaal:N2}").FontSize(8.5f);
                    }
                    foreach (var r in producten) Regel(r, $"{nummer++}");
                    if (opties.Count > 0)
                    {
                        tabel.Cell().ColumnSpan(6).PaddingTop(10).PaddingBottom(2)
                            .Text("OPTIES EN ALTERNATIEVEN").FontSize(7.5f).Bold().LetterSpacing(0.22f).FontColor(BronsDiep);
                        var letter = 'a';
                        foreach (var r in opties) Regel(r, $"{letter++}");
                    }
                });

                inhoud.Item().Row(onder =>
                {
                    onder.RelativeItem().Column(vw =>
                    {
                        vw.Item().Text("VOORWAARDEN").FontSize(7.5f).Bold().LetterSpacing(0.22f).FontColor(BronsDiep);
                        vw.Item().PaddingTop(5).Text(voorwaarden).FontSize(7.5f).FontColor(Gedempt).LineHeight(1.5f);
                    });
                    onder.ConstantItem(14);
                    onder.ConstantItem(180).Background(Vlak).Border(1).BorderColor(LijnZacht).Padding(11).Column(totalen =>
                    {
                        void TotaalRij(string label, decimal bedrag)
                        {
                            totalen.Item().PaddingVertical(2).Row(r =>
                            {
                                r.RelativeItem().Text(label).FontSize(8).FontColor(Gedempt);
                                r.ConstantItem(70).AlignRight().Text($"€ {bedrag:N2}").FontSize(8).FontColor(Body);
                            });
                        }
                        TotaalRij("Subtotaal", subtotaal);
                        if (korting > 0) TotaalRij("Korting", -korting);
                        TotaalRij("Totaal excl. btw", offerte.TotaalExclBtw);
                        foreach (var (tarief, bedragen) in perTarief.OrderBy(p => p.Key))
                            TotaalRij($"Btw {Prijsmotor.Percentage(tarief):0}%", bedragen.btw);
                        totalen.Item().PaddingTop(4).BorderTop(1.2f).BorderColor(Inkt).PaddingTop(5).Row(eind =>
                        {
                            eind.RelativeItem().AlignMiddle().Text("TOTAAL INCL. BTW").FontSize(7.5f).Bold().LetterSpacing(0.1f).FontColor(Inkt);
                            eind.ConstantItem(78).AlignRight().Text($"€ {offerte.TotaalInclBtw:N2}")
                                .FontFamily(Serif).SemiBold().FontSize(14).FontColor(BronsDiep);
                        });
                        totalen.Item().PaddingTop(5).Row(vs =>
                        {
                            vs.RelativeItem().Text($"Voorschot bij bestelling ({voorschotPct}%)").FontSize(7).FontColor(Gedempt);
                            vs.ConstantItem(60).AlignRight().Text($"€ {voorschot:N2}").FontSize(7).FontColor(Gedempt);
                        });
                    });
                });

                inhoud.Item().PaddingTop(4).Row(goedkeuring =>
                {
                    void Tekenvak(QuestPDF.Infrastructure.IContainer vak, string label)
                    {
                        vak.Background(Vlak).Border(1).BorderColor("#24141C15").Padding(11).MinHeight(54).Column(k =>
                        {
                            k.Item().Text(label).FontSize(6.8f).Bold().LetterSpacing(0.14f).FontColor(Gedempt);
                            k.Item().Extend();
                            k.Item().BorderTop(1).BorderColor("#24141C15").PaddingTop(3).Row(r =>
                            {
                                r.RelativeItem().Text("Handtekening").FontSize(6.5f).FontColor(Vaag);
                                r.RelativeItem().AlignRight().Text("Datum").FontSize(6.5f).FontColor(Vaag);
                            });
                        });
                    }
                    Tekenvak(goedkeuring.RelativeItem(), "VOOR AKKOORD · DE KLANT");
                    goedkeuring.ConstantItem(14);
                    Tekenvak(goedkeuring.RelativeItem(), $"{bedrijf.Naam.ToUpperInvariant()} · DE ZAAKVOERDER");
                });
            });

            pagina.Footer().PaddingTop(8).Row(voet =>
            {
                voet.RelativeItem().Text($"{bedrijf.Naam} · {bedrijf.Gemeente}").FontSize(6.5f).FontColor(Vaag);
                voet.RelativeItem().AlignRight().Text(t =>
                {
                    t.DefaultTextStyle(s => s.FontSize(6.5f).FontColor(Vaag));
                    t.Span($"{offerte.Nummer} · blad ");
                    t.CurrentPageNumber();
                    t.Span(" van ");
                    t.TotalPages();
                });
            });
        })).GeneratePdf();
    }

    static string EenheidTekst(ArtikelEenheid eenheid) => eenheid switch
    {
        ArtikelEenheid.LopendeMeter => "lm",
        ArtikelEenheid.VierkanteMeter => "m2",
        _ => "stuk"
    };
}
