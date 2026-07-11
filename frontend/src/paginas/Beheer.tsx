import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { MedewerkerRij, Rol } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Th, Td } from '../ui'

const alleRollen: Rol[] = ['verkoop', 'planning', 'productie', 'montage', 'boekhouding', 'beheerder']

/* Gebruikersbeheer (TS-02): uitnodigen, rollen en deactiveren. Enkel de beheerder. */
export default function Beheer() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [uitnodigOpen, zetUitnodigOpen] = useState(false)
  const { data: medewerkers } = useQuery({ queryKey: ['medewerkers'], queryFn: () => api.get<MedewerkerRij[]>('/medewerkers') })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['medewerkers'] }) }

  const [vorm, zetVorm] = useState({ email: '', naam: '', rollen: [] as Rol[] })
  const nodigUit = useMutation({
    mutationFn: () => api.post('/medewerkers/uitnodigen', vorm),
    onSuccess: () => { ververs(); zetUitnodigOpen(false); zetVorm({ email: '', naam: '', rollen: [] }) },
    onError: f => zetFout((f as Error).message)
  })
  const zetRollen = useMutation({
    mutationFn: ({ id, rollen }: { id: string; rollen: Rol[] }) => api.put(`/medewerkers/${id}/rollen`, { rollen }),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const zetActief = useMutation({
    mutationFn: ({ id, isActief }: { id: string; isActief: boolean }) => api.patch(`/medewerkers/${id}`, { isActief }),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  return (
    <>
      <PaginaKop eyebrow="Beheer · toegang" titel="Medewerkers"
        actie={<Knop variant="primair" onClick={() => zetUitnodigOpen(true)}>Medewerker uitnodigen ↗</Knop>} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      <table className="w-full border-separate border-spacing-0">
        <thead><tr><Th>Naam</Th><Th>Email</Th><Th>Rollen</Th><Th>Toegang</Th><Th /></tr></thead>
        <tbody>
          {medewerkers?.map(m => (
            <tr key={m.id} className="align-top hover:bg-bronze-500/[.06]">
              <Td className="font-semibold">{m.naam}</Td>
              <Td>{m.email}</Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  {alleRollen.map(rol => {
                    const heeft = m.rollen.includes(rol)
                    return (
                      <button key={rol}
                        className={`focusring rounded-chip border px-2 py-0.5 text-xs font-semibold ${heeft ? 'border-bronze-500 bg-bronze-500/15 text-bronze-600' : 'border-inkt/15 text-inkt-faint hover:text-inkt-muted'}`}
                        onClick={() => zetRollen.mutate({ id: m.id, rollen: heeft ? m.rollen.filter(r => r !== rol) : [...m.rollen, rol] })}>
                        {rol}
                      </button>
                    )
                  })}
                </div>
              </Td>
              <Td><Badge status={m.isActief ? 'open' : 'vervallen'} /></Td>
              <Td rechts>
                <Knop variant={m.isActief ? 'ghost' : 'secundair'} className="h-8 px-3 text-xs"
                  onClick={() => zetActief.mutate({ id: m.id, isActief: !m.isActief })}>
                  {m.isActief ? 'Deactiveren' : 'Activeren'}
                </Knop>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-inkt-faint">
        Geen open registratie: nieuwe medewerkers komen enkel binnen via een uitnodiging.
        MFA met een authenticator is verplicht voor beheerder en boekhouding.
      </p>
      <Modaal open={uitnodigOpen} titel="Medewerker uitnodigen" onSluit={() => zetUitnodigOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); nodigUit.mutate() }}>
          <Invoer label="Naam" value={vorm.naam} onChange={e => zetVorm({ ...vorm, naam: e.target.value })} required />
          <Invoer label="Email" type="email" value={vorm.email} onChange={e => zetVorm({ ...vorm, email: e.target.value })} required />
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Rollen</div>
            <div className="flex flex-wrap gap-1.5">
              {alleRollen.map(rol => {
                const heeft = vorm.rollen.includes(rol)
                return (
                  <button type="button" key={rol}
                    className={`focusring rounded-chip border px-2.5 py-1 text-xs font-semibold ${heeft ? 'border-bronze-500 bg-bronze-500/15 text-bronze-600' : 'border-inkt/15 text-inkt-faint'}`}
                    onClick={() => zetVorm({ ...vorm, rollen: heeft ? vorm.rollen.filter(r => r !== rol) : [...vorm.rollen, rol] })}>
                    {rol}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetUitnodigOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={nodigUit.isPending || vorm.rollen.length === 0}>
              {nodigUit.isPending ? 'Bezig…' : 'Uitnodigen'}
            </Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
