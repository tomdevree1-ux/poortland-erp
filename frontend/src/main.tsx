import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RouterProvider, createRootRoute, createRoute, createRouter, redirect, Outlet
} from '@tanstack/react-router'
import { supabase } from './lib/supabase'
import AppSchil from './AppSchil'
import Aanmelden from './paginas/Aanmelden'
import Dashboard from './paginas/Dashboard'
import Leads from './paginas/Leads'
import LeadDetail from './paginas/LeadDetail'
import Klanten from './paginas/Klanten'
import KlantDetail from './paginas/KlantDetail'
import Dossiers from './paginas/Dossiers'
import DossierDetail from './paginas/DossierDetail'
import OfferteEditor from './paginas/OfferteEditor'
import Werkschema from './paginas/Werkschema'
import Planning from './paginas/Planning'
import Veld from './paginas/Veld'
import Service from './paginas/Service'
import Website from './paginas/Website'
import Beheer from './paginas/Beheer'
import './stijl.css'

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
const websiteRoute = createRoute({ getParentRoute: () => appRoute, path: '/website', component: Website })
const beheerRoute = createRoute({ getParentRoute: () => appRoute, path: '/beheer', component: Beheer })

const routeBoom = rootRoute.addChildren([
  aanmeldRoute,
  appRoute.addChildren([
    dashboardRoute, leadsRoute, leadDetailRoute, klantenRoute, klantDetailRoute,
    dossiersRoute, dossierDetailRoute, offerteRoute, werkschemaRoute, planningRoute, veldRoute, serviceRoute, websiteRoute, beheerRoute
  ])
])

const router = createRouter({ routeTree: routeBoom })
declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
