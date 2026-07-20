import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { api } from '../lib/api'
import { euro } from '../lib/formaat'
import type { Kerncijfers, RapportOverzicht } from '../lib/types'
import { Kerncijfer, PaginaKop, Paneel, Knop, statusTekst } from '../ui'

/* TS-12 Rapportering: kerncijfers plus eenvoudige trends in pure CSS,
   zonder grafiekenbibliotheek (bouwspec: licht en offlinevriendelijk). */

const maandKort = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const maandLabel = (m: string) => {
  const [, mm] = m.split('-')
  return maandKort[Number(mm) - 1] ?? m
}

function Staafgrafiek({ punten, formatteer }: {
  punten: { label: string; waarde: number; sub?: number }[]
  formatteer: (w: number) => string
}) {
  const max = Math.max(...punten.map(p => p.waarde), 1)
  return (
    <div className="flex h-40 items-end gap-1.5">
      {punten.map((p, i) => (
        <div key={i} className="group relative flex flex-1 flex-col items-center justify-end self-stretch">
          <div className="pointer-events-none absolute -top-1 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-chip bg-forest-800 px-2 py-1 text-2xs text-stone2-50 group-hover:block">
            {formatteer(p.waarde)}{p.sub !== undefined ? ` · ${p.sub} omgezet` : ''}
          </div>
          <div className="relative w-full rounded-t-[3px] bg-bronze-500/25 transition group-hover:bg-bronze-500/40"
            style={{ height: `${Math.round((p.waarde / max) * 100)}%`, minHeight: p.waarde > 0 ? 3 : 0 }}>
            {p.sub !== undefined && p.waarde > 0 && (
              <div className="absolute bottom-0 left-0 w-full rounded-t-[3px] bg-olive-500/70"
                style={{ height: `${Math.round((p.sub / p.waarde) * 100)}%` }} />
            )}
          </div>
          <span className="mt-1 text-2xs text-inkt-faint">{p.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ['dashboard'], queryFn: () => api.get<Kerncijfers>('/dashboard') })
  const { data: rapport } = useQuery({
    queryKey: ['rapporten'], queryFn: () => api.get<RapportOverzicht>('/rapporten/overzicht')
  })

  const orderTotaal = rapport ? Math.max(rapport.orderStatussen.reduce((s, o) => s + o.aantal, 0), 1) : 1

  return (
    <>
      <PaginaKop eyebrow="Operations · overzicht" titel="Dashboard"
        actie={<Link to="/leads"><Knop variant="primair">Nieuwe lead ↗</Knop></Link>} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Kerncijfer label="Open leads" waarde={data?.openLeads ?? '—'} />
        <Kerncijfer label="Verzonden offertes" waarde={data?.verzondenOffertes ?? '—'} />
        <Kerncijfer label="Actieve orders" waarde={data?.actieveOrders ?? '—'} />
        <Kerncijfer label="Mijn open taken" waarde={data?.mijnOpenTaken ?? '—'} />
        <Kerncijfer label="Omzet kwartaal" waarde={data ? euro(data.omzetKwartaal) : '—'} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Paneel titel="Omzet per maand (goedgekeurde offertes, excl btw)">
          {rapport ? (
            <Staafgrafiek formatteer={euro}
              punten={rapport.maanden.map(m => ({ label: maandLabel(m.maand), waarde: m.omzet }))} />
          ) : <p className="text-sm text-inkt-faint">Laden…</p>}
        </Paneel>
        <Paneel titel="Leads per maand (olijf = omgezet)">
          {rapport ? (
            <Staafgrafiek formatteer={w => `${w} leads`}
              punten={rapport.maanden.map(m => ({ label: maandLabel(m.maand), waarde: m.leads, sub: m.omgezet }))} />
          ) : <p className="text-sm text-inkt-faint">Laden…</p>}
        </Paneel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Paneel titel="Orders per status">
          {rapport && rapport.orderStatussen.length > 0 ? (
            <div className="space-y-2.5">
              {rapport.orderStatussen.map(o => (
                <div key={o.status}>
                  <div className="mb-0.5 flex items-baseline justify-between text-xs">
                    <span className="text-inkt-body">{statusTekst[o.status] ?? o.status}</span>
                    <span className="font-semibold text-inkt">{o.aantal}</span>
                  </div>
                  <div className="h-2 rounded-chip bg-stone2-200">
                    <div className="h-2 rounded-chip bg-bronze-500/60"
                      style={{ width: `${Math.round((o.aantal / orderTotaal) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-inkt-faint">Nog geen orders.</p>}
        </Paneel>
        <Paneel titel="Kengetallen (12 maanden)">
          <div className="grid grid-cols-2 gap-4">
            <Kerncijfer label="Leadconversie" waarde={rapport ? `${rapport.leadconversie}%` : '—'} />
            <Kerncijfer label="Doorlooptijd offerte" waarde={
              rapport?.gemiddeldeDoorlooptijd != null ? `${rapport.gemiddeldeDoorlooptijd} d` : '—'
            } />
            <Link to="/service" className="block"><Kerncijfer label="Open service" waarde={rapport?.serviceOpen ?? '—'} /></Link>
            <Link to="/veld" className="block"><Kerncijfer label="Open werkbonnen" waarde={rapport?.werkbonnenOpen ?? '—'} /></Link>
          </div>
          <p className="mt-3 text-xs text-inkt-faint">
            Conversie op {rapport?.totaalLeads ?? 0} leads waarvan {rapport?.totaalOmgezet ?? 0} omgezet.
            Doorlooptijd is verzending tot goedkeuring.
          </p>
        </Paneel>
      </div>
    </>
  )
}
