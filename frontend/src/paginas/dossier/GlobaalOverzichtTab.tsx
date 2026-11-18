import { Fragment, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { Plus } from 'lucide-react'
import { api } from '../../lib/api'
import { datum } from '../../lib/formaat'
import ArtikelKiezer, { type ArtikelKeuze } from '../../ArtikelKiezer'
import { type Kolom, type LsbType, kiesKolom, lsbKolommen, opKolom } from './lsb'
import { Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, Th, Td, VuilbakKnop } from '../../ui'

/* Samenstelling van een dossier (migratie 0051, Tom 2026-11-18).
   Links de subprojecten met hun onderdelen en vleugelmaten, rechts het globaal
   overzicht in vier rubrieken. Achter elke regel kiest Jef op welke Leverings
   en Servicebon (LSB) ze komt; Plaatsing staat als laatste kolom en Jef kan er
   plaatsingen bijmaken. Een regel komt op precies een LSB. */

type OnderdeelS = { id: string; ouderId?: string | null; naam: string; breedteMm?: number | null; hoogteMm?: number | null }
type Sub = { id: string; naam: string; locatie?: string | null; soort: string; type?: string | null; onderdelen: OnderdeelS[] }
export type Projectregel = {
  id: string; rubriek: Rubriek; subprojectId?: string | null; onderdeelId?: string | null
  artikelId?: string | null; artikelCode?: string | null; omschrijving: string; aantal: number
  opdrachtSoort?: string | null; geplandeDatum?: string | null
  lsbType?: LsbType | null; lsbPlaatsingNummer?: number | null
}
type Samenstelling = {
  lsbPlaatsingen: number; subprojecten: Sub[]; regels: Projectregel[]
  werkbonnen: { id: string; type: LsbType; plaatsingNummer?: number | null; status: string }[]
}
type Rubriek = 'accessoires' | 'automatisering' | 'hekwerk' | 'opdracht'

export const RUBRIEKEN: { sleutel: Rubriek; titel: string }[] = [
  { sleutel: 'accessoires', titel: 'Accessoires' },
  { sleutel: 'automatisering', titel: 'Automatisering' },
  { sleutel: 'hekwerk', titel: 'Hekwerk' },
  { sleutel: 'opdracht', titel: 'Opdracht' }
]
const SOORTEN = [
  { waarde: 'poort', tekst: 'Poort' }, { waarde: 'afsluiting', tekst: 'Afsluiting' },
  { waarde: 'garagepoort', tekst: 'Garagepoort' }, { waarde: 'overkapping', tekst: 'Overkapping' }
]
const OPDRACHTSOORTEN = [
  { waarde: 'plaatsing', tekst: 'Plaatsing' }, { waarde: 'automatisatie', tekst: 'Automatisatie' },
  { waarde: 'herstelling', tekst: 'Herstelling' }
]
// Voorstellen bij een nieuw onderdeel; Jef mag ook een eigen naam typen.
const STANDAARD_ONDERDELEN = ['Vleugel', 'Vleugel links', 'Vleugel rechts', 'Motor links', 'Motor rechts']

function invoerVan(r: Projectregel) {
  return {
    rubriek: r.rubriek, subprojectId: r.subprojectId ?? null, onderdeelId: r.onderdeelId ?? null,
    artikelId: r.artikelId ?? null, omschrijving: r.omschrijving, aantal: r.aantal,
    opdrachtSoort: r.opdrachtSoort ?? null, geplandeDatum: r.geplandeDatum || null,
    lsbType: r.lsbType ?? null, lsbPlaatsingNummer: r.lsbPlaatsingNummer ?? null
  }
}

// Onderdelen als platte lijst met inspringing, de boom volgt ouderId.
function boom(onderdelen: OnderdeelS[], ouder: string | null = null, diepte = 0): { o: OnderdeelS; diepte: number }[] {
  return onderdelen.filter(o => (o.ouderId ?? null) === ouder)
    .flatMap(o => [{ o, diepte }, ...boom(onderdelen, o.id, diepte + 1)])
}
const maat = (o: OnderdeelS) =>
  o.breedteMm || o.hoogteMm ? `${o.breedteMm ?? '?'} x ${o.hoogteMm ?? '?'} mm` : ''

// "Hoort bij" als een waarde: leeg = project, s:<sub>, o:<sub>:<onderdeel>.
const hoortBijWaarde = (r: { subprojectId?: string | null; onderdeelId?: string | null }) =>
  r.onderdeelId ? `o:${r.subprojectId}:${r.onderdeelId}` : r.subprojectId ? `s:${r.subprojectId}` : ''
const hoortBijUit = (w: string) => {
  const [soort, sub, onderdeel] = w.split(':')
  if (soort === 's') return { subprojectId: sub, onderdeelId: null }
  if (soort === 'o') return { subprojectId: sub, onderdeelId: onderdeel }
  return { subprojectId: null, onderdeelId: null }
}

export default function GlobaalOverzichtTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient()
  const sleutel = ['samenstelling', projectId]
  const { data } = useQuery({ queryKey: sleutel, queryFn: () => api.get<Samenstelling>(`/samenstelling/projecten/${projectId}`) })
  const [fout, zetFout] = useState<string>()
  const [melding, zetMelding] = useState<string>()
  const [filter, zetFilter] = useState<string>('')
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: sleutel }) }
  const bijFout = (f: unknown) => zetFout((f as Error).message)

  // ---- subprojecten en onderdelen ----
  const [subOpen, zetSubOpen] = useState<null | { id?: string; naam: string; locatie: string; soort: string; type: string; vleugels: string }>(null)
  const bewaarSub = useMutation({
    mutationFn: () => {
      const v = subOpen!
      const body = { naam: v.naam, locatie: v.locatie || null, soort: v.soort, type: v.type || null, vleugels: v.id ? null : Number(v.vleugels) }
      return v.id ? api.patch(`/samenstelling/subprojecten/${v.id}`, body) : api.post(`/samenstelling/projecten/${projectId}/subprojecten`, body)
    },
    onSuccess: () => { zetSubOpen(null); ververs() }, onError: bijFout
  })
  const verwijderSub = useMutation({
    mutationFn: (id: string) => api.del(`/samenstelling/subprojecten/${id}`),
    onSuccess: () => { if (filter.startsWith('s:')) zetFilter(''); ververs() }, onError: bijFout
  })
  const [onderdeelOpen, zetOnderdeelOpen] = useState<null | { id?: string; subprojectId: string; ouderId?: string; naam: string; breedte: string; hoogte: string }>(null)
  const bewaarOnderdeel = useMutation({
    mutationFn: () => {
      const v = onderdeelOpen!
      const body = { naam: v.naam, ouderId: v.ouderId ?? null, breedteMm: v.breedte ? Number(v.breedte) : null, hoogteMm: v.hoogte ? Number(v.hoogte) : null }
      return v.id ? api.patch(`/samenstelling/onderdelen/${v.id}`, body) : api.post(`/samenstelling/subprojecten/${v.subprojectId}/onderdelen`, body)
    },
    onSuccess: () => { zetOnderdeelOpen(null); ververs() }, onError: bijFout
  })
  const verwijderOnderdeel = useMutation({
    mutationFn: (id: string) => api.del(`/samenstelling/onderdelen/${id}`), onSuccess: ververs, onError: bijFout
  })

  // ---- regels ----
  const wijzigRegel = useMutation({
    mutationFn: (r: Projectregel) => api.patch(`/samenstelling/regels/${r.id}`, invoerVan(r)),
    onSuccess: () => { zetBewerk(null); ververs() }, onError: bijFout
  })
  const verwijderRegel = useMutation({
    mutationFn: (id: string) => api.del(`/samenstelling/regels/${id}`), onSuccess: ververs, onError: bijFout
  })
  const plaatsingErbij = useMutation({
    mutationFn: () => api.post(`/samenstelling/projecten/${projectId}/plaatsingen`, {}), onSuccess: ververs, onError: bijFout
  })
  const naarLsb = useMutation({
    mutationFn: () => api.post<{ nieuw: number; zonderBon: number }>(`/samenstelling/projecten/${projectId}/naar-lsb`, {}),
    onSuccess: a => {
      ververs()
      qc.invalidateQueries({ queryKey: ['dossier-werkbonnen', projectId] })
      zetMelding(`${a.nieuw} ${a.nieuw === 1 ? 'regel' : 'regels'} op de LSB gezet.`
        + (a.zonderBon ? ` ${a.zonderBon} ${a.zonderBon === 1 ? 'regel wacht' : 'regels wachten'} op een LSB die nog niet bestaat; ze komen er vanzelf op zodra die LSB aangemaakt wordt.` : ''))
    },
    onError: bijFout
  })
  const [nieuw, zetNieuw] = useState<null | { rubriek: Rubriek; artikel: ArtikelKeuze | null; omschrijving: string; aantal: string; opdrachtSoort: string; geplandeDatum: string; hoortBij: string }>(null)
  const maakRegel = useMutation({
    mutationFn: () => {
      const v = nieuw!
      return api.post(`/samenstelling/projecten/${projectId}/regels`, {
        rubriek: v.rubriek, ...hoortBijUit(v.hoortBij), artikelId: v.artikel?.id ?? null,
        omschrijving: v.omschrijving || null, aantal: Number(v.aantal.replace(',', '.')) || 1,
        opdrachtSoort: v.rubriek === 'opdracht' ? (v.opdrachtSoort || null) : null,
        geplandeDatum: v.rubriek === 'opdracht' ? (v.geplandeDatum || null) : null,
        lsbType: null, lsbPlaatsingNummer: null
      })
    },
    onSuccess: () => { zetNieuw(null); ververs() }, onError: bijFout
  })
  const [bewerk, zetBewerk] = useState<Projectregel | null>(null)

  if (!data) return null
  const kolommen = lsbKolommen(data.lsbPlaatsingen)
  const bonBestaat = (k: Kolom) => data.werkbonnen.some(b => b.type === k.type && (k.type !== 'plaatsing' || b.plaatsingNummer === k.nummer))
  const subNaam = (id?: string | null) => data.subprojecten.find(s => s.id === id)?.naam
  const onderdeelNaam = (r: Projectregel) =>
    data.subprojecten.flatMap(s => s.onderdelen).find(o => o.id === r.onderdeelId)?.naam
  const hoortBijOpties = [
    { waarde: '', tekst: 'Hele project' },
    ...data.subprojecten.flatMap(s => [
      { waarde: `s:${s.id}`, tekst: s.naam },
      ...boom(s.onderdelen).map(({ o }) => ({ waarde: `o:${s.id}:${o.id}`, tekst: `${s.naam} · ${o.naam}` }))
    ])
  ]
  const zichtbaar = data.regels.filter(r => !filter || r.subprojectId === filter.slice(2))
  const telPerSub = (id: string) => data.regels.filter(r => r.subprojectId === id).length

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
      {fout && <div className="xl:col-span-2"><Melding soort="fout">{fout}</Melding></div>}

      <Paneel titel="Subprojecten" actie={<PlusKnop label="Subproject toevoegen"
        onClick={() => zetSubOpen({ naam: '', locatie: '', soort: 'poort', type: '', vleugels: '0' })} />}>
        {data.subprojecten.length === 0 ? (
          <p className="text-sm text-inkt-muted">Nog geen subprojecten. Voeg er een toe per poort, afsluiting of overkapping, bijvoorbeeld poort oprit en poort tuin.</p>
        ) : (
          <ul className="space-y-4">
            {data.subprojecten.map(s => (
              <li key={s.id} className="rounded-control border border-inkt/[.08] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-inkt">{s.naam}</div>
                    <div className="text-xs text-inkt-muted">
                      {[SOORTEN.find(x => x.waarde === s.soort)?.tekst, s.type, s.locatie].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="flex">
                    <PotloodKnop onClick={() => zetSubOpen({ id: s.id, naam: s.naam, locatie: s.locatie ?? '', soort: s.soort, type: s.type ?? '', vleugels: '0' })} />
                    <VuilbakKnop onClick={() => { if (confirm(`${s.naam} verwijderen? De regels blijven op het project staan.`)) verwijderSub.mutate(s.id) }} />
                  </div>
                </div>
                <ul className="mt-2 space-y-1">
                  {boom(s.onderdelen).map(({ o, diepte }) => (
                    <li key={o.id} className="group flex items-center justify-between gap-2 text-sm" style={{ paddingLeft: diepte * 16 }}>
                      <span className="text-inkt-body">{o.naam}
                        {maat(o) && <span className="ml-2 cijfers text-xs text-inkt-muted">{maat(o)}</span>}</span>
                      <span className="flex opacity-60 group-hover:opacity-100">
                        <PlusKnop label="Onderdeel eronder" onClick={() => zetOnderdeelOpen({ subprojectId: s.id, ouderId: o.id, naam: '', breedte: '', hoogte: '' })} />
                        <PotloodKnop onClick={() => zetOnderdeelOpen({ id: o.id, subprojectId: s.id, naam: o.naam, breedte: o.breedteMm?.toString() ?? '', hoogte: o.hoogteMm?.toString() ?? '' })} />
                        <VuilbakKnop onClick={() => verwijderOnderdeel.mutate(o.id)} />
                      </span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => zetOnderdeelOpen({ subprojectId: s.id, naam: '', breedte: '', hoogte: '' })}
                  className="focusring mt-2 flex w-full items-center justify-center gap-1.5 rounded-control border border-dashed border-inkt/25 py-1.5 text-xs font-semibold text-inkt-muted hover:border-bronze-500 hover:text-bronze-600">
                  <Plus size={14} /> Onderdeel</button>
              </li>
            ))}
          </ul>
        )}
      </Paneel>

      <div className="min-w-0 space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {[{ waarde: '', tekst: `Hele project (${data.regels.length})` },
            ...data.subprojecten.map(s => ({ waarde: `s:${s.id}`, tekst: `${s.naam} (${telPerSub(s.id)})` }))].map(f => (
            <button key={f.waarde} type="button" onClick={() => zetFilter(f.waarde)}
              className={clsx('focusring h-8 rounded-control border px-3 text-sm font-semibold',
                filter === f.waarde ? 'border-bronze-500 bg-bronze-500/10 text-bronze-600' : 'border-inkt/15 text-inkt-muted hover:text-inkt')}>
              {f.tekst}</button>
          ))}
          <span className="ml-auto flex gap-2">
            <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => plaatsingErbij.mutate()} disabled={plaatsingErbij.isPending}>
              <Plus size={14} /> Plaatsing</Knop>
            <Knop variant="primair" className="h-8 px-3 text-xs" onClick={() => naarLsb.mutate()} disabled={naarLsb.isPending}>
              Naar de LSB's zetten</Knop>
          </span>
        </div>
        {melding && <Melding soort="ok">{melding}</Melding>}

        {RUBRIEKEN.map(rb => {
          const regels = zichtbaar.filter(r => r.rubriek === rb.sleutel)
          const opdracht = rb.sleutel === 'opdracht'
          return (
            <Paneel key={rb.sleutel} titel={`${rb.titel} (${regels.length})`}>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead><tr>
                    <Th>Code</Th><Th rechts>Aantal</Th><Th>Omschrijving</Th><Th>Hoort bij</Th>
                    {opdracht && <><Th>Soort</Th><Th>Gepland</Th></>}
                    {kolommen.map(k => (
                      <Th key={`${k.type}${k.nummer ?? ''}`}>
                        <span title={bonBestaat(k) ? 'Deze LSB bestaat al' : 'Deze LSB is nog niet aangemaakt'}
                          className={clsx('whitespace-nowrap', bonBestaat(k) && 'text-bronze-600')}>{k.titel}</span>
                      </Th>
                    ))}
                    <Th />
                  </tr></thead>
                  <tbody>
                    {regels.map(r => {
                      const b = bewerk?.id === r.id ? bewerk : null
                      return (
                        <tr key={r.id}>
                          <Td className="whitespace-nowrap font-mono text-xs text-inkt-muted">{r.artikelCode ?? ''}</Td>
                          <Td rechts>{b
                            ? <input value={String(b.aantal)} onChange={e => zetBewerk({ ...b, aantal: Number(e.target.value.replace(',', '.')) || 0 })}
                                className="focusring h-8 w-16 rounded-control border border-inkt/15 bg-vlak-surface px-2 text-right text-sm" />
                            : r.aantal}</Td>
                          <Td className="min-w-56">{b
                            ? <input value={b.omschrijving} onChange={e => zetBewerk({ ...b, omschrijving: e.target.value })}
                                className="focusring h-8 w-full rounded-control border border-inkt/15 bg-vlak-surface px-2 text-sm" />
                            : r.omschrijving}</Td>
                          <Td className="min-w-40 text-inkt-muted">{b
                            ? <Selecteer klein value={hoortBijWaarde(b)} onChange={e => zetBewerk({ ...b, ...hoortBijUit(e.target.value) })}>
                                {hoortBijOpties.map(o => <option key={o.waarde} value={o.waarde}>{o.tekst}</option>)}</Selecteer>
                            : [subNaam(r.subprojectId), onderdeelNaam(r)].filter(Boolean).join(' · ') || 'Hele project'}</Td>
                          {opdracht && <>
                            <Td className="min-w-36">{b
                              ? <Selecteer klein value={b.opdrachtSoort ?? ''} onChange={e => zetBewerk({ ...b, opdrachtSoort: e.target.value || null })}>
                                  <option value="">Geen</option>
                                  {OPDRACHTSOORTEN.map(o => <option key={o.waarde} value={o.waarde}>{o.tekst}</option>)}</Selecteer>
                              : OPDRACHTSOORTEN.find(o => o.waarde === r.opdrachtSoort)?.tekst ?? ''}</Td>
                            <Td className="whitespace-nowrap">{b
                              ? <input type="date" value={b.geplandeDatum ?? ''} onChange={e => zetBewerk({ ...b, geplandeDatum: e.target.value || null })}
                                  className="focusring h-8 rounded-control border border-inkt/15 bg-vlak-surface px-2 text-sm" />
                              : r.geplandeDatum ? datum(r.geplandeDatum) : 'Geen datum'}</Td>
                          </>}
                          {kolommen.map(k => {
                            const aan = opKolom(r, k)
                            return (
                              <Td key={`${k.type}${k.nummer ?? ''}`} className="text-center">
                                <button type="button" aria-pressed={aan} aria-label={`${r.omschrijving} op LSB ${k.titel}`}
                                  disabled={wijzigRegel.isPending}
                                  onClick={() => wijzigRegel.mutate({ ...r, ...kiesKolom(r, k) })}
                                  className={clsx('focusring inline-flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border text-[11px] font-bold transition',
                                    aan ? 'border-bronze-500 bg-bronze-500 text-stone2-50' : 'border-inkt/25 text-transparent hover:border-bronze-500')}>
                                  ✓</button>
                              </Td>
                            )
                          })}
                          <Td className="whitespace-nowrap">
                            {b ? (
                              <span className="flex gap-1">
                                <Knop variant="primair" className="h-8 px-3 text-xs" disabled={wijzigRegel.isPending}
                                  onClick={() => wijzigRegel.mutate(b)}>Opslaan</Knop>
                                <Knop variant="ghost" className="h-8 px-2 text-xs" onClick={() => zetBewerk(null)}>Annuleren</Knop>
                              </span>
                            ) : (
                              <span className="flex">
                                <PotloodKnop onClick={() => zetBewerk(r)} />
                                <VuilbakKnop onClick={() => verwijderRegel.mutate(r.id)} />
                              </span>
                            )}
                          </Td>
                        </tr>
                      )
                    })}
                    {nieuw?.rubriek === rb.sleutel && (
                      <tr>
                        <td colSpan={99} className="border-b border-inkt/[.06] bg-bronze-500/[.04] px-3 py-2.5 text-sm">
                          <NieuweRegel waarde={nieuw} zet={zetNieuw} opdracht={opdracht} hoortBijOpties={hoortBijOpties}
                            bezig={maakRegel.isPending} onBewaar={() => maakRegel.mutate()} onAnnuleer={() => zetNieuw(null)} />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {nieuw?.rubriek !== rb.sleutel && (
                <button type="button"
                  onClick={() => zetNieuw({ rubriek: rb.sleutel, artikel: null, omschrijving: '', aantal: '1', opdrachtSoort: '', geplandeDatum: '', hoortBij: filter })}
                  className="focusring mt-3 flex w-full items-center justify-center gap-1.5 rounded-control border border-dashed border-inkt/25 py-2 text-sm font-semibold text-inkt-muted hover:border-bronze-500 hover:text-bronze-600">
                  <Plus size={15} /> Toevoegen</button>
              )}
            </Paneel>
          )
        })}
      </div>

      <Modaal open={!!subOpen} titel={subOpen?.id ? 'Subproject bewerken' : 'Subproject toevoegen'} onSluit={() => zetSubOpen(null)}>
        {subOpen && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarSub.mutate() }}>
            <Invoer label="Naam" required value={subOpen.naam} placeholder="Poort oprit"
              onChange={e => zetSubOpen({ ...subOpen, naam: e.target.value })} />
            <Invoer label="Locatie" optioneel value={subOpen.locatie} placeholder="Oprit vooraan"
              onChange={e => zetSubOpen({ ...subOpen, locatie: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Selecteer label="Soort" value={subOpen.soort} onChange={e => zetSubOpen({ ...subOpen, soort: e.target.value })}>
                {SOORTEN.map(s => <option key={s.waarde} value={s.waarde}>{s.tekst}</option>)}
              </Selecteer>
              <Invoer label="Type" optioneel value={subOpen.type} placeholder="Dubbele draaipoort"
                onChange={e => zetSubOpen({ ...subOpen, type: e.target.value })} />
            </div>
            {!subOpen.id && (
              <Selecteer label="Vleugels klaarzetten" value={subOpen.vleugels} onChange={e => zetSubOpen({ ...subOpen, vleugels: e.target.value })}>
                <option value="0">Geen</option>
                <option value="1">Enkele poort: een vleugel</option>
                <option value="2">Dubbele poort: vleugel links en vleugel rechts</option>
              </Selecteer>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Knop type="button" variant="ghost" onClick={() => zetSubOpen(null)}>Annuleren</Knop>
              <Knop type="submit" variant="primair" disabled={bewaarSub.isPending}>Opslaan</Knop>
            </div>
          </form>
        )}
      </Modaal>

      <Modaal open={!!onderdeelOpen} titel={onderdeelOpen?.id ? 'Onderdeel bewerken' : 'Onderdeel toevoegen'} onSluit={() => zetOnderdeelOpen(null)}>
        {onderdeelOpen && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarOnderdeel.mutate() }}>
            <Invoer label="Naam" required list="standaard-onderdelen" value={onderdeelOpen.naam} placeholder="Vleugel links"
              onChange={e => zetOnderdeelOpen({ ...onderdeelOpen, naam: e.target.value })} />
            <datalist id="standaard-onderdelen">
              {STANDAARD_ONDERDELEN.map(n => <option key={n} value={n} />)}
            </datalist>
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Breedte (mm)" optioneel inputMode="numeric" value={onderdeelOpen.breedte} placeholder="1800"
                onChange={e => zetOnderdeelOpen({ ...onderdeelOpen, breedte: e.target.value.replace(/\D/g, '') })} />
              <Invoer label="Hoogte (mm)" optioneel inputMode="numeric" value={onderdeelOpen.hoogte} placeholder="1906"
                onChange={e => zetOnderdeelOpen({ ...onderdeelOpen, hoogte: e.target.value.replace(/\D/g, '') })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Knop type="button" variant="ghost" onClick={() => zetOnderdeelOpen(null)}>Annuleren</Knop>
              <Knop type="submit" variant="primair" disabled={bewaarOnderdeel.isPending}>Opslaan</Knop>
            </div>
          </form>
        )}
      </Modaal>
    </div>
  )
}

