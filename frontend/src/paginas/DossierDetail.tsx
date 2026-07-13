import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, euro, leeg } from '../lib/formaat'
import type { Klant, Offerte } from '../lib/types'
import { Badge, Knop, PaginaKop, Paneel, Th, Td, rijKlik } from '../ui'

interface Dossier {
  project: { id: string; werfadres: string; omschrijving?: string; status: string; garantieMaanden: number; klant: Klant }
  offertes: Offerte[]
  order?: { id: string; datumGoedkeuring: string; status: string }
  communicatie: { id: string; onderwerp: string; verzondenOp: string; status: string }[]
  contactmomenten: { id: string; type: string; datum: string; notitie?: string }[]
}

export default function DossierDetail() {
  const { projectId } = useParams({ from: '/app/dossiers/$projectId' })
  const navigeer = useNavigate()
  const qc = useQueryClient()
  const [tab, zetTab] = useState<'overzicht' | 'offertes' | 'communicatie'>('overzicht')
  const { data } = useQuery({ queryKey: ['dossier', projectId], queryFn: () => api.get<Dossier>(`/projecten/${projectId}`) })
  const maakOfferte = useMutation({
    mutationFn: () => api.post<Offerte>(`/projecten/${projectId}/offertes`, { taal: null }),
    onSuccess: o => { qc.invalidateQueries({ queryKey: ['dossier', projectId] }); navigeer({ to: '/offertes/$offerteId', params: { offerteId: o.id } }) }
  })
  if (!data) return null
  const { project, offertes, order, communicatie, contactmomenten } = data
  const tabs = [
    ['overzicht', 'Overzicht'], ['offertes', `Offertes en order (${offertes.length})`],
    ['communicatie', 'Communicatie']
  ] as const
  return (
    <>
      <PaginaKop eyebrow="Dossier" titel={project.klant.naam}
        actie={<Knop variant="primair" onClick={() => maakOfferte.mutate()} disabled={maakOfferte.isPending}>
          {offertes.length ? 'Nieuwe offerteversie ↗' : 'Offerte maken ↗'}</Knop>} />
      <div className="mb-5 flex items-center gap-6 rounded-card border border-inkt/[.07] bg-vlak-surface px-5 py-3 text-sm">
        <span className="text-inkt-muted">{project.werfadres}</span>
        <Badge status={project.status} />
        <span className="text-inkt-muted">Garantie {project.garantieMaanden} maanden</span>
      </div>
      <div className="mb-5 flex gap-1 border-b border-inkt/10">
        {tabs.map(([sleutel, tekst]) => (
          <button key={sleutel} onClick={() => zetTab(sleutel)}
            className={clsx('focusring px-4 py-2 text-sm font-semibold',
              tab === sleutel ? 'border-b-2 border-bronze-500 text-inkt' : 'text-inkt-muted hover:text-inkt')}>
            {tekst}
          </button>
        ))}
      </div>

      {tab === 'overzicht' && (
        <div className="grid grid-cols-2 gap-6">
          <Paneel titel="Klantgegevens">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Naam</dt><dd className="font-semibold">{project.klant.naam}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Adres</dt><dd>{leeg([project.klant.straat, project.klant.postcode, project.klant.gemeente].filter(Boolean).join(', '))}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(project.klant.email)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(project.klant.telefoon)}</dd></div>
              {project.klant.btwNummer && <div className="flex justify-between"><dt className="text-inkt-muted">Btw</dt><dd>{project.klant.btwNummer}</dd></div>}
            </dl>
          </Paneel>
          <Paneel titel="Contactmomenten">
            {contactmomenten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen contactmomenten.</p> : (
              <ul className="space-y-2 text-sm">
                {contactmomenten.map(c => (
                  <li key={c.id} className="flex justify-between gap-4">
                    <span className="text-inkt-body">{c.type} · {leeg(c.notitie)}</span>
                    <span className="whitespace-nowrap text-inkt-muted">{datum(c.datum)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Paneel>
          <Paneel titel="Omschrijving" className="col-span-2">
            <p className="text-sm text-inkt-body">{leeg(project.omschrijving)}</p>
          </Paneel>
        </div>
      )}

      {tab === 'offertes' && (
        <>
          {order && (
            <div className="mb-4 rounded-card border border-olive-500/40 bg-olive-500/10 px-5 py-3 text-sm">
              Order aangemaakt op {datum(order.datumGoedkeuring)} · <Badge status={order.status} />
            </div>
          )}
          <table className="w-full border-separate border-spacing-0">
            <thead><tr><Th>Nummer</Th><Th>Versie</Th><Th>Status</Th><Th>Geldig tot</Th><Th rechts>Totaal excl.</Th></tr></thead>
            <tbody>
              {offertes.map(o => (
                <tr key={o.id} className={rijKlik}
                  onClick={() => navigeer({ to: '/offertes/$offerteId', params: { offerteId: o.id } })}>
                  <Td className="font-semibold">{o.nummer}</Td>
                  <Td>v{o.versieOfferte}</Td>
                  <Td><Badge status={o.status} /></Td>
                  <Td>{datum(o.geldigTot)}</Td>
                  <Td rechts>{euro(o.totaalExclBtw)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'communicatie' && (
        <Paneel titel="Verzonden communicatie">
          {communicatie.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen communicatie bij dit dossier.</p> : (
            <ul className="space-y-2 text-sm">
              {communicatie.map(c => (
                <li key={c.id} className="flex justify-between gap-4">
                  <span>{c.onderwerp}</span>
                  <span className="whitespace-nowrap text-inkt-muted">{datum(c.verzondenOp)}</span>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      )}
    </>
  )
}
