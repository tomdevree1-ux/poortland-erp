namespace Poortland.Api.Data;

// Klanten, hun contactpersonen en de contactmomenten.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

public class Klant : BasisEntiteit
{
    public KlantType Type { get; set; }
    public string Naam { get; set; } = "";
    public string? Voornaam { get; set; }
    public string? Bedrijfsnaam { get; set; }
    public string? BtwNummer { get; set; }
    public string? Straat { get; set; }
    public string? Postcode { get; set; }
    public string? Gemeente { get; set; }
    public string Land { get; set; } = "BE";
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
    public Taal Communicatietaal { get; set; } = Taal.Nl;
    public string? Communicatievoorkeur { get; set; }
    public List<Contactpersoon> Contactpersonen { get; set; } = new();
}

public class Contactpersoon : BasisEntiteit
{
    // Hoort bij een klant OF bij een lead (minstens een van beide, migratie 0039).
    public Guid? KlantId { get; set; }
    public Guid? LeadId { get; set; }
    public KlantType Type { get; set; } = KlantType.Particulier;
    public string Naam { get; set; } = "";
    public string? Voornaam { get; set; }
    public string? Functie { get; set; }
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
    public string? Bedrijfsnaam { get; set; }
    public string? BtwNummer { get; set; }
    public bool OntvangtOfferte { get; set; }
}

public class Contactmoment : BasisEntiteit
{
    public Guid KlantId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid MedewerkerId { get; set; }
    public string Type { get; set; } = "telefoon";
    public DateTimeOffset Datum { get; set; }
    public string? Notitie { get; set; }
}
