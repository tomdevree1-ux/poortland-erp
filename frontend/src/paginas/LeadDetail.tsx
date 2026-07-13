import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, euro, leeg } from '../lib/formaat'
import type { Klant, Lead } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, Selecteer, TekstVak } from '../ui'
import { timingOpties, typeAanvraagOpties } from './Leads'

const typeTekst = Object.fromEntries(typeAanvraagOpties)
const timingTekst = Object.fromEntries(timingOpties)

interface WizardStap { titel: string; velden: { label: string; waarde: string }[] }

function parseWizard(json?: string): WizardStap[] | null {
  if (!json) return null
  try {
    const data = JSON.parse(json)
    if (Array.isArray(data?.stappen)) return data.stappen as WizardStap[]
    return null
  } catch { return null }
}

export default function LeadDetail() {
  const { leadId } = useParams({ from: '/app/leads/$leadId' })
  const navigeer = useNavigate()
  const qc = useQueryClient()
  const { data: lead } = useQuery({ queryKey: ['lead', leadId], queryFn: () => api.get<Lead>(`/leads/${leadId}`) })
  const [omzetOpen, zetOmzetOpen] = useState(false)
  const [verliesOpen, zetVerliesOpen] = useState(false)
  const [verwijderOpen, zetVerwijderOpen] = useState(false)
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const isBeheerder = mij?.rollen.includes('beheerder') ?? false
  const [fout, zetFout] = useState<string>()
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['lead', leadId] }) }
  const bewerkbaar = lead?.status === 'nieuw' || lead?.status === 'gekwalificeerd'

  const kwalificeer = useMutation({
    mutationFn: () => api.post<Lead>(`/leads/${leadId}/kwalificeer`, { prijsindicatie: null, opvolgdatum: null }),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const wijzig = useMutation({
    mutationFn: (deel: Record<string, unknown>) => api.patch<Lead>(`/leads/${leadId}`, deel),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  const bestandRef = useRef<HTMLInputElement>(null)
  const uploadFoto = useMutation({
    mutationFn: (bestand: File) => {
      const form = new FormData()
      form.append('bestand', bestand)
      return api.formulier(`/leads/${leadId}/fotos`, form)
    },
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const verwijderFoto = useMutation({
    mutationFn: (fotoId: string) => api.del(`/leads/${leadId}/fotos/${fotoId}`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
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
      nieuweKlant: klantKeuze ? null : {
        ...nieuweKlant,
        naam: nieuweKlant.naam || lead?.naam || '',
        gemeente: nieuweKlant.gemeente || lead?.gemeente || null,
        btwNummer: nieuweKlant.btwNummer || null,
        email: lead?.email, telefoon: lead?.telefoon
      },
      werfadres, omschrijving: lead?.eersteVraag
    }),
    onSuccess: r => navigeer({ to: '/dossiers/$projectId', params: { projectId: r.projectId } }),
    onError: f => zetFout((f as Error).message)
  })
  const [reden, zetReden] = useState('')
  const verliezen = useMutation({
    mutationFn: () => api.post<Lead>(`/leads/${leadId}/verliezen`, { reden }),
    onSuccess: () => { ververs(); zetVerliesOpen(false) },
    onError: f => zetFout((f as Error).message)
  })
  const archiveer = useMutation({
    mutationFn: (herstel: boolean) => api.post(`/leads/${leadId}/${herstel ? 'herstel' : 'archiveer'}`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const verwijderen = useMutation({
    mutationFn: () => api.del(`/leads/${leadId}`),
    onSuccess: () => navigeer({ to: '/leads' }),
    onError: f => zetFout((f as Error).message)
  })

  if (!lead) return null
  const wizard = parseWizard(lead.wizardGegevens)
  return (
    <>
      <PaginaKop eyebrow="Verkoop · lead" titel={leeg(lead.naam ?? lead.email)}
        actie={<div className="flex gap-2">
          {!lead.gearchiveerdOp && lead.status === 'nieuw' && <Knop variant="primair" onClick={() => kwalificeer.mutate()}>Kwalificeren</Knop>}
          {!lead.gearchiveerdOp && lead.status === 'gekwalificeerd' && <Knop variant="primair" onClick={() => zetOmzetOpen(true)}>Omzetten naar dossier ↗</Knop>}
          {!lead.gearchiveerdOp && bewerkbaar && <Knop variant="ghost" onClick={() => zetVerliesOpen(true)}>Verliezen</Knop>}
          <Knop variant="neutraal" onClick={() => archiveer.mutate(!!lead.gearchiveerdOp)}>
            {lead.gearchiveerdOp ? 'Herstellen' : 'Archiveren'}
          </Knop>
          {isBeheerder && <Knop variant="destructief" onClick={() => zetVerwijderOpen(true)}>Verwijderen</Knop>}
        </div>} />
      {lead.gearchiveerdOp && <div className="mb-4"><Melding soort="info">
        Deze lead staat in het archief sinds {datum(lead.gearchiveerdOp)}. Herstel hem om verder te werken.
      </Melding></div>}
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="grid grid-cols-2 gap-6">
        <Paneel titel="Aanvraag">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={lead.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Type aanvraag</dt>
              <dd>{leeg(lead.typeAanvraag ? typeTekst[lead.typeAanvraag] ?? lead.typeAanvraag : null)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Gewenste timing</dt>
              <dd>{leeg(lead.gewensteTiming ? timingTekst[lead.gewensteTiming] ?? lead.gewensteTiming : null)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Gemeente</dt><dd>{leeg(lead.gemeente)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(lead.email)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(lead.telefoon)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Opvolgdatum</dt><dd>{datum(lead.opvolgdatum)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Prijsindicatie</dt><dd className="cijfers">{euro(lead.prijsindicatie)}</dd></div>
            {lead.privacyAkkoord && (
              <div className="flex justify-between"><dt className="text-inkt-muted">Privacy akkoord</dt>
                <dd>ja · {datum(lead.privacyAkkoordOp)}</dd></div>
            )}
            {lead.verliesReden && <div className="flex justify-between"><dt className="text-inkt-muted">Reden verlies</dt><dd>{lead.verliesReden}</dd></div>}
          </dl>
        </Paneel>

        <Paneel titel="Omschrijving van het project">
          {bewerkbaar ? (
            <TekstVak defaultValue={lead.eersteVraag ?? ''} rows={6}
              onBlur={e => e.target.value !== (lead.eersteVraag ?? '') && wijzig.mutate({ eersteVraag: e.target.value })} />
          ) : (
            <p className="text-sm leading-relaxed text-inkt-body">{leeg(lead.eersteVraag)}</p>
          )}
        </Paneel>

        <Paneel titel="Foto's van de plek" actie={bewerkbaar && (
          <>
            <input ref={bestandRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden
              onChange={e => e.target.files?.[0] && uploadFoto.mutate(e.target.files[0])} />
            <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => bestandRef.current?.click()}
              disabled={uploadFoto.isPending}>{uploadFoto.isPending ? 'Bezig…' : 'Foto toevoegen'}</Knop>
          </>)}>
          {!lead.fotos?.length ? (
            <p className="text-sm text-inkt-muted">Nog geen foto's. Vanaf het webformulier komen ze hier automatisch binnen.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {lead.fotos.map(f => (
                <figure key={f.id} className="group relative overflow-hidden rounded-control border border-inkt/10 bg-vlak-sunken">
                  <a href={f.url} target="_blank" rel="noreferrer">
                    <img src={f.url} alt={f.bestandsnaam} className="aspect-[4/3] w-full object-cover" />
                  </a>
                  {bewerkbaar && (
                    <button className="focusring absolute right-1 top-1 hidden rounded-chip bg-corten-600 px-1.5 text-xs text-stone2-50 group-hover:block"
                      onClick={() => verwijderFoto.mutate(f.id)} aria-label="Foto verwijderen">×</button>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Paneel>

        {wizard && (
          <WizardPaneel stappen={wizard} bewerkbaar={bewerkbaar}
            bijBewaren={stappen => wijzig.mutate({ wizardGegevens: JSON.stringify({ stappen }) })} />
        )}
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
                <Invoer label="Naam" value={nieuweKlant.naam || lead.naam || ''} onChange={e => zetNieuweKlant({ ...nieuweKlant, naam: e.target.value })} required={!klantKeuze} />
              </div>
              {nieuweKlant.type === 'bedrijf' &&
                <Invoer label="Btw nummer" value={nieuweKlant.btwNummer} onChange={e => zetNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })} required />}
              <div className="grid grid-cols-3 gap-4">
                <Invoer label="Straat" optioneel value={nieuweKlant.straat} onChange={e => zetNieuweKlant({ ...nieuweKlant, straat: e.target.value })} />
                <Invoer label="Postcode" optioneel value={nieuweKlant.postcode} onChange={e => zetNieuweKlant({ ...nieuweKlant, postcode: e.target.value })} />
                <Invoer label="Gemeente" optioneel value={nieuweKlant.gemeente || lead.gemeente || ''} onChange={e => zetNieuweKlant({ ...nieuweKlant, gemeente: e.target.value })} />
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

      <Modaal open={verwijderOpen} titel="Lead verwijderen?" onSluit={() => zetVerwijderOpen(false)}>
        <p className="mb-4 text-sm text-inkt-body">
          Dit verwijdert de lead van {leeg(lead.naam ?? lead.email)} definitief uit de werking.
          De audit trail bewaart de historiek. Deze actie kan niet ongedaan worden gemaakt.
        </p>
        <div className="flex justify-end gap-2">
          <Knop type="button" variant="ghost" onClick={() => zetVerwijderOpen(false)}>Annuleren</Knop>
          <Knop variant="destructief" disabled={verwijderen.isPending} onClick={() => verwijderen.mutate()}>Verwijderen</Knop>
        </div>
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

/* De offertewizard van de website, hier als bewerkbare wizard (TS-04 aanvulling).
   Structuurcontract: { stappen: [{ titel, velden: [{ label, waarde }] }] }. */
function WizardPaneel({ stappen, bewerkbaar, bijBewaren }:
  { stappen: WizardStap[]; bewerkbaar: boolean; bijBewaren: (stappen: WizardStap[]) => void }) {
  const [actief, zetActief] = useState(0)
  const [lokaal, zetLokaal] = useState(stappen)
  const [gewijzigd, zetGewijzigd] = useState(false)
  const stap = lokaal[actief]
  if (!stap) return null

  function zetVeld(index: number, waarde: string) {
    const kopie = lokaal.map((s, si) => si === actief
      ? { ...s, velden: s.velden.map((v, vi) => (vi === index ? { ...v, waarde } : v)) }
      : s)
    zetLokaal(kopie)
    zetGewijzigd(true)
  }

  return (
    <Paneel titel="Offerteaanvraag (wizard van de website)" className="col-span-2"
      actie={gewijzigd && bewerkbaar && (
        <Knop variant="secundair" className="h-8 px-3 text-xs"
          onClick={() => { bijBewaren(lokaal); zetGewijzigd(false) }}>Wijzigingen bewaren</Knop>)}>
      <div className="mb-5 flex items-center gap-2">
        {lokaal.map((s, i) => (
          <button key={i} type="button" onClick={() => zetActief(i)}
            className={clsx('focusring flex items-center gap-2 rounded-chip px-2.5 py-1 text-xs font-semibold',
              i === actief ? 'bg-bronze-500/15 text-bronze-600' : 'text-inkt-muted hover:text-inkt')}>
            <span className={clsx('flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
              i === actief ? 'border-bronze-500 text-bronze-600' : 'border-inkt/20')}>{i + 1}</span>
            {s.titel}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stap.velden.map((veld, i) => (
          <Invoer key={`${actief}-${i}`} label={veld.label} value={veld.waarde} disabled={!bewerkbaar}
            onChange={e => zetVeld(i, e.target.value)} />
        ))}
      </div>
      <div className="mt-5 flex justify-between">
        <Knop variant="ghost" type="button" disabled={actief === 0} onClick={() => zetActief(actief - 1)}>Vorige</Knop>
        <Knop variant="neutraal" type="button" disabled={actief === lokaal.length - 1} onClick={() => zetActief(actief + 1)}>Volgende</Knop>
      </div>
    </Paneel>
  )
}
