// Bedragen rechts en tabulair, lege cel is een liggend streepje (huisstijlgids blad 06).
export const euro = (bedrag?: number | null) =>
  bedrag === undefined || bedrag === null
    ? '—'
    : new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' }).format(bedrag)

export const datum = (iso?: string | null) =>
  iso ? new Intl.DateTimeFormat('nl-BE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso)) : '—'

export const leeg = (waarde?: string | null) => (waarde && waarde.trim() !== '' ? waarde : '—')
