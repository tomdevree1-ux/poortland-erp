import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, euro, leeg, weergaveNaam } from '../lib/formaat'
import type { Klant, Offerte, Onderdeel, OnderdeelStatus, ProductieData } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer, Selectievak, Th, Td, VuilbakKnop, rijKlik, statusTekst } from '../ui'

interface Dossier {
  project: { id: string; nummer?: number; werfadres: string; omschrijving?: string; status: string; garantieMaanden: number; klant: Klant }
  offertes: Offerte[]
  order?: { id: string; datumGoedkeuring: string; status: string }
  communicatie: { id: string; onderwerp: string; verzondenOp: string; status: string }[]
  contactmomenten: { id: string; type: string; datum: string; notitie?: string }[]
}

export default function DossierDetail() {
  const { projectId } = useParams({ from: '/app/dossiers/$projectId' })
  const navigeer = useNavigate()
  const qc = useQueryClient()
  const [tab, zetTab] = useState<'overzicht' | 'productie' | 'offertes' | 'communicatie'>('overzicht')
  const { data } = useQuery({ queryKey: ['dossier', projectId], queryFn: () => api.get<Dossier>(`/projecten/${projectId}`) })
  const maakOfferte = useMutation({
    mutationFn: () => api.post<Offerte>(`/projecten/${projectId}/offertes`, { taal: null }),
    onSuccess: o => { qc.invalidateQueries({ queryKey: ['dossier', projectId] }); navigeer({ to: '/offertes/$offerteId', params: { offerteId: o.id } }) }
  })

  // SSOT: de klant is 1 record; hier bewerken werkt overal door (klantenlijst, fiche, offerte).
  const [klantFout, zetKlantFout] = useState<string>()
  const [klantOpen, zetKlantOpen] = useState(false)
  const [klantVorm, zetKlantVorm] = useState<{ type: string; voornaam: string; naam: string; bedrijfsnaam: string; btwNummer: string
    straat: string; postcode: string; gemeente: string; email: string; telefoon: string } | null>(null)
  function openKlantBewerk() {
    const k = data!.project.klant
    zetKlantVorm({
      type: k.type, voornaam: k.voornaam ?? '', naam: k.naam, bedrijfsnaam: k.bedrijfsnaam ?? '', btwNummer: k.btwNummer ?? '',
      straat: k.straat ?? '', postcode: k.postcode ?? '', gemeente: k.gemeente ?? '', email: k.email ?? '', telefoon: k.telefoon ?? ''
    })
    zetKlantFout(undefined); zetKlantOpen(true)
  }
  const bewaarKlant = useMutation({
    mutationFn: () => api.patch(`/klanten/${data!.project.klant.id}`, {
      ...klantVorm, voornaam: klantVorm!.voornaam || null,
      bedrijfsnaam: klantVorm!.type === 'bedrijf' ? (klantVorm!.bedrijfsnaam || null) : null,
      btwNummer: klantVorm!.type === 'bedrijf' ? (klantVorm!.btwNummer || null) : null,
      straat: klantVorm!.straat || null, postcode: klantVorm!.postcode || null, gemeente: klantVorm!.gemeente || null,
      email: klantVorm!.email || null, telefoon: klantVorm!.telefoon || null,
      communicatietaal: data!.project.klant.communicatietaal, communicatievoorkeur: null
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dossier', projectId] })
      qc.invalidateQueries({ queryKey: ['klanten'] })
      zetKlantOpen(false)
    },
    onError: f => zetKlantFout((f as Error).message)
  })
  if (!data) return null
  const { project, offertes, order, communicatie, contactmomenten } = data
  const tabs = [
    ['overzicht', 'Overzicht'], ['productie', 'Productie'],
    ['offertes', `Offertes en order (${offertes.length})`],
    ['communicatie', 'Communicatie']
  ] as const
  return (
    <>
      <PaginaKop eyebrow={project.nummer ? `Dossier ${project.nummer}` : 'Dossier'}
        titel={weergaveNaam(project.klant)}
        actie={<Knop variant="primair" onClick={() => maakOfferte.mutate()} disabled={maakOfferte.isPending}>
          {offertes.length ? 'Nieuwe offerteversie ↗' : 'Offerte maken ↗'}</Knop>} />
      <div className="mb-5 flex gap-1 border-b border-inkt/10">
        {tabs.map(([sleutel, tekst]) => (
          <button key={sleutel} onClick={() => zetTab(sleutel)}
            className={clsx('focusring px-4 py-2 text-sm font-semibold',
              tab === sleutel ? 'border-b-2 border-bronze-500 text-inkt' : 'text-inkt-muted hover:text-inkt')}>
            {tekst}
          </button>
        ))}
      </div>

      {tab === 'overzicht' && (
        <div className="grid grid-cols-2 gap-6">
          <Paneel titel="Klantgegevens" actie={<PotloodKnop onClick={openKlantBewerk} />}>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Type</dt><dd>{project.klant.type === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</dd></div>
              {project.klant.bedrijfsnaam && <div className="flex justify-between"><dt className="text-inkt-muted">Bedrijfsnaam</dt><dd className="font-semibold">{project.klant.bedrijfsnaam}</dd></div>}
              <div className="flex justify-between"><dt className="text-inkt-muted">Voornaam</dt><dd>{leeg(project.klant.voornaam)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Naam</dt><dd className="font-semibold">{leeg(project.klant.naam)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Adres</dt><dd>{leeg([project.klant.straat, project.klant.postcode, project.klant.gemeente].filter(Boolean).join(', '))}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(project.klant.email)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(project.klant.telefoon)}</dd></div>
              {project.klant.btwNummer && <div className="flex justify-between"><dt className="text-inkt-muted">Btw</dt><dd>{project.klant.btwNummer}</dd></div>}
            </dl>
          </Paneel>
          <Paneel titel="Contactmomenten">
            {contactmomenten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen contactmomenten.</p> : (
              <ul className="space-y-2 text-sm">
                {contactmomenten.map(c => (
                  <li key={c.id} className="flex justify-between gap-4">
                    <span className="text-inkt-body">{c.type} · {leeg(c.notitie)}</span>
                    <span className="whitespace-nowrap text-inkt-muted">{datum(c.datum)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Paneel>
          <Paneel titel="Dossier" className="col-span-2">
            <dl className="mb-3 grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Werfadres</dt><dd className="font-semibold">{leeg(project.werfadres)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={project.status} /></dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Garantie</dt><dd>{project.garantieMaanden} maanden</dd></div>
            </dl>
            <div className="border-t border-inkt/[.06] pt-2.5">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Omschrijving</div>
              <p className="text-sm text-inkt-body">{leeg(project.omschrijving)}</p>
            </div>
          </Paneel>
        </div>
      )}

      {tab === 'productie' && <ProductieTab projectId={projectId} />}

      {tab === 'offertes' && (
        <>
          {order && (
            <div className="mb-4 rounded-card border border-olive-500/40 bg-olive-500/10 px-5 py-3 text-sm">
              Order aangemaakt op {datum(order.datumGoedkeuring)} · <Badge status={order.status} />
            </div>
          )}
          <table className="w-full border-separate border-spacing-0">
            <thead><tr><Th>Nummer</Th><Th>Versie</Th><Th>Status</Th><Th>Geldig tot</Th><Th rechts>Totaal excl.</Th></tr></thead>
            <tbody>
              {offertes.map(o => (
                <tr key={o.id} className={rijKlik}
                  onClick={() => navigeer({ to: '/offertes/$offerteId', params: { offerteId: o.id } })}>
                  <Td className="font-semibold">{o.nummer}</Td>
                  <Td>v{o.versieOfferte}</Td>
                  <Td><Badge status={o.status} /></Td>
                  <Td>{datum(o.geldigTot)}</Td>
                  <Td rechts>{euro(o.totaalExclBtw)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'communicatie' && (
        <Paneel titel="Verzonden communicatie">
          {communicatie.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen communicatie bij dit dossier.</p> : (
            <ul className="space-y-2 text-sm">
              {communicatie.map(c => (
                <li key={c.id} className="flex justify-between gap-4">
                  <span>{c.onderwerp}</span>
                  <span className="whitespace-nowrap text-inkt-muted">{datum(c.verzondenOp)}</span>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      )}

      <Modaal open={klantOpen} titel="Klantgegevens bewerken" onSluit={() => zetKlantOpen(false)}>
        {klantVorm && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarKlant.mutate() }}>
            {klantFout && <Melding soort="fout">{klantFout}</Melding>}
            <Selecteer label="Type" value={klantVorm.type} onChange={e => zetKlantVorm({ ...klantVorm, type: e.target.value })}>
              <option value="particulier">Particulier</option>
              <option value="bedrijf">Bedrijf</option>
            </Selecteer>
            {klantVorm.type === 'bedrijf' && (
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Bedrijfsnaam" value={klantVorm.bedrijfsnaam} onChange={e => zetKlantVorm({ ...klantVorm, bedrijfsnaam: e.target.value })} required />
                <Invoer label="Btw nummer" value={klantVorm.btwNummer} onChange={e => zetKlantVorm({ ...klantVorm, btwNummer: e.target.value })} required />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Voornaam" optioneel value={klantVorm.voornaam} onChange={e => zetKlantVorm({ ...klantVorm, voornaam: e.target.value })} />
              <Invoer label="Naam" value={klantVorm.naam} onChange={e => zetKlantVorm({ ...klantVorm, naam: e.target.value })} required />
            </div>
            <Invoer label="Straat en huisnummer" optioneel value={klantVorm.straat} onChange={e => zetKlantVorm({ ...klantVorm, straat: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Postcode" optioneel value={klantVorm.postcode} onChange={e => zetKlantVorm({ ...klantVorm, postcode: e.target.value })} />
              <Invoer label="Stad of gemeente" optioneel value={klantVorm.gemeente} onChange={e => zetKlantVorm({ ...klantVorm, gemeente: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Email" optioneel type="email" value={klantVorm.email} onChange={e => zetKlantVorm({ ...klantVorm, email: e.target.value })} />
              <Invoer label="Telefoon" optioneel value={klantVorm.telefoon} onChange={e => zetKlantVorm({ ...klantVorm, telefoon: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetKlantOpen(false)}>Annuleren</Knop>
              <Knop variant="primair" disabled={bewaarKlant.isPending || !klantVorm.naam.trim()}>
                {bewaarKlant.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
            </div>
          </form>
        )}
      </Modaal>
    </>
  )
}

/* TS-07: het digitale productiedossier. De volgende stap per onderdeel volgt de
   behandelingsketen en respecteert de van toepassing vlaggen; de databank
   bewaakt de overgang als tweede laag. */
function volgendeStap(o: Onderdeel): OnderdeelStatus | null {
  switch (o.status) {
    case 'besteld': return 'inProductie'
    case 'inProductie': return o.voorbehandelingVanToepassing ? 'voorbehandeling'
      : (o.lakwerkVanToepassing ? 'lakwerk' : 'klaarVoorMontage')
    case 'voorbehandeling': return o.lakwerkVanToepassing ? 'lakwerk' : 'klaarVoorMontage'
    case 'lakwerk': return 'klaarVoorMontage'
    case 'klaarVoorMontage': return 'gemonteerd'
    default: return null
  }
}

function ProductieTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const { data } = useQuery({
    queryKey: ['productie', projectId],
    queryFn: () => api.get<ProductieData>(`/projecten/${projectId}/productie`)
  })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['productie', projectId] }) }
  const bijFout = (f: unknown) => zetFout((f as Error).message)

  const maakStuklijst = useMutation({
    mutationFn: () => api.post(`/projecten/${projectId}/stuklijst`, {}),
    onSuccess: ververs, onError: bijFout
  })
  const nieuweVersie = useMutation({
    mutationFn: () => api.post(`/stuklijsten/${data!.stuklijst!.id}/nieuwe-versie`, {}),
    onSuccess: ververs, onError: bijFout
  })
  const zetStatus = useMutation({
    mutationFn: (p: { id: string; status: OnderdeelStatus }) => api.post(`/onderdelen/${p.id}/status`, { status: p.status }),
    onSuccess: ververs, onError: bijFout
  })
  const verwijderOnderdeel = useMutation({
    mutationFn: (id: string) => api.del(`/onderdelen/${id}`),
    onSuccess: ververs, onError: bijFout
  })

  const leegOnderdeel = { productcode: '', omschrijving: '', afmetingen: '', materiaal: '',
    voorbehandelingVanToepassing: true, lakwerkVanToepassing: true,
    leverancierVoorbehandelingId: '', leverancierLakwerkId: '', lakwerkRal: '',
    etaVoorbehandeling: '', etaLakwerk: '' }
  const [onderdeelOpen, zetOnderdeelOpen] = useState(false)
  const [bewerkId, zetBewerkId] = useState<string | null>(null)
  const [vorm, zetVorm] = useState(leegOnderdeel)
  function openNieuw() { zetBewerkId(null); zetVorm(leegOnderdeel); zetOnderdeelOpen(true) }
  function openBewerk(o: Onderdeel) {
    zetBewerkId(o.id)
    zetVorm({
      productcode: o.productcode, omschrijving: o.omschrijving ?? '', afmetingen: o.afmetingen ?? '', materiaal: o.materiaal ?? '',
      voorbehandelingVanToepassing: o.voorbehandelingVanToepassing, lakwerkVanToepassing: o.lakwerkVanToepassing,
      leverancierVoorbehandelingId: o.leverancierVoorbehandelingId ?? '', leverancierLakwerkId: o.leverancierLakwerkId ?? '',
      lakwerkRal: o.lakwerkRal ?? '', etaVoorbehandeling: o.etaVoorbehandeling ?? '', etaLakwerk: o.etaLakwerk ?? ''
    })
    zetOnderdeelOpen(true)
  }
  const bewaarOnderdeel = useMutation({
    mutationFn: () => {
      const payload = {
        productcode: vorm.productcode, omschrijving: vorm.omschrijving || null,
        afmetingen: vorm.afmetingen || null, materiaal: vorm.materiaal || null,
        voorbehandelingVanToepassing: vorm.voorbehandelingVanToepassing, lakwerkVanToepassing: vorm.lakwerkVanToepassing,
        leverancierVoorbehandelingId: vorm.voorbehandelingVanToepassing ? (vorm.leverancierVoorbehandelingId || null) : null,
        leverancierLakwerkId: vorm.lakwerkVanToepassing ? (vorm.leverancierLakwerkId || null) : null,
        lakwerkRal: vorm.lakwerkVanToepassing ? (vorm.lakwerkRal || null) : null,
        etaVoorbehandeling: vorm.voorbehandelingVanToepassing ? (vorm.etaVoorbehandeling || null) : null,
        etaLakwerk: vorm.lakwerkVanToepassing ? (vorm.etaLakwerk || null) : null
      }
      return bewerkId ? api.patch(`/onderdelen/${bewerkId}`, payload)
        : api.post(`/stuklijsten/${data!.stuklijst!.id}/onderdelen`, payload)
    },
    onSuccess: () => { ververs(); zetOnderdeelOpen(false) },
    onError: bijFout
  })

  const bestandRef = useRef<HTMLInputElement>(null)
  const uploadTekening = useMutation({
    mutationFn: (b: File) => { const f = new FormData(); f.append('bestand', b); return api.formulier(`/projecten/${projectId}/tekeningen`, f) },
    onSuccess: ververs, onError: bijFout
  })
  const verwijderTekening = useMutation({
    mutationFn: (id: string) => api.del(`/tekeningen/${id}`),
    onSuccess: ververs, onError: bijFout
  })

  if (!data) return null
  const levNaam = (id?: string) => data.leveranciers.find(l => l.id === id)?.naam

  return (
    <div className="space-y-6">
      {fout && <Melding soort="fout">{fout}</Melding>}

      {!data.stuklijst ? (
        <Paneel titel="Stuklijst">
          <p className="mb-4 text-sm text-inkt-muted">
            Nog geen stuklijst voor dit dossier. Start de stuklijst en voeg de onderdelen toe;
            de behandelingsketen (voorbehandeling en lakwerk) volgt per onderdeel.
          </p>
          <Knop variant="primair" onClick={() => maakStuklijst.mutate()} disabled={maakStuklijst.isPending}>
            {maakStuklijst.isPending ? 'Bezig…' : 'Stuklijst starten'}
          </Knop>
        </Paneel>
      ) : (
        <Paneel titel={`Stuklijst versie ${data.stuklijst.versieStuklijst} · ${datum(data.stuklijst.datumOpmaak)}`}
          actie={
            <div className="flex items-center gap-3">
              <Badge status={data.productieStatus} />
              <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => nieuweVersie.mutate()} disabled={nieuweVersie.isPending}>
                Nieuwe versie
              </Knop>
              <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={openNieuw}>Onderdeel toevoegen</Knop>
            </div>
          }>
          {data.onderdelen.length === 0 ? (
            <p className="text-sm text-inkt-muted">Nog geen onderdelen. Voeg het eerste onderdeel toe.</p>
          ) : (
            <table className="w-full border-separate border-spacing-0">
              <thead><tr>
                <Th>Productcode</Th><Th>Omschrijving</Th><Th>Afmetingen</Th><Th>Materiaal</Th>
                <Th>Behandelingen</Th><Th>Status</Th><Th>{''}</Th>
              </tr></thead>
              <tbody>
                {data.onderdelen.map(o => {
                  const volgende = volgendeStap(o)
                  return (
                    <tr key={o.id}>
                      <Td className="font-semibold">{o.productcode}</Td>
                      <Td>{leeg(o.omschrijving)}</Td>
                      <Td>{leeg(o.afmetingen)}</Td>
                      <Td>{leeg(o.materiaal)}</Td>
                      <Td>
                        <div className="space-y-1 text-xs">
                          <div className={o.voorbehandelingVanToepassing ? '' : 'text-inkt-faint line-through'}>
                            VB{o.voorbehandelingVanToepassing
                              ? ` · ${levNaam(o.leverancierVoorbehandelingId) ?? 'leverancier n.t.b.'}${o.etaVoorbehandeling ? ` · ${datum(o.etaVoorbehandeling)}` : ''}`
                              : ' n.v.t.'}
                          </div>
                          <div className={o.lakwerkVanToepassing ? '' : 'text-inkt-faint line-through'}>
                            LAK{o.lakwerkVanToepassing
                              ? ` · ${levNaam(o.leverancierLakwerkId) ?? 'leverancier n.t.b.'}${o.lakwerkRal ? ` · RAL ${o.lakwerkRal}` : ''}${o.etaLakwerk ? ` · ${datum(o.etaLakwerk)}` : ''}`
                              : ' n.v.t.'}
                          </div>
                        </div>
                      </Td>
                      <Td><Badge status={o.status} /></Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          {volgende && (
                            <Knop variant="secundair" className="h-7 whitespace-nowrap px-2.5 text-xs"
                              onClick={() => zetStatus.mutate({ id: o.id, status: volgende })} disabled={zetStatus.isPending}>
                              → {statusTekst[volgende]}
                            </Knop>
                          )}
                          <PotloodKnop onClick={() => openBewerk(o)} />
                          <VuilbakKnop onClick={() => verwijderOnderdeel.mutate(o.id)} />
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {data.vorigeVersies.length > 0 && (
            <p className="mt-3 text-xs text-inkt-faint">
              Vorige versies: {data.vorigeVersies.map(v => `v${v.versieStuklijst} (${datum(v.datumOpmaak)})`).join(' · ')}
            </p>
          )}
        </Paneel>
      )}

      <Paneel titel="Tekeningen" actie={
        <>
          <input ref={bestandRef} type="file" accept="application/pdf" hidden
            onChange={e => { const b = e.target.files?.[0]; if (b) uploadTekening.mutate(b); e.target.value = '' }} />
          <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => bestandRef.current?.click()}
            disabled={uploadTekening.isPending}>{uploadTekening.isPending ? 'Bezig…' : 'Tekening uploaden'}</Knop>
        </>}>
        {data.tekeningen.length === 0 ? (
          <p className="text-sm text-inkt-muted">Nog geen tekeningen. Upload de AutoCAD tekening als PDF; versie, datum en auteur worden vastgelegd.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.tekeningen.map(t => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-control border border-inkt/[.07] bg-vlak-surface px-3 py-2">
                <div>
                  <a href={t.url} target="_blank" rel="noreferrer" className="font-semibold text-bronze-600 hover:underline">
                    v{t.tekeningVersie} · {t.bestandsnaam}
                  </a>
                  <div className="text-xs text-inkt-muted">{datum(t.datum)}{t.auteur ? ` · ${t.auteur}` : ''}</div>
                </div>
                <VuilbakKnop onClick={() => verwijderTekening.mutate(t.id)} />
              </li>
            ))}
          </ul>
        )}
      </Paneel>

      <Modaal open={onderdeelOpen} titel={bewerkId ? 'Onderdeel bewerken' : 'Onderdeel toevoegen'} onSluit={() => zetOnderdeelOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarOnderdeel.mutate() }}>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Productcode" value={vorm.productcode} onChange={e => zetVorm({ ...vorm, productcode: e.target.value })} required />
            <Invoer label="Materiaal" optioneel value={vorm.materiaal} onChange={e => zetVorm({ ...vorm, materiaal: e.target.value })} />
          </div>
          <Invoer label="Omschrijving" optioneel value={vorm.omschrijving} onChange={e => zetVorm({ ...vorm, omschrijving: e.target.value })} />
          <Invoer label="Afmetingen" optioneel placeholder="bv. 3500 x 1800 mm" value={vorm.afmetingen} onChange={e => zetVorm({ ...vorm, afmetingen: e.target.value })} />

          <div className="space-y-3 rounded-control bg-vlak-raised p-4">
            <Selectievak checked={vorm.voorbehandelingVanToepassing} onChange={v => zetVorm({ ...vorm, voorbehandelingVanToepassing: v })}>
              Voorbehandeling van toepassing
            </Selectievak>
            {vorm.voorbehandelingVanToepassing && (
              <div className="grid grid-cols-2 gap-4">
                <Selecteer label="Leverancier voorbehandeling" optioneel value={vorm.leverancierVoorbehandelingId}
                  onChange={e => zetVorm({ ...vorm, leverancierVoorbehandelingId: e.target.value })}>
                  <option value="">Nog te bepalen</option>
                  {data.leveranciers.filter(l => l.type !== 'lakwerk').map(l => <option key={l.id} value={l.id}>{l.naam}</option>)}
                </Selecteer>
                <Invoer label="Verwachte ETA" optioneel type="date" value={vorm.etaVoorbehandeling}
                  onChange={e => zetVorm({ ...vorm, etaVoorbehandeling: e.target.value })} />
              </div>
            )}
          </div>
          <div className="space-y-3 rounded-control bg-vlak-raised p-4">
            <Selectievak checked={vorm.lakwerkVanToepassing} onChange={v => zetVorm({ ...vorm, lakwerkVanToepassing: v })}>
              Lakwerk van toepassing
            </Selectievak>
            {vorm.lakwerkVanToepassing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Selecteer label="Leverancier lakwerk" optioneel value={vorm.leverancierLakwerkId}
                    onChange={e => zetVorm({ ...vorm, leverancierLakwerkId: e.target.value })}>
                    <option value="">Nog te bepalen</option>
                    {data.leveranciers.filter(l => l.type !== 'voorbehandeling').map(l => <option key={l.id} value={l.id}>{l.naam}</option>)}
                  </Selecteer>
                  <Invoer label="Verwachte ETA" optioneel type="date" value={vorm.etaLakwerk}
                    onChange={e => zetVorm({ ...vorm, etaLakwerk: e.target.value })} />
                </div>
                <Invoer label="RAL kleurcode" optioneel placeholder="bv. 7016" value={vorm.lakwerkRal}
                  onChange={e => zetVorm({ ...vorm, lakwerkRal: e.target.value })} />
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetOnderdeelOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={bewaarOnderdeel.isPending || !vorm.productcode.trim()}>
              {bewaarOnderdeel.isPending ? 'Bezig…' : 'Opslaan'}
            </Knop>
          </div>
        </form>
      </Modaal>
    </div>
  )
}
