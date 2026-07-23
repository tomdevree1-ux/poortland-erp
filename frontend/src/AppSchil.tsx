import { Suspense, useState } from 'react'
import { Link, Outlet, useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { ArrowLeft, Bell, CalendarDays, FolderOpen, HardHat, Users, Inbox, ListTodo, Globe, Receipt, Settings, LogOut, Wrench } from 'lucide-react'
import type { NotificatieRij } from './lib/types'
import { supabase } from './lib/supabase'
import { api } from './lib/api'
import { persoon } from './lib/formaat'

/* Het vaste skelet uit de huisstijlgids blad 07: bosgroene sidebar (236),
   sticky topbar en het werkvlak op warm perkament. */

const navItems = [
  { naar: '/leads', label: 'Leads', icoon: Inbox },
  { naar: '/dossiers', label: 'Dossiers', icoon: FolderOpen },
  { naar: '/klanten', label: 'Klanten', icoon: Users },
  { naar: '/werkschema', label: 'Werkschema', icoon: ListTodo },
  { naar: '/planning', label: 'Planning', icoon: CalendarDays },
  { naar: '/veld', label: 'Veld', icoon: HardHat },
  { naar: '/service', label: 'Service', icoon: Wrench },
  { naar: '/facturatie', label: 'Facturatie', icoon: Receipt, rollen: ['boekhouding', 'verkoop', 'beheerder'] },
  { naar: '/website', label: 'Website', icoon: Globe, rollen: ['verkoop', 'beheerder'] },
  { naar: '/beheer', label: 'Beheer', icoon: Settings, rollen: ['beheerder'] }
]

export default function AppSchil() {
  const navigeer = useNavigate()
  const router = useRouter()
  const pad = useRouterState({ select: s => s.location.pathname })
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ medewerker: { naam: string; voornaam?: string }; rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const rollen = mij?.rollen ?? []

  // Notificatiebel: gereedmeldingen en toewijzingen, elke minuut ververst.
  const qc = useQueryClient()
  const [belOpen, zetBelOpen] = useState(false)
  const { data: meldingen } = useQuery({
    queryKey: ['notificaties'],
    queryFn: () => api.get<{ ongelezen: number; lijst: NotificatieRij[] }>('/notificaties'),
    refetchInterval: 60_000
  })
  const markeerGelezen = useMutation({
    mutationFn: (id: string) => api.post(`/notificaties/${id}/gelezen`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificaties'] })
  })
  const allesGelezen = useMutation({
    mutationFn: () => api.post('/notificaties/alles-gelezen', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notificaties'] })
  })
  function openMelding(n: NotificatieRij) {
    if (!n.gelezenOp) markeerGelezen.mutate(n.id)
    zetBelOpen(false)
    if (n.entiteitType === 'project' && n.entiteitId)
      navigeer({ to: '/dossiers/$projectId', params: { projectId: n.entiteitId } })
    else if (n.entiteitType === 'offerte' && n.entiteitId)
      navigeer({ to: '/offertes/$offerteId', params: { offerteId: n.entiteitId } })
  }

  async function uitloggen() {
    await supabase.auth.signOut()
    navigeer({ to: '/aanmelden' })
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 flex w-[236px] flex-col border-r border-bronze-500/45 bg-vlak-sunken text-inkt">
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center border-[1.4px] border-inkt/60 font-display text-xl">P</span>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em]">Poortland</div>
            <div className="text-2xs uppercase tracking-[0.2em] text-inkt-muted">Operations</div>
          </div>
        </div>
        <nav className="mt-2 flex-1 space-y-0.5 px-3">
          {navItems
            .filter(item => !item.rollen || item.rollen.some(r => rollen.includes(r)) || rollen.includes('beheerder'))
            .map(item => {
              const actief = item.naar === '/' ? pad === '/' : pad.startsWith(item.naar)
              const Icoon = item.icoon
              return (
                <Link key={item.naar} to={item.naar}
                  className={clsx('flex items-center gap-3 rounded-control px-3 py-2 text-sm transition',
                    actief
                      ? 'border-l-2 border-bronze-500 bg-vlak-canvas font-semibold text-forest-900 shadow-sm'
                      : 'text-inkt-muted hover:bg-stone2-100 hover:text-inkt')}>
                  <Icoon size={16} strokeWidth={1.8} />
                  {item.label}
                </Link>
              )
            })}
        </nav>
        <div className="border-t border-inkt/10 px-5 py-4">
          <div className="text-sm font-semibold">{persoon(mij?.medewerker?.voornaam, mij?.medewerker?.naam) || '…'}</div>
          <div className="text-xs text-inkt-faint">{rollen.join(' · ') || 'geen rollen'}</div>
          <button onClick={uitloggen}
            className="focusring mt-3 flex items-center gap-2 text-xs text-inkt-muted hover:text-inkt">
            <LogOut size={14} /> Uitloggen
          </button>
        </div>
      </aside>
      <div className="ml-[236px] flex-1">
        <header className="sticky top-0 z-40 flex h-[56px] items-center justify-between border-b border-inkt/[.07] bg-vlak-canvas/90 px-8 backdrop-blur">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => router.history.back()}
              className="focusring flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-semibold text-inkt-muted transition hover:text-inkt">
              <ArrowLeft size={15} strokeWidth={2} /> Terug
            </button>
            <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">Operations · overzicht</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button type="button" onClick={() => zetBelOpen(o => !o)} aria-label="Notificaties"
                className="focusring relative flex h-8 w-8 items-center justify-center rounded-control text-inkt-muted transition hover:text-inkt">
                <Bell size={17} strokeWidth={1.8} />
                {(meldingen?.ongelezen ?? 0) > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-corten-500 px-1 text-[10px] font-bold text-stone2-50">
                    {meldingen!.ongelezen > 9 ? '9+' : meldingen!.ongelezen}
                  </span>
                )}
              </button>
              {belOpen && (
                <div className="absolute right-0 top-10 z-50 w-96 rounded-card border border-inkt/10 bg-vlak-surface shadow-lg">
                  <div className="flex items-center justify-between border-b border-inkt/[.07] px-4 py-2.5">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-inkt-muted">Notificaties</span>
                    {(meldingen?.ongelezen ?? 0) > 0 && (
                      <button type="button" onClick={() => allesGelezen.mutate()}
                        className="focusring text-xs font-semibold text-bronze-600 hover:underline">Alles gelezen</button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {(meldingen?.lijst ?? []).length === 0 ? (
                      <p className="px-4 py-6 text-sm text-inkt-muted">Geen notificaties.</p>
                    ) : (meldingen!.lijst.map(n => (
                      <button key={n.id} type="button" onClick={() => openMelding(n)}
                        className={clsx('focusring block w-full border-b border-inkt/[.05] px-4 py-2.5 text-left text-sm transition hover:bg-bronze-500/[.07]',
                          !n.gelezenOp && 'bg-bronze-500/[.05]')}>
                        <div className={clsx('leading-snug', !n.gelezenOp ? 'font-semibold text-inkt' : 'text-inkt-body')}>{n.titel}</div>
                        {n.boodschap && <div className="mt-0.5 text-xs leading-snug text-inkt-muted">{n.boodschap}</div>}
                      </button>
                    )))}
                  </div>
                </div>
              )}
            </div>
            <div className="cijfers text-xs text-inkt-muted">
              KW {Math.ceil((new Date().getMonth() + 1) / 3)} · {new Date().getFullYear()}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1120px] px-8 py-8">
          <Suspense fallback={<div className="py-16 text-center text-sm text-inkt-faint">Laden…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
