import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../lib/api'
import { leeg } from '../lib/formaat'
import type { Klant } from '../lib/types'
import { Invoer, LegeStaat, PaginaKop, Th, Td } from '../ui'

export default function Klanten() {
  const [zoek, zetZoek] = useState('')
  const { data: klanten } = useQuery({
    queryKey: ['klanten', zoek],
    queryFn: () => api.get<Klant[]>(`/klanten?${new URLSearchParams(zoek ? { zoek } : {})}`)
  })
  return (
    <>
      <PaginaKop eyebrow="Verkoop · klanten" titel="Klanten" />
      <div className="mb-4"><Invoer placeholder="Zoek naam, gemeente of email…" value={zoek} onChange={e => zetZoek(e.target.value)} /></div>
      {klanten && klanten.length === 0 ? (
        <LegeStaat titel="Nog geen klanten" tekst="Klanten ontstaan bij het omzetten van een lead of hier via de verkoop." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>Naam</Th><Th>Type</Th><Th>Gemeente</Th><Th>Email</Th><Th /></tr></thead>
          <tbody>
            {klanten?.map(k => (
              <tr key={k.id} className="hover:bg-bronze-500/[.06]">
                <Td className="font-semibold">{k.naam}</Td>
                <Td>{k.type === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</Td>
                <Td>{leeg(k.gemeente)}</Td>
                <Td>{leeg(k.email)}</Td>
                <Td rechts><Link to="/klanten/$klantId" params={{ klantId: k.id }} className="text-sm font-semibold text-bronze-600 hover:text-bronze-500">Openen</Link></Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
