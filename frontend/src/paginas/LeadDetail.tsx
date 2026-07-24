import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { datum, euro, leeg, persoon, weergaveNaam } from '../lib/formaat'
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

// Nette veldnamen voor de ruwe sleutels uit de websitewizard (poorten,
// overkappingen, automatisering en onderhoud). Onbekende sleutels tonen we as is.
const wizardVeldLabels: Record<string, string> = {
  Dienst: 'Dienst', typePoort: 'Type poort', typeOpening: 'Type opening',
  breedte: 'Breedte (cm)', zijhoogte: 'Zijhoogte (cm)', bediening: 'Type bediening',
  uitvoering: 'Uitvoering', lengte: 'Lengte (cm)', hoogte: 'Hoogte (cm)',
  wanden: 'Aantal wanden', glazenSchuifwand: 'Glazen schuifwand', zonnewerendGlas: 'Zonnewerend glas',
  autoBeschrijving: 'Gegevens van de poort', bouwjaar: 'Bouwjaar', typeMotor: 'Type of merk motor'
}
const wizardLabel = (l: string) => wizardVeldLabels[l] ?? l
const wizardDienstTekst: Record<string, string> = {
  poorten: 'Poorten', overkappingen: 'Overkapping', automatisering: 'Automatisering', onderhoud: 'Onderhoud'
}
const wizardWaarde = (veld: { label: string; waarde: string }) =>
  veld.label === 'Dienst' ? (wizardDienstTekst[veld.waarde] ?? veld.waarde) : veld.waarde

