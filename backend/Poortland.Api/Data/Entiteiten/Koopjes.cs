namespace Poortland.Api.Data;

// Koopjes uit voorraad en vacatures, beide beheerd in het websitebeheer en
// gepubliceerd via content.json (migratie 0046).

public class Koopje : BasisEntiteit
{
    public string Materiaal { get; set; } = "";
    public string? Model { get; set; }
    public string? Ral { get; set; }
    public int? BreedteCm { get; set; }
    public int? HoogteCm { get; set; }
    public string? ExtraInfo { get; set; }
    public decimal? PrijsInclBtw { get; set; }
    public KoopjeStatus Status { get; set; } = KoopjeStatus.Concept;
    public int Volgnummer { get; set; }
    public DateTimeOffset? VerkochtOp { get; set; }
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
    public List<KoopjeFoto> Fotos { get; set; } = new();
}

public class KoopjeFoto : BasisEntiteit
{
    public Guid KoopjeId { get; set; }
    public string BestandPadOrigineel { get; set; } = "";
    public string? BestandPadWeb { get; set; }
    public string? BestandPadThumb { get; set; }
    public string? AltTekst { get; set; }
    public int Volgnummer { get; set; }
    public int? Breedte { get; set; }
    public int? Hoogte { get; set; }
}

public class Vacature : BasisEntiteit
{
    public string Titel { get; set; } = "";
    public string? Intro { get; set; }
    // Json: [{ "kop": "Taken", "punten": ["...", "..."] }]
    public string Blokken { get; set; } = "[]";
    public VacatureStatus Status { get; set; } = VacatureStatus.Concept;
    public int Volgnummer { get; set; }
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
}
