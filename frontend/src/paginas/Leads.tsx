import { useState } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { FolderPlus, TrendingDown, Archive, Trash2, RotateCcw } from 'lucide-react'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { datum, leeg, weergaveNaam } from '../lib/formaat'
import type { Lead } from '../lib/types'
import { Badge, Invoer, Knop, Modaal, PaginaKop, Selecteer, TekstVak, Th, Td, rijKlik } from '../ui'

// Snelknop in de leadtabel: rustig gedempt, kleurt op bij hover, met tooltip.
const actieBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-control text-inkt-faint transition'

const kanaalTekst: Record<string, string> = {
  telefoon: 'Telefoon', email: 'Email', webformulier: 'Webformulier', socialeMedia: 'Sociale media',
  contactWebsite: 'Contact (website)', offerteaanvraagWebsite: 'Offerteaanvraag (website)'
}
// Gelijk aan de keuzes op het contactformulier van de website (1 op 1 mapping).
export const typeAanvraagOpties = [
  ['poorten', 'Poorten'], ['overkappingen', 'Overkappingen'], ['automatisatie', 'Automatisatie'],
  ['onderhoud', 'Onderhoud'], ['andere', 'Andere vraag']
] as const
export const timingOpties = [
  ['zo-snel', 'Zo snel mogelijk'], ['3-maand', 'Binnen drie maanden'],
  ['6-maand', 'Binnen zes maanden'], ['orientatie', 'Nog in oriëntatie']
] as const

