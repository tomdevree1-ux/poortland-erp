import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum, euro, leeg, weergaveNaam } from '../lib/formaat'
import type { Klant, Offerte } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer, Th, Td, rijKlik } from '../ui'

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
  const [tab, zetTab] = useState<'overzicht' | 'offertes' | 'communicatie'>('overzicht')
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
    ['overzicht', 'Overzicht'], ['offertes', `Offertes en order (${offertes.length})`],
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
