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

// Elke pagina lazy zodat de eerste lading (login en het veld) klein blijft;
// per route splitst Vite een eigen chunk (audit snelheid 7 en 10).
const Dashboard = React.lazy(() => import('./paginas/Dashboard'))
const Leads = React.lazy(() => import('./paginas/Leads'))
const LeadDetail = React.lazy(() => import('./paginas/LeadDetail'))
const Klanten = React.lazy(() => import('./paginas/Klanten'))
const KlantDetail = React.lazy(() => import('./paginas/KlantDetail'))
const Dossiers = React.lazy(() => import('./paginas/Dossiers'))
const DossierDetail = React.lazy(() => import('./paginas/DossierDetail'))
const OfferteEditor = React.lazy(() => import('./paginas/OfferteEditor'))
const Werkschema = React.lazy(() => import('./paginas/Werkschema'))
const Planning = React.lazy(() => import('./paginas/Planning'))
const Veld = React.lazy(() => import('./paginas/Veld'))
const Service = React.lazy(() => import('./paginas/Service'))
const Facturatie = React.lazy(() => import('./paginas/Facturatie'))
const Website = React.lazy(() => import('./paginas/Website'))
const Beheer = React.lazy(() => import('./paginas/Beheer'))

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
const leadDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/leads/$leadId', component: LeadDetail })
const klantenRoute = createRoute({ getParentRoute: () => appRoute, path: '/klanten', component: Klanten })
const klantDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/klanten/$klantId', component: KlantDetail })
const dossiersRoute = createRoute({ getParentRoute: () => appRoute, path: '/dossiers', component: Dossiers })
const dossierDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/dossiers/$projectId', component: DossierDetail })
const offerteRoute = createRoute({ getParentRoute: () => appRoute, path: '/offertes/$offerteId', component: OfferteEditor })
const werkschemaRoute = createRoute({ getParentRoute: () => appRoute, path: '/werkschema', component: Werkschema })
const planningRoute = createRoute({ getParentRoute: () => appRoute, path: '/planning', component: Planning })
const veldRoute = createRoute({ getParentRoute: () => appRoute, path: '/veld', component: Veld })
const serviceRoute = createRoute({ getParentRoute: () => appRoute, path: '/service', component: Service })
const facturatieRoute = createRoute({ getParentRoute: () => appRoute, path: '/facturatie', component: Facturatie })
const websiteRoute = createRoute({ getParentRoute: () => appRoute, path: '/website', component: Website })
const beheerRoute = createRoute({ getParentRoute: () => appRoute, path: '/beheer', component: Beheer })

const routeBoom = rootRoute.addChildren([
  aanmeldRoute,
  appRoute.addChildren([
    dashboardRoute, leadsRoute, leadDetailRoute, klantenRoute, klantDetailRoute,
    dossiersRoute, dossierDetailRoute, offerteRoute, werkschemaRoute, planningRoute, veldRoute, serviceRoute, facturatieRoute, websiteRoute, beheerRoute
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
