namespace Poortland.Api.Data;

// Van dossier tot offerte, order, opvolgtaak en communicatie.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

public class Project : BasisEntiteit
{
    public Guid KlantId { get; set; }
    public int Nummer { get; set; }
    public string Werfadres { get; set; } = "";
    public string? Omschrijving { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Aangemaakt;
    public int GarantieMaanden { get; set; } = 24;
    public DateOnly? VerwachteOpleverdatum { get; set; }
    public Klant? Klant { get; set; }
    public List<Offerte> Offertes { get; set; } = new();
}

// De velden na IsActief komen uit het productbestand dat Poortland aanleverde
// (export 25 september 2026). Zijn indeling blijft leidend, zie migratie 0048.
public class Artikel : BasisEntiteit
{
    public string Code { get; set; } = "";
    public string Naam { get; set; } = "";
    public string Omschrijving { get; set; } = "";
    public ArtikelEenheid Eenheid { get; set; } = ArtikelEenheid.Stuk;
    public decimal Basisprijs { get; set; }
    public BtwTarief BtwDefault { get; set; } = BtwTarief.P21;
    public bool IsActief { get; set; } = true;

    public string? Categorie1 { get; set; }
    public string? Categorie2 { get; set; }
    public string? Leverancier { get; set; }
    public string? LeverancierNummer { get; set; }
    public string? Merk { get; set; }
    public string? Model { get; set; }
    public string? Type { get; set; }
    public string? StdMaten { get; set; }
    // Het nummer uit het bestand van Poortland. Niet uniek, enkel ter herkenning.
    public int? PoortlandId { get; set; }
    public bool PrijsOntbreekt { get; set; }
}

public class Offerte : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public string Nummer { get; set; } = "";
    public int VersieOfferte { get; set; } = 1;
    public OfferteSoort Soort { get; set; } = OfferteSoort.Offerte;
    public string? Model { get; set; }
    public Guid? UitRamingId { get; set; }
    public bool BtwVerlegd { get; set; }
    public OfferteStatus Status { get; set; } = OfferteStatus.Nieuw;
    public Taal Taal { get; set; } = Taal.Nl;
    public DateOnly GeldigTot { get; set; }
    public decimal KortingPercentage { get; set; }
    public decimal KortingBedrag { get; set; }
    public decimal TotaalExclBtw { get; set; }
    public decimal TotaalBtw { get; set; }
    public decimal TotaalInclBtw { get; set; }
    public DateTimeOffset? VerzondenOp { get; set; }
    public DateTimeOffset? BeslistOp { get; set; }
    public string? WeigerReden { get; set; }
    public string? OndertekendDocumentPad { get; set; }
    public DateTimeOffset? OndertekendOp { get; set; }
    public string? EsignatureReferentie { get; set; }
    public Project? Project { get; set; }
    public List<Offerteregel> Regels { get; set; } = new();
}

public class Offerteregel : BasisEntiteit
{
    public Guid OfferteId { get; set; }
    public int Volgnummer { get; set; }
    public string Soort { get; set; } = "product";
    public Guid? ArtikelId { get; set; }
    public string Omschrijving { get; set; } = "";
    public string? Detail { get; set; }
    public decimal Aantal { get; set; } = 1;
    public ArtikelEenheid Eenheid { get; set; } = ArtikelEenheid.Stuk;
    public decimal Eenheidsprijs { get; set; }
    public decimal KortingBedrag { get; set; }
    public BtwTarief Btw { get; set; } = BtwTarief.P21;
    public decimal Totaal { get; set; }
}

public class Order : BasisEntiteit
{
    public Guid OfferteId { get; set; }
    public DateOnly DatumGoedkeuring { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Aangemaakt;
    public Offerte? Offerte { get; set; }
}

public class Opvolgtaak : BasisEntiteit
{
    public OpvolgtaakType Type { get; set; }
    public Guid? OfferteId { get; set; }
    public Guid? LeadId { get; set; }
    public Guid MedewerkerId { get; set; }
    public DateOnly DueDatum { get; set; }
    public OpvolgtaakStatus Status { get; set; } = OpvolgtaakStatus.Open;
    public string? Omschrijving { get; set; }
}

public class Communicatie : BasisEntiteit
{
    public Guid KlantId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? OfferteId { get; set; }
    public string Kanaal { get; set; } = "email";
    public string Onderwerp { get; set; } = "";
    public string? Inhoud { get; set; }
    public string? InhoudPad { get; set; }
    public DateTimeOffset VerzondenOp { get; set; }
    public CommunicatieStatus Status { get; set; } = CommunicatieStatus.Gelogd;
}

public class Notificatie : BasisEntiteit
{
    public Guid MedewerkerId { get; set; }
    public string Type { get; set; } = "";
    public string Titel { get; set; } = "";
    public string? Boodschap { get; set; }
    public string? EntiteitType { get; set; }
    public Guid? EntiteitId { get; set; }
    public DateTimeOffset? GelezenOp { get; set; }
}
