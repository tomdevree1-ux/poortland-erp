import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../lib/api'
import { datum, leeg, persoon } from '../lib/formaat'
import type { Lead } from '../lib/types'
import { Badge, Invoer, Knop, Modaal, PaginaKop, Selecteer, TekstVak, Th, Td, rijKlik } from '../ui'

const kanaalTekst: Record<string, string> = {
  telefoon: 'Telefoon', email: 'Email', webformulier: 'Webformulier', socialeMedia: 'Sociale media',
  contactWebsite: 'Contact (website)', offerteaanvraagWebsite: 'Offerteaanvraag (website)'
}
export const typeAanvraagOpties = [
  ['nieuwe-poort', 'Nieuwe poort'], ['hekwerk', 'Hekwerk'], ['automatisatie', 'Automatisatie'],
  ['onderhoud', 'Onderhoud of service'], ['showroom', 'Showroombezoek'], ['andere', 'Andere vraag']
] as const
export const timingOpties = [
  ['zo-snel', 'Zo snel mogelijk'], ['3-maand', 'Binnen drie maanden'],
  ['6-maand', 'Binnen zes maanden'], ['orientatie', 'Nog in oriëntatie']
] as const

export default function Leads() {
  const qc = useQueryClient()
  const navigeer = useNavigate()
  const [status, zetStatus] = useState('')
  const [zoek, zetZoek] = useState('')
  const [weergave, zetWeergave] = useState('actief')
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const { data: leads } = useQuery({
    queryKey: ['leads', status, zoek, weergave],
    queryFn: () => api.get<Lead[]>(`/leads?${new URLSearchParams({
      ...(status ? { status } : {}), ...(zoek ? { zoek } : {}),
      ...(weergave === 'archief' ? { archief: 'true' } : {}) })}`)
  })
  const [vorm, zetVorm] = useState({ kanaal: 'telefoon', naam: '', voornaam: '', email: '', telefoon: '', eersteVraag: '', typeAanvraag: '', gemeente: '', gewensteTiming: '' })
  const maak = useMutation({
    mutationFn: () => api.post<Lead>('/leads', {
      ...vorm,
      typeAanvraag: vorm.typeAanvraag || undefined, gewensteTiming: vorm.gewensteTiming || undefined,
      gemeente: vorm.gemeente || undefined
    }),
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
        <Selecteer value={weergave} onChange={e => zetWeergave(e.target.value)} className="w-36">
          <option value="actief">Actief</option>
          <option value="archief">Archief</option>
        </Selecteer>
        <Invoer placeholder="Zoek naam, email of vraag…" value={zoek} onChange={e => zetZoek(e.target.value)} className="flex-1" />
      </div>
      {(
        <table className="w-full border-separate border-spacing-0">
          <thead><tr>
            <Th>Naam</Th><Th>Kanaal</Th><Th>Eerste vraag</Th><Th>Status</Th><Th>Opvolgen</Th>
          </tr></thead>
          <tbody>
            {leads?.map(lead => (
              <tr key={lead.id} className={rijKlik}
                onClick={() => navigeer({ to: '/leads/$leadId', params: { leadId: lead.id } })}>
                <Td className="font-semibold">{persoon(lead.voornaam, lead.naam) || leeg(lead.email)}</Td>
                <Td>{kanaalTekst[lead.kanaal] ?? lead.kanaal}</Td>
                <Td className="max-w-72 truncate text-inkt-muted">{leeg(lead.eersteVraag)}</Td>
                <Td><Badge status={lead.status} /></Td>
                <Td>{datum(lead.opvolgdatum)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modaal open={nieuwOpen} titel="Nieuwe lead" onSluit={() => zetNieuwOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); maak.mutate() }}>
          <Selecteer label="Kanaal" value={vorm.kanaal} onChange={e => zetVorm({ ...vorm, kanaal: e.target.value })}>
            <option value="telefoon">Telefoon</option>
            <option value="email">Email</option>
            <option value="socialeMedia">Sociale media</option>
            <option value="contactWebsite">Contact (website)</option>
            <option value="offerteaanvraagWebsite">Offerteaanvraag (website)</option>
          </Selecteer>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Voornaam" optioneel value={vorm.voornaam} onChange={e => zetVorm({ ...vorm, voornaam: e.target.value })} />
            <Invoer label="Naam" value={vorm.naam} onChange={e => zetVorm({ ...vorm, naam: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Email" optioneel type="email" value={vorm.email} onChange={e => zetVorm({ ...vorm, email: e.target.value })} />
            <Invoer label="Telefoon" optioneel value={vorm.telefoon} onChange={e => zetVorm({ ...vorm, telefoon: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Type aanvraag" optioneel value={vorm.typeAanvraag} onChange={e => zetVorm({ ...vorm, typeAanvraag: e.target.value })}>
              <option value="">Nog niet gekend</option>
              {typeAanvraagOpties.map(([w, tekst]) => <option key={w} value={w}>{tekst}</option>)}
            </Selecteer>
            <Selecteer label="Gewenste timing" optioneel value={vorm.gewensteTiming} onChange={e => zetVorm({ ...vorm, gewensteTiming: e.target.value })}>
              <option value="">Nog niet gekend</option>
              {timingOpties.map(([w, tekst]) => <option key={w} value={w}>{tekst}</option>)}
            </Selecteer>
          </div>
          <Invoer label="Gemeente" optioneel value={vorm.gemeente} onChange={e => zetVorm({ ...vorm, gemeente: e.target.value })} />
          <TekstVak label="Omschrijving van het project" optioneel value={vorm.eersteVraag} onChange={e => zetVorm({ ...vorm, eersteVraag: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetNieuwOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={maak.isPending}>{maak.isPending ? 'Bezig…' : 'Bewaren'}</Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
