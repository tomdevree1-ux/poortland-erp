// Spiegels van de backend contracten (bouwspec 6.6).
export type LeadStatus = 'nieuw' | 'gekwalificeerd' | 'omgezet' | 'verloren'
export type LeadKanaal = 'telefoon' | 'email' | 'webformulier' | 'socialeMedia' | 'contactWebsite' | 'offerteaanvraagWebsite'
export type OfferteStatus = 'nieuw' | 'verzonden' | 'goedgekeurd' | 'geweigerd' | 'verlopen'
export type OrderStatus = 'aangemaakt' | 'inProductie' | 'externeBehandeling' | 'klaarVoorMontage' | 'gemonteerd' | 'afgesloten' | 'geannuleerd'
export type BtwTarief = 'p0' | 'p6' | 'p21'
export type Eenheid = 'stuk' | 'lopendeMeter' | 'vierkanteMeter'
export type ContentStatus = 'concept' | 'gepubliceerd' | 'gearchiveerd'
export type Rol = 'verkoop' | 'planning' | 'productie' | 'montage' | 'boekhouding' | 'beheerder'

export interface LeadFoto { id: string; bestandsnaam: string; url: string }
export interface Lead {
  id: string; kanaal: LeadKanaal; status: LeadStatus; eigenaarId: string
  naam?: string; voornaam?: string; email?: string; telefoon?: string; eersteVraag?: string
  prijsindicatie?: number; opvolgdatum?: string; verliesReden?: string
  omgezetProjectId?: string; aangemaaktOp: string
  typeAanvraag?: string; klantType?: string; bedrijfsnaam?: string; btwNummer?: string
  straat?: string; postcode?: string; gemeente?: string; gewensteTiming?: string
  privacyAkkoord?: boolean; privacyAkkoordOp?: string; wizardGegevens?: string
  gearchiveerdOp?: string
  fotos?: LeadFoto[]
}
export interface Klant {
  id: string; type: 'particulier' | 'bedrijf'; naam: string; voornaam?: string; bedrijfsnaam?: string; btwNummer?: string
  straat?: string; postcode?: string; gemeente?: string; email?: string; telefoon?: string
  communicatietaal: 'nl' | 'fr' | 'en'
}
export interface ProjectRij {
  id: string; nummer?: number; werfadres: string; omschrijving?: string; status: OrderStatus
  garantieMaanden: number; verwachteOpleverdatum?: string; aangemaaktOp: string
  klant: { id: string; naam: string; voornaam?: string; gemeente?: string }; offerteWaarde?: number
}
export interface Offerteregel {
  id?: string; volgnummer?: number; soort: string; artikelId?: string; omschrijving: string
  aantal: number; eenheid: Eenheid; eenheidsprijs: number; kortingBedrag: number
  btw: BtwTarief; totaal?: number
}
export interface Offerte {
  id: string; projectId: string; nummer: string; versieOfferte: number; status: OfferteStatus
  taal: string; geldigTot: string; kortingPercentage: number; kortingBedrag: number
  totaalExclBtw: number; totaalBtw: number; totaalInclBtw: number
  verzondenOp?: string; beslistOp?: string; weigerReden?: string
  regels: Offerteregel[]; aangemaaktOp: string; gewijzigdOp?: string
}
export interface Artikel {
  id: string; code: string; omschrijving: string; eenheid: Eenheid
  basisprijs: number; btwDefault: BtwTarief; isActief: boolean
}
export interface Opvolgtaak {
  id: string; type: string; offerteId?: string; leadId?: string
  dueDatum: string; status: string; omschrijving?: string
}
export interface Media {
  id: string; titel: string; altTekst?: string; categorie?: string; volgnummer: number
  productSoort?: 'poort' | 'overkapping'; poortType?: 'hout' | 'metaal' | 'hout_metaal'
  poortUitvoering?: 'draaipoort' | 'schuifpoort'
  status: ContentStatus; breedte?: number; hoogte?: number
  personenInBeeld: boolean; toestemmingBevestigd: boolean; gepubliceerdOp?: string; voorbeeld?: string
}
export interface Popup {
  id: string; titel: string; bodyTekst: string; actiefVan: string; actiefTot: string; status: ContentStatus
}
export interface Kerncijfers {
  openLeads: number; verzondenOffertes: number; actieveOrders: number
  mijnOpenTaken: number; omzetKwartaal: number
}
export interface MedewerkerKeuze { id: string; naam: string }
export interface MedewerkerRij {
  id: string; naam: string; voornaam?: string; email: string; telefoon?: string; isActief: boolean; rollen: Rol[]
}
