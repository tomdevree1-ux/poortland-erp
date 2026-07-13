import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { api } from '../lib/api'
import { datum, leeg, persoon as volledigeNaam } from '../lib/formaat'
import type { Klant } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer } from '../ui'

interface Contactpersoon { id: string; naam: string; voornaam?: string; functie?: string; email?: string; telefoon?: string }
interface KlantDossier {
  klant: Klant & { contactpersonen: Contactpersoon[] }
  projecten: { id: string; werfadres: string; status: string; aangemaaktOp: string }[]
  contactmomenten: { id: string; type: string; datum: string; notitie?: string }[]
}

const functiePresets = ['Tuinman', 'Architect', 'Elektricien', 'Concierge', 'Aannemer', 'Werfleider']

export default function KlantDetail() {
  const { klantId } = useParams({ from: '/app/klanten/$klantId' })
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const { data } = useQuery({ queryKey: ['klant', klantId], queryFn: () => api.get<KlantDossier>(`/klanten/${klantId}`) })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['klant', klantId] }) }

  const [persoonOpen, zetPersoonOpen] = useState(false)
  const [bewerkId, zetBewerkId] = useState<string>()
  const leegPersoon = { naam: '', voornaam: '', functie: '', functieAnders: '', email: '', telefoon: '' }
  const [persoon, zetPersoon] = useState(leegPersoon)

  function openNieuw() {
    zetBewerkId(undefined); zetPersoon(leegPersoon); zetPersoonOpen(true)
  }
  function openBewerk(p: Contactpersoon) {
    zetBewerkId(p.id)
    const preset = functiePresets.includes(p.functie ?? '') ? p.functie! : (p.functie ? 'Andere' : '')
    zetPersoon({
      naam: p.naam, voornaam: p.voornaam ?? '', functie: preset,
      functieAnders: preset === 'Andere' ? (p.functie ?? '') : '',
      email: p.email ?? '', telefoon: p.telefoon ?? ''
    })
    zetPersoonOpen(true)
  }

  const bewaarPersoon = useMutation({
    mutationFn: () => {
      const body = {
        naam: persoon.naam, voornaam: persoon.voornaam || null,
        functie: (persoon.functie === 'Andere' ? persoon.functieAnders : persoon.functie) || null,
        email: persoon.email || null, telefoon: persoon.telefoon || null
      }
      return bewerkId
        ? api.patch(`/klanten/${klantId}/contactpersonen/${bewerkId}`, body)
        : api.post(`/klanten/${klantId}/contactpersonen`, body)
    },
    onSuccess: () => { ververs(); zetPersoonOpen(false) },
    onError: f => zetFout((f as Error).message)
  })
  const verwijderPersoon = useMutation({
    mutationFn: (id: string) => api.del(`/klanten/${klantId}/contactpersonen/${id}`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  const [klantOpen, zetKlantOpen] = useState(false)
  const [klantVorm, zetKlantVorm] = useState<{ type: string; naam: string; voornaam: string; btwNummer: string; straat: string
    postcode: string; gemeente: string; email: string; telefoon: string; communicatietaal: string } | null>(null)
  function openKlantBewerk() {
    const k = data!.klant
    zetKlantVorm({
      type: k.type, naam: k.naam, voornaam: k.voornaam ?? '', btwNummer: k.btwNummer ?? '', straat: k.straat ?? '',
      postcode: k.postcode ?? '', gemeente: k.gemeente ?? '', email: k.email ?? '',
      telefoon: k.telefoon ?? '', communicatietaal: k.communicatietaal
    })
    zetKlantOpen(true)
  }
  const bewaarKlant = useMutation({
    mutationFn: () => api.patch(`/klanten/${klantId}`, {
      ...klantVorm, voornaam: klantVorm!.voornaam || null, btwNummer: klantVorm!.btwNummer || null,
      straat: klantVorm!.straat || null, postcode: klantVorm!.postcode || null,
      gemeente: klantVorm!.gemeente || null, email: klantVorm!.email || null,
      telefoon: klantVorm!.telefoon || null, communicatievoorkeur: null
    }),
    onSuccess: () => { ververs(); zetKlantOpen(false) },
    onError: f => zetFout((f as Error).message)
  })

  if (!data) return null
  const { klant, projecten, contactmomenten } = data
  return (
    <>
      <PaginaKop eyebrow="Klantfiche" titel={volledigeNaam(klant.voornaam, klant.naam)} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      <div className="grid grid-cols-2 gap-6">
        <Paneel titel="Gegevens" actie={<PotloodKnop onClick={openKlantBewerk} />}>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-inkt-muted">Type</dt><dd>{klant.type === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Adres</dt><dd>{leeg([klant.straat, klant.postcode, klant.gemeente].filter(Boolean).join(', '))}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(klant.email)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(klant.telefoon)}</dd></div>
            {klant.btwNummer && <div className="flex justify-between"><dt className="text-inkt-muted">Btw</dt><dd>{klant.btwNummer}</dd></div>}
            <div className="flex justify-between"><dt className="text-inkt-muted">Taal</dt><dd className="uppercase">{klant.communicatietaal}</dd></div>
          </dl>
        </Paneel>

        <Paneel titel="Contactpersonen" actie={
          <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={openNieuw}>Toevoegen</Knop>}>
          {klant.contactpersonen.length === 0 ? (
            <p className="text-sm text-inkt-muted">
              Nog geen contactpersonen. Denk aan de tuinman, architect, elektricien of concierge die bij de werf hoort.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {klant.contactpersonen.map(p => (
                <li key={p.id}
                  className="flex cursor-pointer items-start justify-between gap-3 rounded-control border border-inkt/[.07] bg-vlak-surface px-3 py-2 transition hover:bg-bronze-500/[.08]"
                  onClick={() => openBewerk(p)}>
                  <div>
                    <div className="font-semibold">{[p.voornaam, p.naam].filter(Boolean).join(' ')}
                      {p.functie && <span className="ml-2 rounded-chip bg-bronze-500/15 px-1.5 py-0.5 text-xs font-semibold text-bronze-600">{p.functie}</span>}
                    </div>
                    <div className="text-inkt-muted">{[p.telefoon, p.email].filter(Boolean).join(' · ') || '—'}</div>
                  </div>
                  <button className="focusring text-corten-600" aria-label="Verwijderen"
                    onClick={e => { e.stopPropagation(); verwijderPersoon.mutate(p.id) }}>×</button>
                </li>
              ))}
            </ul>
          )}
        </Paneel>

        <Paneel titel="Historisch klantbeeld" className="col-span-2">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-2 text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">Projecten</h3>
              {projecten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen projecten.</p> : (
                <ul className="space-y-2 text-sm">
                  {projecten.map(p => (
                    <li key={p.id} className="flex items-center justify-between gap-3">
                      <Link to="/dossiers/$projectId" params={{ projectId: p.id }} className="font-semibold text-bronze-600 hover:text-bronze-500">{p.werfadres}</Link>
                      <Badge status={p.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">Contactmomenten</h3>
              {contactmomenten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen contactmomenten.</p> : (
                <ul className="space-y-1 text-sm">
                  {contactmomenten.map(c => (
                    <li key={c.id} className="flex justify-between gap-3">
                      <span>{c.type} · {leeg(c.notitie)}</span>
                      <span className="whitespace-nowrap text-inkt-muted">{datum(c.datum)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Paneel>
      </div>

      <Modaal open={klantOpen} titel="Klantgegevens bewerken" onSluit={() => zetKlantOpen(false)}>
        {klantVorm && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarKlant.mutate() }}>
            <div className="grid grid-cols-2 gap-4">
              <Selecteer label="Type" value={klantVorm.type} onChange={e => zetKlantVorm({ ...klantVorm, type: e.target.value })}>
                <option value="particulier">Particulier</option>
                <option value="bedrijf">Bedrijf</option>
              </Selecteer>
              <Invoer label="Naam" value={klantVorm.naam} onChange={e => zetKlantVorm({ ...klantVorm, naam: e.target.value })} required />
            </div>
            {klantVorm.type === 'particulier' &&
              <Invoer label="Voornaam" optioneel value={klantVorm.voornaam} onChange={e => zetKlantVorm({ ...klantVorm, voornaam: e.target.value })} />}
            {klantVorm.type === 'bedrijf' &&
              <Invoer label="Btw nummer" value={klantVorm.btwNummer} onChange={e => zetKlantVorm({ ...klantVorm, btwNummer: e.target.value })} required />}
            <div className="grid grid-cols-3 gap-4">
              <Invoer label="Straat" optioneel value={klantVorm.straat} onChange={e => zetKlantVorm({ ...klantVorm, straat: e.target.value })} />
              <Invoer label="Postcode" optioneel value={klantVorm.postcode} onChange={e => zetKlantVorm({ ...klantVorm, postcode: e.target.value })} />
              <Invoer label="Gemeente" optioneel value={klantVorm.gemeente} onChange={e => zetKlantVorm({ ...klantVorm, gemeente: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Email" optioneel type="email" value={klantVorm.email} onChange={e => zetKlantVorm({ ...klantVorm, email: e.target.value })} />
              <Invoer label="Telefoon" optioneel value={klantVorm.telefoon} onChange={e => zetKlantVorm({ ...klantVorm, telefoon: e.target.value })} />
            </div>
            <Selecteer label="Communicatietaal" value={klantVorm.communicatietaal} onChange={e => zetKlantVorm({ ...klantVorm, communicatietaal: e.target.value })}>
              <option value="nl">Nederlands</option>
              <option value="fr">Frans</option>
              <option value="en">Engels</option>
            </Selecteer>
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetKlantOpen(false)}>Annuleren</Knop>
              <Knop variant="primair" disabled={bewaarKlant.isPending}>{bewaarKlant.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
            </div>
          </form>
        )}
      </Modaal>

      <Modaal open={persoonOpen} titel={bewerkId ? 'Contactpersoon bewerken' : 'Contactpersoon toevoegen'}
        onSluit={() => zetPersoonOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarPersoon.mutate() }}>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Voornaam" optioneel value={persoon.voornaam} onChange={e => zetPersoon({ ...persoon, voornaam: e.target.value })} />
            <Invoer label="Naam" value={persoon.naam} onChange={e => zetPersoon({ ...persoon, naam: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Functie" optioneel value={persoon.functie} onChange={e => zetPersoon({ ...persoon, functie: e.target.value })}>
              <option value="">Geen functie</option>
              {functiePresets.map(f => <option key={f} value={f}>{f}</option>)}
              <option value="Andere">Andere…</option>
            </Selecteer>
            {persoon.functie === 'Andere' && (
              <Invoer label="Welke functie" value={persoon.functieAnders}
                onChange={e => zetPersoon({ ...persoon, functieAnders: e.target.value })} required />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Telefoon" optioneel value={persoon.telefoon} onChange={e => zetPersoon({ ...persoon, telefoon: e.target.value })} />
            <Invoer label="Email" optioneel type="email" value={persoon.email} onChange={e => zetPersoon({ ...persoon, email: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetPersoonOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={bewaarPersoon.isPending}>{bewaarPersoon.isPending ? 'Bezig…' : 'Bewaren'}</Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
