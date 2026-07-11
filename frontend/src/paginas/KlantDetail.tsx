import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { api } from '../lib/api'
import { datum, leeg } from '../lib/formaat'
import type { Klant } from '../lib/types'
import { Badge, PaginaKop, Paneel } from '../ui'

interface KlantDossier {
  klant: Klant & { contactpersonen: { id: string; naam: string; functie?: string; email?: string }[] }
  projecten: { id: string; werfadres: string; status: string; aangemaaktOp: string }[]
  contactmomenten: { id: string; type: string; datum: string; notitie?: string }[]
}

export default function KlantDetail() {
  const { klantId } = useParams({ from: '/app/klanten/$klantId' })
  const { data } = useQuery({ queryKey: ['klant', klantId], queryFn: () => api.get<KlantDossier>(`/klanten/${klantId}`) })
  if (!data) return null
  const { klant, projecten, contactmomenten } = data
  return (
    <>
      <PaginaKop eyebrow="Klantfiche" titel={klant.naam} />
      <div className="grid grid-cols-2 gap-6">
        <Paneel titel="Gegevens">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-inkt-muted">Type</dt><dd>{klant.type === 'bedrijf' ? 'Bedrijf' : 'Particulier'}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Adres</dt><dd>{leeg([klant.straat, klant.postcode, klant.gemeente].filter(Boolean).join(', '))}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Email</dt><dd>{leeg(klant.email)}</dd></div>
            <div className="flex justify-between"><dt className="text-inkt-muted">Telefoon</dt><dd>{leeg(klant.telefoon)}</dd></div>
            {klant.btwNummer && <div className="flex justify-between"><dt className="text-inkt-muted">Btw</dt><dd>{klant.btwNummer}</dd></div>}
            <div className="flex justify-between"><dt className="text-inkt-muted">Taal</dt><dd className="uppercase">{klant.communicatietaal}</dd></div>
          </dl>
          {klant.contactpersonen.length > 0 && (
            <>
              <h3 className="mb-2 mt-5 text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">Contactpersonen</h3>
              <ul className="space-y-1 text-sm">
                {klant.contactpersonen.map(c => (
                  <li key={c.id}>{c.naam} <span className="text-inkt-muted">· {leeg(c.functie)} · {leeg(c.email)}</span></li>
                ))}
              </ul>
            </>
          )}
        </Paneel>
        <Paneel titel="Historisch klantbeeld">
          <h3 className="mb-2 text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">Projecten</h3>
          {projecten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen projecten.</p> : (
            <ul className="space-y-2 text-sm">
              {projecten.map(p => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link to="/dossiers/$projectId" params={{ projectId: p.id }} className="font-semibold text-bronze-600 hover:text-bronze-500">{p.werfadres}</Link>
                  <Badge status={p.status} />
                </li>
              ))}
            </ul>
          )}
          <h3 className="mb-2 mt-5 text-2xs font-bold uppercase tracking-[0.16em] text-inkt-muted">Contactmomenten</h3>
          {contactmomenten.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen contactmomenten.</p> : (
            <ul className="space-y-1 text-sm">
              {contactmomenten.map(c => (
                <li key={c.id} className="flex justify-between gap-3">
                  <span>{c.type} · {leeg(c.notitie)}</span>
                  <span className="whitespace-nowrap text-inkt-muted">{datum(c.datum)}</span>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      </div>
    </>
  )
}
