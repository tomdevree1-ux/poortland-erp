import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, euro, leeg, weergaveNaam } from '../lib/formaat'
import type { Klant, MedewerkerKeuze, Offerte, Onderdeel, OnderdeelStatus, PlanningsItemRij, ProductieData, WerkbonRij } from '../lib/types'
import { faseTekst } from './Planning'
import { werkbonTitel } from './Veld'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer, Selectievak, Th, Td, VuilbakKnop, rijKlik, statusTekst } from '../ui'
import ProductieTab from './dossier/ProductieTab'

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
  const { data: mij } = useQuery({ queryKey: ['mij'], queryFn: () => api.get<{ rollen: string[] }>('/medewerkers/mij'), staleTime: 5 * 60 * 1000 })
  const isBeheerder = mij?.rollen.includes('beheerder') ?? false
  const [verwijderOpen, zetVerwijderOpen] = useState(false)
  const verwijderDossier = useMutation({
    mutationFn: () => api.del(`/projecten/${projectId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dossiers'] }); navigeer({ to: '/dossiers' }) },
    onError: () => zetVerwijderOpen(false)
  })
  const { data: planning } = useQuery({
    queryKey: ['dossier-planning', projectId],
    queryFn: () => api.get<PlanningsItemRij[]>(`/projecten/${projectId}/planning`)
  })
  const { data: werkbonnen } = useQuery({
    queryKey: ['dossier-werkbonnen', projectId],
    queryFn: () => api.get<WerkbonRij[]>(`/projecten/${projectId}/werkbonnen`)
  })
  const { data: medewerkerKeuzes } = useQuery({
    queryKey: ['medewerker-overzicht'],
    queryFn: () => api.get<MedewerkerKeuze[]>('/medewerkers/overzicht'), staleTime: 5 * 60 * 1000
  })
  const [bonOpen, zetBonOpen] = useState(false)
  const [bonVorm, zetBonVorm] = useState({ type: 'plaatsing', plaatserId: '', uitvoeringsdatum: '' })
  const [bonFout, zetBonFout] = useState<string>()
  const maakBon = useMutation({
    mutationFn: () => api.post<{ id: string }>('/werkbonnen', {
      projectId, type: bonVorm.type,
      plaatserId: bonVorm.plaatserId || null,
      uitvoeringsdatum: bonVorm.uitvoeringsdatum || null
    }),
    // Na het aanmaken meteen door naar het invulscherm, dat is de volgende stap.
    onSuccess: bon => {
      qc.invalidateQueries({ queryKey: ['dossier-werkbonnen', projectId] })
      zetBonOpen(false)
      zetBonFout(undefined)
      navigeer({ to: '/veld', search: { bon: bon.id } })
    },
    // Zonder dit bleef het venster gewoon staan bij een fout en leek er niets te gebeuren.
    onError: f => zetBonFout(f instanceof Error ? f.message : 'Er ging iets mis.')
  })
  // Prijsraming (nog zonder plaatsbezoek) of meteen een offerte na opmeting.
  const maakOfferte = useMutation({
    mutationFn: (soort: 'prijsraming' | 'offerte' = 'offerte') =>
      api.post<Offerte>(`/projecten/${projectId}/offertes`, { taal: null, soort }),
    onSuccess: o => { qc.invalidateQueries({ queryKey: ['dossier', projectId] }); navigeer({ to: '/offertes/$offerteId', params: { offerteId: o.id } }) }
  })

  // Contactmoment rechtstreeks vanaf het dossier loggen (zelfde record als op de klantfiche).
  const [momentOpen, zetMomentOpen] = useState(false)
  const [momentVorm, zetMomentVorm] = useState({ type: 'telefoon', notitie: '' })
  const logMoment = useMutation({
    mutationFn: () => api.post(`/klanten/${data!.project.klant.id}/contactmomenten`, {
      projectId, type: momentVorm.type, notitie: momentVorm.notitie || null
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['dossier', projectId] }); zetMomentOpen(false) }
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
        actie={<div className="flex items-center gap-2">
          {isBeheerder && <Knop variant="destructief" onClick={() => zetVerwijderOpen(true)}>Verwijderen</Knop>}
          <Knop variant="secundair" onClick={() => maakOfferte.mutate('prijsraming')} disabled={maakOfferte.isPending}>
            Prijsraming maken ↗</Knop>
          <Knop variant="primair" onClick={() => maakOfferte.mutate('offerte')} disabled={maakOfferte.isPending}>
            {offertes.length ? 'Nieuwe offerteversie ↗' : 'Offerte maken ↗'}</Knop>
        </div>} />
      <Modaal open={verwijderOpen} titel="Dossier verwijderen?" onSluit={() => zetVerwijderOpen(false)}>
        <p className="text-sm text-inkt-body">Dit verwijdert dossier {project.nummer ?? ''} van {weergaveNaam(project.klant)} uit de werking. De audit trail bewaart de historiek.</p>
        <div className="mt-6 flex justify-end gap-2">
          <Knop type="button" variant="ghost" onClick={() => zetVerwijderOpen(false)}>Annuleren</Knop>
          <Knop variant="destructief" disabled={verwijderDossier.isPending} onClick={() => verwijderDossier.mutate()}>{verwijderDossier.isPending ? 'Bezig…' : 'Verwijderen'}</Knop>
        </div>
      </Modaal>
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
          <Paneel titel="Contactmomenten" actie={
            <Knop variant="secundair" className="h-8 px-3 text-xs"
              onClick={() => { zetMomentVorm({ type: 'telefoon', notitie: '' }); zetMomentOpen(true) }}>Loggen</Knop>}>
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

          <Paneel titel="Werkbonnen" className="col-span-2"
            actie={<Knop variant="secundair" className="h-8 px-3 text-xs"
              onClick={() => { zetBonVorm({ type: 'plaatsing', plaatserId: '', uitvoeringsdatum: '' }); zetBonOpen(true) }}>
              Werkbon aanmaken</Knop>}>
            {(werkbonnen ?? []).length === 0 ? (
              <p className="text-sm text-inkt-muted">Nog geen werkbonnen. De planner maakt ze hier aan; de plaatser vult ze in op de pagina Veld.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {werkbonnen!.map(b => (
                  <li key={b.id} className="flex items-center justify-between gap-4">
                    <span className="font-medium">{werkbonTitel(b)} · {b.plaatser}</span>
                    <span className="flex items-center gap-3">
                      <Badge status={b.status} />
                      <span className="whitespace-nowrap text-inkt-muted">{datum(b.uitvoeringsdatum)}</span>
                      {/* De bon invullen gebeurt op de pagina Veld. Vanuit het dossier
                          openen wij ze rechtstreeks, ook wanneer een ander de plaatser is. */}
                      <Link to="/veld" search={{ bon: b.id }}
                        className="focusring text-xs font-semibold text-bronze-600 hover:underline">Invullen</Link>
                      <button type="button" onClick={() => api.download(`/werkbonnen/${b.id}/pdf`)}
                        className="focusring text-xs font-semibold text-bronze-600 hover:underline">PDF</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Paneel>

          <Paneel titel="Planning" className="col-span-2"
            actie={<Link to="/planning" className="focusring text-xs font-semibold text-bronze-600 hover:underline">Open planning</Link>}>
            {(planning ?? []).length === 0 ? (
              <p className="text-sm text-inkt-muted">Nog geen fases ingepland. De planner plant in via de pagina Planning.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {planning!.map(item => (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <span className="font-medium">{faseTekst[item.fase]} · {item.toegewezene}</span>
                    <span className="flex items-center gap-3">
                      <Badge status={item.status} />
                      <span className="whitespace-nowrap text-inkt-muted">{datum(item.geplandeDatum)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
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
                  <Td className="whitespace-nowrap">{datum(o.geldigTot)}</Td>
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

      <Modaal open={bonOpen} titel="Werkbon aanmaken" onSluit={() => { zetBonOpen(false); zetBonFout(undefined) }}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); zetBonFout(undefined); maakBon.mutate() }}>
          {bonFout && <Melding soort="fout">{bonFout}</Melding>}
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Type" value={bonVorm.type} onChange={e => zetBonVorm({ ...bonVorm, type: e.target.value })}>
              <option value="plaatsing">Plaatsing (nummer loopt automatisch op)</option>
              <option value="automatisatie">Automatisatie</option>
              <option value="onderhoud">Onderhoud</option>
              <option value="herstelling">Herstelling</option>
            </Selecteer>
            <Invoer label="Uitvoeringsdatum" optioneel type="date" value={bonVorm.uitvoeringsdatum}
              onChange={e => zetBonVorm({ ...bonVorm, uitvoeringsdatum: e.target.value })} />
          </div>
          <Selecteer label="Plaatser" value={bonVorm.plaatserId} onChange={e => zetBonVorm({ ...bonVorm, plaatserId: e.target.value })} required>
            <option value="">Kies een plaatser…</option>
            {medewerkerKeuzes?.map(m => <option key={m.id} value={m.id}>{m.naam}</option>)}
          </Selecteer>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetBonOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={maakBon.isPending || !bonVorm.plaatserId}>
              {maakBon.isPending ? 'Bezig…' : 'Aanmaken'}</Knop>
          </div>
        </form>
      </Modaal>

      <Modaal open={momentOpen} titel="Contactmoment loggen" onSluit={() => zetMomentOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); logMoment.mutate() }}>
          <Selecteer label="Type" value={momentVorm.type} onChange={e => zetMomentVorm({ ...momentVorm, type: e.target.value })}>
            <option value="telefoon">Telefoon</option>
            <option value="email">Email</option>
            <option value="bezoek">Bezoek</option>
            <option value="showroom">Showroom</option>
            <option value="andere">Andere</option>
          </Selecteer>
          <Invoer label="Notitie" optioneel placeholder="Kort verslag van het contact"
            value={momentVorm.notitie} onChange={e => zetMomentVorm({ ...momentVorm, notitie: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetMomentOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={logMoment.isPending}>{logMoment.isPending ? 'Bezig…' : 'Loggen'}</Knop>
          </div>
        </form>
      </Modaal>

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
