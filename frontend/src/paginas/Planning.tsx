import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, weergaveNaam } from '../lib/formaat'
import type { MedewerkerKeuze, PlanningsItemRij, PloegRij, Projectfase } from '../lib/types'
import { Invoer, Knop, Melding, Modaal, PaginaKop, Selecteer, Selectievak, TekstVak } from '../ui'

/* TS-08: de centrale planning per week. De planner plant fases in met een
   medewerker of ploeg; iedereen leest mee (FR-010). */

export const faseTekst: Record<string, string> = {
  voorbereiding: 'Voorbereiding', draadafsluiting: 'Draadafsluiting',
  plaatsing1: 'Plaatsing 1', plaatsing2: 'Plaatsing 2', automatisering: 'Automatisering'
}
const faseOpties = Object.entries(faseTekst) as [Projectfase, string][]
const statusKleur: Record<string, string> = {
  gepland: 'border-inkt/15 bg-vlak-surface',
  bevestigd: 'border-bronze-500/50 bg-bronze-500/10',
  uitgevoerd: 'border-olive-500/50 bg-olive-500/10'
}

function maandagVan(d: Date) {
  const kopie = new Date(d)
  kopie.setDate(kopie.getDate() - ((kopie.getDay() + 6) % 7))
  kopie.setHours(0, 0, 0, 0)
  return kopie
}
const iso = (d: Date) => d.toISOString().slice(0, 10)