export default function LeadDetail() {
  const { leadId } = useParams({ from: '/app/leads/$leadId' })
  const zoek = useSearch({ strict: false }) as { actie?: string }
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
    onSuccess: () => { ververs(); zetBewerkOpen(false); zetWizardOpen(false) },
    onError: f => zetFout((f as Error).message)
  })
  const [wizardOpen, zetWizardOpen] = useState(false)
  const [wizardVorm, zetWizardVorm] = useState<WizardStap[] | null>(null)

  const [vorm, zetVorm] = useState<{ naam: string; voornaam: string; email: string; telefoon: string
    klantType: string; bedrijfsnaam: string; btwNummer: string
    straat: string; postcode: string; gemeente: string; typeAanvraag: string; gewensteTiming: string
    prijsindicatie: string; opvolgdatum: string; eersteVraag: string } | null>(null)
  function openBewerk() {
    if (!lead) return
    zetVorm({
      naam: lead.naam ?? '', voornaam: lead.voornaam ?? '', email: lead.email ?? '', telefoon: lead.telefoon ?? '',
      klantType: lead.klantType ?? 'particulier', bedrijfsnaam: lead.bedrijfsnaam ?? '', btwNummer: lead.btwNummer ?? '',
      straat: lead.straat ?? '', postcode: lead.postcode ?? '', gemeente: lead.gemeente ?? '', typeAanvraag: lead.typeAanvraag ?? '',
      gewensteTiming: lead.gewensteTiming ?? '',
      prijsindicatie: lead.prijsindicatie != null ? String(lead.prijsindicatie) : '', opvolgdatum: lead.opvolgdatum ?? '',
      eersteVraag: lead.eersteVraag ?? ''
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
  const leegKlant = { type: 'particulier', naam: '', voornaam: '', bedrijfsnaam: '', btwNummer: '', straat: '', postcode: '', gemeente: '', email: '', telefoon: '' }

  // Dubbelcheck: bestaat er al een klant met dit emailadres of deze naam, waarschuw
  // dan voor het aanmaken van een dubbel en bied de bestaande klant meteen aan.
  const { data: dubbelKandidaten } = useQuery({
    queryKey: ['klant-dubbels', lead?.email ?? '', lead?.naam ?? ''],
    queryFn: async () => {
      const zoek = (z: string) => api.get<Klant[]>(`/klanten?${new URLSearchParams({ zoek: z })}`)
      const lijsten = await Promise.all([
        lead?.email ? zoek(lead.email) : Promise.resolve([] as Klant[]),
        lead?.naam ? zoek(lead.naam) : Promise.resolve([] as Klant[])
      ])
      const uniek = new Map<string, Klant>()
      lijsten.flat().forEach(k => uniek.set(k.id, k))
      return [...uniek.values()]
    },
    enabled: omzetOpen && !!lead && !!(lead.email || lead.naam)
  })
  const dubbels = (dubbelKandidaten ?? []).filter(k =>
    (lead?.email && k.email && k.email.toLowerCase() === lead.email.toLowerCase()) ||
    (lead?.naam && k.naam.toLowerCase() === lead.naam.toLowerCase() && (k.voornaam ?? '') === (lead.voornaam ?? '')))
  const [nieuweKlant, zetNieuweKlant] = useState(leegKlant)
  const [omzetModus, zetOmzetModus] = useState<'nieuw' | 'bestaand'>('nieuw')
  const [werf, zetWerf] = useState({ straat: '', postcode: '', gemeente: '' })

  // Isolatieregel: bij het wisselen van lead wordt alle formulierstaat gewist
  // zodat gegevens van record A nooit zichtbaar zijn bij record B.
  useEffect(() => {
    zetOmzetOpen(false); zetVerliesOpen(false); zetVerwijderOpen(false); zetBewerkOpen(false)
    zetKlantKeuze(''); klantZoek.zetInvoer(''); zetNieuweKlant(leegKlant); zetWerf({ straat: '', postcode: '', gemeente: '' }); zetOmzetModus('nieuw')
    zetReden(''); zetVorm(null); zetFout(undefined)
  }, [leadId])

  // SSOT: het omzetvenster opent altijd vers en vooraf ingevuld vanuit de lead.
  function openOmzetten() {
    if (!lead) return
    zetKlantKeuze(''); klantZoek.zetInvoer(''); zetWerf({ straat: '', postcode: '', gemeente: '' }); zetOmzetModus('nieuw')
    zetNieuweKlant({
      ...leegKlant,
      type: lead.klantType === 'bedrijf' ? 'bedrijf' : 'particulier',
      naam: lead.naam ?? '', voornaam: lead.voornaam ?? '',
      bedrijfsnaam: lead.bedrijfsnaam ?? '', btwNummer: lead.btwNummer ?? '',
      straat: lead.straat ?? '', postcode: lead.postcode ?? '', gemeente: lead.gemeente ?? '',
      email: lead.email ?? '', telefoon: lead.telefoon ?? ''
    })
    zetOmzetOpen(true)
  }

  function neemKlantadresOver() {
    const bestaand = klantKeuze ? klanten?.find(k => k.id === klantKeuze) : null
    const bron = bestaand ?? nieuweKlant
    zetWerf({ straat: bron.straat ?? '', postcode: bron.postcode ?? '', gemeente: bron.gemeente ?? '' })
  }
  const omzetten = useMutation({
    mutationFn: () => api.post<{ projectId: string }>(`/leads/${leadId}/omzetten`, {
      klantId: omzetModus === 'bestaand' ? (klantKeuze || null) : null,
      nieuweKlant: omzetModus === 'bestaand' ? null : {
        ...nieuweKlant,
        naam: nieuweKlant.naam || lead?.naam || '',
        voornaam: nieuweKlant.voornaam || lead?.voornaam || null,
        bedrijfsnaam: nieuweKlant.type === 'bedrijf' ? (nieuweKlant.bedrijfsnaam || null) : null,
        btwNummer: nieuweKlant.type === 'bedrijf' ? (nieuweKlant.btwNummer || null) : null,
        gemeente: nieuweKlant.gemeente || lead?.gemeente || null,
        email: nieuweKlant.email || lead?.email || null,
        telefoon: nieuweKlant.telefoon || lead?.telefoon || null
      },
      werfadres: [werf.straat, [werf.postcode, werf.gemeente].filter(Boolean).join(' ')].filter(x => x && x.trim()).join(', '),
      omschrijving: lead?.eersteVraag
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
  const heractiveer = useMutation({
    mutationFn: () => api.post<Lead>(`/leads/${leadId}/heractiveer`, {}),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const verwijderen = useMutation({
    mutationFn: () => api.del(`/leads/${leadId}`),
    onSuccess: () => navigeer({ to: '/leads' }),
    onError: f => zetFout((f as Error).message)
  })

  // Actie-intentie vanuit de leadlijst: eenmalig exact dezelfde flow starten als
  // de knoppen, en de parameter meteen opruimen zodat een refresh niets herhaalt.
  const actieGedaan = useRef(false)
  useEffect(() => {
    if (!lead || actieGedaan.current || !zoek.actie) return
    actieGedaan.current = true
    const a = zoek.actie
    navigeer({ to: '/leads/$leadId', params: { leadId }, search: {}, replace: true })
    if (a === 'omzetten') openOmzetten()
    else if (a === 'verliezen') zetVerliesOpen(true)
    else if (a === 'archiveren') archiveer.mutate(false)
    else if (a === 'herstellen') archiveer.mutate(true)
    else if (a === 'verwijderen') zetVerwijderOpen(true)
  }, [lead, zoek.actie])

  if (!lead) return null
  const wizard = parseWizard(lead.wizardGegevens)
  const openWizardBewerk = () => {
    if (!wizard) return
    zetWizardVorm(wizard.map(s => ({ titel: s.titel, velden: s.velden.map(v => ({ ...v })) })))
    zetWizardOpen(true)
  }
  return (
    <>
      <PaginaKop eyebrow="Verkoop · lead" titel={weergaveNaam(lead) || leeg(lead.email)}
        actie={<div className="flex gap-2">
          {!lead.gearchiveerdOp && (lead.status === 'nieuw' || lead.status === 'gekwalificeerd') &&
            <Knop variant="primair" onClick={openOmzetten}>Omzetten naar dossier ↗</Knop>}
          {!lead.gearchiveerdOp && lead.status === 'verloren' &&
            <Knop variant="primair" onClick={() => heractiveer.mutate()}>Heractiveren ↺</Knop>}
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
            <div className="flex justify-between"><dt className="text-inkt-muted">Type klant</dt>
              <dd>{lead.klantType === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</dd></div>
            {lead.bedrijfsnaam && <div className="flex justify-between"><dt className="text-inkt-muted">Bedrijfsnaam</dt><dd>{lead.bedrijfsnaam}</dd></div>}
            {lead.btwNummer && <div className="flex justify-between"><dt className="text-inkt-muted">Btw nummer</dt><dd>{lead.btwNummer}</dd></div>}
            <div className="flex justify-between"><dt className="text-inkt-muted">Voornaam</dt><dd>{leeg(lead.voornaam)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Naam</dt><dd>{leeg(lead.naam)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Straat en nummer</dt><dd>{leeg(lead.straat)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Postcode</dt><dd>{leeg(lead.postcode)}</dd></div>
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
            <div className="flex gap-3 overflow-x-auto pb-1">
              {lead.fotos.map(f => (
                <figure key={f.id} className="group relative h-32 w-44 flex-none overflow-hidden rounded-control border border-inkt/10 bg-vlak-sunken">
                  <a href={f.url} target="_blank" rel="noreferrer" className="block h-full w-full">
                    <img src={f.url} alt={f.bestandsnaam} className="h-full w-full object-cover" />
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
          <Paneel titel="Offerteaanvraag (wizard van de website)" actie={bewerkbaar && <PotloodKnop onClick={openWizardBewerk} />}>
            <dl className="space-y-1.5 text-sm">
              {wizard.flatMap(s => s.velden).filter(v => v.waarde).map((veld, i) => (
                <div key={i} className="flex justify-between gap-4 border-b border-inkt/[.06] py-1.5 last:border-0">
                  <dt className="text-inkt-muted">{wizardLabel(veld.label)}</dt>
                  <dd className="text-right font-medium">{wizardWaarde(veld)}</dd>
                </div>
              ))}
            </dl>
          </Paneel>
        )}
        <Modaal open={wizardOpen} titel="Offerteaanvraag bewerken" onSluit={() => zetWizardOpen(false)}>
          {wizardVorm && (
            <form className="space-y-4" onSubmit={e => {
              e.preventDefault()
              wijzig.mutate({ wizardGegevens: JSON.stringify({ stappen: wizardVorm }) })
            }}>
              {wizardVorm.flatMap((s, si) => s.velden.map((v, vi) => (
                <Invoer key={`${si}-${vi}`} label={wizardLabel(v.label)} optioneel value={v.waarde}
                  onChange={e => zetWizardVorm(w => {
                    if (!w) return w
                    const kopie = w.map(st => ({ titel: st.titel, velden: st.velden.map(x => ({ ...x })) }))
                    kopie[si].velden[vi].waarde = e.target.value
                    return kopie
                  })} />
              )))}
              <div className="flex justify-end gap-2">
                <Knop type="button" variant="ghost" onClick={() => zetWizardOpen(false)}>Annuleren</Knop>
                <Knop variant="primair" disabled={wijzig.isPending}>{wijzig.isPending ? 'Bezig…' : 'Bewaren'}</Knop>
              </div>
            </form>
          )}
        </Modaal>
      </div>

      <Modaal open={bewerkOpen} titel="Lead bewerken" onSluit={() => zetBewerkOpen(false)}>
        {vorm && (
          <form className="space-y-4" onSubmit={e => {
            e.preventDefault()
            wijzig.mutate({
              naam: vorm.naam, voornaam: vorm.voornaam || null, email: vorm.email || null, telefoon: vorm.telefoon || null,
              klantType: vorm.klantType, bedrijfsnaam: vorm.klantType === 'bedrijf' ? (vorm.bedrijfsnaam || '') : '',
              btwNummer: vorm.klantType === 'bedrijf' ? (vorm.btwNummer || '') : '',
              straat: vorm.straat || null, postcode: vorm.postcode || null, gemeente: vorm.gemeente || null,
              typeAanvraag: vorm.typeAanvraag || null,
              gewensteTiming: vorm.gewensteTiming || null,
              prijsindicatie: vorm.prijsindicatie !== '' ? Number(vorm.prijsindicatie) : null,
              opvolgdatum: vorm.opvolgdatum || null,
              eersteVraag: vorm.eersteVraag || null
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
              <Selecteer label="Type klant" value={vorm.klantType} onChange={e => zetVorm({ ...vorm, klantType: e.target.value })}>
                <option value="particulier">Particulier</option>
                <option value="bedrijf">Bedrijf</option>
              </Selecteer>
              {vorm.klantType === 'bedrijf' && (
                <Invoer label="Bedrijfsnaam" value={vorm.bedrijfsnaam} onChange={e => zetVorm({ ...vorm, bedrijfsnaam: e.target.value })} />
              )}
            </div>
            {vorm.klantType === 'bedrijf' && (
              <Invoer label="Btw nummer" optioneel value={vorm.btwNummer} onChange={e => zetVorm({ ...vorm, btwNummer: e.target.value })} />
            )}
            <Invoer label="Straat en huisnummer" optioneel value={vorm.straat} onChange={e => zetVorm({ ...vorm, straat: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Postcode" optioneel value={vorm.postcode} onChange={e => zetVorm({ ...vorm, postcode: e.target.value })} />
              <Invoer label="Gemeente" optioneel value={vorm.gemeente} onChange={e => zetVorm({ ...vorm, gemeente: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Prijsindicatie (euro)" optioneel type="number" min="0" step="0.01" value={vorm.prijsindicatie}
                onChange={e => zetVorm({ ...vorm, prijsindicatie: e.target.value })} />
              <Invoer label="Opvolgdatum (ten laatste)" optioneel type="date" value={vorm.opvolgdatum}
                onChange={e => zetVorm({ ...vorm, opvolgdatum: e.target.value })} />
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
          Dit verwijdert de lead van {weergaveNaam(lead) || leeg(lead.email)} definitief uit de werking.
          De audit trail bewaart de historiek. Deze actie kan niet ongedaan worden gemaakt.
        </p>
        <div className="flex justify-end gap-2">
          <Knop type="button" variant="ghost" onClick={() => zetVerwijderOpen(false)}>Annuleren</Knop>
          <Knop variant="destructief" disabled={verwijderen.isPending} onClick={() => verwijderen.mutate()}>Verwijderen</Knop>
        </div>
      </Modaal>

      <Modaal open={omzetOpen} titel="Omzetten naar klant en dossier" onSluit={() => zetOmzetOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); omzetten.mutate() }}>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { zetOmzetModus('nieuw'); zetKlantKeuze('') }}
              className={clsx('rounded-control border p-4 text-left transition',
                omzetModus === 'nieuw' ? 'border-bronze-500 bg-bronze-500/10' : 'border-inkt/15 hover:border-bronze-500/50')}>
              <div className="text-sm font-semibold text-inkt">Nieuwe klant aanmaken</div>
              <div className="mt-1 text-xs text-inkt-muted">De gegevens uit de lead staan al ingevuld.</div>
            </button>
            <button type="button" onClick={() => { zetOmzetModus('bestaand'); zetKlantKeuze('') }}
              className={clsx('rounded-control border p-4 text-left transition',
                omzetModus === 'bestaand' ? 'border-bronze-500 bg-bronze-500/10' : 'border-inkt/15 hover:border-bronze-500/50')}>
              <div className="text-sm font-semibold text-inkt">Toevoegen aan bestaande klant</div>
              <div className="mt-1 text-xs text-inkt-muted">Zoek en koppel een klant die al bestaat.</div>
            </button>
          </div>

          {omzetModus === 'nieuw' && dubbels.length > 0 && (
            <Melding soort="info">
              <div className="flex items-center justify-between gap-3">
                <span>Er bestaat al een klant met deze gegevens: <strong>{weergaveNaam(dubbels[0])}</strong>
                  {dubbels[0].gemeente ? ` · ${dubbels[0].gemeente}` : ''}. Vermijd een dubbel.</span>
                <Knop type="button" variant="secundair" className="h-8 shrink-0 whitespace-nowrap px-3 text-xs"
                  onClick={() => { zetOmzetModus('bestaand'); zetKlantKeuze(dubbels[0].id) }}>
                  Gebruik deze klant
                </Knop>
              </div>
            </Melding>
          )}
          {omzetModus === 'bestaand' ? (
            <>
              <Invoer label="Zoek bestaande klant" placeholder="Naam of gemeente…"
                value={klantZoek.invoer} onChange={e => klantZoek.zetInvoer(e.target.value)} />
              <Selecteer label="Bestaande klant" value={klantKeuze} onChange={e => zetKlantKeuze(e.target.value)}>
                <option value="">Kies een klant…</option>
                {klanten?.map(k => <option key={k.id} value={k.id}>{weergaveNaam(k)} · {k.gemeente ?? ''}</option>)}
              </Selecteer>
            </>
          ) : (
            <div className="space-y-4 rounded-control bg-vlak-raised p-4">
              <div className="flex gap-1 rounded-control border border-inkt/10 p-1">
                {(['particulier', 'bedrijf'] as const).map(t => (
                  <button key={t} type="button" onClick={() => zetNieuweKlant({ ...nieuweKlant, type: t })}
                    className={clsx('flex-1 rounded-[6px] px-3 py-1.5 text-sm font-semibold transition',
                      nieuweKlant.type === t ? 'bg-bronze-500 text-forest-950' : 'text-inkt-muted hover:text-inkt')}>
                    {t === 'particulier' ? 'Particulier' : 'Bedrijf'}
                  </button>
                ))}
              </div>
              {nieuweKlant.type === 'bedrijf' && (
                <div className="grid grid-cols-2 gap-4">
                  <Invoer label="Bedrijfsnaam" value={nieuweKlant.bedrijfsnaam} onChange={e => zetNieuweKlant({ ...nieuweKlant, bedrijfsnaam: e.target.value })} required />
                  <Invoer label="Btw nummer" value={nieuweKlant.btwNummer} onChange={e => zetNieuweKlant({ ...nieuweKlant, btwNummer: e.target.value })} required />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Naam" value={nieuweKlant.naam} onChange={e => zetNieuweKlant({ ...nieuweKlant, naam: e.target.value })} required />
                <Invoer label="Voornaam" optioneel value={nieuweKlant.voornaam} onChange={e => zetNieuweKlant({ ...nieuweKlant, voornaam: e.target.value })} />
              </div>
              <Invoer label="Straat en huisnummer" optioneel value={nieuweKlant.straat} onChange={e => zetNieuweKlant({ ...nieuweKlant, straat: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Postcode" optioneel value={nieuweKlant.postcode} onChange={e => zetNieuweKlant({ ...nieuweKlant, postcode: e.target.value })} />
                <Invoer label="Stad of gemeente" optioneel value={nieuweKlant.gemeente} onChange={e => zetNieuweKlant({ ...nieuweKlant, gemeente: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Email" optioneel type="email" value={nieuweKlant.email} onChange={e => zetNieuweKlant({ ...nieuweKlant, email: e.target.value })} />
                <Invoer label="Telefoon" optioneel value={nieuweKlant.telefoon} onChange={e => zetNieuweKlant({ ...nieuweKlant, telefoon: e.target.value })} />
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Werfadres</div>
              <Knop type="button" variant="ghost" className="h-8 whitespace-nowrap px-3 text-xs" onClick={neemKlantadresOver}>
                Neem klantadres over
              </Knop>
            </div>
            <Invoer label="Straat en huisnummer" value={werf.straat} onChange={e => zetWerf({ ...werf, straat: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Postcode" optioneel value={werf.postcode} onChange={e => zetWerf({ ...werf, postcode: e.target.value })} />
              <Invoer label="Stad of gemeente" optioneel value={werf.gemeente} onChange={e => zetWerf({ ...werf, gemeente: e.target.value })} />
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

