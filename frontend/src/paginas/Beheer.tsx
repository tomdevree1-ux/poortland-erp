import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { persoon } from '../lib/formaat'
import type { MedewerkerRij, Rol } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Th, Td, rijKlik } from '../ui'

const alleRollen: Rol[] = ['verkoop', 'planning', 'productie', 'montage', 'boekhouding', 'beheerder']

/* Gebruikersbeheer volgens de platform UX regels: de rij openen is klikken,
   wijzigen gebeurt in het bewerkvenster met Opslaan en Annuleren. */
export default function Beheer() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [uitnodigOpen, zetUitnodigOpen] = useState(false)
  const { data: medewerkers } = useQuery({ queryKey: ['medewerkers'], queryFn: () => api.get<MedewerkerRij[]>('/medewerkers') })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['medewerkers'] }) }

  const [vorm, zetVorm] = useState({ email: '', naam: '', voornaam: '', rollen: [] as Rol[] })
  const nodigUit = useMutation({
    mutationFn: () => api.post('/medewerkers/uitnodigen', vorm),
    onSuccess: () => { ververs(); zetUitnodigOpen(false); zetVorm({ email: '', naam: '', voornaam: '', rollen: [] }) },
    onError: f => zetFout((f as Error).message)
  })

  const [bewerk, zetBewerk] = useState<MedewerkerRij | null>(null)
  const [bewerkVorm, zetBewerkVorm] = useState<{ rollen: Rol[]; isActief: boolean } | null>(null)
  function openBewerk(m: MedewerkerRij) {
    zetBewerk(m)
    zetBewerkVorm({ rollen: [...m.rollen], isActief: m.isActief })
  }
  const bewaar = useMutation({
    mutationFn: async () => {
      await api.put(`/medewerkers/${bewerk!.id}/rollen`, { rollen: bewerkVorm!.rollen })
      if (bewerkVorm!.isActief !== bewerk!.isActief)
        await api.patch(`/medewerkers/${bewerk!.id}`, { isActief: bewerkVorm!.isActief })
    },
    onSuccess: () => { ververs(); zetBewerk(null) },
    onError: f => zetFout((f as Error).message)
  })

  function wisselRol(lijst: Rol[], rol: Rol): Rol[] {
    return lijst.includes(rol) ? lijst.filter(r => r !== rol) : [...lijst, rol]
  }

  return (
    <>
      <PaginaKop eyebrow="Beheer · toegang" titel="Medewerkers"
        actie={<Knop variant="primair" onClick={() => { zetVorm({ email: '', naam: '', voornaam: '', rollen: [] }); zetUitnodigOpen(true) }}>Medewerker uitnodigen ↗</Knop>} />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      <table className="w-full border-separate border-spacing-0">
        <thead><tr><Th>Naam</Th><Th>Email</Th><Th>Rollen</Th><Th>Toegang</Th></tr></thead>
        <tbody>
          {medewerkers?.map(m => (
            <tr key={m.id} className={rijKlik} onClick={() => openBewerk(m)}>
              <Td className="font-semibold">{persoon(m.voornaam, m.naam)}</Td>
              <Td>{m.email}</Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  {m.rollen.length === 0 ? '—' : m.rollen.map(rol => (
                    <span key={rol} className="rounded-chip bg-bronze-500/15 px-2 py-0.5 text-xs font-semibold text-bronze-600">{rol}</span>
                  ))}
                </div>
              </Td>
              <Td><Badge status={m.isActief ? 'open' : 'vervallen'} /></Td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs text-inkt-faint">
        Geen open registratie: nieuwe medewerkers komen enkel binnen via een uitnodiging.
        MFA met een authenticator is verplicht voor beheerder en boekhouding.
      </p>

      <Modaal open={!!bewerk} titel={bewerk ? `${bewerk.naam} bewerken` : ''} onSluit={() => zetBewerk(null)}>
        {bewerk && bewerkVorm && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaar.mutate() }}>
            <div className="text-sm text-inkt-muted">{bewerk.email}</div>
            <div>
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Rollen</div>
              <div className="flex flex-wrap gap-1.5">
                {alleRollen.map(rol => {
                  const heeft = bewerkVorm.rollen.includes(rol)
                  return (
                    <button type="button" key={rol}
                      className={`focusring rounded-chip border px-2.5 py-1 text-xs font-semibold ${heeft ? 'border-bronze-500 bg-bronze-500/15 text-bronze-600' : 'border-inkt/15 text-inkt-faint'}`}
                      onClick={() => zetBewerkVorm({ ...bewerkVorm, rollen: wisselRol(bewerkVorm.rollen, rol) })}>
                      {rol}
                    </button>
                  )
                })}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-inkt-body">
              <input type="checkbox" checked={bewerkVorm.isActief}
                onChange={e => zetBewerkVorm({ ...bewerkVorm, isActief: e.target.checked })} />
              Actieve toegang (uitvinken blokkeert het aanmelden)
            </label>
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetBewerk(null)}>Annuleren</Knop>
              <Knop variant="primair" disabled={bewaar.isPending || bewerkVorm.rollen.length === 0}>
                {bewaar.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
            </div>
          </form>
        )}
      </Modaal>

      <Modaal open={uitnodigOpen} titel="Medewerker uitnodigen" onSluit={() => zetUitnodigOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); nodigUit.mutate() }}>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Voornaam" optioneel value={vorm.voornaam} onChange={e => zetVorm({ ...vorm, voornaam: e.target.value })} />
            <Invoer label="Naam" value={vorm.naam} onChange={e => zetVorm({ ...vorm, naam: e.target.value })} required />
          </div>
          <Invoer label="Email" type="email" value={vorm.email} onChange={e => zetVorm({ ...vorm, email: e.target.value })} required />
          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-muted">Rollen</div>
            <div className="flex flex-wrap gap-1.5">
              {alleRollen.map(rol => {
                const heeft = vorm.rollen.includes(rol)
                return (
                  <button type="button" key={rol}
                    className={`focusring rounded-chip border px-2.5 py-1 text-xs font-semibold ${heeft ? 'border-bronze-500 bg-bronze-500/15 text-bronze-600' : 'border-inkt/15 text-inkt-faint'}`}
                    onClick={() => zetVorm({ ...vorm, rollen: wisselRol(vorm.rollen, rol) })}>
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
