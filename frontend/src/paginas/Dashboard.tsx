import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../lib/api'
import { euro } from '../lib/formaat'
import type { Kerncijfers } from '../lib/types'
import { Kerncijfer, PaginaKop, Paneel, Knop } from '../ui'

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get<Kerncijfers>('/dashboard') })
  return (
    <>
      <PaginaKop eyebrow="Atelier · overzicht" titel="Dashboard"
        actie={<Link to="/leads"><Knop variant="primair">Nieuwe lead ↗</Knop></Link>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Kerncijfer label="Open leads" waarde={data?.openLeads ?? '—'} />
        <Kerncijfer label="Verzonden offertes" waarde={data?.verzondenOffertes ?? '—'} />
        <Kerncijfer label="Actieve orders" waarde={data?.actieveOrders ?? '—'} />
        <Kerncijfer label="Mijn open taken" waarde={data?.mijnOpenTaken ?? '—'} />
        <Kerncijfer label="Omzet kwartaal" waarde={data ? euro(data.omzetKwartaal) : '—'} />
      </div>
      <div className="mt-6">
        <Paneel titel="Aan de slag">
          <p className="text-sm leading-relaxed text-inkt-muted">
            Dit is de eerste bouwslag van het Poortland ERP: leads, klanten, dossiers, offertes met
            automatische ordervorming en het websitebeheer. Productie, planning, veldwerkbonnen en
            facturatie volgen in de volgende slagen op ditzelfde fundament.
          </p>
        </Paneel>
      </div>
    </>
  )
}
