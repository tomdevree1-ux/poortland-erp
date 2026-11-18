/* De regels achter de vinkjes in het globaal overzicht (Tom 2026-11-18).
   Een regel komt op precies een Leverings en Servicebon (LSB). Plaatsing staat
   als laatste kolom en kan meerdere keren voorkomen. Los van het scherm zodat
   ze zonder knoppen te testen zijn. */

export type LsbType = 'plaatsing' | 'automatisatie' | 'onderhoud' | 'herstelling'
export type Kolom = { type: LsbType; nummer?: number; titel: string }
type MetLsb = { lsbType?: LsbType | null; lsbPlaatsingNummer?: number | null }

// De kolommen: eerst de vaste LSB's, dan de plaatsingen.
export function lsbKolommen(plaatsingen: number): Kolom[] {
  const vast: Kolom[] = [
    { type: 'automatisatie', titel: 'Automatisatie' },
    { type: 'herstelling', titel: 'Herstelling' },
    { type: 'onderhoud', titel: 'Onderhoud' }
  ]
  const p: Kolom[] = Array.from({ length: Math.max(1, plaatsingen) }, (_, i) =>
    ({ type: 'plaatsing', nummer: i + 1, titel: plaatsingen > 1 ? `Plaatsing ${i + 1}` : 'Plaatsing' }))
  return [...vast, ...p]
}
export const opKolom = (r: MetLsb, k: Kolom) =>
  r.lsbType === k.type && (k.type !== 'plaatsing' || r.lsbPlaatsingNummer === k.nummer)

// Een vinkje zetten op een andere kolom haalt het van de vorige weg; hetzelfde
// vinkje opnieuw aanklikken laat de regel zonder LSB.
export function kiesKolom(r: MetLsb, k: Kolom) {
  if (opKolom(r, k)) return { lsbType: null, lsbPlaatsingNummer: null }
  return { lsbType: k.type, lsbPlaatsingNummer: k.type === 'plaatsing' ? k.nummer! : null }
}

