namespace Poortland.Api.Data;

// TS-07 productie: leveranciers, stuklijsten, onderdelen en tekeningen.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

// TS-07 productie en stuklijst
public class Leverancier : BasisEntiteit
{
    public string Naam { get; set; } = "";
    public LeverancierType Type { get; set; }
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
    public bool IsActief { get; set; } = true;
}

public class Stuklijst : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public int VersieStuklijst { get; set; } = 1;
    public bool IsActief { get; set; } = true;
    public DateOnly DatumOpmaak { get; set; }
    public List<Productieonderdeel> Onderdelen { get; set; } = [];
}

public class Productieonderdeel : BasisEntiteit
{
    public Guid StuklijstId { get; set; }
    public string Productcode { get; set; } = "";
    public string? Omschrijving { get; set; }
    public string? Afmetingen { get; set; }
    public string? Materiaal { get; set; }
    public OnderdeelStatus Status { get; set; } = OnderdeelStatus.Besteld;
    public bool VoorbehandelingVanToepassing { get; set; } = true;
    public bool LakwerkVanToepassing { get; set; } = true;
    public Guid? LeverancierVoorbehandelingId { get; set; }
    public Guid? LeverancierLakwerkId { get; set; }
    public string? LakwerkRal { get; set; }
    public DateOnly? EtaVoorbehandeling { get; set; }
    public DateOnly? EtaLakwerk { get; set; }
}

public class Tekening : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public int TekeningVersie { get; set; } = 1;
    public DateOnly Datum { get; set; }
    public Guid? AuteurId { get; set; }
    public string Bestandsnaam { get; set; } = "";
    public string BestandPad { get; set; } = "";
    public string? Metadata { get; set; }
}

// TS-08 planning
