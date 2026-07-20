namespace Poortland.Api.Data;

// Spiegels van de Postgres enum types (TS-01 sectie 4).
public enum Rol { Verkoop, Planning, Productie, Montage, Boekhouding, Beheerder, Systeem }
public enum KlantType { Particulier, Bedrijf }
public enum Taal { Nl, Fr, En }
public enum LeadKanaal { Telefoon, Email, Webformulier, SocialeMedia, ContactWebsite, OfferteaanvraagWebsite }
public enum LeadStatus { Nieuw, Gekwalificeerd, Omgezet, Verloren }
public enum OfferteStatus { Nieuw, Verzonden, Goedgekeurd, Geweigerd, Verlopen }
public enum OrderStatus { Aangemaakt, InProductie, ExterneBehandeling, KlaarVoorMontage, Gemonteerd, Afgesloten, Geannuleerd }
public enum BtwTarief { P0, P6, P21 }
public enum OnderdeelStatus { Besteld, InProductie, Voorbehandeling, Lakwerk, KlaarVoorMontage, Gemonteerd }
public enum LeverancierType { Voorbehandeling, Lakwerk, Product }
public enum Projectfase
{
    Voorbereiding, Draadafsluiting,
    [NpgsqlTypes.PgName("plaatsing_1")] Plaatsing1,
    [NpgsqlTypes.PgName("plaatsing_2")] Plaatsing2,
    Automatisering
}
public enum WerkbonStatus { Open, Uitgevoerd, KlantGetekend, VerwerktInFacturatie }
public enum ServicedossierStatus { Gemeld, Ingepland, Uitgevoerd, Afgesloten }
public enum WerkbonType
{
    [NpgsqlTypes.PgName("plaatsing_1")] Plaatsing1,
    [NpgsqlTypes.PgName("plaatsing_2")] Plaatsing2,
    Interventie
}
public enum OpvolgtaakStatus { Open, Uitgevoerd, Vervallen }
public enum OpvolgtaakType { NaOpmeting, NaOfferte, LeadOpvolging }
public enum WebsiteContentStatus { Concept, Gepubliceerd, Gearchiveerd }
public enum ArtikelEenheid { Stuk, LopendeMeter, VierkanteMeter }
public enum CommunicatieStatus { Gelogd, Verzonden, Mislukt }
