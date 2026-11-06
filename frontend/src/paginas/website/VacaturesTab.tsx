import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { api } from '../../lib/api'
import { Badge, Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, TekstVak, VuilbakKnop } from '../../ui'

/* Vacatures op de website (overleg 2026-10-05). Vrije blokken met een kop en
   opsommingspunten, zodat een vacature kan groeien zonder databankwijziging.
   Solliciteren gebeurt per mail, er worden geen cv's bewaard. */

type Blok = { kop: string; punten: string[] }
type Vacature = {
  id: string
  titel: string
  intro?: string
  blokken: string | Blok[]
  status: 'concept' | 'zichtbaar' | 'gesloten'
  volgnummer: number
}
type Vorm = { titel: string; intro: string; blokken: { kop: string; punten: string }[] }

const standaardBlokken = [
  { kop: 'Taken', punten: '' },
  { kop: 'Skills', punten: '' },
  { kop: 'Opleiding', punten: '' },
  { kop: 'Wij bieden', punten: '' }
]
const leegVorm = (): Vorm => ({ titel: '', intro: '', blokken: standaardBlokken.map(b => ({ ...b })) })

function leesBlokken(ruw: string | Blok[]): Blok[] {
  if (Array.isArray(ruw)) return ruw
  try { return JSON.parse(ruw || '[]') } catch { return [] }
}

