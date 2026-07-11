import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../lib/api'
import { datum, leeg } from '../lib/formaat'
import type { Lead, MedewerkerKeuze } from '../lib/types'
import { Badge, Invoer, Knop, LegeStaat, Modaal, PaginaKop, Selecteer, TekstVak, Th, Td } from '../ui'

const kanaalTekst: Record<string, string> = {
  telefoon: 'Telefoon', email: 'Email', webformulier: 'Webformulier', socialeMedia: 'Sociale media'
}

export default function Leads() {
  const qc = useQueryClient()
  const [status, zetStatus] = useState('')
  const [zoek, zetZoek] = useState('')
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const { data: leads } = useQuery({
    queryKey: ['leads', status, zoek],
    queryFn: () => api.get<Lead[]>(`/leads?${new URLSearchParams({
      ...(status ? { status } : {}), ...(zoek ? { zoek } : {}) })}`)
  })
  const { data: medewerkers } = useQuery({
    queryKey: ['medewerkers-overzicht'],
    queryFn: () => api.get<MedewerkerKeuze[]>('/medewerkers/overzicht')
  })
  const [vorm, zetVorm] = useState({ kanaal: 'telefoon', naam: '', email: '', telefoon: '', eersteVraag: '', eigenaarId: '' })
  const maak = useMutation({
    mutationFn: () => api.post<Lead>('/leads', { ...vorm, eigenaarId: vorm.eigenaarId || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); zetNieuwOpen(false) }
  })

  return (
    <>
      <PaginaKop eyebrow="Verkoop · leadinbox" titel="Leads"
        actie={<Knop variant="primair" onClick={() => zetNieuwOpen(true)}>Nieuwe lead ↗</Knop>} />
      <div className="mb-4 flex gap-3">
        <Selecteer value={status} onChange={e => zetStatus(e.target.value)} className="w-48">
          <option value="">Alle statussen</option>
          <option value="nieuw">Nieuw</option>
          <option value="gekwalificeerd">Gekwalificeerd</option>
          <option value="omgezet">Omgezet</option>
          <option value="verloren">Verloren</option>
        </Selecteer>
        <Invoer placeholder="Zoek naam, email of vraag…" value={zoek} onChange={e => zetZoek(e.target.value)} className="flex-1" />
      </div>
      {leads && leads.length === 0 ? (
        <LegeStaat titel="Nog geen leads" tekst="Elke aanvraag uit de 4 kanalen komt hier samen."
          actie={<Knop variant="primair" onClick={() => zetNieuwOpen(true)}>Nieuwe lead ↗</Knop>} />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr>
            <Th>Naam</Th><Th>Kanaal</Th><Th>Eerste vraag</Th><Th>Status</Th><Th>Opvolgen</Th><Th />
          </tr></thead>
          <tbody>
            {leads?.map(lead => (
              <tr key={lead.id} className="hover:bg-bronze-500/[.06]">
                <Td className="font-semibold">{leeg(lead.naam ?? lead.email)}</Td>
                <Td>{kanaalTekst[lead.kanaal] ?? lead.kanaal}</Td>
                <Td className="max-w-72 truncate text-inkt-muted">{leeg(lead.eersteVraag)}</Td>
                <Td><Badge status={lead.status} /></Td>
                <Td>{datum(lead.opvolgdatum)}</Td>
                <Td rechts><Link to="/leads/$leadId" params={{ leadId: lead.id }} className="text-sm font-semibold text-bronze-600 hover:text-bronze-500">Openen</Link></Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modaal open={nieuwOpen} titel="Nieuwe lead" onSluit={() => zetNieuwOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); maak.mutate() }}>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Kanaal" value={vorm.kanaal} onChange={e => zetVorm({ ...vorm, kanaal: e.target.value })}>
              <option value="telefoon">Telefoon</option>
              <option value="email">Email</option>
              <option value="socialeMedia">Sociale media</option>
            </Selecteer>
            <Selecteer label="Eigenaar" value={vorm.eigenaarId} onChange={e => zetVorm({ ...vorm, eigenaarId: e.target.value })}>
              <option value="">Ikzelf</option>
              {medewerkers?.map(m => <option key={m.id} value={m.id}>{m.naam}</option>)}
            </Selecteer>
          </div>
          <Invoer label="Naam" value={vorm.naam} onChange={e => zetVorm({ ...vorm, naam: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Email" optioneel type="email" value={vorm.email} onChange={e => zetVorm({ ...vorm, email: e.target.value })} />
            <Invoer label="Telefoon" optioneel value={vorm.telefoon} onChange={e => zetVorm({ ...vorm, telefoon: e.target.value })} />
          </div>
          <TekstVak label="Eerste vraag" optioneel value={vorm.eersteVraag} onChange={e => zetVorm({ ...vorm, eersteVraag: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetNieuwOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={maak.isPending}>{maak.isPending ? 'Bezig…' : 'Bewaren'}</Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
