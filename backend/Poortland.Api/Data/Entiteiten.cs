namespace Poortland.Api.Data;

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
    public Guid KlantId { get; set; }
    public string Naam { get; set; } = "";
    public string? Voornaam { get; set; }
    public string? Functie { get; set; }
    public string? Email { get; set; }
    public string? Telefoon { get; set; }
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
    public List<LeadBijlage> Bijlagen { get; set; } = new();
}

public class LeadBijlage : BasisEntiteit
{
    public Guid LeadId { get; set; }
    public string Bestandsnaam { get; set; } = "";
    public string ContentType { get; set; } = "";
    public string BestandPad { get; set; } = "";
}

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

public class Artikel : BasisEntiteit
{
    public string Code { get; set; } = "";
    public string Omschrijving { get; set; } = "";
    public ArtikelEenheid Eenheid { get; set; } = ArtikelEenheid.Stuk;
    public decimal Basisprijs { get; set; }
    public BtwTarief BtwDefault { get; set; } = BtwTarief.P21;
    public bool IsActief { get; set; } = true;
}

public class Offerte : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public string Nummer { get; set; } = "";
    public int VersieOfferte { get; set; } = 1;
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

public class WebsiteMedia : BasisEntiteit
{
    public string Titel { get; set; } = "";
    public string? AltTekst { get; set; }
    public string? Categorie { get; set; }
    public string? ProductSoort { get; set; }
    public string? PoortType { get; set; }
    public string? PoortUitvoering { get; set; }
    // De drie parameters waarmee de website een poortfoto plaatst:
    // PoortType is het materiaal (hout, metaal of de combinatie), PoortStijl is de
    // stijltab (bv. Klassiek met sierpunten) en ModelNaam is de modelnaam (bv. Brenta).
    public string? PoortStijl { get; set; }
    public string? ModelNaam { get; set; }
    public int Volgnummer { get; set; }
    public WebsiteContentStatus Status { get; set; } = WebsiteContentStatus.Concept;
    public string BestandPadOrigineel { get; set; } = "";
    public string? BestandPadWeb { get; set; }
    public string? BestandPadThumb { get; set; }
    public int? Breedte { get; set; }
    public int? Hoogte { get; set; }
    public bool PersonenInBeeld { get; set; }
    public bool ToestemmingBevestigd { get; set; }
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
}

public class WebsitePopup : BasisEntiteit
{
    public string Titel { get; set; } = "";
    public string BodyTekst { get; set; } = "";
    public DateOnly ActiefVan { get; set; }
    public DateOnly ActiefTot { get; set; }
    public WebsiteContentStatus Status { get; set; } = WebsiteContentStatus.Concept;
    public DateTimeOffset? GepubliceerdOp { get; set; }
    public Guid? GepubliceerdDoor { get; set; }
}

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
public class Werkbon : BasisEntiteit
{
    public Guid ProjectId { get; set; }
    public Guid PlaatserId { get; set; }
    public Guid? PlanningsitemId { get; set; }
    public WerkbonType Type { get; set; }
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

public class Instelling
{
    public string Sleutel { get; set; } = "";
    public string Waarde { get; set; } = "";
    public string? Omschrijving { get; set; }
}
