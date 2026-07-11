import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../lib/api'
import { euro, leeg } from '../lib/formaat'
import type { ProjectRij } from '../lib/types'
import { Badge, Invoer, LegeStaat, PaginaKop, Th, Td } from '../ui'

export default function Dossiers() {
  const [zoek, zetZoek] = useState('')
  const { data: projecten } = useQuery({
    queryKey: ['projecten', zoek],
    queryFn: () => api.get<ProjectRij[]>(`/projecten?${new URLSearchParams(zoek ? { zoek } : {})}`)
  })
  return (
    <>
      <PaginaKop eyebrow="Atelier · overzicht" titel="Dossiers" />
      <div className="mb-4">
        <Invoer placeholder="Zoek dossier, klant of adres…" value={zoek} onChange={e => zetZoek(e.target.value)} />
      </div>
      {projecten && projecten.length === 0 ? (
        <LegeStaat titel="Nog geen dossiers" tekst="Zet een gekwalificeerde lead om en het eerste dossier verschijnt hier." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr>
            <Th>Klant &amp; adres</Th><Th>Omschrijving</Th><Th>Status</Th><Th rechts>Waarde</Th><Th />
          </tr></thead>
          <tbody>
            {projecten?.map(p => (
              <tr key={p.id} className="hover:bg-bronze-500/[.06]">
                <Td><span className="font-semibold">{p.klant.naam}</span>
                  <span className="ml-2 text-inkt-muted">{p.werfadres}</span></Td>
                <Td className="max-w-64 truncate text-inkt-muted">{leeg(p.omschrijving)}</Td>
                <Td><Badge status={p.status} /></Td>
                <Td rechts>{euro(p.offerteWaarde)}</Td>
                <Td rechts><Link to="/dossiers/$projectId" params={{ projectId: p.id }} className="text-sm font-semibold text-bronze-600 hover:text-bronze-500">Openen</Link></Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