export default function Planning() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [start, zetStart] = useState(() => maandagVan(new Date()))
  const dagen = [...Array(7)].map((_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d })
  const van = iso(dagen[0]); const tot = iso(dagen[6])

  const { data: items } = useQuery({
    queryKey: ['planning', van, tot],
    queryFn: () => api.get<PlanningsItemRij[]>(`/planning?van=${van}&tot=${tot}`)
  })
  const { data: medewerkers } = useQuery({
    queryKey: ['medewerker-overzicht'],
    queryFn: () => api.get<MedewerkerKeuze[]>('/medewerkers/overzicht'), staleTime: 5 * 60 * 1000
  })
  const { data: ploegen } = useQuery({ queryKey: ['ploegen'], queryFn: () => api.get<PloegRij[]>('/ploegen') })
  const { data: projecten } = useQuery({
    queryKey: ['projecten-keuze'],
    queryFn: () => api.get<{ id: string; nummer?: number; werfadres: string; klant: { naam: string; voornaam?: string; bedrijfsnaam?: string } }[]>('/projecten'),
    staleTime: 60 * 1000
  })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['planning'] }) }
  const bijFout = (f: unknown) => zetFout((f as Error).message)

  const leegVorm = { projectId: '', fase: 'voorbereiding' as Projectfase, toewijzing: '', geplandeDatum: '', status: 'gepland', benodigdeMaterialen: '', klantafspraken: '' }
  const [open, zetOpen] = useState(false)
  const [bewerkId, zetBewerkId] = useState<string | null>(null)
  const [vorm, zetVorm] = useState(leegVorm)
  function openNieuw(dag?: string) { zetBewerkId(null); zetVorm({ ...leegVorm, geplandeDatum: dag ?? van }); zetOpen(true) }
  function openBewerk(item: PlanningsItemRij) {
    zetBewerkId(item.id)
    zetVorm({
      projectId: item.projectId, fase: item.fase,
      toewijzing: item.ploegId ? `ploeg:${item.ploegId}` : (item.medewerkerId ? `medewerker:${item.medewerkerId}` : ''),
      geplandeDatum: item.geplandeDatum, status: item.status,
      benodigdeMaterialen: item.benodigdeMaterialen ?? '', klantafspraken: item.klantafspraken ?? ''
    })
    zetOpen(true)
  }
  const bewaar = useMutation({
    mutationFn: () => {
      const [soort, id] = vorm.toewijzing.split(':')
      const payload = {
        projectId: vorm.projectId, fase: vorm.fase,
        medewerkerId: soort === 'medewerker' ? id : null,
        ploegId: soort === 'ploeg' ? id : null,
        geplandeDatum: vorm.geplandeDatum, status: vorm.status,
        benodigdeMaterialen: vorm.benodigdeMaterialen || null,
        klantafspraken: vorm.klantafspraken || null
      }
      return bewerkId ? api.patch(`/planning/${bewerkId}`, payload) : api.post('/planning', payload)
    },
    onSuccess: () => { ververs(); zetOpen(false) },
    onError: bijFout
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/planning/${id}`),
    onSuccess: () => { ververs(); zetOpen(false) },
    onError: bijFout
  })

  // Ploegbeheer
  const [ploegOpen, zetPloegOpen] = useState(false)
  const [ploegBewerkId, zetPloegBewerkId] = useState<string | null>(null)
  const [ploegVorm, zetPloegVorm] = useState<{ naam: string; leden: string[] }>({ naam: '', leden: [] })
  function openPloegNieuw() { zetPloegBewerkId(null); zetPloegVorm({ naam: '', leden: [] }); zetPloegOpen(true) }
  function openPloegBewerk(p: PloegRij) { zetPloegBewerkId(p.id); zetPloegVorm({ naam: p.naam, leden: [...p.leden] }); zetPloegOpen(true) }
  const bewaarPloeg = useMutation({
    mutationFn: () => ploegBewerkId
      ? api.put(`/ploegen/${ploegBewerkId}`, { naam: ploegVorm.naam, leden: ploegVorm.leden })
      : api.post('/ploegen', { naam: ploegVorm.naam, leden: ploegVorm.leden }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ploegen'] }); zetPloegOpen(false) },
    onError: bijFout
  })

  const weekTekst = `${datum(van)} tot ${datum(tot)}`
  return (
    <>
      <PaginaKop eyebrow="Planning · centraal" titel="Planning"
        actie={<div className="flex gap-2">
          <Knop variant="ghost" onClick={openPloegNieuw}>Ploegen</Knop>
          <Knop variant="primair" onClick={() => openNieuw()}>Inplannen ↗</Knop>
        </div>} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="mb-4 flex items-center justify-between">
        <Knop variant="ghost" onClick={() => zetStart(s => { const d = new Date(s); d.setDate(d.getDate() - 7); return d })}>← Vorige week</Knop>
        <div className="text-sm font-semibold text-inkt">{weekTekst}</div>
        <Knop variant="ghost" onClick={() => zetStart(s => { const d = new Date(s); d.setDate(d.getDate() + 7); return d })}>Volgende week →</Knop>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dagen.map(dag => {
          const sleutel = iso(dag)
          const vandaag = sleutel === iso(new Date())
          const dagItems = (items ?? []).filter(i => i.geplandeDatum === sleutel)
          return (
            <div key={sleutel} className={clsx('min-h-[180px] rounded-control border p-2',
              vandaag ? 'border-bronze-500/60 bg-bronze-500/[.06]' : 'border-inkt/10 bg-vlak-surface/60')}>
              <button type="button" onClick={() => openNieuw(sleutel)}
                className="focusring mb-2 w-full rounded-control px-1 py-0.5 text-left text-xs font-bold uppercase tracking-[0.1em] text-inkt-muted hover:text-inkt">
                {new Intl.DateTimeFormat('nl-BE', { weekday: 'short', day: '2-digit', month: 'short' }).format(dag)}
              </button>
              <div className="space-y-1.5">
                {dagItems.map(item => (
                  <button key={item.id} type="button" onClick={() => openBewerk(item)}
                    className={clsx('focusring block w-full rounded-control border px-2 py-1.5 text-left text-xs transition hover:border-bronze-500', statusKleur[item.status])}>
                    <div className="font-semibold">{item.project.nummer ? `${item.project.nummer} · ` : ''}{weergaveNaam(item.project.klant)}</div>
                    <div className="text-inkt-muted">{faseTekst[item.fase]} · {item.toegewezene}</div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modaal open={open} titel={bewerkId ? 'Planningsitem bewerken' : 'Inplannen'} onSluit={() => zetOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaar.mutate() }}>
          <Selecteer label="Dossier" value={vorm.projectId} onChange={e => zetVorm({ ...vorm, projectId: e.target.value })} required>
            <option value="">Kies een dossier…</option>
            {projecten?.map(p => <option key={p.id} value={p.id}>{p.nummer ? `${p.nummer} · ` : ''}{weergaveNaam(p.klant)} · {p.werfadres}</option>)}
          </Selecteer>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Fase" value={vorm.fase} onChange={e => zetVorm({ ...vorm, fase: e.target.value as Projectfase })}>
              {faseOpties.map(([w, t]) => <option key={w} value={w}>{t}</option>)}
            </Selecteer>
            <Invoer label="Datum" type="date" value={vorm.geplandeDatum} onChange={e => zetVorm({ ...vorm, geplandeDatum: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Toewijzing" value={vorm.toewijzing} onChange={e => zetVorm({ ...vorm, toewijzing: e.target.value })} required>
              <option value="">Kies medewerker of ploeg…</option>
              {(ploegen ?? []).filter(p => p.isActief).map(p => <option key={p.id} value={`ploeg:${p.id}`}>Ploeg · {p.naam}</option>)}
              {(medewerkers ?? []).map(m => <option key={m.id} value={`medewerker:${m.id}`}>{m.naam}</option>)}
            </Selecteer>
            <Selecteer label="Status" value={vorm.status} onChange={e => zetVorm({ ...vorm, status: e.target.value })}>
              <option value="gepland">Gepland</option>
              <option value="bevestigd">Bevestigd</option>
              <option value="uitgevoerd">Uitgevoerd</option>
            </Selecteer>
          </div>
          <TekstVak label="Benodigde materialen" optioneel value={vorm.benodigdeMaterialen}
            onChange={e => zetVorm({ ...vorm, benodigdeMaterialen: e.target.value })} />
          <TekstVak label="Klantafspraken" optioneel value={vorm.klantafspraken}
            onChange={e => zetVorm({ ...vorm, klantafspraken: e.target.value })} />
          <div className="flex items-center justify-between gap-2">
            {bewerkId
              ? <Knop type="button" variant="destructief" onClick={() => verwijder.mutate(bewerkId)}>Verwijderen</Knop>
              : <span />}
            <div className="flex gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetOpen(false)}>Annuleren</Knop>
              <Knop variant="primair" disabled={bewaar.isPending || !vorm.projectId || !vorm.toewijzing || !vorm.geplandeDatum}>
                {bewaar.isPending ? 'Bezig…' : 'Opslaan'}
              </Knop>
            </div>
          </div>
        </form>
      </Modaal>

      <Modaal open={ploegOpen} titel={ploegBewerkId ? 'Ploeg bewerken' : 'Ploegen'} onSluit={() => zetPloegOpen(false)}>
        <div className="space-y-4">
          {!ploegBewerkId && (ploegen ?? []).length > 0 && (
            <div className="space-y-2">
              {(ploegen ?? []).map(p => (
                <button key={p.id} type="button" onClick={() => openPloegBewerk(p)}
                  className="focusring flex w-full items-center justify-between rounded-control border border-inkt/10 bg-vlak-surface px-3 py-2 text-left text-sm hover:border-bronze-500">
                  <span className="font-semibold">{p.naam}</span>
                  <span className="text-xs text-inkt-muted">{p.leden.length} leden</span>
                </button>
              ))}
              <div className="border-t border-inkt/10 pt-3 text-xs font-bold uppercase tracking-[0.14em] text-inkt-muted">Nieuwe ploeg</div>
            </div>
          )}
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarPloeg.mutate() }}>
            <Invoer label="Naam" value={ploegVorm.naam} onChange={e => zetPloegVorm({ ...ploegVorm, naam: e.target.value })} required />
            <div>
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Leden</div>
              <div className="space-y-2">
                {(medewerkers ?? []).map(m => (
                  <Selectievak key={m.id} checked={ploegVorm.leden.includes(m.id)}
                    onChange={aan => zetPloegVorm({ ...ploegVorm, leden: aan ? [...ploegVorm.leden, m.id] : ploegVorm.leden.filter(l => l !== m.id) })}>
                    {m.naam}
                  </Selectievak>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetPloegOpen(false)}>Sluiten</Knop>
              <Knop variant="primair" disabled={bewaarPloeg.isPending || !ploegVorm.naam.trim()}>
                {bewaarPloeg.isPending ? 'Bezig…' : (ploegBewerkId ? 'Opslaan' : 'Ploeg aanmaken')}
              </Knop>
            </div>
          </form>
        </div>
      </Modaal>
    </>
  )
}
