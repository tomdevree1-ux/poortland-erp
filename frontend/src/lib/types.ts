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
  communicatietaal: 'nl' | 'fr' | 'en'; communicatievoorkeur?: string
}
export interface ProjectRij {
  id: string; nummer?: number; werfadres: string; omschrijving?: string; status: OrderStatus
  garantieMaanden: number; verwachteOpleverdatum?: string; aangemaaktOp: string
  klant: { id: string; naam: string; voornaam?: string; bedrijfsnaam?: string; gemeente?: string }; offerteWaarde?: number
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
  poortUitvoering?: 'draaipoort' | 'schuifpoort'; modelNaam?: string
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

// TS-09 veld en werkbon
export interface WerkbonRegelRij {
  id: string; soort: 'uitgevoerd_werk' | 'materiaal' | 'meerwerk'
  omschrijving: string; aantal?: number; eenheid?: string; afwijkingVanStuklijst: boolean
}
export interface WerkbonFotoRij {
  id: string; moment: 'voor' | 'na'; bestandsnaam: string; gpsLat?: number; gpsLon?: number
  aangemaaktOp: string; url?: string
}
export interface WerkbonRij {
  id: string; projectId: string; plaatserId: string
  type: 'plaatsing1' | 'plaatsing2' | 'interventie'
  status: 'open' | 'uitgevoerd' | 'klantGetekend' | 'verwerktInFacturatie'
  uitvoeringsdatum?: string; urenBegin?: string; urenEinde?: string; opmerkingen?: string
  getekendOp?: string; handtekeningUrl?: string; plaatser: string
  project?: { id: string; nummer?: number; werfadres: string; klant: { naam: string; voornaam?: string; bedrijfsnaam?: string } }
  regels: WerkbonRegelRij[]
  fotos: WerkbonFotoRij[]
}

// TS-08 planning
export type Projectfase = 'voorbereiding' | 'draadafsluiting' | 'plaatsing1' | 'plaatsing2' | 'automatisering'
export interface PlanningsItemRij {
  id: string; projectId: string; fase: Projectfase; geplandeDatum: string
  status: 'gepland' | 'bevestigd' | 'uitgevoerd'
  benodigdeMaterialen?: string; klantafspraken?: string
  medewerkerId?: string; ploegId?: string; toegewezene: string
  project: { id: string; nummer?: number; werfadres: string; klant: { naam: string; voornaam?: string; bedrijfsnaam?: string } }
}
export interface PloegRij { id: string; naam: string; isActief: boolean; leden: string[] }
export interface NotificatieRij {
  id: string; type: string; titel: string; boodschap?: string
  entiteitType?: string; entiteitId?: string; gelezenOp?: string; aangemaaktOp: string
}

// TS-11 service en nazorg
export type ServiceStatus = 'gemeld' | 'ingepland' | 'uitgevoerd' | 'afgesloten'
export interface ServiceRij {
  id: string; status: ServiceStatus; garantieIndicatie: boolean; klacht?: string
  gemeldOp: string; geplandOp?: string; techniekerId?: string; technieker?: string
  klant: { id: string; naam: string; voornaam?: string; bedrijfsnaam?: string; telefoon?: string; gemeente?: string }
  project?: { id: string; nummer?: number; werfadres: string; garantieMaanden: number } | null
}

// TS-12 rapportering
export interface RapportOverzicht {
  maanden: { maand: string; omzet: number; leads: number; omgezet: number }[]
  leadconversie: number; totaalLeads: number; totaalOmgezet: number
  gemiddeldeDoorlooptijd?: number | null
  orderStatussen: { status: OrderStatus; aantal: number }[]
  serviceOpen: number; werkbonnenOpen: number
}

// TS-10 facturatievoorbereiding
export type FactuurStatus = 'concept' | 'goedgekeurd' | 'gefactureerd'
export type FactuurSoort = 'voorschot' | 'eind'
export interface FactuurKlaarRij {
  id: string; nummer?: number; werfadres: string; status: OrderStatus
  klant: { naam: string; voornaam?: string; bedrijfsnaam?: string }
  offerteTotaal: number; werkbonGetekend: boolean; meerwerkRegels: number
  voorstellen: { id: string; soort: FactuurSoort; status: FactuurStatus; totaalInclBtw: number; exactNummer?: string }[]
}
export interface FactuurRegelRij {
  id: string; volgnummer: number; bron: 'offerte' | 'meerwerk' | 'handmatig'
  omschrijving: string; aantal: number; eenheid?: string; eenheidsprijs: number; btw: BtwTarief; totaal: number
}
export interface FactuurVoorstelRij {
  id: string; soort: FactuurSoort; status: FactuurStatus
  totaalExclBtw: number; totaalInclBtw: number; exactNummer?: string
  goedgekeurdOp?: string; gefactureerdOp?: string; aangemaaktOp: string
  project: { id: string; nummer?: number; werfadres: string }
  klant: { naam: string; voornaam?: string; bedrijfsnaam?: string }
}
export interface FactuurVoorstelDetail {
  id: string; soort: FactuurSoort; status: FactuurStatus; afwijkingBevestigd: boolean
  totaalExclBtw: number; totaalBtw: number; totaalInclBtw: number
  exactNummer?: string; goedgekeurdOp?: string; gefactureerdOp?: string
  offerteTotaal?: number | null; afwijkingVanOfferte: boolean
  project: { id: string; nummer?: number; werfadres: string }
  klant: { naam: string; voornaam?: string; bedrijfsnaam?: string; btwNummer?: string }
  regels: FactuurRegelRij[]
}

// TS-07 productie en stuklijst
export type OnderdeelStatus = 'besteld' | 'inProductie' | 'voorbehandeling' | 'lakwerk' | 'klaarVoorMontage' | 'gemonteerd'
export interface Leverancier { id: string; naam: string; type: 'voorbehandeling' | 'lakwerk' | 'product'; email?: string; telefoon?: string }
export interface Onderdeel {
  id: string; stuklijstId: string; productcode: string; omschrijving?: string; afmetingen?: string; materiaal?: string
  status: OnderdeelStatus
  voorbehandelingVanToepassing: boolean; lakwerkVanToepassing: boolean
  leverancierVoorbehandelingId?: string; leverancierLakwerkId?: string
  lakwerkRal?: string; etaVoorbehandeling?: string; etaLakwerk?: string
}
export interface TekeningRij { id: string; tekeningVersie: number; datum: string; bestandsnaam: string; auteur?: string; url?: string }
export interface ProductieData {
  stuklijst?: { id: string; versieStuklijst: number; datumOpmaak: string } | null
  onderdelen: Onderdeel[]
  productieStatus: 'inVoorbereiding' | 'inUitvoering' | 'externInBehandeling' | 'klaarVoorMontage' | 'afgerond'
  vorigeVersies: { id: string; versieStuklijst: number; datumOpmaak: string }[]
  tekeningen: TekeningRij[]
  leveranciers: Leverancier[]
}
