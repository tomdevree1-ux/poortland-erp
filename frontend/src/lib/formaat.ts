// Bedragen rechts en tabulair, lege cel is een liggend streepje (huisstijlgids blad 06).
export const euro = (bedrag?: number | null) =>
  bedrag === undefined || bedrag === null
    ? '—'
    : new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(bedrag)

export const datum = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—'

export const leeg = (waarde?: string | null) => (waarde && waarde.trim() !== '' ? waarde : '—')

// Gegevensregel Poortland: naam en voornaam altijd gescheiden opslaan
// en samen tonen als voornaam plus naam.
export const persoon = (voornaam?: string | null, naam?: string | null) =>
  [voornaam, naam].filter(Boolean).join(' ')

// Weergavenaam van een klant of lead: het bedrijf indien gekend, anders de persoon.
export const weergaveNaam = (k?: { bedrijfsnaam?: string | null; voornaam?: string | null; naam?: string | null } | null) =>
  k ? (k.bedrijfsnaam && k.bedrijfsnaam.trim() ? k.bedrijfsnaam : persoon(k.voornaam, k.naam)) : ''

// Relatieve tijd voor notificaties: zonet, 5 minuten geleden, 2 uur geleden,
// gisteren, 3 dagen geleden en ouder dan een week gewoon de datum.
export const relatieveTijd = (iso?: string | null) => {
  if (!iso) return ''
  const verschilMs = Date.now() - new Date(iso).getTime()
  const minuten = Math.floor(verschilMs / 60_000)
  if (minuten < 1) return 'zonet'
  if (minuten === 1) return '1 minuut geleden'
  if (minuten < 60) return `${minuten} minuten geleden`
  const uren = Math.floor(minuten / 60)
  if (uren === 1) return '1 uur geleden'
  if (uren < 24) return `${uren} uur geleden`
  const dagen = Math.floor(uren / 24)
  if (dagen === 1) return 'gisteren'
  if (dagen < 7) return `${dagen} dagen geleden`
  return datum(iso)
}
