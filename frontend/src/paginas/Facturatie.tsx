import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { api, ApiFout } from '../lib/api'
import { supabase } from '../lib/supabase'
import { datum, euro, persoon, weergaveNaam } from '../lib/formaat'
import type { BtwTarief, FactuurKlaarRij, FactuurRegelRij, FactuurVoorstelDetail, FactuurVoorstelRij } from '../lib/types'
import { Badge, Invoer, Knop, LegeStaat, Melding, Modaal, PaginaKop, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, Td, Th, VuilbakKnop, rijKlik } from '../ui'

/* TS-10 Facturatievoorbereiding (FR-014): factuurklare dossiers, het voorstel
   met de vergelijking offerte tegenover uitvoering, de consistentiecontrole
   en het alternatieve exportpad naar Exact Online. */

const soortTekst = { eind: 'Eindfactuur', voorschot: 'Voorschot' } as const
const bronTekst = { offerte: 'Offerte', meerwerk: 'Meerwerk', handmatig: 'Handmatig' } as const

async function downloadExport(id: string) {
  const { data } = await supabase.auth.getSession()
  const antwoord = await fetch(`/api/v1/facturatie/voorstellen/${id}/export`, {
    headers: { Authorization: `Bearer ${data.session?.access_token}` }
  })
  if (!antwoord.ok) return
  const blob = await antwoord.blob()
  const naam = antwoord.headers.get('Content-Disposition')?.match(/filename="?([^";]+)/)?.[1] ?? 'factuurexport.csv'
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = naam; a.click()
  URL.revokeObjectURL(url)
}

