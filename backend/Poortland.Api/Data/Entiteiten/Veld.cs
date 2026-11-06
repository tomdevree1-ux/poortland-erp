namespace Poortland.Api.Data;

// TS-09 veld en werkbon, en TS-11 service na verkoop.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

// TS-09 veld en werkbon
public class Werkbon : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public Guid PlaatserId { get; set; }
    public Guid? PlanningsitemId { get; set; }
    public WerkbonType Type { get; set; }
    // Oplopend nummer per project voor plaatsingen (Plaatsing 1, 2, 3, ...).
    public int? PlaatsingNummer { get; set; }
    public WerkbonStatus Status { get; set; } = WerkbonStatus.Open;
    public DateOnly? Uitvoeringsdatum { get; set; }
    public TimeOnly? UrenBegin { get; set; }
    public TimeOnly? UrenEinde { get; set; }
    public string? Opmerkingen { get; set; }
    public string? KlanthandtekeningPad { get; set; }
    public DateTimeOffset? GetekendOp { get; set; }
    public string? HandtekeningMethode { get; set; }
    public decimal? GpsLat { get; set; }
    public decimal? GpsLon { get; set; }
    public Guid? ClientId { get; set; }
    public DateTimeOffset? GesynchroniseerdOp { get; set; }
    public Project? Project { get; set; }
    public List<Werkbonregel> Regels { get; set; } = [];
    public List<Werkbonfoto> Fotos { get; set; } = [];
}

public class Werkbonregel : BasisEntiteit
{
    public Guid WerkbonId { get; set; }
    public string Soort { get; set; } = "uitgevoerd_werk";
    public string Omschrijving { get; set; } = "";
    public decimal? Aantal { get; set; }
    public string? Eenheid { get; set; }
    public bool AfwijkingVanStuklijst { get; set; }
    // Optionele verwijzing naar de catalogus (migratie 0049). De code blijft
    // bewaard zodat de bon leesbaar blijft als het artikel later verdwijnt.
    public Guid? ArtikelId { get; set; }
    public string? ArtikelCode { get; set; }
}

public class Werkbonfoto : BasisEntiteit
{
    public Guid WerkbonId { get; set; }
    public string Moment { get; set; } = "voor";
    public string Bestandsnaam { get; set; } = "";
    public string BestandPad { get; set; } = "";
    public decimal? GpsLat { get; set; }
    public decimal? GpsLon { get; set; }
}

// TS-11 service en nazorg

// TS-11 service en nazorg
public class Servicedossier : BasisEntiteit
{
    public Guid KlantId { get; set; }
    public Guid? ProjectId { get; set; }
    public ServicedossierStatus Status { get; set; } = ServicedossierStatus.Gemeld;
    public Guid? TechniekerId { get; set; }
    public bool GarantieIndicatie { get; set; }
    public string? Klacht { get; set; }
    public DateTimeOffset GemeldOp { get; set; }
    public DateOnly? GeplandOp { get; set; }
    public Klant? Klant { get; set; }
    public Project? Project { get; set; }
}

// TS-10 facturatievoorbereiding: geen eigen facturatiemotor (ADR-005), wel het
// voorstel dat naar Exact Online gaat met het teruggemelde nummer.