export default function Leads() {
  const qc = useQueryClient()
  const navigeer = useNavigate()
  const { data: mij } = useQuery({
    queryKey: ['mij'], queryFn: () => api.get<{ rollen: string[] }>('/medewerkers/mij'), staleTime: 5 * 60 * 1000
  })
  const isBeheerder = mij?.rollen.includes('beheerder') ?? false
  // De icoonknop opent de fiche en start daar exact dezelfde actie als de knoppen.
  const ga = (id: string, actie: string) => navigeer({ to: '/leads/$leadId', params: { leadId: id }, search: { actie } })
  const [status, zetStatus] = useState('')
  const { invoer, zetInvoer, term } = useZoekterm()
  const [weergave, zetWeergave] = useState('actief')
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const { data: leads, isFetching } = useQuery({
    queryKey: ['leads', status, term, weergave],
    queryFn: () => api.get<Lead[]>(`/leads?${new URLSearchParams({
      ...(status ? { status } : {}), ...(term ? { zoek: term } : {}),
      ...(weergave === 'archief' ? { archief: 'true' } : {}) })}`),
    placeholderData: keepPreviousData
  })
  const leegVorm = { kanaal: 'telefoon', naam: '', voornaam: '', email: '', telefoon: '', eersteVraag: '', typeAanvraag: '',
    klantType: 'particulier', bedrijfsnaam: '', btwNummer: '', straat: '', postcode: '', gemeente: '', gewensteTiming: '' }
  const [vorm, zetVorm] = useState(leegVorm)
  function openNieuw() { zetVorm(leegVorm); zetNieuwOpen(true) }
  const maak = useMutation({
    mutationFn: () => api.post<Lead>('/leads', {
      ...vorm,
      typeAanvraag: vorm.typeAanvraag || undefined, gewensteTiming: vorm.gewensteTiming || undefined,
      bedrijfsnaam: vorm.klantType === 'bedrijf' ? (vorm.bedrijfsnaam || undefined) : undefined,
      btwNummer: vorm.klantType === 'bedrijf' ? (vorm.btwNummer || undefined) : undefined,
      straat: vorm.straat || undefined, postcode: vorm.postcode || undefined,
      gemeente: vorm.gemeente || undefined
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); zetNieuwOpen(false) }
  })

  return (
    <>
      <PaginaKop eyebrow="Verkoop · leadinbox" titel="Leads"
        actie={<Knop variant="primair" onClick={openNieuw}>Nieuwe lead ↗</Knop>} />
      <div className="mb-4 flex gap-3">
        <Selecteer value={status} onChange={e => zetStatus(e.target.value)} className="w-48">
          <option value="">Alle statussen</option>
          <option value="nieuw">Nieuw</option>
          <option value="omgezet">Omgezet</option>
          <option value="verloren">Verloren</option>
        </Selecteer>
        <Selecteer value={weergave} onChange={e => zetWeergave(e.target.value)} className="w-36">
          <option value="actief">Actief</option>
          <option value="archief">Archief</option>
        </Selecteer>
        <Invoer placeholder="Zoek naam, email of vraag…" value={invoer} onChange={e => zetInvoer(e.target.value)} className="flex-1" />
        <Knop variant="secundair" className="h-10 shrink-0 whitespace-nowrap px-4"
          onClick={() => qc.invalidateQueries({ queryKey: ['leads'] })} disabled={isFetching}>
          {isFetching ? 'Bezig…' : 'Vernieuwen'}
        </Knop>
      </div>
      {(
        <table className="w-full border-separate border-spacing-0">
          <thead><tr>
            <Th>Naam</Th><Th>Kanaal</Th><Th>Eerste vraag</Th><Th>Status</Th><Th>Datum</Th><Th rechts>Acties</Th>
          </tr></thead>
          <tbody>
            {leads?.map(lead => (
              <tr key={lead.id} className={rijKlik}
                onClick={() => navigeer({ to: '/leads/$leadId', params: { leadId: lead.id } })}>
                <Td className="font-semibold">{weergaveNaam(lead) || leeg(lead.email)}</Td>
                <Td>{kanaalTekst[lead.kanaal] ?? lead.kanaal}</Td>
                <Td className="max-w-72 truncate text-inkt-muted">{leeg(lead.eersteVraag)}</Td>
                <Td><Badge status={lead.status} /></Td>
                <Td>{datum(lead.aangemaaktOp)}</Td>
                <Td>
                  <div className="flex items-center justify-end gap-0.5" onClick={e => e.stopPropagation()}>
                    {(lead.status === 'nieuw' || lead.status === 'gekwalificeerd') && !lead.gearchiveerdOp && (
                      <>
                        <button type="button" title="Omzetten naar dossier" aria-label="Omzetten naar dossier"
                          onClick={() => ga(lead.id, 'omzetten')}
                          className={`${actieBtn} hover:bg-bronze-500/10 hover:text-bronze-600`}><FolderPlus size={17} /></button>
                        <button type="button" title="Verliezen" aria-label="Verliezen"
                          onClick={() => ga(lead.id, 'verliezen')}
                          className={`${actieBtn} hover:bg-inkt/[.06] hover:text-inkt`}><TrendingDown size={17} /></button>
                      </>
                    )}
                    {lead.gearchiveerdOp
                      ? <button type="button" title="Herstellen" aria-label="Herstellen"
                          onClick={() => ga(lead.id, 'herstellen')}
                          className={`${actieBtn} hover:bg-inkt/[.06] hover:text-inkt-body`}><RotateCcw size={17} /></button>
                      : <button type="button" title="Archiveren" aria-label="Archiveren"
                          onClick={() => ga(lead.id, 'archiveren')}
                          className={`${actieBtn} hover:bg-inkt/[.06] hover:text-inkt-body`}><Archive size={17} /></button>}
                    {isBeheerder && (
                      <button type="button" title="Verwijderen" aria-label="Verwijderen"
                        onClick={() => ga(lead.id, 'verwijderen')}
                        className={`${actieBtn} hover:bg-corten-500/10 hover:text-corten-600`}><Trash2 size={17} /></button>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {leads?.length === 0 && term && (
        <p className="mt-4 text-sm text-inkt-muted">Geen resultaten voor "{term}".</p>
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
            <Selecteer label="Type klant" value={vorm.klantType} onChange={e => zetVorm({ ...vorm, klantType: e.target.value })}>
              <option value="particulier">Particulier</option>
              <option value="bedrijf">Bedrijf</option>
            </Selecteer>
            {vorm.klantType === 'bedrijf' && (
              <Invoer label="Bedrijfsnaam" value={vorm.bedrijfsnaam} onChange={e => zetVorm({ ...vorm, bedrijfsnaam: e.target.value })} required />
            )}
          </div>
          {vorm.klantType === 'bedrijf' && (
            <Invoer label="Btw nummer" optioneel value={vorm.btwNummer} onChange={e => zetVorm({ ...vorm, btwNummer: e.target.value })} />
          )}
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
          <Invoer label="Straat en huisnummer" optioneel value={vorm.straat} onChange={e => zetVorm({ ...vorm, straat: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Postcode" optioneel value={vorm.postcode} onChange={e => zetVorm({ ...vorm, postcode: e.target.value })} />
            <Invoer label="Stad of gemeente" optioneel value={vorm.gemeente} onChange={e => zetVorm({ ...vorm, gemeente: e.target.value })} />
          </div>
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
