import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { persoon as volledigeNaam } from '../lib/formaat'
import { Invoer, Knop, Modaal, Paneel, Selecteer, Selectievak } from '../ui'

// Gedeeld paneel voor contactpersonen, gebruikt op de klantfiche en de leadfiche
// (feedback 2026-08-06). Zelfde venster en velden op beide plaatsen; het basisPad
// bepaalt tegen welke fiche de API-aanroepen lopen. Een contactpersoon heeft een
// eigen klanttype (particulier of bedrijf) en kan aangeduid worden als ontvanger
// van de offerte (een of meerdere personen).

export interface ContactpersoonRij {
  id: string; naam: string; voornaam?: string; functie?: string; email?: string; telefoon?: string
  type?: string; bedrijfsnaam?: string; btwNummer?: string; ontvangtOfferte?: boolean
}

export const functiePresets = ['Tuinman', 'Architect', 'Elektricien', 'Concierge', 'Aannemer', 'Werfleider']

export function ContactpersonenPaneel({ basisPad, personen, onVervers, onFout }: {
  basisPad: string; personen: ContactpersoonRij[]; onVervers: () => void; onFout: (m: string) => void
}) {
  const [open, zetOpen] = useState(false)
  const [bewerkId, zetBewerkId] = useState<string>()
  const leeg = { type: 'particulier', naam: '', voornaam: '', functie: '', functieAnders: '',
    email: '', telefoon: '', bedrijfsnaam: '', btwNummer: '', ontvangtOfferte: false }
  const [vorm, zetVorm] = useState(leeg)

  function openNieuw() { zetBewerkId(undefined); zetVorm(leeg); zetOpen(true) }
  function openBewerk(p: ContactpersoonRij) {
    zetBewerkId(p.id)
    const preset = functiePresets.includes(p.functie ?? '') ? p.functie! : (p.functie ? 'Andere' : '')
    zetVorm({
      type: p.type ?? 'particulier', naam: p.naam, voornaam: p.voornaam ?? '', functie: preset,
      functieAnders: preset === 'Andere' ? (p.functie ?? '') : '',
      email: p.email ?? '', telefoon: p.telefoon ?? '',
      bedrijfsnaam: p.bedrijfsnaam ?? '', btwNummer: p.btwNummer ?? '',
      ontvangtOfferte: p.ontvangtOfferte ?? false
    })
    zetOpen(true)
  }

  const bewaar = useMutation({
    mutationFn: () => {
      const body = {
        naam: vorm.naam, voornaam: vorm.voornaam || null,
        functie: (vorm.functie === 'Andere' ? vorm.functieAnders : vorm.functie) || null,
        email: vorm.email || null, telefoon: vorm.telefoon || null,
        type: vorm.type,
        bedrijfsnaam: vorm.type === 'bedrijf' ? (vorm.bedrijfsnaam || null) : null,
        btwNummer: vorm.type === 'bedrijf' ? (vorm.btwNummer || null) : null,
        ontvangtOfferte: vorm.ontvangtOfferte
      }
      return bewerkId
        ? api.patch(`${basisPad}/contactpersonen/${bewerkId}`, body)
        : api.post(`${basisPad}/contactpersonen`, body)
    },
    onSuccess: () => { onVervers(); zetOpen(false) },
    onError: f => onFout((f as Error).message)
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`${basisPad}/contactpersonen/${id}`),
    onSuccess: onVervers, onError: f => onFout((f as Error).message)
  })

  return (
    <Paneel titel="Contactpersonen" actie={
      <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={openNieuw}>Toevoegen</Knop>}>
      {personen.length === 0 ? (
        <p className="text-sm text-inkt-muted">
          Nog geen contactpersonen. Denk aan de tuinman, architect, elektricien of concierge die bij de werf hoort.
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {personen.map(p => (
            <li key={p.id}
              className="flex cursor-pointer items-start justify-between gap-3 rounded-control border border-inkt/[.07] bg-vlak-surface px-3 py-2 transition hover:bg-bronze-500/[.08]"
              onClick={() => openBewerk(p)}>
              <div>
                <div className="font-semibold">{volledigeNaam(p.voornaam, p.naam)}
                  {p.type === 'bedrijf' && <span className="ml-2 rounded-chip bg-inkt/[.08] px-1.5 py-0.5 text-xs font-semibold text-inkt-muted">{p.bedrijfsnaam || 'Bedrijf'}</span>}
                  {p.functie && <span className="ml-2 rounded-chip bg-bronze-500/15 px-1.5 py-0.5 text-xs font-semibold text-bronze-600">{p.functie}</span>}
                  {p.ontvangtOfferte && <span className="ml-2 rounded-chip bg-olive-500/15 px-1.5 py-0.5 text-xs font-semibold text-olive-600">Ontvangt offerte</span>}
                </div>
                <div className="text-inkt-muted">{[p.telefoon, p.email].filter(Boolean).join(' · ') || '—'}</div>
              </div>
              <button className="focusring text-corten-600" aria-label="Verwijderen"
                onClick={e => { e.stopPropagation(); verwijder.mutate(p.id) }}>×</button>
            </li>
          ))}
        </ul>
      )}

      <Modaal open={open} titel={bewerkId ? 'Contactpersoon bewerken' : 'Contactpersoon toevoegen'}
        onSluit={() => zetOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaar.mutate() }}>
          <div className="flex gap-1 rounded-control border border-inkt/10 p-1">
            {(['particulier', 'bedrijf'] as const).map(t => (
              <button key={t} type="button" onClick={() => zetVorm({ ...vorm, type: t })}
                className={clsx('focusring flex-1 rounded-[6px] px-3 py-1.5 text-sm font-semibold transition',
                  vorm.type === t ? 'bg-bronze-500 text-forest-950' : 'text-inkt-muted hover:text-inkt')}>
                {t === 'particulier' ? 'Particulier' : 'Bedrijf'}
              </button>
            ))}
          </div>
          {vorm.type === 'bedrijf' && (
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Bedrijfsnaam" value={vorm.bedrijfsnaam} onChange={e => zetVorm({ ...vorm, bedrijfsnaam: e.target.value })} required />
              <Invoer label="Btw nummer" value={vorm.btwNummer} onChange={e => zetVorm({ ...vorm, btwNummer: e.target.value })} required />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Voornaam" value={vorm.voornaam} onChange={e => zetVorm({ ...vorm, voornaam: e.target.value })} required />
            <Invoer label="Naam" value={vorm.naam} onChange={e => zetVorm({ ...vorm, naam: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Selecteer label="Functie" optioneel value={vorm.functie} onChange={e => zetVorm({ ...vorm, functie: e.target.value })}>
              <option value="">Geen functie</option>
              {functiePresets.map(f => <option key={f} value={f}>{f}</option>)}
              <option value="Andere">Andere…</option>
            </Selecteer>
            {vorm.functie === 'Andere' && (
              <Invoer label="Welke functie" value={vorm.functieAnders}
                onChange={e => zetVorm({ ...vorm, functieAnders: e.target.value })} required />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Telefoon" value={vorm.telefoon} onChange={e => zetVorm({ ...vorm, telefoon: e.target.value })} required />
            <Invoer label="Email" type="email" value={vorm.email} onChange={e => zetVorm({ ...vorm, email: e.target.value })} required />
          </div>
          <div className="rounded-control bg-vlak-raised p-3">
            <Selectievak checked={vorm.ontvangtOfferte} onChange={v => zetVorm({ ...vorm, ontvangtOfferte: v })}>
              Deze persoon ontvangt de offerte
            </Selectievak>
          </div>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={bewaar.isPending}>{bewaar.isPending ? 'Bezig…' : 'Bewaren'}</Knop>
          </div>
        </form>
      </Modaal>
    </Paneel>
  )
}