type NieuwVorm = { rubriek: Rubriek; artikel: ArtikelKeuze | null; omschrijving: string; aantal: string; opdrachtSoort: string; geplandeDatum: string; hoortBij: string }
function NieuweRegel({ waarde, zet, opdracht, hoortBijOpties, bezig, onBewaar, onAnnuleer }: {
  waarde: NieuwVorm; zet: (v: NieuwVorm) => void; opdracht: boolean
  hoortBijOpties: { waarde: string; tekst: string }[]; bezig: boolean; onBewaar: () => void; onAnnuleer: () => void
}) {
  const kanBewaren = opdracht ? !!(waarde.artikel || waarde.omschrijving.trim()) : !!waarde.artikel
  return (
    <form className="grid grid-cols-1 gap-3 py-1 md:grid-cols-6" onSubmit={e => { e.preventDefault(); if (kanBewaren) onBewaar() }}>
      <div className="md:col-span-2">
        <ArtikelKiezer label={opdracht ? 'Artikel (mag leeg)' : 'Artikel'} waarde={waarde.artikel}
          onKies={a => zet({ ...waarde, artikel: a, omschrijving: a && !waarde.omschrijving ? a.naam : waarde.omschrijving })} />
      </div>
      <Invoer label="Omschrijving" className="md:col-span-2" value={waarde.omschrijving}
        placeholder={opdracht ? 'Plaatsen hekwerk' : 'Naam van het artikel, aan te vullen'}
        onChange={e => zet({ ...waarde, omschrijving: e.target.value })} />
      <Invoer label="Aantal" inputMode="decimal" value={waarde.aantal} onChange={e => zet({ ...waarde, aantal: e.target.value })} />
      <Selecteer label="Hoort bij" value={waarde.hoortBij} onChange={e => zet({ ...waarde, hoortBij: e.target.value })}>
        {hoortBijOpties.map(o => <option key={o.waarde} value={o.waarde}>{o.tekst}</option>)}
      </Selecteer>
      {opdracht && <Fragment>
        <Selecteer label="Soort" value={waarde.opdrachtSoort} onChange={e => zet({ ...waarde, opdrachtSoort: e.target.value })}>
          <option value="">Geen</option>
          {OPDRACHTSOORTEN.map(o => <option key={o.waarde} value={o.waarde}>{o.tekst}</option>)}
        </Selecteer>
        <Invoer label="Gepland" optioneel type="date" value={waarde.geplandeDatum} onChange={e => zet({ ...waarde, geplandeDatum: e.target.value })} />
      </Fragment>}
      <p className="text-xs text-inkt-faint md:col-span-6">De omschrijving geldt enkel voor dit dossier. Het artikel in de artikeldatabase blijft ongewijzigd.</p>
      <div className="flex justify-end gap-2 md:col-span-6">
        <Knop type="button" variant="ghost" onClick={onAnnuleer}>Annuleren</Knop>
        <Knop type="submit" variant="primair" disabled={bezig || !kanBewaren}>Toevoegen</Knop>
      </div>
    </form>
  )
}
