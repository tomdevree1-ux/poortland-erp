import { Children, isValidElement, useEffect, useId, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { clsx } from 'clsx'
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

/* Componenten volgens de huisstijlgids bladen 04 tot 07.
   Eén bronzen hoofdactie per zone, labels boven velden, rustige meldingen. */

type KnopVariant = 'primair' | 'secundair' | 'neutraal' | 'ghost' | 'destructief'
export function Knop({ variant = 'secundair', className, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: KnopVariant }) {
  const stijl: Record<KnopVariant, string> = {
    primair: 'bg-bronze-500 text-stone2-50 hover:bg-bronze-400 active:bg-bronze-600 border border-transparent',
    secundair: 'border border-bronze-500 text-bronze-600 hover:bg-bronze-500/10',
    neutraal: 'bg-vlak-raised text-inkt-body hover:bg-vlak-sunken border border-transparent',
    ghost: 'text-inkt-muted hover:text-inkt border border-transparent',
    destructief: 'bg-corten-600 text-stone2-50 hover:bg-corten-500 border border-transparent'
  }
  return (
    <button
      className={clsx(
        'focusring inline-flex h-10 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
        stijl[variant], className)}
      {...rest}
    />
  )
}

export function VeldLabel({ children, optioneel, htmlFor }: { children: ReactNode; optioneel?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">
      {children}
      {optioneel && <span className="ml-1 font-normal normal-case tracking-normal text-inkt-faint">· optioneel</span>}
    </label>
  )
}

export function Invoer({ label, optioneel, fout, className, id, ...rest }:
  InputHTMLAttributes<HTMLInputElement> & { label?: string; optioneel?: boolean; fout?: string }) {
  // Label en veld gekoppeld: nodig voor schermlezers en de e2e-suite.
  const autoId = useId()
  const veldId = id ?? autoId
  return (
    <div className={className}>
      {label && <VeldLabel optioneel={optioneel} htmlFor={veldId}>{label}</VeldLabel>}
      <input
        id={veldId}
        className="focusring h-10 w-full rounded-control border border-inkt/15 bg-vlak-surface px-3 text-[15px] text-inkt placeholder:text-inkt-faint"
        {...rest}
      />
      {fout && <p className="mt-1 text-xs text-corten-600">{fout}</p>}
    </div>
  )
}

export function TekstVak({ label, optioneel, className, id, ...rest }:
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; optioneel?: boolean }) {
  const autoId = useId()
  const veldId = id ?? autoId
  return (
    <div className={className}>
      {label && <VeldLabel optioneel={optioneel} htmlFor={veldId}>{label}</VeldLabel>}
      <textarea
        id={veldId}
        className="focusring min-h-24 w-full rounded-control border border-inkt/15 bg-vlak-surface px-3 py-2 text-[15px] text-inkt placeholder:text-inkt-faint"
        {...rest}
      />
    </div>
  )
}

/* Platformdropdown: nooit de browseropmaak (interfaceregel Poortland).
   Zelfde API als een native select zodat bestaande schermen niets merken. */
