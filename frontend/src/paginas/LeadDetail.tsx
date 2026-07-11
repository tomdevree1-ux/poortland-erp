import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { api } from '../lib/api'
import { datum, euro, leeg } from '../lib/formaat'
import type { Klant, Lead } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, Selecteer, TekstVak } from '../ui'

export default function LeadDetail() {
  const { leadId } = useParams({ from: '/app/leads/$leadId' })
  const navigeer = useNavigate()
  const qc = useQueryClient()
  const { data: lead } = useQuery({ queryKey: ['lead', leadId], queryFn: () => api.get<Lead>(`/leads/${leadId}`) })
  const [omzetOpen, zetOmzetOpen] = useState(false)
  const [verliesOpen, zetVerliesOpen] = useState(false)
  const [fout, zetFout] = useState<string>()

  const kwalificeer = useMutation({
    mutationFn: () => api.post<Lead>(`/leads/${leadId}/kwalificeer`, { prijsindicatie: null, opvolgdatum: null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lead', leadId] }),
    onError: f => zetFout((f as Error).message)
  })

  const [klantKeuze, zetKlantKeuze] = useState('')
  const [zoekKlant, zetZoekKlant] = useState('')
  const { data: klanten } = useQuery({
    queryKey: ['klanten', zoekKlant],
    queryFn: () => api.get<Klant[]>(`/klanten?${new URLSearchParams(zoekKlant ? { zoek: zoekKlant } : {})}`),
    enabled: omzetOpen
  })
  const [nieuweKlant, zetNieuweKlant] = useState({ type: 'particulier', naam: '', btwNummer: '', straat: '', postcode: '', gemeente: '' })
  const [werfadres, zetWerfadres] = useState('')
  const omzetten = useMutation({
    mutationFn: () => api.post<{ projectId: string }>(`/leads/${leadId}/omzetten`, {
      klantId: klantKeuze || null,
      nieuweKlant: klantKeuze ? null : { ...nieuweKlant, btwNummer: nieuweKlant.btwNummer || null, email: lead?.email, telefoon: lead?.telefoon },
      werfadres, omschrijving: lead?.eersteVraag
    }),
    onSuccess: r => navigeer({ to: '/dossiers/$projectId', params: { projectId: r.projectId } }),
    onError: f => zetFout((f as Error).message)
  })
  const [reden, zetReden] = useState('')
  const verliezen = useMutation({
    mutationFn: () => api.post<Lead>(`/leads/${leadId}/verliezen`, { reden }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lead', leadId] }); zetVerliesOpen(false) },
    onError: f => zetFout((f as Error).message)
  })

  if (!lead) return null
  return (
    <>
      <PaginaKop eyebrow="Verkoop · lead" titel={leeg(lead.naam ?? lead.email)}
        actie={<div className="flex gap-2">
          {lead.status === 'nieuw' && <Knop variant="primair" onClick={() => kwalificeer.mutate()}>Kwalificeren</Knop>}
          {lead.status === 'gekwalificeerd' && <Knop variant="primair" onClick={() => zetOmzetOpen(true)}>Omzetten naar dossier ↗</Knop>}
          {(lead.status === 'nieuw' || lead.status === 'gekwalificeerd') &&
            <Knop variant="ghost" onClick={() => zetVerliesOpen(true)}>Verliezen</Knop>}
        </div>} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      <div className="grid grid-cols-2 gap-6">
        <Paneel titel="Gegevens">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={lead.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(lead.email)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(lead.telefoon)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Opvolgdatum</dt><dd>{datum(lead.opvolgdatum)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Prijsindicatie</dt><dd className="cijfers">{euro(lead.prijsindicatie)}</dd></div>
            {lead.verliesReden && <div className="flex justify-between"><dt className="text-inkt-muted">Reden verlies</dt><dd>{lead.verliesReden}</dd></div>}
          </dl>
        </Paneel>
        <Paneel titel="Eerste vraag">
          <p className="text-sm leading-relaxed text-inkt-body">{leeg(lead.eersteVraag)}</p>
        </Paneel>
      </div>

      <Modaal open={omzetOpen} titel="Omzetten naar klant en dossier" onSluit={() => zetOmzetOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); omzetten.mutate() }}>
          <Invoer label="Zoek bestaande klant" optioneel placeholder="Naam of gemeente…"
            value={zoekKlant} onChange={e => zetZoekKlant(e.target.value)} />
          <Selecteer label="Bestaande klant" optioneel value={klantKeuze} onChange={e => zetKlantKeuze(e.target.value)}>
            <option value="">Nieuwe klant aanmaken</option>
            {klanten?.map(k => <option key={k.id} value={k.id}>{k.naam} · {k.gemeente ?? ''}</option>)}
          </Selecteer>
          {!klantKeuze && (
            <div className="space-y-4 rounded-control bg-vlak-raised p-4">
              <div className="grid grid-cols-2 gap-4">
                <Selecteer label="Type" value={nieuweKlant.type} onChange={e => zetNieuweKlant({ ...nieuweKlant, type: e.target.value })}>
                  <option value="particulier">Particulier</option>
                  <option value="bedrijf">Bedrijf</option>
                </Selecteer>
                <Invoer label="Naam" value={nieuweKlant.naam} onChange={e => zetNieuweKlant({ ...nieuweKlant, naam: e.target.value })} required={!klantKeuze} />
              </div>
              {nieuweKlant.type === 'bedrijf' &&
                <Invoer label="Btw nummer" value={nieuweKlant.btwNummer} onChange={e => zetNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })} required />}
              <div className="grid grid-cols-3 gap-4">
                <Invoer label="Straat" optioneel value={nieuweKlant.straat} onChange={e => zetNieuweKlant({ ...nieuweKlant, straat: e.target.value })} />
                <Invoer label="Postcode" optioneel value={nieuweKlant.postcode} onChange={e => zetNieuweKlant({ ...nieuweKlant, postcode: e.target.value })} />
                <Invoer label="Gemeente" optioneel value={nieuweKlant.gemeente} onChange={e => zetNieuweKlant({ ...nieuweKlant, gemeente: e.target.value })} />
              </div>
            </div>
          )}
          <Invoer label="Werfadres" value={werfadres} onChange={e => zetWerfadres(e.target.value)} required />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetOmzetOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={omzetten.isPending}>{omzetten.isPending ? 'Bezig…' : 'Omzetten'}</Knop>
          </div>
        </form>
      </Modaal>

      <Modaal open={verliesOpen} titel="Lead verliezen" onSluit={() => zetVerliesOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); verliezen.mutate() }}>
          <TekstVak label="Reden" value={reden} onChange={e => zetReden(e.target.value)} required />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetVerliesOpen(false)}>Annuleren</Knop>
            <Knop variant="destructief" disabled={verliezen.isPending}>Verliezen</Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
