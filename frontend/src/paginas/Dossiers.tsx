import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { euro, leeg, weergaveNaam } from '../lib/formaat'
import type { ProjectRij } from '../lib/types'
import { Badge, Invoer, LegeStaat, PaginaKop, Th, Td, rijKlik } from '../ui'

// Houdt de volgorde van de server aan (nieuwste of beste zoektreffer eerst) en
// zet de projecten van dezelfde klant onder elkaar.
function perKlant(projecten: ProjectRij[]) {
  const groepen = new Map<string, { projecten: ProjectRij[] }>()
  for (const p of projecten) {
    const g = groepen.get(p.klant.id) ?? { projecten: [] }
    g.projecten.push(p)
    groepen.set(p.klant.id, g)
  }
  return [...groepen.values()]
}

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
            <Th>Nr</Th><Th>Klant</Th><Th>Adres</Th><Th>Telefoon</Th><Th>Status</Th><Th rechts>Waarde</Th>
          </tr></thead>
          <tbody>
            {/* Per klant gegroepeerd: een klantendossier kan meerdere projecten tellen. */}
            {perKlant(projecten ?? []).map(groep => groep.projecten.map((p, i) => (
              <tr key={p.id} className={rijKlik}
                onClick={() => navigeer({ to: '/dossiers/$projectId', params: { projectId: p.id } })}>
                <Td className="cijfers font-semibold text-bronze-600">{p.nummer ?? '—'}</Td>
                <Td className={i === 0 ? 'font-semibold' : 'text-inkt-faint'}>
                  {i === 0 ? weergaveNaam(p.klant) : '↳ zelfde klant'}
                  {i === 0 && groep.projecten.length > 1 && <span className="ml-2 text-xs font-normal text-inkt-muted">{groep.projecten.length} projecten</span>}
                </Td>
                <Td className="text-inkt-muted">{p.werfadres}</Td>
                <Td className="whitespace-nowrap text-inkt-muted">{leeg(p.klant.telefoon)}</Td>
                <Td><Badge status={p.status} /></Td>
                <Td rechts>{euro(p.offerteWaarde)}</Td>
              </tr>
            )))}
          </tbody>
        </table>
      )}
    </>
  )
}
