import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { api, ApiFout } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { datum, euro, persoon, weergaveNaam } from '../../lib/formaat'
import type { BtwTarief, FactuurRegelRij, FactuurVoorstelDetail } from '../../lib/types'
import { bronTekst, downloadExport, legeRegel, soortTekst } from './gedeeld'
import { Badge, Invoer, Knop, LegeStaat, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, Td, Th, VuilbakKnop, rijKlik } from '../../ui'

/* Opgesplitst uit Facturatie.tsx (audit 2026-10-05): het detail van een
   factuurvoorstel is een eigen scherm. */

export default function VoorstelDetail({ id, magBoekhouden, onSluit, onWijzig }: {
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
