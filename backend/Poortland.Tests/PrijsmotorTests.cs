using Poortland.Api.Data;
using Poortland.Api.Domein;
using Xunit;

namespace Poortland.Tests;

// Bouwspec hoofdstuk 9: de prijsmotor gedekt met unit tests.
public class PrijsmotorTests
{
    [Fact]
    public void RegelTotaal_rekent_aantal_maal_prijs_min_korting()
    {
        Assert.Equal(4900.00m, Prijsmotor.RegelTotaal(2, 2450.00m, 0));
        Assert.Equal(4650.00m, Prijsmotor.RegelTotaal(2, 2450.00m, 250.00m));
    }

    [Fact]
    public void RegelTotaal_rondt_commercieel_af_op_2_decimalen()
    {
        // 3,33 lopende meter aan 18,50 is 61,605 en wordt 61,61
        Assert.Equal(61.61m, Prijsmotor.RegelTotaal(3.33m, 18.50m, 0));
    }

    [Fact]
    public void RegelTotaal_weigert_negatieve_regels()
    {
        Assert.Throws<DomeinFout>(() => Prijsmotor.RegelTotaal(1, 100m, 150m));
    }

    [Fact]
    public void Totalen_splitst_btw_correct_per_tarief()
    {
        var regels = new List<(decimal, BtwTarief)> { (1000.00m, BtwTarief.P21), (500.00m, BtwTarief.P6) };
        var (excl, btw, incl, perTarief) = Prijsmotor.Totalen(regels, 0, 0);
        Assert.Equal(1500.00m, excl);
        Assert.Equal(240.00m, btw); // 210 plus 30
        Assert.Equal(1740.00m, incl);
        Assert.Equal(210.00m, perTarief[BtwTarief.P21].btw);
        Assert.Equal(30.00m, perTarief[BtwTarief.P6].btw);
    }

    [Fact]
    public void Totalen_verdeelt_offertekorting_pro_rata_over_tarieven()
    {
        var regels = new List<(decimal, BtwTarief)> { (1000.00m, BtwTarief.P21), (500.00m, BtwTarief.P6) };
        var (excl, btw, incl, perTarief) = Prijsmotor.Totalen(regels, 10, 0);
        // korting 150: 100 op p21 en 50 op p6
        Assert.Equal(1350.00m, excl);
        Assert.Equal(900.00m, perTarief[BtwTarief.P21].grondslag);
        Assert.Equal(450.00m, perTarief[BtwTarief.P6].grondslag);
        Assert.Equal(189.00m + 27.00m, btw);
        Assert.Equal(excl + btw, incl);
    }

    [Fact]
    public void Totalen_excl_plus_btw_is_altijd_incl()
    {
        var regels = new List<(decimal, BtwTarief)> { (123.45m, BtwTarief.P21), (67.89m, BtwTarief.P6), (10.01m, BtwTarief.P0) };
        var (excl, btw, incl, _) = Prijsmotor.Totalen(regels, 7.5m, 12.34m);
        Assert.Equal(incl, excl + btw); // consistentieregel uit TS-01 sectie 7 punt 9
    }

    [Fact]
    public void Totalen_weigert_korting_boven_subtotaal()
    {
        var regels = new List<(decimal, BtwTarief)> { (100.00m, BtwTarief.P21) };
        Assert.Throws<DomeinFout>(() => Prijsmotor.Totalen(regels, 0, 200.00m));
    }

    [Fact]
    public void Totalen_zonder_regels_is_nul()
    {
        var (excl, btw, incl, _) = Prijsmotor.Totalen(new List<(decimal, BtwTarief)>(), 0, 0);
        Assert.Equal(0m, excl);
        Assert.Equal(0m, btw);
        Assert.Equal(0m, incl);
    }
}
