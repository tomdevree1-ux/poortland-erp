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
public enum OpvolgtaakStatus { Open, Uitgevoerd, Vervallen }
public enum OpvolgtaakType { NaOpmeting, NaOfferte, LeadOpvolging }
public enum WebsiteContentStatus { Concept, Gepubliceerd, Gearchiveerd }
public enum ArtikelEenheid { Stuk, LopendeMeter, VierkanteMeter }
public enum CommunicatieStatus { Gelogd, Verzonden, Mislukt }
