namespace Poortland.Api.Data;

// Leads uit het webformulier en de wizard, plus de foto-inzendingen.
// Opgesplitst uit Entiteiten.cs (audit 2026-10-05); enkel verplaatst, niets gewijzigd.

public class Lead : BasisEntiteit
{
    public Guid? KlantId { get; set; }
    public LeadKanaal Kanaal { get; set; }
    public LeadStatus Status { get; set; } = LeadStatus.Nieuw;
    public Guid EigenaarId { get; set; }
    public DateOnly? Opvolgdatum { get; set; }
    public string? Naam { get; set; }
    public string? Voornaam { get; set; }
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
    public string? EersteVraag { get; set; }
    public decimal? Prijsindicatie { get; set; }
    public string? VerliesReden { get; set; }
    public Guid? OmgezetProjectId { get; set; }
    public string? TypeAanvraag { get; set; }
    public string? KlantType { get; set; }
    public string? Bedrijfsnaam { get; set; }
    public string? BtwNummer { get; set; }
    public string? Straat { get; set; }
    public string? Postcode { get; set; }
    public string? Gemeente { get; set; }
    public string? GewensteTiming { get; set; }
    public bool PrivacyAkkoord { get; set; }
    public DateTimeOffset? PrivacyAkkoordOp { get; set; }
    public string? WizardGegevens { get; set; }
    public DateTimeOffset? GearchiveerdOp { get; set; }
    // Foto-opvraag via unieke uploadlink (migratie 0040): token voor de publieke
    // uploadpagina, standaard 30 dagen geldig, hernieuwbaar en intrekbaar.
    public string? UploadToken { get; set; }
    public DateTimeOffset? UploadTokenGeldigTot { get; set; }
    public DateTimeOffset? UploadLinkVerstuurdOp { get; set; }
    public List<LeadBijlage> Bijlagen { get; set; } = new();
}

public class LeadBijlage : BasisEntiteit
{
    public Guid LeadId { get; set; }
    public string Bestandsnaam { get; set; } = "";
    public string ContentType { get; set; } = "";
    public string BestandPad { get; set; } = "";
}

// Fotoberichten: foto's die binnenkomen via de vaste publieke pagina /fotos,
// dus zonder uploadlink en zonder lead (migratie 0044). Een medewerker kan de
// inzending nadien aan een lead koppelen.

// Fotoberichten: foto's die binnenkomen via de vaste publieke pagina /fotos,
// dus zonder uploadlink en zonder lead (migratie 0044). Een medewerker kan de
// inzending nadien aan een lead koppelen.
public class Fotobericht : BasisEntiteit
{
    public string Naam { get; set; } = "";
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
    public string? Bericht { get; set; }
    public string? Herkomst { get; set; }
    public FotoberichtStatus Status { get; set; } = FotoberichtStatus.Nieuw;
    public Guid? LeadId { get; set; }
    public DateTimeOffset? BehandeldOp { get; set; }
    public Guid? BehandeldDoor { get; set; }
    public bool PrivacyAkkoord { get; set; }
    public DateTimeOffset? PrivacyAkkoordOp { get; set; }
    // Aparte toestemming om het beeld te tonen bij de realisaties (migratie 0045).
    public bool PublicatieAkkoord { get; set; }
    public string? Gemeente { get; set; }
    public int? GeplaatstJaar { get; set; }
    public List<FotoberichtBijlage> Bijlagen { get; set; } = new();
}

public class FotoberichtBijlage : BasisEntiteit
{
    public Guid FotoberichtId { get; set; }
    public string Bestandsnaam { get; set; } = "";
    public string ContentType { get; set; } = "";
    public string BestandPad { get; set; } = "";
}