export default function VacaturesTab() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [vorm, zetVorm] = useState<Vorm>(leegVorm())
  const [open, zetOpen] = useState<string | 'nieuw' | null>(null)
  const [verwijderId, zetVerwijderId] = useState<string | null>(null)

  const { data: vacatures } = useQuery({ queryKey: ['vacatures'], queryFn: () => api.get<Vacature[]>('/vacatures') })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['vacatures'] }) }
  const faal = (f: unknown) => zetFout(f instanceof Error ? f.message : 'Er ging iets mis.')
  const naarInvoer = () => ({
    titel: vorm.titel.trim(),
    intro: vorm.intro.trim() || null,
    blokken: vorm.blokken.map(b => ({
      kop: b.kop.trim(),
      punten: b.punten.split('\n').map(p => p.trim()).filter(Boolean)
    }))
  })

  const bewaar = useMutation({
    mutationFn: () => open === 'nieuw'
      ? api.post<Vacature>('/vacatures', naarInvoer())
      : api.put<Vacature>(`/vacatures/${open}`, naarInvoer()),
    onSuccess: () => { ververs(); zetOpen(null) }, onError: faal
  })
  const zetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vacature['status'] }) =>
      api.patch(`/vacatures/${id}/status`, { status }),
    onSuccess: ververs, onError: faal
  })
  const verplaats = useMutation({
    mutationFn: ({ id, richting }: { id: string; richting: number }) =>
      api.patch(`/vacatures/${id}/volgorde`, { richting }),
    onSuccess: ververs, onError: faal
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/vacatures/${id}`),
    onSuccess: () => { ververs(); zetVerwijderId(null) }, onError: faal
  })

  function startBewerken(v: Vacature) {
    const blokken = leesBlokken(v.blokken)
    zetVorm({
      titel: v.titel, intro: v.intro ?? '',
      blokken: blokken.length
        ? blokken.map(b => ({ kop: b.kop, punten: (b.punten ?? []).join('\n') }))
        : standaardBlokken.map(b => ({ ...b }))
    })
    zetOpen(v.id)
  }

  return (
    <>
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="mb-4 flex items-center justify-between">
        <p className="max-w-[70ch] text-sm text-inkt-muted">
          Vacatures op de pagina Jobs. Zet een vacature op{' '}
          <span className="font-medium text-inkt">zichtbaar</span> om ze online te plaatsen.
          Kandidaten solliciteren per mail, er wordt niets opgeslagen in het ERP.
        </p>
        <PlusKnop label="Vacature toevoegen" onClick={() => { zetVorm(leegVorm()); zetOpen('nieuw') }} />
      </div>

      {!vacatures?.length ? (
        <Paneel titel="Vacatures"><p className="text-sm text-inkt-muted">Nog geen vacatures.</p></Paneel>
      ) : (
        <div className="space-y-3">
          {vacatures.map((v, i) => {
            const blokken = leesBlokken(v.blokken)
            return (
              <Paneel key={v.id} titel={v.titel}
                actie={<>
                  <button type="button" aria-label="Naar boven" className="focusring px-1 text-inkt-muted disabled:opacity-30"
                    disabled={i === 0} onClick={() => verplaats.mutate({ id: v.id, richting: -1 })}><ArrowUp size={15} /></button>
                  <button type="button" aria-label="Naar onder" className="focusring px-1 text-inkt-muted disabled:opacity-30"
                    disabled={i === vacatures.length - 1} onClick={() => verplaats.mutate({ id: v.id, richting: 1 })}><ArrowDown size={15} /></button>
                  <PotloodKnop onClick={() => startBewerken(v)} />
                  <VuilbakKnop onClick={() => zetVerwijderId(v.id)} />
                </>}>
                <div className="mb-2 flex items-center gap-2">
                  <Badge status={v.status} />
                  <span className="text-xs text-inkt-faint">
                    {blokken.length} blok{blokken.length === 1 ? '' : 'ken'} ·{' '}
                    {blokken.reduce((n, b) => n + (b.punten?.length ?? 0), 0)} punten
                  </span>
                </div>
                {v.intro && <p className="mb-2 text-sm text-inkt-body">{v.intro}</p>}
                <div className="flex flex-wrap gap-2 border-t border-inkt/[.07] pt-3">
                  {v.status !== 'zichtbaar' ? (
                    <Knop variant="primair" className="h-8 px-3 text-xs"
                      onClick={() => zetStatus.mutate({ id: v.id, status: 'zichtbaar' })}>Online zetten</Knop>
                  ) : (
                    <Knop variant="ghost" className="h-8 px-3 text-xs"
                      onClick={() => zetStatus.mutate({ id: v.id, status: 'gesloten' })}>Vacature sluiten</Knop>
                  )}
                </div>
              </Paneel>
            )
          })}
        </div>
      )}

      <Modaal open={!!open} titel={open === 'nieuw' ? 'Nieuwe vacature' : 'Vacature bewerken'} onSluit={() => zetOpen(null)}>
        <div className="space-y-3">
          <Invoer label="Titel" placeholder="Monteur of plaatser"
            value={vorm.titel} onChange={e => zetVorm({ ...vorm, titel: e.target.value })} />
          <TekstVak label="Intro" optioneel rows={3}
            placeholder="Een korte inleiding boven de opsommingen."
            value={vorm.intro} onChange={e => zetVorm({ ...vorm, intro: e.target.value })} />
          {vorm.blokken.map((b, i) => (
            <div key={i} className="rounded-control border border-inkt/10 bg-vlak-raised p-3">
              <div className="flex items-center gap-2">
                <Invoer className="flex-1" label={`Blok ${i + 1}`} placeholder="Taken"
                  value={b.kop}
                  onChange={e => zetVorm({ ...vorm, blokken: vorm.blokken.map((x, j) => j === i ? { ...x, kop: e.target.value } : x) })} />
                <button type="button" aria-label="Blok verwijderen"
                  className="focusring mt-5 px-2 text-sm text-corten-600"
                  onClick={() => zetVorm({ ...vorm, blokken: vorm.blokken.filter((_, j) => j !== i) })}>×</button>
              </div>
              <TekstVak label="Punten, een per regel" optioneel rows={4}
                value={b.punten}
                onChange={e => zetVorm({ ...vorm, blokken: vorm.blokken.map((x, j) => j === i ? { ...x, punten: e.target.value } : x) })} />
            </div>
          ))}
          <Knop variant="secundair" className="h-8 px-3 text-xs"
            onClick={() => zetVorm({ ...vorm, blokken: [...vorm.blokken, { kop: '', punten: '' }] })}>
            Blok toevoegen
          </Knop>
        </div>
        <div className="mt-5 flex justify-end gap-2 border-t border-inkt/10 pt-4">
          <Knop variant="ghost" onClick={() => zetOpen(null)}>Annuleren</Knop>
          <Knop variant="primair" disabled={bewaar.isPending} onClick={() => bewaar.mutate()}>Opslaan</Knop>
        </div>
      </Modaal>

      <Modaal open={!!verwijderId} titel="Vacature verwijderen?" onSluit={() => zetVerwijderId(null)}>
        <p className="text-sm text-inkt-body">De vacature verdwijnt van de website.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Knop variant="ghost" onClick={() => zetVerwijderId(null)}>Annuleren</Knop>
          <Knop variant="primair" onClick={() => verwijderId && verwijder.mutate(verwijderId)}>Verwijderen</Knop>
        </div>
      </Modaal>
    </>
  )
}
