import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { LayoutDashboard, FolderOpen, Users, Inbox, ListTodo, Globe, Settings, LogOut } from 'lucide-react'
import { supabase } from './lib/supabase'
import { api } from './lib/api'

/* Het vaste skelet uit de huisstijlgids blad 07: bosgroene sidebar (236),
   sticky topbar en het werkvlak op warm perkament. */

const navItems = [
  { naar: '/', label: 'Dashboard', icoon: LayoutDashboard },
  { naar: '/leads', label: 'Leads', icoon: Inbox },
  { naar: '/dossiers', label: 'Dossiers', icoon: FolderOpen },
  { naar: '/klanten', label: 'Klanten', icoon: Users },
  { naar: '/werkschema', label: 'Werkschema', icoon: ListTodo },
  { naar: '/website', label: 'Website', icoon: Globe, rollen: ['verkoop', 'beheerder'] },
  { naar: '/beheer', label: 'Beheer', icoon: Settings, rollen: ['beheerder'] }
]

export default function AppSchil() {
  const navigeer = useNavigate()
  const pad = useRouterState({ select: s => s.location.pathname })
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ medewerker: { naam: string }; rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const rollen = mij?.rollen ?? []

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
          <div className="text-sm font-semibold">{mij?.medewerker?.naam ?? '…'}</div>
          <div className="text-xs text-inkt-faint">{rollen.join(' · ') || 'geen rollen'}</div>
          <button onClick={uitloggen}
            className="focusring mt-3 flex items-center gap-2 text-xs text-inkt-muted hover:text-inkt">
            <LogOut size={14} /> Uitloggen
          </button>
        </div>
      </aside>
      <div className="ml-[236px] flex-1">
        <header className="sticky top-0 z-40 flex h-[56px] items-center justify-between border-b border-inkt/[.07] bg-vlak-canvas/90 px-8 backdrop-blur">
          <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">Operations · overzicht</div>
          <div className="cijfers text-xs text-inkt-muted">
            KW {Math.ceil((new Date().getMonth() + 1) / 3)} · {new Date().getFullYear()}
          </div>
        </header>
        <main className="mx-auto max-w-[1120px] px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
