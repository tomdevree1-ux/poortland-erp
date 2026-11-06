import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, weergaveNaam } from '../lib/formaat'
import type { MedewerkerKeuze, PlanningsItemRij, PloegRij, Projectfase } from '../lib/types'
import { Invoer, Knop, Melding, Modaal, PaginaKop, Selecteer, Selectievak, TekstVak } from '../ui'

/* TS-08: de centrale planning per week. De planner plant fases in met een
   medewerker of ploeg; iedereen leest mee (FR-010). */

// Eén generieke fase plaatsing: meerdere plaatsingen plan je in als
// meerdere items met deze fase (zelfde lijn als de werkbonnen).
export const faseTekst: Record<string, string> = {
  voorbereiding: 'Voorbereiding', draadafsluiting: 'Draadafsluiting',
  plaatsing: 'Plaatsing', automatisering: 'Automatisering'
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
// Lokale datum als iso, nooit via UTC (anders verschuift de dag in de zomertijd).
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const plusDagen = (d: Date, n: number) => { const k = new Date(d); k.setDate(k.getDate() + n); return k }

type Weergave = 'week' | 'bord' | 'maand' | 'dag'

export default function Planning() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [weergave, zetWeergave] = useState<Weergave>('week')
  const [start, zetStart] = useState(() => maandagVan(new Date()))
  const [maand, zetMaand] = useState(() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d })
  const dagen = [...Array(7)].map((_, i) => plusDagen(start, i))

  // De periode volgt de weergave; alles leest dezelfde planningsdata. Het
  // maandraster dekt ook de randdagen van de buurmaanden (zoals in een agenda-app).
  const vandaag = new Date(); vandaag.setHours(0, 0, 0, 0)
  const maandEerste = new Date(maand.getFullYear(), maand.getMonth(), 1)
  const maandEinde = new Date(maand.getFullYear(), maand.getMonth() + 1, 0)
  const rasterStart = maandagVan(maandEerste)
  const wekenNodig = Math.ceil((((maandEerste.getDay() + 6) % 7) + maandEinde.getDate()) / 7)
  const [van, tot] = weergave === 'maand'
    ? [iso(rasterStart), iso(plusDagen(rasterStart, wekenNodig * 7 - 1))]
    : weergave === 'dag'
      ? [iso(vandaag), iso(plusDagen(vandaag, 1))]
      : [iso(dagen[0]), iso(dagen[6])]

  const { data: items } = useQuery({
    queryKey: ['planning', van, tot],
    queryFn: () => api.get<PlanningsItemRij[]>(`/planning?van=${van}&tot=${tot}`)
  })
  const { data: medewerkers } = useQuery({
    queryKey: ['medewerker-overzicht'],
    queryFn: () => api.get<MedewerkerKeuze[]>('/medewerkers/overzicht'), staleTime: 5 * 60 * 1000
  })
  const { data: ploegen } = useQuery({ queryKey: ['ploegen'], queryFn: () => api.get<PloegRij[]>('/ploegen'), staleTime: 5 * 60 * 1000 })
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
  function openNieuw(dag?: string, toewijzing?: string) {
    zetBewerkId(null)
    zetVorm({ ...leegVorm, geplandeDatum: dag ?? van, toewijzing: toewijzing ?? '' })
    zetOpen(true)
  }
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
  const maandTekst = new Intl.DateTimeFormat('nl-BE', { month: 'long', year: 'numeric' }).format(maand)

  function ItemKaart({ item, groot }: { item: PlanningsItemRij; groot?: boolean }) {
    return (
      <button type="button" onClick={() => openBewerk(item)}
        className={clsx('focusring block w-full rounded-control border text-left transition hover:border-bronze-500',
          statusKleur[item.status], groot ? 'px-4 py-3 text-sm' : 'px-2 py-1.5 text-xs')}>
        <div className="font-semibold">{item.project.nummer ? `${item.project.nummer} · ` : ''}{weergaveNaam(item.project.klant)}</div>
        <div className="text-inkt-muted">{faseTekst[item.fase]} · {item.toegewezene}</div>
        {groot && (
          <div className="mt-1.5 space-y-0.5 text-xs text-inkt-muted">
            <div>{item.project.werfadres}</div>
            {item.benodigdeMaterialen && <div>Materialen: {item.benodigdeMaterialen}</div>}
            {item.klantafspraken && <div>Afspraken: {item.klantafspraken}</div>}
          </div>
        )}
      </button>
    )
  }

  // Planbordrijen: eerst de actieve ploegen, dan de medewerkers. Een medewerker
  // telt ook mee wanneer zijn ploeg is ingepland, zodat dubbelboeking opvalt.
  const bordRijen = [
    ...(ploegen ?? []).filter(p => p.isActief).map(p => ({
      sleutel: `ploeg:${p.id}`, naam: `Ploeg · ${p.naam}`,
      vanItem: (i: PlanningsItemRij) => i.ploegId === p.id
    })),
    ...(medewerkers ?? []).map(m => ({
      sleutel: `medewerker:${m.id}`, naam: m.naam,
      vanItem: (i: PlanningsItemRij) => i.medewerkerId === m.id
        || (i.ploegId != null && (ploegen ?? []).some(p => p.id === i.ploegId && p.leden.includes(m.id)))
    }))
  ]

  return (
    <>
      <PaginaKop eyebrow="Planning · centraal" titel="Planning"
        actie={<div className="flex gap-2">
          <Knop variant="ghost" onClick={openPloegNieuw}>Ploegen</Knop>
          <Knop variant="primair" onClick={() => openNieuw()}>Inplannen ↗</Knop>
        </div>} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex gap-1 rounded-control border border-inkt/10 p-1">
          {([['week', 'Week'], ['bord', 'Planbord'], ['maand', 'Maand'], ['dag', 'Vandaag']] as [Weergave, string][]).map(([w, t]) => (
            <button key={w} type="button" onClick={() => zetWeergave(w)}
              className={clsx('focusring rounded-[6px] px-3 py-1.5 text-sm font-semibold transition',
                weergave === w ? 'bg-bronze-500 text-forest-950' : 'text-inkt-muted hover:text-inkt')}>
              {t}
            </button>
          ))}
        </div>
        {weergave === 'maand' ? (
          <div className="flex items-center gap-2">
            <Knop variant="ghost" onClick={() => zetMaand(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>←</Knop>
            <div className="w-44 text-center text-sm font-semibold capitalize text-inkt">{maandTekst}</div>
            <Knop variant="ghost" onClick={() => zetMaand(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>→</Knop>
          </div>
        ) : weergave !== 'dag' ? (
          <div className="flex items-center gap-2">
            <Knop variant="ghost" onClick={() => zetStart(s => plusDagen(s, -7))}>← Vorige</Knop>
            <div className="text-sm font-semibold text-inkt">{weekTekst}</div>
            <Knop variant="ghost" onClick={() => zetStart(s => plusDagen(s, 7))}>Volgende →</Knop>
          </div>
        ) : <div className="text-sm font-semibold text-inkt">Vandaag en morgen</div>}
      </div>

      {weergave === 'week' && (
        <div className="grid grid-cols-7 gap-2">
          {dagen.map(dag => {
            const sleutel = iso(dag)
            const isVandaag = sleutel === iso(new Date())
            const dagItems = (items ?? []).filter(i => i.geplandeDatum === sleutel)
            return (
              <div key={sleutel} className={clsx('min-h-[180px] rounded-control border p-2',
                isVandaag ? 'border-bronze-500/60 bg-bronze-500/[.06]' : 'border-inkt/10 bg-vlak-surface/60')}>
                <button type="button" onClick={() => openNieuw(sleutel)}
                  className="focusring mb-2 w-full rounded-control px-1 py-0.5 text-left text-xs font-bold uppercase tracking-[0.1em] text-inkt-muted hover:text-inkt">
                  {new Intl.DateTimeFormat('nl-BE', { weekday: 'short', day: '2-digit', month: 'short' }).format(dag)}
                </button>
                <div className="space-y-1.5">
                  {dagItems.map(item => <ItemKaart key={item.id} item={item} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {weergave === 'bord' && (
        <div className="overflow-x-auto rounded-control border border-inkt/10">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-vlak-canvas px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.1em] text-inkt-muted">Wie</th>
                {dagen.map(dag => (
                  <th key={iso(dag)} className={clsx('px-2 py-2 text-left text-xs font-bold uppercase tracking-[0.1em]',
                    iso(dag) === iso(new Date()) ? 'text-bronze-600' : 'text-inkt-muted')}>
                    {new Intl.DateTimeFormat('nl-BE', { weekday: 'short', day: '2-digit' }).format(dag)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bordRijen.map(rij => (
                <tr key={rij.sleutel} className="border-t border-inkt/[.06]">
                  <td className="sticky left-0 whitespace-nowrap border-t border-inkt/[.06] bg-vlak-canvas px-3 py-2 font-semibold">{rij.naam}</td>
                  {dagen.map(dag => {
                    const sleutel = iso(dag)
                    const celItems = (items ?? []).filter(i => i.geplandeDatum === sleutel && rij.vanItem(i))
                    const dubbel = celItems.length > 1
                    return (
                      <td key={sleutel} className="min-w-32 border-t border-inkt/[.06] p-1 align-top">
                        <div className={clsx('min-h-12 space-y-1 rounded-control p-1',
                          dubbel && 'border border-corten-500/60 bg-corten-500/[.07]')}
                          title={dubbel ? 'Dubbel geboekt op deze dag' : undefined}>
                          {celItems.map(item => <ItemKaart key={item.id} item={item} />)}
                          {celItems.length === 0 && (
                            <button type="button" onClick={() => openNieuw(sleutel, rij.sleutel)} aria-label="Inplannen"
                              className="focusring h-11 w-full rounded-control text-inkt-faint transition hover:bg-bronze-500/[.08] hover:text-bronze-600">+</button>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {weergave === 'maand' && (() => {
        // Naar het patroon van een agenda-app: elke dag toont de afspraken als
        // compacte balkjes in statuskleur, met een "+N meer" bij overloop.
        const cellen = [...Array(wekenNodig * 7)].map((_, i) => plusDagen(rasterStart, i))
        const maxPerDag = 3
        const statusBalk: Record<string, string> = {
          gepland: 'border-inkt/10 bg-inkt/[.05] text-inkt-body',
          bevestigd: 'border-bronze-500/30 bg-bronze-500/15 text-bronze-600',
          uitgevoerd: 'border-olive-500/30 bg-olive-500/15 text-olive-600'
        }
        return (
          <div className="overflow-hidden rounded-card border border-inkt/10 bg-vlak-surface/40">
            <div className="grid grid-cols-7 border-b border-inkt/10 bg-vlak-surface/80">
              {['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'].map(d => (
                <div key={d} className="px-2 py-2 text-xs font-bold uppercase tracking-[0.1em] text-inkt-muted">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cellen.map((dag, i) => {
                const sleutel = iso(dag)
                const inMaand = dag.getMonth() === maand.getMonth()
                const isVandaag = sleutel === iso(new Date())
                const dagItems = (items ?? []).filter(it => it.geplandeDatum === sleutel)
                const zichtbaar = dagItems.slice(0, maxPerDag)
                const rest = dagItems.length - zichtbaar.length
                return (
                  <div key={sleutel}
                    className={clsx('min-h-28 border-b border-inkt/[.07] p-1.5',
                      i % 7 !== 0 && 'border-l',
                      !inMaand && 'bg-vlak-sunken/30')}>
                    <button type="button" onClick={() => openNieuw(sleutel)} aria-label={`Inplannen op ${sleutel}`}
                      className={clsx('focusring cijfers mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition',
                        isVandaag ? 'bg-bronze-500 text-forest-950'
                          : inMaand ? 'text-inkt hover:bg-bronze-500/15' : 'text-inkt-faint hover:bg-bronze-500/10')}>
                      {dag.getDate()}
                    </button>
                    <div className="space-y-1">
                      {zichtbaar.map(item => (
                        <button key={item.id} type="button" onClick={() => openBewerk(item)}
                          title={`${item.project.nummer ? `${item.project.nummer} · ` : ''}${weergaveNaam(item.project.klant)} · ${faseTekst[item.fase]} · ${item.toegewezene}${item.project.werfadres ? ` · ${item.project.werfadres}` : ''}`}
                          className={clsx('focusring block w-full truncate rounded-[4px] border px-1.5 py-0.5 text-left text-[11px] font-medium transition hover:border-bronze-500',
                            statusBalk[item.status], !inMaand && 'opacity-60')}>
                          {item.project.nummer ? `${item.project.nummer} · ` : ''}{weergaveNaam(item.project.klant)} · {faseTekst[item.fase]}
                        </button>
                      ))}
                      {rest > 0 && (
                        <button type="button" onClick={() => { zetStart(maandagVan(dag)); zetWeergave('week') }}
                          className="focusring block w-full rounded-[4px] px-1.5 py-0.5 text-left text-[11px] font-semibold text-bronze-600 transition hover:bg-bronze-500/10">
                          +{rest} meer
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {weergave === 'dag' && (
        <div className="grid grid-cols-2 gap-6">
          {[vandaag, plusDagen(vandaag, 1)].map((dag, i) => {
            const sleutel = iso(dag)
            const dagItems = (items ?? []).filter(it => it.geplandeDatum === sleutel)
            return (
              <div key={sleutel}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-inkt-muted">
                  {i === 0 ? 'Vandaag' : 'Morgen'} · {new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: '2-digit', month: 'long' }).format(dag)}
                </h2>
                {dagItems.length === 0 ? (
                  <p className="text-sm text-inkt-muted">Niets ingepland.</p>
                ) : (
                  <div className="space-y-2">
                    {dagItems.map(item => <ItemKaart key={item.id} item={item} groot />)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

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
