import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { euro, leeg, weergaveNaam } from '../lib/formaat'
import type { ProjectRij } from '../lib/types'
import { Badge, Invoer, LegeStaat, PaginaKop, Th, Td, rijKlik } from '../ui'

export default function Dossiers() {
  const navigeer = useNavigate()
  const { invoer, zetInvoer, term } = useZoekterm()
  const { data: projecten, isFetching } = useQuery({
    queryKey: ['projecten', term],
    queryFn: () => api.get<ProjectRij[]>(`/projecten?${new URLSearchParams(term ? { zoek: term } : {})}`),
    placeholderData: keepPreviousData
  })
  return (
    <>
      <PaginaKop eyebrow="Operations · overzicht" titel="Dossiers" />
      <div className="mb-4 flex gap-3">
        <Invoer placeholder="Zoek dossier, nummer, klant of adres…" value={invoer} onChange={e => zetInvoer(e.target.value)} className="flex-1" />
        {isFetching && term && <span className="self-center text-xs text-inkt-faint">zoeken…</span>}
      </div>
      {projecten && projecten.length === 0 ? (
        term
          ? <p className="mt-4 text-sm text-inkt-muted">Geen resultaten voor "{term}".</p>
          : <LegeStaat titel="Nog geen dossiers" tekst="Zet een gekwalificeerde lead om en het eerste dossier verschijnt hier." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr>
            <Th>Nr</Th><Th>Klant &amp; adres</Th><Th>Omschrijving</Th><Th>Status</Th><Th rechts>Waarde</Th>
          </tr></thead>
          <tbody>
            {projecten?.map(p => (
              <tr key={p.id} className={rijKlik}
                onClick={() => navigeer({ to: '/dossiers/$projectId', params: { projectId: p.id } })}>
                <Td className="cijfers font-semibold text-bronze-600">{p.nummer ?? '—'}</Td>
                <Td><span className="font-semibold">{weergaveNaam(p.klant)}</span>
                  <span className="ml-2 text-inkt-muted">{p.werfadres}</span></Td>
                <Td className="max-w-64 truncate text-inkt-muted">{leeg(p.omschrijving)}</Td>
                <Td><Badge status={p.status} /></Td>
                <Td rechts>{euro(p.offerteWaarde)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
