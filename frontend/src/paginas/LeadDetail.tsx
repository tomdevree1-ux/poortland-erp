import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { datum, euro, leeg, persoon } from '../lib/formaat'
import type { Klant, Lead } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer, TekstVak } from '../ui'
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
  const [bewerkOpen, zetBewerkOpen] = useState(false)
  const [fout, zetFout] = useState<string>()
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const isBeheerder = mij?.rollen.includes('beheerder') ?? false
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['lead', leadId] }) }
  const bewerkbaar = (lead?.status === 'nieuw' || lead?.status === 'gekwalificeerd') && !lead?.gearchiveerdOp

  const wijzig = useMutation({
    mutationFn: (deel: Record<string, unknown>) => api.patch<Lead>(`/leads/${leadId}`, deel),
    onSuccess: () => { ververs(); zetBewerkOpen(false) },
    onError: f => zetFout((f as Error).message)
  })

  const [vorm, zetVorm] = useState<{ naam: string; voornaam: string; email: string; telefoon: string
    straat: string; gemeente: string; typeAanvraag: string; gewensteTiming: string; eersteVraag: string } | null>(null)
  function openBewerk() {
    if (!lead) return
    zetVorm({
      naam: lead.naam ?? '', voornaam: lead.voornaam ?? '', email: lead.email ?? '', telefoon: lead.telefoon ?? '',
      straat: lead.straat ?? '', gemeente: lead.gemeente ?? '', typeAanvraag: lead.typeAanvraag ?? '',
      gewensteTiming: lead.gewensteTiming ?? '', eersteVraag: lead.eersteVraag ?? ''
    })
    zetBewerkOpen(true)
  }

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
  const klantZoek = useZoekterm()
  const { data: klanten } = useQuery({
    queryKey: ['klanten', klantZoek.term],
    queryFn: () => api.get<Klant[]>(`/klanten?${new URLSearchParams(klantZoek.term ? { zoek: klantZoek.term } : {})}`),
    enabled: omzetOpen
  })
  const leegKlant = { type: 'particulier', naam: '', voornaam: '', btwNummer: '', straat: '', postcode: '', gemeente: '', email: '', telefoon: '' }
  const [nieuweKlant, zetNieuweKlant] = useState(leegKlant)
  const [werfadres, zetWerfadres] = useState('')

  // Isolatieregel: bij het wisselen van lead wordt alle formulierstaat gewist
  // zodat gegevens van record A nooit zichtbaar zijn bij record B.
  useEffect(() => {
    zetOmzetOpen(false); zetVerliesOpen(false); zetVerwijderOpen(false); zetBewerkOpen(false)
    zetKlantKeuze(''); klantZoek.zetInvoer(''); zetNieuweKlant(leegKlant); zetWerfadres('')
    zetReden(''); zetVorm(null); zetFout(undefined)
  }, [leadId])

  // SSOT: het omzetvenster opent altijd vers en vooraf ingevuld vanuit de lead.
  function openOmzetten() {
    if (!lead) return
    zetKlantKeuze(''); klantZoek.zetInvoer(''); zetWerfadres('')
    zetNieuweKlant({
      ...leegKlant,
      naam: lead.naam ?? '', voornaam: lead.voornaam ?? '', straat: lead.straat ?? '', gemeente: lead.gemeente ?? '',
      email: lead.email ?? '', telefoon: lead.telefoon ?? ''
    })
    zetOmzetOpen(true)
  }

  function neemKlantadresOver() {
    const bestaand = klantKeuze ? klanten?.find(k => k.id === klantKeuze) : null
    const bron = bestaand ?? nieuweKlant
    const adres = [bron.straat, [bron.postcode, bron.gemeente].filter(Boolean).join(' ')]
      .filter(x => x && String(x).trim()).join(', ')
    if (adres) zetWerfadres(adres)
  }
  const omzetten = useMutation({
    mutationFn: () => api.post<{ projectId: string }>(`/leads/${leadId}/omzetten`, {
      klantId: klantKeuze || null,
      nieuweKlant: klantKeuze ? null : {
        ...nieuweKlant,
        naam: nieuweKlant.naam || lead?.naam || '',
        voornaam: nieuweKlant.voornaam || lead?.voornaam || null,
        gemeente: nieuweKlant.gemeente || lead?.gemeente || null,
        btwNummer: nieuweKlant.btwNummer || null,
        email: nieuweKlant.email || lead?.email || null,
        telefoon: nieuweKlant.telefoon || lead?.telefoon || null
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
      <PaginaKop eyebrow="Verkoop · lead" titel={persoon(lead.voornaam, lead.naam) || leeg(lead.email)}
        actie={<div className="flex gap-2">
          {!lead.gearchiveerdOp && (lead.status === 'nieuw' || lead.status === 'gekwalificeerd') &&
            <Knop variant="primair" onClick={openOmzetten}>Omzetten naar dossier ↗</Knop>}
          {bewerkbaar && <Knop variant="ghost" onClick={() => zetVerliesOpen(true)}>Verliezen</Knop>}
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
        <Paneel titel="Aanvraag" actie={bewerkbaar && <PotloodKnop onClick={openBewerk} />}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={lead.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Type aanvraag</dt>
              <dd>{leeg(lead.typeAanvraag
                ? lead.typeAanvraag.split(',').map(x => typeTekst[x.trim()] ?? x.trim()).join(', ')
                : null)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Gewenste timing</dt>
              <dd>{leeg(lead.gewensteTiming ? timingTekst[lead.gewensteTiming] ?? lead.gewensteTiming : null)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Naam</dt><dd>{leeg(persoon(lead.voornaam, lead.naam))}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Straat en nummer</dt><dd>{leeg(lead.straat)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Gemeente</dt><dd>{leeg(lead.gemeente)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(lead.email)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(lead.telefoon)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Opvolgdatum (ten laatste)</dt><dd>{datum(lead.opvolgdatum)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Prijsindicatie</dt><dd className="cijfers">{euro(lead.prijsindicatie)}</dd></div>
            {lead.privacyAkkoord && (
              <div className="flex justify-between"><dt className="text-inkt-muted">Privacy akkoord</dt>
                <dd>ja · {datum(lead.privacyAkkoordOp)}</dd></div>
            )}
            {lead.verliesReden && <div className="flex justify-between"><dt className="text-inkt-muted">Reden verlies</dt><dd>{lead.verliesReden}</dd></div>}
          </dl>
        </Paneel>

        <Paneel titel="Omschrijving van het project" actie={bewerkbaar && <PotloodKnop onClick={openBewerk} />}>
          <p className="whitespace-pre-line text-sm leading-relaxed text-inkt-body">{leeg(lead.eersteVraag)}</p>
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
                      onClick={e => { e.stopPropagation(); verwijderFoto.mutate(f.id) }} aria-label="Foto verwijderen">×</button>
                  )}
                </figure>
              ))}
            </div>
          )}
        </Paneel>

        {wizard && (
          <WizardPaneel stappen={wizard} magBewerken={bewerkbaar}
            bijBewaren={stappen => wijzig.mutate({ wizardGegevens: JSON.stringify({ stappen }) })} />
        )}
      </div>

      <Modaal open={bewerkOpen} titel="Lead bewerken" onSluit={() => zetBewerkOpen(false)}>
        {vorm && (
          <form className="space-y-4" onSubmit={e => {
            e.preventDefault()
            wijzig.mutate({
              naam: vorm.naam, voornaam: vorm.voornaam || null, email: vorm.email || null, telefoon: vorm.telefoon || null,
              straat: vorm.straat || null, gemeente: vorm.gemeente || null, typeAanvraag: vorm.typeAanvraag || null,
              gewensteTiming: vorm.gewensteTiming || null, eersteVraag: vorm.eersteVraag || null
            })
          }}>
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
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Straat en huisnummer" optioneel value={vorm.straat} onChange={e => zetVorm({ ...vorm, straat: e.target.value })} />
              <Invoer label="Gemeente" optioneel value={vorm.gemeente} onChange={e => zetVorm({ ...vorm, gemeente: e.target.value })} />
            </div>
            <TekstVak label="Omschrijving van het project" optioneel value={vorm.eersteVraag}
              onChange={e => zetVorm({ ...vorm, eersteVraag: e.target.value })} />
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetBewerkOpen(false)}>Annuleren</Knop>
              <Knop variant="primair" disabled={wijzig.isPending}>{wijzig.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
            </div>
          </form>
        )}
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

      <Modaal open={omzetOpen} titel="Omzetten naar klant en dossier" onSluit={() => zetOmzetOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); omzetten.mutate() }}>
          <Invoer label="Zoek bestaande klant" optioneel placeholder="Naam of gemeente…"
            value={klantZoek.invoer} onChange={e => klantZoek.zetInvoer(e.target.value)} />
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
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Voornaam" optioneel value={nieuweKlant.voornaam} onChange={e => zetNieuweKlant({ ...nieuweKlant, voornaam: e.target.value })} />
              </div>
              {nieuweKlant.type === 'bedrijf' &&
                <Invoer label="Btw nummer" value={nieuweKlant.btwNummer} onChange={e => zetNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })} required />}
              <div className="grid grid-cols-3 gap-4">
                <Invoer label="Straat" optioneel value={nieuweKlant.straat} onChange={e => zetNieuweKlant({ ...nieuweKlant, straat: e.target.value })} />
                <Invoer label="Postcode" optioneel value={nieuweKlant.postcode} onChange={e => zetNieuweKlant({ ...nieuweKlant, postcode: e.target.value })} />
                <Invoer label="Gemeente" optioneel value={nieuweKlant.gemeente} onChange={e => zetNieuweKlant({ ...nieuweKlant, gemeente: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Email" optioneel type="email" value={nieuweKlant.email} onChange={e => zetNieuweKlant({ ...nieuweKlant, email: e.target.value })} />
                <Invoer label="Telefoon" optioneel value={nieuweKlant.telefoon} onChange={e => zetNieuweKlant({ ...nieuweKlant, telefoon: e.target.value })} />
              </div>
            </div>
          )}
          <div>
            <div className="flex items-end justify-between gap-4">
              <Invoer label="Werfadres" value={werfadres} onChange={e => zetWerfadres(e.target.value)} required className="flex-1" />
              <Knop type="button" variant="ghost" className="h-10 whitespace-nowrap px-3 text-xs" onClick={neemKlantadresOver}>
                Neem klantadres over
              </Knop>
            </div>
          </div>
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

/* De offertewizard van de website: leesmodus eerst en bewerken via het potlood
   met Opslaan en Annuleren (platform UX regels). */
function WizardPaneel({ stappen, magBewerken, bijBewaren }:
  { stappen: WizardStap[]; magBewerken: boolean; bijBewaren: (stappen: WizardStap[]) => void }) {
  const [actief, zetActief] = useState(0)
  const [bewerkModus, zetBewerkModus] = useState(false)
  const [lokaal, zetLokaal] = useState(stappen)
  const stap = (bewerkModus ? lokaal : stappen)[actief]
  if (!stap) return null

  function start() { zetLokaal(stappen.map(s => ({ ...s, velden: s.velden.map(v => ({ ...v })) }))); zetBewerkModus(true) }
  function zetVeld(index: number, waarde: string) {
    zetLokaal(lokaal.map((s, si) => si === actief
      ? { ...s, velden: s.velden.map((v, vi) => (vi === index ? { ...v, waarde } : v)) }
      : s))
  }

  return (
    <Paneel titel="Offerteaanvraag (wizard van de website)" className="col-span-2"
      actie={bewerkModus ? (
        <div className="flex gap-2">
          <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => zetBewerkModus(false)}>Annuleren</Knop>
          <Knop variant="primair" className="h-8 px-3 text-xs"
            onClick={() => { bijBewaren(lokaal); zetBewerkModus(false) }}>Opslaan</Knop>
        </div>
      ) : magBewerken && <PotloodKnop onClick={start} />}>
      <div className="mb-5 flex items-center gap-2">
        {(bewerkModus ? lokaal : stappen).map((s, i) => (
          <button key={i} type="button" onClick={() => zetActief(i)}
            className={clsx('focusring flex items-center gap-2 rounded-chip px-2.5 py-1 text-xs font-semibold',
              i === actief ? 'bg-bronze-500/15 text-bronze-600' : 'text-inkt-muted hover:text-inkt')}>
            <span className={clsx('flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
              i === actief ? 'border-bronze-500 text-bronze-600' : 'border-inkt/20')}>{i + 1}</span>
            {s.titel}
          </button>
        ))}
      </div>
      {bewerkModus ? (
        <div className="grid grid-cols-2 gap-4">
          {stap.velden.map((veld, i) => (
            <Invoer key={`${actief}-${i}`} label={veld.label} value={veld.waarde}
              onChange={e => zetVeld(i, e.target.value)} />
          ))}
        </div>
      ) : (
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {stap.velden.map((veld, i) => (
            <div key={i} className="flex justify-between gap-4 border-b border-inkt/[.06] py-1.5">
              <dt className="text-inkt-muted">{veld.label}</dt>
              <dd className="text-right font-medium">{veld.waarde || '—'}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-5 flex justify-between">
        <Knop variant="ghost" type="button" disabled={actief === 0} onClick={() => zetActief(actief - 1)}>Vorige</Knop>
        <Knop variant="neutraal" type="button" disabled={actief === stappen.length - 1} onClick={() => zetActief(actief + 1)}>Volgende</Knop>
      </div>
    </Paneel>
  )
}
