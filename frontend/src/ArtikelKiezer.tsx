import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { api } from './lib/api'
import { VeldLabel } from './ui'

/* Zoekveld dat een artikel uit de catalogus oplevert. De catalogus telt 910
   regels, dus de lijst komt uit de databank en niet uit het geheugen van de
   browser. Op de werf telt elke tik, dus het veld zoekt vanzelf na 300 ms en
   toont hoogstens tien treffers. */

export type ArtikelKeuze = {
  id: string; code: string; naam: string
  eenheid: 'stuk' | 'lopende_meter' | 'vierkante_meter'
  merk?: string; categorie2?: string
}
type Antwoord = { aantal: number; rijen: ArtikelKeuze[] }

export const eenheidKort: Record<ArtikelKeuze['eenheid'], string> = {
  stuk: 'stuk', lopende_meter: 'm', vierkante_meter: 'm2'
}

export default function ArtikelKiezer({ waarde, onKies, label = 'Artikel' }: {
  waarde: ArtikelKeuze | null
  onKies: (a: ArtikelKeuze | null) => void
  label?: string
}) {
  const [term, zetTerm] = useState('')
  const [traag, zetTraag] = useState('')
  const [open, zetOpen] = useState(false)
  const wortel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => zetTraag(term.trim()), 300)
    return () => clearTimeout(t)
  }, [term])

  // Klik naast de lijst sluit ze, net als bij de andere keuzevelden.
  useEffect(() => {
    if (!open) return
    const buiten = (e: MouseEvent) => {
      if (wortel.current && !wortel.current.contains(e.target as Node)) zetOpen(false)
    }
    document.addEventListener('mousedown', buiten)
    return () => document.removeEventListener('mousedown', buiten)
  }, [open])

  const { data, isFetching } = useQuery({
    queryKey: ['artikel-zoek', traag],
    queryFn: () => api.get<Antwoord>(`/artikelen?zoek=${encodeURIComponent(traag)}&pagina=0`),
    enabled: traag.length >= 2,
    staleTime: 60_000
  })
  const treffers = (data?.rijen ?? []).slice(0, 10)

  if (waarde) {
    return (
      <div>
        <VeldLabel>{label}</VeldLabel>
        <div className="flex items-center gap-2 rounded-control border border-inkt/15 bg-vlak-surface px-3 py-2">
          <span className="font-mono text-xs text-inkt-muted">{waarde.code}</span>
          <span className="truncate text-sm text-inkt">{waarde.naam}</span>
          <button type="button" aria-label="Artikel loslaten" className="focusring ml-auto text-inkt-muted"
            onClick={() => { onKies(null); zetTerm(''); zetTraag('') }}>
            <X size={15} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={wortel} className="relative">
      <VeldLabel optioneel>{label}</VeldLabel>
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-inkt-faint" />
        <input
          value={term}
          onChange={e => { zetTerm(e.target.value); zetOpen(true) }}
          onFocus={() => zetOpen(true)}
          placeholder="Zoek op naam, code of merk"
          className="focusring h-10 w-full rounded-control border border-inkt/15 bg-vlak-surface pl-9 pr-3 text-[15px] text-inkt placeholder:text-inkt-faint"
        />
      </div>
      {open && term.trim().length >= 2 && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-control border border-inkt/15 bg-stone2-50 shadow-lg">
          {isFetching && !treffers.length && (
            <p className="px-3 py-2 text-sm text-inkt-muted">Bezig met zoeken…</p>
          )}
          {!isFetching && !treffers.length && (
            <p className="px-3 py-2 text-sm text-inkt-muted">Niets gevonden. Typ gewoon een omschrijving.</p>
          )}
          {treffers.map(a => (
            <button key={a.id} type="button"
              className="focusring flex w-full items-baseline gap-2 border-b border-inkt/[.06] px-3 py-2 text-left last:border-0 hover:bg-vlak-surface"
              onClick={() => { onKies(a); zetOpen(false); zetTerm('') }}>
              <span className="font-mono text-xs text-inkt-muted">{a.code}</span>
              <span className="truncate text-sm text-inkt">{a.naam}</span>
              <span className="ml-auto whitespace-nowrap text-xs text-inkt-faint">
                {a.merk ?? a.categorie2 ?? ''}
              </span>
            </button>
          ))}
          {(data?.aantal ?? 0) > treffers.length && (
            <p className="px-3 py-1.5 text-xs text-inkt-faint">
              {data!.aantal} treffers, verfijn je zoekterm.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
