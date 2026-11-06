namespace Poortland.Api.Data;

// Content die het ERP naar de publieke website publiceert.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

public class WebsiteMedia : BasisEntiteit
{
    public string Titel { get; set; } = "";
    public string? AltTekst { get; set; }
    public string? Categorie { get; set; }
    public string? ProductSoort { get; set; }
    public string? PoortType { get; set; }
    public string? PoortUitvoering { get; set; }
    // De drie parameters waarmee de website een poortfoto plaatst:
    // PoortType is het materiaal (hout, metaal of de combinatie), PoortStijl is de
    // stijltab (bv. Klassiek met sierpunten) en ModelNaam is de modelnaam (bv. Brenta).
    public string? PoortStijl { get; set; }
    public string? ModelNaam { get; set; }
    public int Volgnummer { get; set; }
    public WebsiteContentStatus Status { get; set; } = WebsiteContentStatus.Concept;
    public string BestandPadOrigineel { get; set; } = "";
    public string? BestandPadWeb { get; set; }
    public string? BestandPadThumb { get; set; }
    public int? Breedte { get; set; }
    public int? Hoogte { get; set; }
    public bool PersonenInBeeld { get; set; }
    public bool ToestemmingBevestigd { get; set; }
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
}

public class WebsitePopup : BasisEntiteit
{
    public string Titel { get; set; } = "";
    public string BodyTekst { get; set; } = "";
    public DateOnly ActiefVan { get; set; }
    public DateOnly ActiefTot { get; set; }
    public WebsiteContentStatus Status { get; set; } = WebsiteContentStatus.Concept;
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
}

// TS-07 productie en stuklijst
