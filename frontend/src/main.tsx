import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider, createRootRoute, createRoute, createRouter, redirect, Outlet
} from '@tanstack/react-router'
import { supabase } from './lib/supabase'
import AppSchil from './AppSchil'
import Aanmelden from './paginas/Aanmelden'
import './stijl.css'

/* Na een uitrol verdwijnen de oude gehashte bundels van de server. Een tabblad
   dat al open stond vraagt er dan een op die er niet meer is en breekt met de
   melding dat text/html geen geldig javascript MIME type is. Hier vangen wij
   dat op: eenmalig herladen zodat de browser de nieuwe index ophaalt. De vlag
   in sessionStorage voorkomt een herlaadlus wanneer het iets anders is. */
const VLAG = 'pl-chunk-herladen'
function laad<T>(invoer: () => Promise<T>): () => Promise<T> {
  return () =>
    invoer().catch((f: unknown) => {
      const al = sessionStorage.getItem(VLAG)
      if (!al) {
        sessionStorage.setItem(VLAG, String(Date.now()))
        window.location.reload()
        // Nooit bereikt, maar de belofte mag niet afronden voor de herlading.
        return new Promise<T>(() => {})
      }
      throw f
    })
}
// Geslaagde start betekent dat de bundels kloppen, dus de vlag mag weg.
window.addEventListener('load', () => sessionStorage.removeItem(VLAG))

// Elke pagina lazy zodat de eerste lading (login en het veld) klein blijft;
// per route splitst Vite een eigen chunk (audit snelheid 7 en 10).
const Dashboard = React.lazy(laad(() => import('./paginas/Dashboard')))
const Leads = React.lazy(laad(() => import('./paginas/Leads')))
const LeadDetail = React.lazy(laad(() => import('./paginas/LeadDetail')))
const Fotoberichten = React.lazy(laad(() => import('./paginas/Fotoberichten')))
const Klanten = React.lazy(laad(() => import('./paginas/Klanten')))
const KlantDetail = React.lazy(laad(() => import('./paginas/KlantDetail')))
const Dossiers = React.lazy(laad(() => import('./paginas/Dossiers')))
const DossierDetail = React.lazy(laad(() => import('./paginas/DossierDetail')))
const OfferteEditor = React.lazy(laad(() => import('./paginas/OfferteEditor')))
const Werkschema = React.lazy(laad(() => import('./paginas/Werkschema')))
const Planning = React.lazy(laad(() => import('./paginas/Planning')))
const Veld = React.lazy(laad(() => import('./paginas/Veld')))
const Service = React.lazy(laad(() => import('./paginas/Service')))
const Facturatie = React.lazy(laad(() => import('./paginas/Facturatie')))
const Website = React.lazy(laad(() => import('./paginas/Website')))
const Artikelen = React.lazy(laad(() => import('./paginas/Artikelen')))
const Beheer = React.lazy(laad(() => import('./paginas/Beheer')))

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const aanmeldRoute = createRoute({ getParentRoute: () => rootRoute, path: '/aanmelden', component: Aanmelden })

// Beveiligde schil: zonder sessie terug naar aanmelden (LOGIN reeks).
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession()
    if (!data.session) throw redirect({ to: '/aanmelden' })
  },
  component: AppSchil
})

const dashboardRoute = createRoute({ getParentRoute: () => appRoute, path: '/', component: Dashboard })
const leadsRoute = createRoute({ getParentRoute: () => appRoute, path: '/leads', component: Leads })
const leadDetailRoute = createRoute({
  getParentRoute: () => appRoute, path: '/leads/$leadId', component: LeadDetail,
  // Intentie vanuit de leadlijst: welke actie meteen starten op de fiche.
  validateSearch: (s: Record<string, unknown>): { actie?: string } =>
    ({ actie: typeof s.actie === 'string' ? s.actie : undefined })
})
const fotoberichtenRoute = createRoute({ getParentRoute: () => appRoute, path: '/fotoberichten', component: Fotoberichten })
const klantenRoute = createRoute({ getParentRoute: () => appRoute, path: '/klanten', component: Klanten })
const klantDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/klanten/$klantId', component: KlantDetail })
const dossiersRoute = createRoute({ getParentRoute: () => appRoute, path: '/dossiers', component: Dossiers })
const dossierDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/dossiers/$projectId', component: DossierDetail })
const offerteRoute = createRoute({ getParentRoute: () => appRoute, path: '/offertes/$offerteId', component: OfferteEditor })
const werkschemaRoute = createRoute({ getParentRoute: () => appRoute, path: '/werkschema', component: Werkschema })
const planningRoute = createRoute({ getParentRoute: () => appRoute, path: '/planning', component: Planning })
// De planner opent een bon rechtstreeks vanuit het dossier met ?bon=<id>.
const veldRoute = createRoute({
  getParentRoute: () => appRoute, path: '/veld', component: Veld,
  validateSearch: (zoek: Record<string, unknown>): { bon?: string } =>
    typeof zoek.bon === 'string' ? { bon: zoek.bon } : {}
})
const serviceRoute = createRoute({ getParentRoute: () => appRoute, path: '/service', component: Service })
const facturatieRoute = createRoute({ getParentRoute: () => appRoute, path: '/facturatie', component: Facturatie })
const websiteRoute = createRoute({ getParentRoute: () => appRoute, path: '/website', component: Website })
const artikelenRoute = createRoute({ getParentRoute: () => appRoute, path: '/artikelen', component: Artikelen })
const beheerRoute = createRoute({ getParentRoute: () => appRoute, path: '/beheer', component: Beheer })

const routeBoom = rootRoute.addChildren([
  aanmeldRoute,
  appRoute.addChildren([
    dashboardRoute, leadsRoute, leadDetailRoute, fotoberichtenRoute, klantenRoute, klantDetailRoute,
    dossiersRoute, dossierDetailRoute, offerteRoute, werkschemaRoute, planningRoute, veldRoute, serviceRoute, facturatieRoute, websiteRoute, artikelenRoute, beheerRoute
  ])
])

const router = createRouter({ routeTree: routeBoom })
declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

const queryClient = new QueryClient({
  // Standaard 30s vers zodat navigeren niet elke lijst opnieuw ophaalt (audit performantie 4).
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 } }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
