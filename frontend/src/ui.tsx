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

export function VeldLabel({ children, optioneel }: { children: ReactNode; optioneel?: boolean }) {
  return (
    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">
      {children}{optioneel && <span className="ml-1 font-normal normal-case tracking-normal text-inkt-faint">(optioneel)</span>}
    </label>
  )
}

export function Invoer({ label, optioneel, fout, className, ...rest }:
  InputHTMLAttributes<HTMLInputElement> & { label?: string; optioneel?: boolean; fout?: string }) {
  return (
    <div className={className}>
      {label && <VeldLabel optioneel={optioneel}>{label}</VeldLabel>}
      <input
        className="focusring h-10 w-full rounded-control border border-inkt/15 bg-vlak-surface px-3 text-[15px] text-inkt placeholder:text-inkt-faint"
        {...rest}
      />
      {fout && <p className="mt-1 text-xs text-corten-600">{fout}</p>}
    </div>
  )
}

export function TekstVak({ label, optioneel, className, ...rest }:
  TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; optioneel?: boolean }) {
  return (
    <div className={className}>
      {label && <VeldLabel optioneel={optioneel}>{label}</VeldLabel>}
      <textarea
        className="focusring min-h-24 w-full rounded-control border border-inkt/15 bg-vlak-surface px-3 py-2 text-[15px] text-inkt placeholder:text-inkt-faint"
        {...rest}
      />
    </div>
  )
}

export function Selecteer({ label, optioneel, children, className, ...rest }:
  SelectHTMLAttributes<HTMLSelectElement> & { label?: string; optioneel?: boolean }) {
  return (
    <div className={className}>
      {label && <VeldLabel optioneel={optioneel}>{label}</VeldLabel>}
      <select
        className="focusring h-10 w-full rounded-control border border-inkt/15 bg-vlak-surface px-3 text-[15px] text-inkt"
        {...rest}
      >{children}</select>
    </div>
  )
}

/* Statusbadges in materiaalkleur, 1 per rij (huisstijlgids blad 06). */
const badgeStijl: Record<string, string> = {
  neutraal: 'bg-inkt/[.08] text-stone2-700',
  brons: 'bg-bronze-500/[.16] text-bronze-600',
  olijf: 'bg-olive-500/[.18] text-olive-600',
  corten: 'bg-corten-500/[.16] text-corten-600',
  kritiek: 'bg-corten-600 text-stone2-50'
}
export const statusToon: Record<string, string> = {
  nieuw: 'neutraal', gekwalificeerd: 'brons', omgezet: 'olijf', verloren: 'corten',
  verzonden: 'brons', goedgekeurd: 'olijf', geweigerd: 'kritiek', verlopen: 'corten',
  aangemaakt: 'neutraal', inProductie: 'brons', externeBehandeling: 'brons',
  klaarVoorMontage: 'brons', gemonteerd: 'olijf', afgesloten: 'olijf', geannuleerd: 'kritiek',
  concept: 'neutraal', gepubliceerd: 'olijf', gearchiveerd: 'neutraal',
  open: 'brons', uitgevoerd: 'olijf', vervallen: 'neutraal'
}
export const statusTekst: Record<string, string> = {
  nieuw: 'Nieuw', gekwalificeerd: 'Gekwalificeerd', omgezet: 'Omgezet', verloren: 'Verloren',
  verzonden: 'Verzonden', goedgekeurd: 'Goedgekeurd', geweigerd: 'Geweigerd', verlopen: 'Verlopen',
  aangemaakt: 'Aangemaakt', inProductie: 'In productie', externeBehandeling: 'Externe behandeling',
  klaarVoorMontage: 'Klaar voor montage', gemonteerd: 'Gemonteerd', afgesloten: 'Afgesloten',
  geannuleerd: 'Geannuleerd', concept: 'Concept', gepubliceerd: 'Gepubliceerd', gearchiveerd: 'Gearchiveerd',
  open: 'Open', uitgevoerd: 'Uitgevoerd', vervallen: 'Vervallen'
}
export function Badge({ status }: { status: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-chip px-2 py-0.5 text-xs font-semibold',
      badgeStijl[statusToon[status] ?? 'neutraal'])}>
      {statusTekst[status] ?? status}
    </span>
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
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/50 p-4"
      onClick={onSluit} onKeyDown={e => e.key === 'Escape' && onSluit()}>
      <div role="dialog" aria-modal="true" aria-label={titel}
        className="w-full max-w-lg rounded-card border border-inkt/10 bg-vlak-surface p-6 shadow-xl"
        onClick={e => e.stopPropagation()}>
        <h2 className="mb-4 font-display text-2xl font-medium text-inkt">{titel}</h2>
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
