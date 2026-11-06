import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { api, ApiFout } from '../lib/api'
import { supabase } from '../lib/supabase'
import { datum, euro, persoon, weergaveNaam } from '../lib/formaat'
import type { BtwTarief, FactuurKlaarRij, FactuurRegelRij, FactuurVoorstelDetail, FactuurVoorstelRij } from '../lib/types'
import { Badge, Invoer, Knop, LegeStaat, Melding, Modaal, PaginaKop, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, Td, Th, VuilbakKnop, rijKlik } from '../ui'
import VoorstelDetail from './facturatie/VoorstelDetail'
import { bronTekst, downloadExport, legeRegel, soortTekst } from './facturatie/gedeeld'

/* TS-10 Facturatievoorbereiding (FR-014): factuurklare dossiers, het voorstel
   met de vergelijking offerte tegenover uitvoering, de consistentiecontrole
   en het alternatieve exportpad naar Exact Online. */



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
                    <Td className="whitespace-nowrap">{datum(v.aangemaaktOp)}</Td>
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
