import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../../lib/api'
import { datum } from '../../lib/formaat'
import type { Media, Popup } from '../../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, TekstVak, VuilbakKnop } from '../../ui'

/* Opgesplitst uit Website.tsx (audit 2026-10-05). */

export default function PopupTab() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [bewerkModus, zetBewerkModus] = useState(false)
  const [verwijderOpen, zetVerwijderOpen] = useState(false)
  const { data: popups } = useQuery({ queryKey: ['popup'], queryFn: () => api.get<Popup[]>('/website/popup') })
  const concept = popups?.find(p => p.status === 'concept')
  const actief = popups?.find(p => p.status === 'gepubliceerd')
  const huidig = concept ?? actief // de banner die we tonen en bewerken (ook gepubliceerd)
  const [vorm, zetVorm] = useState<{ titel: string; bodyTekst: string; actiefVan: string; actiefTot: string } | null>(null)
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['popup'] }) }

  function startBewerken() {
    zetVorm({
      titel: huidig?.titel ?? '', bodyTekst: huidig?.bodyTekst ?? '',
      actiefVan: huidig?.actiefVan ?? new Date().toISOString().slice(0, 10),
      actiefTot: huidig?.actiefTot ?? new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)
    })
    zetBewerkModus(true)
  }
  const bewaar = useMutation({
    // Bestaande banner via PATCH (werkt ook op een gepubliceerde), anders een nieuw concept.
    mutationFn: () => huidig
      ? api.patch<Popup>(`/website/popup/${huidig.id}`, vorm)
      : api.put<Popup>('/website/popup', vorm),
    onSuccess: () => { ververs(); zetBewerkModus(false) },
    onError: f => zetFout((f as Error).message)
  })
  const publiceer = useMutation({
    mutationFn: (id: string) => api.post<Popup>(`/website/popup/${id}/publiceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/website/popup/${id}`),
    onSuccess: () => { ververs(); zetVerwijderOpen(false); zetBewerkModus(false) },
    onError: f => zetFout((f as Error).message)
  })

  const voorbeeld = bewerkModus ? vorm : huidig
  return (
    <>
    <div className="grid grid-cols-2 gap-6">
      <Paneel titel="Popup" actie={bewerkModus ? (
        <div className="flex gap-2">
          <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => zetBewerkModus(false)}>Annuleren</Knop>
          <Knop variant="primair" className="h-8 px-3 text-xs" disabled={bewaar.isPending}
            onClick={() => bewaar.mutate()}>Opslaan</Knop>
        </div>
      ) : huidig
        ? <div className="flex gap-1"><PotloodKnop onClick={startBewerken} /><VuilbakKnop onClick={() => zetVerwijderOpen(true)} /></div>
        : <PlusKnop onClick={startBewerken} label="Banner opstellen" />}>
        {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
        {bewerkModus && vorm ? (
          <div className="space-y-4">
            <Invoer label="Titel" maxLength={80} value={vorm.titel}
              onChange={e => zetVorm({ ...vorm, titel: e.target.value })} required />
            <TekstVak label="Bodytekst" maxLength={500} value={vorm.bodyTekst}
              onChange={e => zetVorm({ ...vorm, bodyTekst: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Actief van" type="date" value={vorm.actiefVan}
                onChange={e => zetVorm({ ...vorm, actiefVan: e.target.value })} required />
              <Invoer label="Actief tot" type="date" value={vorm.actiefTot}
                onChange={e => zetVorm({ ...vorm, actiefTot: e.target.value })} required />
            </div>
          </div>
        ) : huidig ? (
          <>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={huidig.status} /></dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Titel</dt><dd className="font-medium">{huidig.titel}</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-inkt-muted">Bodytekst</dt>
                <dd className="max-w-64 text-right">{huidig.bodyTekst}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Periode</dt>
                <dd>{datum(huidig.actiefVan)} tot {datum(huidig.actiefTot)}</dd></div>
            </dl>
            {huidig.status === 'concept' && (
              <div className="mt-4 flex justify-end">
                <Knop variant="primair" onClick={() => publiceer.mutate(huidig.id)}>Publiceren ↗</Knop>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-inkt-muted">Nog geen banner. Klik op het plusteken om er een op te stellen.</p>
        )}
      </Paneel>
      <Paneel titel="Voorbeeld op de website">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card border border-inkt/10 bg-vlak-sunken p-6">
          <div className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 bg-stone2-300 px-3">
            <span className="h-2 w-2 rounded-full bg-inkt/20" /><span className="h-2 w-2 rounded-full bg-inkt/20" /><span className="h-2 w-2 rounded-full bg-inkt/20" />
          </div>
          <div className="w-full max-w-xs rounded-card bg-stone2-50 p-5 shadow-2xl">
            <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">Poortland</div>
            <div className="mt-1 font-display text-xl font-medium text-inkt">{voorbeeld?.titel || 'Titel van de popup'}</div>
            <p className="mt-2 text-sm leading-relaxed text-inkt-muted">{voorbeeld?.bodyTekst || 'De bodytekst verschijnt hier zoals de bezoeker ze ziet.'}</p>
            <div className="mt-4 flex justify-end"><span className="rounded-control bg-bronze-500 px-3 py-1.5 text-xs font-semibold text-stone2-50">Sluiten</span></div>
          </div>
        </div>
      </Paneel>
    </div>
      <Modaal open={verwijderOpen} titel="Banner verwijderen?" onSluit={() => zetVerwijderOpen(false)}>
        <p className="mb-4 text-sm text-inkt-body">
          Dit verwijdert de banner "{huidig?.titel}" en haalt hem indien nodig meteen van de site.
          De audit trail bewaart de historiek.
        </p>
        <div className="flex justify-end gap-2">
          <Knop type="button" variant="ghost" onClick={() => zetVerwijderOpen(false)}>Annuleren</Knop>
          <Knop variant="destructief" disabled={verwijder.isPending}
            onClick={() => huidig && verwijder.mutate(huidig.id)}>Verwijderen</Knop>
        </div>
      </Modaal>
    </>
  )
}
