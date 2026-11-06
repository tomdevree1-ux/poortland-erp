namespace Poortland.Api.Data;

// TS-10 facturatievoorbereiding richting Exact Online (ADR-005).
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

// TS-10 facturatievoorbereiding: geen eigen facturatiemotor (ADR-005), wel het
// voorstel dat naar Exact Online gaat met het teruggemelde nummer.
public class Factuurvoorstel : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public Guid? OrderId { get; set; }
    public FactuurSoort Soort { get; set; } = FactuurSoort.Eind;
    public FactuurStatus Status { get; set; } = FactuurStatus.Concept;
    public bool AfwijkingBevestigd { get; set; }
    public decimal TotaalExclBtw { get; set; }
    public decimal TotaalBtw { get; set; }
    public decimal TotaalInclBtw { get; set; }
    public string? ExactNummer { get; set; }
    public DateTimeOffset? GoedgekeurdOp { get; set; }
    public DateTimeOffset? GefactureerdOp { get; set; }
    public Project? Project { get; set; }
    public List<Factuurvoorstelregel> Regels { get; set; } = new();
}

public class Factuurvoorstelregel : BasisEntiteit
{
    public Guid FactuurvoorstelId { get; set; }
    public int Volgnummer { get; set; } = 1;
    public FactuurregelBron Bron { get; set; } = FactuurregelBron.Offerte;
    public string Omschrijving { get; set; } = "";
    public decimal Aantal { get; set; } = 1;
    public string? Eenheid { get; set; }
    public decimal Eenheidsprijs { get; set; }
    public BtwTarief Btw { get; set; } = BtwTarief.P21;
}
