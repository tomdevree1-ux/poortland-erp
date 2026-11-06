namespace Poortland.Api.Data;

// Audit- en organisatiebasis: de gedeelde auditkolommen, medewerkers en instellingen.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

// Standaard auditkolommen (TS-01 sectie 3).
public abstract class BasisEntiteit
{
    public Guid Id { get; set; }
    public DateTimeOffset AangemaaktOp { get; set; }
    public Guid? AangemaaktDoor { get; set; }
    public DateTimeOffset GewijzigdOp { get; set; }
    public Guid? GewijzigdDoor { get; set; }
    public int Versie { get; set; }
    public DateTimeOffset? VerwijderdOp { get; set; }
    public DateOnly? BewarenTot { get; set; }
}

public class Medewerker : BasisEntiteit
{
    public Guid? AuthUserId { get; set; }
    public string Naam { get; set; } = "";
    public string? Voornaam { get; set; }
    public string Email { get; set; } = "";
    public string? Telefoon { get; set; }
    public bool IsActief { get; set; } = true;
    public List<MedewerkerRol> Rollen { get; set; } = new();
}

public class MedewerkerRol
{
    public Guid MedewerkerId { get; set; }
    public Rol Rol { get; set; }
}

public class Instelling
{
    public string Sleutel { get; set; } = "";
    public string Waarde { get; set; } = "";
    public string? Omschrijving { get; set; }
}