export function Selecteer({ label, optioneel, children, className, value, onChange, disabled, klein }:
  SelectHTMLAttributes<HTMLSelectElement> & { label?: string; optioneel?: boolean; klein?: boolean }) {
  const [open, zetOpen] = useState(false)
  const wortel = useRef<HTMLDivElement>(null)
  const opties: { waarde: string; tekst: string }[] = []
  Children.forEach(children, kind => {
    if (isValidElement(kind) && kind.type === 'option') {
      const p = kind.props as { value?: string | number; children?: ReactNode }
      opties.push({ waarde: String(p.value ?? ''), tekst: String(p.children ?? '') })
    }
  })
  useEffect(() => {
    if (!open) return
    const sluitBuiten = (e: MouseEvent) => {
      if (wortel.current && !wortel.current.contains(e.target as Node)) zetOpen(false)
    }
    const sluitToets = (e: KeyboardEvent) => { if (e.key === 'Escape') zetOpen(false) }
    document.addEventListener('mousedown', sluitBuiten)
    document.addEventListener('keydown', sluitToets)
    return () => {
      document.removeEventListener('mousedown', sluitBuiten)
      document.removeEventListener('keydown', sluitToets)
    }
  }, [open])
  const huidige = opties.find(o => o.waarde === String(value ?? ''))
  const kies = (waarde: string) => {
    onChange?.({ target: { value: waarde } } as unknown as React.ChangeEvent<HTMLSelectElement>)
    zetOpen(false)
  }
  return (
    <div className={className} ref={wortel}>
      {label && <VeldLabel optioneel={optioneel}>{label}</VeldLabel>}
      <div className="relative">
        <button type="button" disabled={disabled} onClick={() => zetOpen(!open)}
          aria-haspopup="listbox" aria-expanded={open}
          className={clsx('focusring flex w-full items-center justify-between gap-2 rounded-control border border-inkt/15 bg-vlak-surface px-3 text-left text-inkt disabled:cursor-not-allowed disabled:opacity-40',
            klein ? 'h-8 text-sm' : 'h-10 text-[15px]')}>
          <span className={clsx('truncate', !huidige?.tekst && 'text-inkt-faint')}>
            {huidige?.tekst || 'Maak een keuze'}
          </span>
          <span aria-hidden="true" className="text-[10px] text-bronze-600">▾</span>
        </button>
        {open && (
          <ul role="listbox" className="absolute z-30 mt-1 max-h-64 w-full min-w-44 overflow-auto rounded-control border border-inkt/10 bg-vlak-surface py-1 shadow-lg">
            {opties.map(o => {
              const actief = o.waarde === String(value ?? '')
              return (
                <li key={o.waarde}>
                  <button type="button" role="option" aria-selected={actief} onClick={() => kies(o.waarde)}
                    className={clsx('flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-bronze-500/10',
                      actief ? 'font-semibold text-bronze-600' : 'text-inkt-body')}>
                    <span className="truncate">{o.tekst}</span>
                    {actief && <span aria-hidden="true">✓</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

/* Statusbadges in materiaalkleur, 1 per rij (huisstijlgids blad 06). */
const badgeStijl: Record<string, string> = {
  neutraal: 'bg-inkt/[.08] text-stone2-700',
  brons: 'bg-bronze-500/[.16] text-bronze-600',
  olijf: 'bg-olive-500/[.18] text-olive-600',
  frisgroen: 'bg-olive-400/[.20] text-olive-600',
  corten: 'bg-corten-500/[.16] text-corten-600',
  kritiek: 'bg-corten-600 text-stone2-50'
}
export const statusToon: Record<string, string> = {
  nieuw: 'frisgroen', gekwalificeerd: 'brons', omgezet: 'olijf', verloren: 'corten',
  verzonden: 'brons', goedgekeurd: 'olijf', geweigerd: 'kritiek', verlopen: 'corten',
  aangemaakt: 'neutraal', inProductie: 'brons', externeBehandeling: 'brons',
  klaarVoorMontage: 'brons', gemonteerd: 'olijf', afgesloten: 'olijf', geannuleerd: 'kritiek',
  concept: 'neutraal', gepubliceerd: 'olijf', gearchiveerd: 'neutraal',
  open: 'brons', uitgevoerd: 'olijf', vervallen: 'neutraal',
  besteld: 'neutraal', voorbehandeling: 'brons', lakwerk: 'brons',
  nogGeenFotos: 'neutraal', linkVerstuurd: 'brons', fotosOntvangen: 'olijf', behandeld: 'olijf',
  zichtbaar: 'olijf', verkocht: 'corten', verborgen: 'neutraal', gesloten: 'neutraal',
  inVoorbereiding: 'neutraal', inUitvoering: 'brons', externInBehandeling: 'brons', afgerond: 'olijf',
  gepland: 'neutraal', bevestigd: 'brons',
  klantGetekend: 'olijf', verwerktInFacturatie: 'olijf',
  gemeld: 'corten', ingepland: 'brons',
  gefactureerd: 'olijf'
}
export const statusTekst: Record<string, string> = {
  nieuw: 'Nieuw', gekwalificeerd: 'Gekwalificeerd', omgezet: 'Omgezet', verloren: 'Verloren',
  verzonden: 'Verzonden', goedgekeurd: 'Goedgekeurd', geweigerd: 'Geweigerd', verlopen: 'Verlopen',
  aangemaakt: 'Aangemaakt', inProductie: 'In productie', externeBehandeling: 'Externe behandeling',
  klaarVoorMontage: 'Klaar voor montage', gemonteerd: 'Gemonteerd', afgesloten: 'Afgesloten',
  geannuleerd: 'Geannuleerd', concept: 'Concept', gepubliceerd: 'Gepubliceerd', gearchiveerd: 'Gearchiveerd',
  open: 'Open', uitgevoerd: 'Uitgevoerd', vervallen: 'Vervallen',
  besteld: 'Besteld', voorbehandeling: 'Voorbehandeling', lakwerk: 'Lakwerk',
  inVoorbereiding: 'In voorbereiding', inUitvoering: 'In uitvoering',
  externInBehandeling: 'Extern in behandeling', afgerond: 'Afgerond',
  gepland: 'Gepland', bevestigd: 'Bevestigd',
  klantGetekend: 'Klant getekend', verwerktInFacturatie: 'Verwerkt in facturatie',
  gemeld: 'Gemeld', ingepland: 'Ingepland', behandeld: 'Behandeld',
  zichtbaar: 'Zichtbaar', verkocht: 'Verkocht', verborgen: 'Verborgen', gesloten: 'Gesloten',
  nogGeenFotos: "Nog geen foto's", linkVerstuurd: 'Uploadlink verstuurd', fotosOntvangen: "Foto's ontvangen",
  gefactureerd: 'Gefactureerd'
}
export function Badge({ status }: { status: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-chip px-2 py-0.5 text-xs font-semibold',
      badgeStijl[statusToon[status] ?? 'neutraal'])}>
      {statusTekst[status] ?? status}
    </span>
  )
}

/* Selectievak in de huisstijl (geen ruwe browservinkjes, platformbreed). */
export function Selectievak({ checked, onChange, children, className }:
  { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; className?: string }) {
  return (
    <label className={clsx('flex cursor-pointer items-start gap-2.5 text-sm text-inkt-body', className)}>
      <span aria-hidden="true"
        className={clsx('mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[4px] border text-[11px] font-bold transition',
          checked ? 'border-bronze-500 bg-bronze-500 text-forest-950' : 'border-inkt/25 bg-transparent text-transparent')}>
        ✓
      </span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      <span>{children}</span>
    </label>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">{children}</div>
}

export function PaginaKop({ eyebrow, titel, actie }: { eyebrow: string; titel: string; actie?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-1 text-[32px] font-medium leading-none tracking-tight text-inkt">{titel}</h1>
      </div>
      {actie}
    </div>
  )
}

export function Paneel({ titel, actie, children, className }:
  { titel?: string; actie?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={clsx('rounded-card border border-inkt/[.07] bg-vlak-surface shadow-sm', className)}>
      {(titel || actie) && (
        <header className="flex items-center justify-between border-b border-inkt/[.07] px-5 py-3">
          {titel && <h2 className="font-sans text-base font-semibold text-inkt">{titel}</h2>}
          {actie}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export function Kerncijfer({ label, waarde }: { label: string; waarde: string | number }) {
  return (
    <div className="rounded-card border border-inkt/[.07] bg-vlak-surface px-4 py-3">
      <div className="text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">{label}</div>
      <div className="cijfers mt-1 font-display text-2xl font-semibold text-inkt">{waarde}</div>
    </div>
  )
}

export function LegeStaat({ titel, tekst, actie }: { titel: string; tekst: string; actie?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center border-[1.4px] border-inkt/40 font-display text-2xl">P</div>
      <div>
        <div className="font-display text-xl text-inkt">{titel}</div>
        <p className="mt-1 text-sm text-inkt-muted">{tekst}</p>
      </div>
      {actie}
    </div>
  )
}

export function Modaal({ open, titel, children, onSluit }:
  { open: boolean; titel: string; children: ReactNode; onSluit: () => void }) {
  // Elk pop-upvenster sluit met Esc (globale luisteraar, niet afhankelijk van focus)
  // en met het sluitkruisje. Klikken op de achtergrond sluit ook.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onSluit() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onSluit])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/50 p-4" onClick={onSluit}>
      <div role="dialog" aria-modal="true" aria-label={titel}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card border border-inkt/10 bg-vlak-surface p-6 shadow-xl"
        onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onSluit} aria-label="Sluiten"
          className="focusring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-control text-xl leading-none text-inkt-muted hover:bg-inkt/[.06] hover:text-inkt">×</button>
        <h2 className="mb-4 pr-9 font-display text-2xl font-medium text-inkt">{titel}</h2>
        {children}
      </div>
    </div>
  )
}

export function Melding({ soort, children }: { soort: 'ok' | 'info' | 'fout'; children: ReactNode }) {
  const stijl = {
    ok: 'border-olive-500/40 bg-olive-500/10 text-olive-600',
    info: 'border-bronze-500/40 bg-bronze-500/10 text-bronze-600',
    fout: 'border-corten-500/40 bg-corten-500/10 text-corten-600'
  }
  return <div className={clsx('rounded-control border px-3 py-2 text-sm', stijl[soort])}>{children}</div>
}

export function Th({ children, rechts }: { children?: ReactNode; rechts?: boolean }) {
  return <th className={clsx('bg-vlak-raised px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted first:rounded-l-control last:rounded-r-control', rechts && 'text-right')}>{children}</th>
}
export function Td({ children, rechts, className }: { children?: ReactNode; rechts?: boolean; className?: string }) {
  return <td className={clsx('border-b border-inkt/[.06] px-3 py-2.5 text-sm', rechts && 'cijfers text-right', className)}>{children}</td>
}


/* Platform UX regels (README): rijen zijn klikbaar zonder Openen knoppen en
   bewerken start altijd bewust via het potlood, met Opslaan en Annuleren. */
export const rijKlik = 'cursor-pointer transition hover:bg-bronze-500/[.08]'

export function PotloodKnop({ onClick, label = 'Bewerken' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="focusring flex h-8 w-8 items-center justify-center rounded-control text-inkt-muted hover:bg-bronze-500/10 hover:text-bronze-600">
      <Pencil size={15} strokeWidth={1.8} />
    </button>
  )
}

/* Plus voor iets nieuws aanmaken, potlood voor iets bestaands bewerken. */
export function PlusKnop({ onClick, label = 'Toevoegen' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="focusring flex h-8 w-8 items-center justify-center rounded-control text-inkt-muted hover:bg-bronze-500/10 hover:text-bronze-600">
      <Plus size={16} strokeWidth={1.8} />
    </button>
  )
}

export function VuilbakKnop({ onClick, label = 'Verwijderen' }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="focusring flex h-8 w-8 items-center justify-center rounded-control text-inkt-muted hover:bg-corten-600/10 hover:text-corten-600">
      <Trash2 size={15} strokeWidth={1.8} />
    </button>
  )
}