export default function Facturatie() {
  const qc = useQueryClient()
  const [actiefId, zetActiefId] = useState<string | null>(null)

  const { data: klaar } = useQuery({
    queryKey: ['factuurklaar'], queryFn: () => api.get<FactuurKlaarRij[]>('/facturatie/factuurklaar')
  })
  const { data: voorstellen } = useQuery({
    queryKey: ['factuurvoorstellen'], queryFn: () => api.get<FactuurVoorstelRij[]>('/facturatie/voorstellen')
  })
  // Verkoop leest mee; alleen boekhouding en beheerder muteren (TS-10 sectie 7).
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ medewerker: { naam: string; voornaam?: string }; rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const magBoekhouden = (mij?.rollen ?? []).some(r => r === 'boekhouding' || r === 'beheerder')

  const ververs = () => {
    qc.invalidateQueries({ queryKey: ['factuurklaar'] })
    qc.invalidateQueries({ queryKey: ['factuurvoorstellen'] })
  }

  const maak = useMutation({
    mutationFn: ({ projectId, soort }: { projectId: string; soort: 'eind' | 'voorschot' }) =>
      api.post<{ id: string }>(`/facturatie/projecten/${projectId}/voorstellen`, { soort }),
    onSuccess: r => { ververs(); zetActiefId(r.id) }
  })

  return (
    <>
      <PaginaKop eyebrow="Boekhouding · facturatie" titel="Facturatie" />

      <Paneel titel="Factuurklare dossiers" className="mb-4">
        {klaar && klaar.length === 0 ? (
          <p className="text-sm text-inkt-muted">
            Nog geen dossiers gemonteerd. Een dossier verschijnt hier zodra de montage rond is.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>
                <Th>Dossier</Th><Th>Klant</Th><Th>Status</Th><Th>Werkbon</Th>
                <Th rechts>Offerte excl btw</Th><Th>Voorstellen</Th><Th /></tr></thead>
              <tbody>
                {klaar?.map(p => (
                  <tr key={p.id} className="border-t border-stone2-200">
                    <Td>
                      <Link to="/dossiers/$projectId" params={{ projectId: p.id }}
                        className="font-semibold text-bronze-600 underline underline-offset-2">
                        {p.nummer ?? '—'}
                      </Link>
                      <p className="text-xs text-inkt-faint">{p.werfadres}</p>
                    </Td>
                    <Td>{weergaveNaam(p.klant)}</Td>
                    <Td><Badge status={p.status} /></Td>
                    <Td>
                      {p.werkbonGetekend
                        ? <span className="text-xs font-semibold text-olive-600">Getekend</span>
                        : <span className="text-xs text-inkt-faint">Nog niet getekend</span>}
                      {p.meerwerkRegels > 0 && (
                        <p className="text-xs font-semibold text-corten-600">{p.meerwerkRegels} meerwerk</p>
                      )}
                    </Td>
                    <Td rechts>{euro(p.offerteTotaal)}</Td>
                    <Td>
                      {p.voorstellen.length === 0 ? <span className="text-xs text-inkt-faint">Geen</span> :
                        p.voorstellen.map(v => (
                          <button key={v.id} type="button" onClick={() => zetActiefId(v.id)} className="mr-1">
                            <Badge status={v.status} />
                          </button>
                        ))}
                    </Td>
                    <Td rechts>
                      {magBoekhouden && (
                        <div className="flex justify-end gap-1.5">
                          <Knop disabled={maak.isPending} onClick={() => maak.mutate({ projectId: p.id, soort: 'voorschot' })}>Voorschot</Knop>
                          <Knop variant="primair" disabled={maak.isPending} onClick={() => maak.mutate({ projectId: p.id, soort: 'eind' })}>Eindfactuur</Knop>
                        </div>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {maak.isError && <div className="mt-2"><Melding soort="fout">{(maak.error as Error).message}</Melding></div>}
      </Paneel>

      <Paneel titel="Factuurvoorstellen">
        {voorstellen && voorstellen.length === 0 ? (
          <LegeStaat titel="Nog geen voorstellen" tekst="Maak een voorschot of eindfactuur vanuit een factuurklaar dossier hierboven." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr>
                <Th>Dossier</Th><Th>Klant</Th><Th>Soort</Th><Th>Status</Th>
                <Th rechts>Incl btw</Th><Th>Exact nummer</Th><Th>Aangemaakt</Th></tr></thead>
              <tbody>
                {voorstellen?.map(v => (
                  <tr key={v.id} className={`border-t border-stone2-200 ${rijKlik}`} onClick={() => zetActiefId(v.id)}>
                    <Td>{v.project.nummer ?? '—'} <span className="text-xs text-inkt-faint">{v.project.werfadres}</span></Td>
                    <Td>{weergaveNaam(v.klant)}</Td>
                    <Td>{soortTekst[v.soort]}</Td>
                    <Td><Badge status={v.status} /></Td>
                    <Td rechts>{euro(v.totaalInclBtw)}</Td>
                    <Td>{v.exactNummer ?? '—'}</Td>
                    <Td>{datum(v.aangemaaktOp)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Paneel>

      {actiefId && <VoorstelDetail id={actiefId} magBoekhouden={magBoekhouden} onSluit={() => zetActiefId(null)} onWijzig={ververs} />}
    </>
  )
}

const legeRegel = { omschrijving: '', aantal: '1', eenheid: '', eenheidsprijs: '0', btw: 'p21' as BtwTarief }

function VoorstelDetail({ id, magBoekhouden, onSluit, onWijzig }: {
  id: string; magBoekhouden: boolean; onSluit: () => void; onWijzig: () => void
}) {
  const qc = useQueryClient()
  const [fout, zetFout] = useState('')
  const [bevestigAfwijking, zetBevestigAfwijking] = useState(false)
  const [bewerkRegel, zetBewerkRegel] = useState<FactuurRegelRij | 'nieuw' | null>(null)
  const [vorm, zetVorm] = useState(legeRegel)
  const [exactNummer, zetExactNummer] = useState('')

  const { data: v } = useQuery({
    queryKey: ['factuurvoorstel', id],
    queryFn: () => api.get<FactuurVoorstelDetail>(`/facturatie/voorstellen/${id}`)
  })

  const klaar = () => {
    qc.invalidateQueries({ queryKey: ['factuurvoorstel', id] })
    onWijzig()
    zetFout('')
    zetBewerkRegel(null)
  }
  const bijFout = (e: Error) => zetFout(e.message)

  const bewaarRegel = useMutation({
    mutationFn: () => {
      const body = {
        omschrijving: vorm.omschrijving, aantal: Number(vorm.aantal) || 1, eenheid: vorm.eenheid || null,
        eenheidsprijs: Number(vorm.eenheidsprijs) || 0, btw: vorm.btw
      }
      return bewerkRegel === 'nieuw'
        ? api.post(`/facturatie/voorstellen/${id}/regels`, body)
        : api.patch(`/facturatie/regels/${(bewerkRegel as FactuurRegelRij).id}`, body)
    },
    onSuccess: klaar, onError: bijFout
  })
  const verwijderRegel = useMutation({
    mutationFn: (regelId: string) => api.del(`/facturatie/regels/${regelId}`),
    onSuccess: klaar, onError: bijFout
  })
  const goedkeuren = useMutation({
    mutationFn: () => api.post(`/facturatie/voorstellen/${id}/goedkeuren`, { afwijkingBevestigd: bevestigAfwijking }),
    onSuccess: klaar,
    onError: (e: Error) => {
      if (e instanceof ApiFout && e.status === 409) zetFout(e.message)
      else bijFout(e)
    }
  })
  const heropen = useMutation({
    mutationFn: () => api.post(`/facturatie/voorstellen/${id}/heropen`),
    onSuccess: klaar, onError: bijFout
  })
  const gefactureerd = useMutation({
    mutationFn: () => api.post(`/facturatie/voorstellen/${id}/gefactureerd`, { exactNummer: exactNummer || null }),
    onSuccess: klaar, onError: bijFout
  })

  if (!v) return null
  const concept = v.status === 'concept' && magBoekhouden
  const heeftMeerwerk = v.regels.some(r => r.bron === 'meerwerk')
  const afwijking = v.afwijkingVanOfferte || heeftMeerwerk

  const openBewerk = (r: FactuurRegelRij | 'nieuw') => {
    zetBewerkRegel(r)
    zetVorm(r === 'nieuw' ? legeRegel : {
      omschrijving: r.omschrijving, aantal: String(r.aantal), eenheid: r.eenheid ?? '',
      eenheidsprijs: String(r.eenheidsprijs), btw: r.btw
    })
  }

  return (
    <Modaal open titel={`${soortTekst[v.soort]} · dossier ${v.project.nummer ?? '—'}`} onSluit={onSluit}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-inkt">{weergaveNaam(v.klant)}</p>
            {v.klant.bedrijfsnaam && (v.klant.voornaam || v.klant.naam) && (
              <p className="text-xs text-inkt-muted">t.a.v. {persoon(v.klant.voornaam, v.klant.naam)}</p>
            )}
            <p className="text-xs text-inkt-muted">{v.project.werfadres}</p>
            {v.klant.btwNummer && <p className="text-xs text-inkt-faint">Btw {v.klant.btwNummer}</p>}
          </div>
          <Badge status={v.status} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><Th>Omschrijving</Th><Th>Bron</Th><Th rechts>Aantal</Th><Th rechts>Prijs</Th><Th rechts>Btw</Th><Th rechts>Totaal</Th>{concept && <Th />}</tr></thead>
            <tbody>
              {v.regels.map(r => (
                <tr key={r.id} className="border-t border-stone2-200">
                  <Td>{r.omschrijving}</Td>
                  <Td>
                    <span className={r.bron === 'meerwerk' ? 'text-xs font-semibold text-corten-600' : 'text-xs text-inkt-faint'}>
                      {bronTekst[r.bron]}
                    </span>
                  </Td>
                  <Td rechts>{r.aantal} {r.eenheid ?? ''}</Td>
                  <Td rechts>{euro(r.eenheidsprijs)}</Td>
                  <Td rechts>{r.btw.slice(1)}%</Td>
                  <Td rechts>{euro(r.totaal)}</Td>
                  {concept && (
                    <Td rechts>
                      <div className="flex justify-end gap-1">
                        <PotloodKnop onClick={() => openBewerk(r)} />
                        <VuilbakKnop onClick={() => verwijderRegel.mutate(r.id)} />
                      </div>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {concept && !bewerkRegel && <PlusKnop label="Regel toevoegen" onClick={() => openBewerk('nieuw')} />}
        {concept && bewerkRegel && (
          <div className="rounded-card border border-stone2-200 bg-vlak-raised p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Invoer label="Omschrijving" value={vorm.omschrijving} onChange={e => zetVorm({ ...vorm, omschrijving: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <Invoer label="Aantal" type="number" min="0.01" step="0.01" value={vorm.aantal} onChange={e => zetVorm({ ...vorm, aantal: e.target.value })} />
                <Invoer label="Eenheid" optioneel value={vorm.eenheid} onChange={e => zetVorm({ ...vorm, eenheid: e.target.value })} />
                <Invoer label="Prijs excl" type="number" step="0.01" value={vorm.eenheidsprijs} onChange={e => zetVorm({ ...vorm, eenheidsprijs: e.target.value })} />
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <Selecteer label="Btw" klein className="w-28" value={vorm.btw} onChange={e => zetVorm({ ...vorm, btw: e.target.value as BtwTarief })}>
                <option value="p0">0%</option><option value="p6">6%</option><option value="p21">21%</option>
              </Selecteer>
              <div className="flex gap-2">
                <Knop onClick={() => zetBewerkRegel(null)}>Annuleren</Knop>
                <Knop variant="primair" disabled={bewaarRegel.isPending || !vorm.omschrijving.trim() || Number(vorm.aantal) <= 0} onClick={() => bewaarRegel.mutate()}>Bewaren</Knop>
              </div>
            </div>
          </div>
        )}

        <div className="ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-inkt-muted">Excl btw</span><span>{euro(v.totaalExclBtw)}</span></div>
          <div className="flex justify-between"><span className="text-inkt-muted">Btw</span><span>{euro(v.totaalBtw)}</span></div>
          <div className="flex justify-between font-semibold text-inkt"><span>Incl btw</span><span>{euro(v.totaalInclBtw)}</span></div>
          {v.offerteTotaal != null && (
            <div className="flex justify-between text-xs text-inkt-faint"><span>Offerte excl btw</span><span>{euro(v.offerteTotaal)}</span></div>
          )}
        </div>

        {concept && afwijking && (
          <div className="rounded-card border border-corten-400/40 bg-corten-500/[.06] p-3">
            <p className="text-sm text-inkt-body">
              Dit voorstel wijkt af van de offerte{heeftMeerwerk ? ' door meerwerk op de werkbon' : ''}.
              De keten offerte, order en factuur blijft alleen consistent met een expliciete bevestiging.
            </p>
            <div className="mt-2">
              <Selectievak checked={bevestigAfwijking} onChange={zetBevestigAfwijking}>
                Ik bevestig de afwijking tegenover de offerte
              </Selectievak>
            </div>
          </div>
        )}

        {v.status === 'goedgekeurd' && magBoekhouden && (
          <div className="flex items-end gap-3">
            <Invoer label="Factuurnummer uit Exact Online" optioneel className="flex-1"
              value={exactNummer} onChange={e => zetExactNummer(e.target.value)} placeholder="bv. 2026-0042" />
          </div>
        )}
        {v.status === 'gefactureerd' && (
          <Melding soort="ok">
            Gefactureerd op {datum(v.gefactureerdOp ?? null)}{v.exactNummer ? ` met nummer ${v.exactNummer}` : ''}.
          </Melding>
        )}

        {fout && <Melding soort="fout">{fout}</Melding>}

        <div className="flex flex-wrap justify-end gap-2">
          {v.status !== 'concept' && magBoekhouden && (
            <Knop onClick={() => downloadExport(v.id)}>
              <span className="inline-flex items-center gap-1.5"><Download size={14} /> Export voor Exact</span>
            </Knop>
          )}
          {concept && (
            <Knop variant="primair" disabled={goedkeuren.isPending || (afwijking && !bevestigAfwijking) || v.totaalInclBtw <= 0}
              onClick={() => goedkeuren.mutate()}>Goedkeuren</Knop>
          )}
          {v.status === 'goedgekeurd' && magBoekhouden && (
            <>
              <Knop disabled={heropen.isPending} onClick={() => heropen.mutate()}>Terug naar concept</Knop>
              <Knop variant="primair" disabled={gefactureerd.isPending} onClick={() => gefactureerd.mutate()}>
                Gefactureerd melden
              </Knop>
            </>
          )}
        </div>
      </div>
    </Modaal>
  )
}
