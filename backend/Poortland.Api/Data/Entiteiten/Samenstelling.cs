namespace Poortland.Api.Data;

// Samenstelling van een dossier (migratie 0051, Tom 2026-11-18): subprojecten met
// een eigen locatie, onderdelen per subproject en de regels van het globaal
// overzicht met de LSB waarop elke regel komt.

public class Subproject : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public string Naam { get; set; } = "";
    public string? Locatie { get; set; }
    // poort, afsluiting, garagepoort of overkapping (de groepen uit het datamodel).
    public string Soort { get; set; } = "poort";
    public string? Type { get; set; }
    public int Volgnummer { get; set; }
}

public class SubprojectOnderdeel : BasisEntiteit
{
    public Guid SubprojectId { get; set; }
    public Guid? OuderId { get; set; }
    public string Naam { get; set; } = "";
    public int? BreedteMm { get; set; }
    public int? HoogteMm { get; set; }
    public int Volgnummer { get; set; }
}

public class Projectregel : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public Guid? SubprojectId { get; set; }
    public Guid? OnderdeelId { get; set; }
    // accessoires, automatisering, hekwerk of opdracht.
    public string Rubriek { get; set; } = "accessoires";
    public Guid? ArtikelId { get; set; }
    public string? ArtikelCode { get; set; }
    // Hoort bij deze regel; het artikel zelf blijft ongewijzigd.
    public string Omschrijving { get; set; } = "";
    public decimal Aantal { get; set; } = 1;
    // Enkel bij een opdracht: plaatsing, automatisatie of herstelling.
    public string? OpdrachtSoort { get; set; }
    public DateOnly? GeplandeDatum { get; set; }
    public WerkbonType? LsbType { get; set; }
    public int? LsbPlaatsingNummer { get; set; }
    public int Volgnummer { get; set; }
}
