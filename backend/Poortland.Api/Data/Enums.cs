namespace Poortland.Api.Data;

// Spiegels van de Postgres enum types (TS-01 sectie 4).
public enum Rol { Verkoop, Planning, Productie, Montage, Boekhouding, Beheerder, Systeem }
public enum KlantType { Particulier, Bedrijf }
public enum Taal { Nl, Fr, En }
public enum LeadKanaal { Telefoon, Email, Webformulier, SocialeMedia, ContactWebsite, OfferteaanvraagWebsite }
public enum LeadStatus { Nieuw, Gekwalificeerd, Omgezet, Verloren }
// Prijsraming (nog zonder plaatsbezoek) of definitieve offerte (feedback 2026-09-13)
// Koopjes uit voorraad en vacatures op de website (migratie 0046).
public enum KoopjeStatus { Concept, Zichtbaar, Verkocht, Verborgen }
public enum VacatureStatus { Concept, Zichtbaar, Gesloten }

// Losse foto-inzending via de publieke pagina /fotos (migratie 0044).
public enum FotoberichtStatus { Nieuw, Behandeld }

public enum OfferteSoort { Prijsraming, Offerte }
public enum OfferteStatus { Nieuw, Verzonden, Goedgekeurd, Geweigerd, Verlopen }
public enum OrderStatus { Aangemaakt, InProductie, ExterneBehandeling, KlaarVoorMontage, Gemonteerd, Afgesloten, Geannuleerd }
public enum BtwTarief { P0, P6, P21 }
public enum OnderdeelStatus { Besteld, InProductie, Voorbehandeling, Lakwerk, KlaarVoorMontage, Gemonteerd }
public enum LeverancierType { Voorbehandeling, Lakwerk, Product }
// Sinds migratie 0042 één generieke fase plaatsing: meerdere plaatsingen
// worden meerdere planningsitems met dezelfde fase.
public enum Projectfase { Voorbereiding, Draadafsluiting, Plaatsing, Automatisering }
public enum WerkbonStatus { Open, Uitgevoerd, KlantGetekend, VerwerktInFacturatie }
public enum ServicedossierStatus { Gemeld, Ingepland, Uitgevoerd, Afgesloten }
// De vier types van de Leverings en Servicebon (LSB). Plaatsingen zijn
// onbeperkt in aantal; het volgnummer staat in werkbon.plaatsing_nummer.
public enum WerkbonType { Plaatsing, Automatisatie, Onderhoud, Herstelling }
public enum FactuurStatus { Concept, Goedgekeurd, Gefactureerd }
public enum FactuurSoort { Voorschot, Eind }
public enum FactuurregelBron { Offerte, Meerwerk, Handmatig }
public enum OpvolgtaakStatus { Open, Uitgevoerd, Vervallen }
public enum OpvolgtaakType { NaOpmeting, NaOfferte, LeadOpvolging }
public enum WebsiteContentStatus { Concept, Gepubliceerd, Gearchiveerd }
public enum ArtikelEenheid { Stuk, LopendeMeter, VierkanteMeter }
public enum CommunicatieStatus { Gelogd, Verzonden, Mislukt }
