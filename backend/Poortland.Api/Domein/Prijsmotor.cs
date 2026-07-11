using Poortland.Api.Data;

namespace Poortland.Api.Domein;

// Prijsmotor v1 (bouwspec 6.3). De backend rekent, de frontend toont (TS-05).
public static class Prijsmotor
{
    public static decimal Percentage(BtwTarief t) => t switch
    {
        BtwTarief.P0 => 0m,
        BtwTarief.P6 => 6m,
        _ => 21m
    };

    public static decimal Rond(decimal bedrag) =>
        Math.Round(bedrag, 2, MidpointRounding.AwayFromZero);

    // Regeltotaal: aantal maal eenheidsprijs min regelkorting, nooit negatief.
    public static decimal RegelTotaal(decimal aantal, decimal eenheidsprijs, decimal kortingBedrag)
    {
        var bruto = Rond(aantal * eenheidsprijs) - kortingBedrag;
        if (bruto < 0) throw new DomeinFout("Een regelkorting mag de regel niet negatief maken.");
        return Rond(bruto);
    }

    // Totalen met offertekorting (percentage en bedrag) pro rata over de
    // btw tarieven verdeeld zodat de uitsplitsing per tarief correct blijft.
    public static (decimal excl, decimal btw, decimal incl, Dictionary<BtwTarief, (decimal grondslag, decimal btw)> perTarief)
        Totalen(IReadOnlyCollection<(decimal totaal, BtwTarief btw)> regels, decimal kortingPercentage, decimal kortingBedrag)
    {
        if (kortingPercentage is < 0 or > 100) throw new DomeinFout("Kortingpercentage moet tussen 0 en 100 liggen.");
        if (kortingBedrag < 0) throw new DomeinFout("Kortingbedrag mag niet negatief zijn.");

        var subtotaal = Rond(regels.Sum(r => r.totaal));
        var korting = Rond(subtotaal * kortingPercentage / 100m) + kortingBedrag;
        if (korting > subtotaal) throw new DomeinFout("De korting mag het subtotaal niet overschrijden.");

        var perTarief = new Dictionary<BtwTarief, (decimal grondslag, decimal btw)>();
        decimal excl = 0m, btw = 0m, verdeeldeKorting = 0m;
        var groepen = regels.GroupBy(r => r.btw).OrderBy(g => g.Key).ToList();
        for (var i = 0; i < groepen.Count; i++)
        {
            var groep = groepen[i];
            var groepTotaal = Rond(groep.Sum(r => r.totaal));
            decimal kortingAandeel;
            if (i == groepen.Count - 1)
            {
                kortingAandeel = Rond(korting - verdeeldeKorting); // rest tegen afrondingsdrift
            }
            else
            {
                kortingAandeel = subtotaal == 0 ? 0 : Rond(korting * groepTotaal / subtotaal);
                verdeeldeKorting += kortingAandeel;
            }
            var grondslag = Rond(groepTotaal - kortingAandeel);
            var groepBtw = Rond(grondslag * Percentage(groep.Key) / 100m);
            perTarief[groep.Key] = (grondslag, groepBtw);
            excl += grondslag;
            btw += groepBtw;
        }
        return (Rond(excl), Rond(btw), Rond(excl + btw), perTarief);
    }
}

public class DomeinFout(string boodschap) : Exception(boodschap);
