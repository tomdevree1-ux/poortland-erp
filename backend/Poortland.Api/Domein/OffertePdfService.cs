using Poortland.Api.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Poortland.Api.Domein;

// Offerte PDF volgens de kernvelden uit RFP bijlage C.1 (TS-05 sectie 3).
// Kleuren uit de huisstijlgids: inkt 141C15, brons A6824C, papier FAF6EE.
public class OffertePdfService
{
    static readonly string Inkt = "#141C15";
    static readonly string Brons = "#A6824C";
    static readonly string Gedempt = "#6E6450";

    public byte[] Genereer(Offerte offerte)
    {
        var klant = offerte.Project?.Klant;
        var document = Document.Create(c => c.Page(pagina =>
        {
            pagina.Size(PageSizes.A4);
            pagina.Margin(42);
            pagina.DefaultTextStyle(t => t.FontSize(10).FontColor(Inkt));

            pagina.Header().Row(rij =>
            {
                rij.RelativeItem().Column(kolom =>
                {
                    kolom.Item().Text("POORTLAND").FontSize(18).SemiBold().LetterSpacing(0.2f);
                    kolom.Item().Text("Maatwerk tuinpoorten · Mechelen").FontSize(8).FontColor(Gedempt);
                });
                rij.ConstantItem(200).Column(kolom =>
                {
                    kolom.Item().AlignRight().Text($"Offerte {offerte.Nummer}").SemiBold().FontSize(12);
                    kolom.Item().AlignRight().Text($"Versie {offerte.VersieOfferte} · {DateTime.Today:dd/MM/yyyy}").FontSize(8).FontColor(Gedempt);
                    kolom.Item().AlignRight().Text($"Geldig tot {offerte.GeldigTot:dd/MM/yyyy}").FontSize(8).FontColor(Gedempt);
                });
            });

            pagina.Content().PaddingVertical(18).Column(kolom =>
            {
                kolom.Spacing(14);
                kolom.Item().Row(rij =>
                {
                    rij.RelativeItem().Column(k =>
                    {
                        k.Item().Text("KLANT").FontSize(7).FontColor(Brons).LetterSpacing(0.2f);
                        k.Item().Text(klant?.Naam ?? "—").SemiBold();
                        if (klant?.Straat is not null) k.Item().Text($"{klant.Straat}, {klant.Postcode} {klant.Gemeente}").FontSize(9);
                        if (klant?.BtwNummer is not null) k.Item().Text($"btw {klant.BtwNummer}").FontSize(9).FontColor(Gedempt);
                    });
                    rij.RelativeItem().Column(k =>
                    {
                        k.Item().Text("WERF").FontSize(7).FontColor(Brons).LetterSpacing(0.2f);
                        k.Item().Text(offerte.Project?.Werfadres ?? "—").FontSize(9);
                        if (offerte.Project?.Omschrijving is not null)
                            k.Item().Text(offerte.Project.Omschrijving).FontSize(9).FontColor(Gedempt);
                    });
                });

                kolom.Item().Table(tabel =>
                {
                    tabel.ColumnsDefinition(k =>
                    {
                        k.RelativeColumn(6); k.RelativeColumn(2); k.RelativeColumn(2); k.RelativeColumn(2);
                    });
                    tabel.Header(h =>
                    {
                        foreach (var titel in new[] { "Omschrijving", "Aantal", "Eenheidsprijs", "Totaal" })
                            h.Cell().BorderBottom(1).BorderColor(Inkt).PaddingBottom(4)
                                .Text(titel).FontSize(8).SemiBold();
                    });
                    foreach (var regel in offerte.Regels.OrderBy(r => r.Volgnummer))
                    {
                        tabel.Cell().PaddingVertical(3).Text(regel.Omschrijving).FontSize(9);
                        tabel.Cell().PaddingVertical(3).AlignRight().Text($"{regel.Aantal:0.##}").FontSize(9);
                        tabel.Cell().PaddingVertical(3).AlignRight().Text($"€ {regel.Eenheidsprijs:N2}").FontSize(9);
                        tabel.Cell().PaddingVertical(3).AlignRight().Text($"€ {regel.Totaal:N2}").FontSize(9);
                    }
                });

                kolom.Item().AlignRight().Column(k =>
                {
                    if (offerte.KortingPercentage > 0 || offerte.KortingBedrag > 0)
                        k.Item().Text($"Korting: {offerte.KortingPercentage:0.##}% plus € {offerte.KortingBedrag:N2}").FontSize(9).FontColor(Gedempt);
                    k.Item().Text($"Totaal excl. btw  € {offerte.TotaalExclBtw:N2}").FontSize(10);
                    k.Item().Text($"btw  € {offerte.TotaalBtw:N2}").FontSize(10);
                    k.Item().Text($"Totaal incl. btw  € {offerte.TotaalInclBtw:N2}").FontSize(12).SemiBold().FontColor(Brons);
                });

                kolom.Item().PaddingTop(8).Column(k =>
                {
                    k.Item().Text("VOORWAARDEN").FontSize(7).FontColor(Brons).LetterSpacing(0.2f);
                    k.Item().Text("Voorschot 30% bij bestelling. Levertermijn in overleg na opmeting. Garantie 24 maanden. Betaling 14 dagen na factuurdatum.").FontSize(8).FontColor(Gedempt);
                });

                kolom.Item().PaddingTop(16).Row(rij =>
                {
                    rij.RelativeItem().Column(k =>
                    {
                        k.Item().Text("Voor akkoord, de klant").FontSize(8).FontColor(Gedempt);
                        k.Item().PaddingTop(28).BorderBottom(1).BorderColor(Gedempt);
                    });
                    rij.ConstantItem(40);
                    rij.RelativeItem().Column(k =>
                    {
                        k.Item().Text("Poortland, de zaakvoerder").FontSize(8).FontColor(Gedempt);
                        k.Item().PaddingTop(28).BorderBottom(1).BorderColor(Gedempt);
                    });
                });
            });

            pagina.Footer().AlignCenter().Text(t =>
            {
                t.Span("Poortland BV · Mechelen · ").FontSize(7).FontColor(Gedempt);
                t.Span($"Offerte {offerte.Nummer} · pagina ").FontSize(7).FontColor(Gedempt);
                t.CurrentPageNumber().FontSize(7).FontColor(Gedempt);
            });
        }));
        return document.GeneratePdf();
    }
}
