import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { leeg, persoon } from '../lib/formaat'
import type { Klant } from '../lib/types'
import { Invoer, LegeStaat, PaginaKop, Th, Td, rijKlik } from '../ui'

export default function Klanten() {
  const navigeer = useNavigate()
  const { invoer, zetInvoer, term } = useZoekterm()
  const { data: klanten, isFetching } = useQuery({
    queryKey: ['klanten', term],
    queryFn: () => api.get<Klant[]>(`/klanten?${new URLSearchParams(term ? { zoek: term } : {})}`),
    placeholderData: keepPreviousData
  })
  return (
    <>
      <PaginaKop eyebrow="Verkoop · klanten" titel="Klanten" />
      <div className="mb-4 flex gap-3">
        <Invoer placeholder="Zoek naam, gemeente of email…" value={invoer} onChange={e => zetInvoer(e.target.value)} className="flex-1" />
        {isFetching && term && <span className="self-center text-xs text-inkt-faint">zoeken…</span>}
      </div>
      {klanten && klanten.length === 0 ? (
        term
          ? <p className="mt-4 text-sm text-inkt-muted">Geen resultaten voor "{term}".</p>
          : <LegeStaat titel="Nog geen klanten" tekst="Klanten ontstaan bij het omzetten van een lead of hier via de verkoop." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>Naam</Th><Th>Type</Th><Th>Gemeente</Th><Th>Email</Th></tr></thead>
          <tbody>
            {klanten?.map(k => (
              <tr key={k.id} className={rijKlik}
                onClick={() => navigeer({ to: '/klanten/$klantId', params: { klantId: k.id } })}>
                <Td className="font-semibold">{persoon(k.voornaam, k.naam)}</Td>
                <Td>{k.type === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</Td>
                <Td>{leeg(k.gemeente)}</Td>
                <Td>{leeg(k.email)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
