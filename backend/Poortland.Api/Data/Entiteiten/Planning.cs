namespace Poortland.Api.Data;

// TS-08 planning: ploegen en planningsitems.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

// TS-08 planning
public class Ploeg : BasisEntiteit
{
    public string Naam { get; set; } = "";
    public bool IsActief { get; set; } = true;
    public List<PloegLid> Leden { get; set; } = [];
}

public class PloegLid
{
    public Guid PloegId { get; set; }
    public Guid MedewerkerId { get; set; }
}

public class Planningsitem : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public Projectfase Fase { get; set; }
    public Guid? MedewerkerId { get; set; }
    public Guid? PloegId { get; set; }
    public DateOnly GeplandeDatum { get; set; }
    public string Status { get; set; } = "gepland";
    public string? BenodigdeMaterialen { get; set; }
    public string? Klantafspraken { get; set; }
    public Project? Project { get; set; }
}

// TS-09 veld en werkbon
