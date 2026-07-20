import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { api } from '../lib/api'
import { datum, leeg, persoon, weergaveNaam } from '../lib/formaat'
import type { Klant, MedewerkerKeuze, ServiceRij, ServiceStatus } from '../lib/types'
import { Badge, Knop, LegeStaat, Melding, Modaal, PaginaKop, Paneel, Selecteer, TekstVak, VeldLabel } from '../ui'

/* TS-11 Service en nazorg (FR-015): meldingen na oplevering met een
   garantie-indicatie uit het dossier en een eenvoudige statusflow. */

const statussen: { waarde: '' | ServiceStatus; label: string }[] = [
  { waarde: '', label: 'Alle statussen' },
  { waarde: 'gemeld', label: 'Gemeld' },
  { waarde: 'ingepland', label: 'Ingepland' },
  { waarde: 'uitgevoerd', label: 'Uitgevoerd' },
  { waarde: 'afgesloten', label: 'Afgesloten' }
]

function GarantieBadge({ binnen }: { binnen: boolean }) {
  return binnen ? (
    <span className="inline-flex items-center gap-1 rounded-chip bg-olive-500/15 px-2 py-0.5 text-xs font-semibold text-olive-600">
      <ShieldCheck size={12} /> Binnen garantie
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-chip bg-stone2-200 px-2 py-0.5 text-xs font-semibold text-inkt-muted">
      <ShieldOff size={12} /> Buiten garantie
    </span>
  )
}

export default function Service() {
  const qc = useQueryClient()
  const [statusFilter, zetStatusFilter] = useState<'' | ServiceStatus>('')
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const [actiefId, zetActiefId] = useState<string | null>(null)
  const [fout, zetFout] = useState('')

  const { data: dossiers } = useQuery({
    queryKey: ['service', statusFilter],
    queryFn: () => api.get<ServiceRij[]>(`/service${statusFilter ? `?status=${statusFilter}` : ''}`)
  })
  const { data: medewerkers } = useQuery({
    queryKey: ['medewerkers-overzicht'],
    queryFn: () => api.get<MedewerkerKeuze[]>('/medewerkers/overzicht'), staleTime: 5 * 60 * 1000
  })

  const ververs = () => qc.invalidateQueries({ queryKey: ['service'] })
  const actief = dossiers?.find(d => d.id === actiefId) ?? null

  return (
    <>
      <PaginaKop eyebrow="Nazorg · meldingen" titel="Service"
        actie={<Knop variant="primair" onClick={() => { zetFout(''); zetNieuwOpen(true) }}>Nieuwe melding</Knop>} />

      <div className="mb-4 flex items-center gap-3">
        <Selecteer klein value={statusFilter} onChange={e => zetStatusFilter(e.target.value as '' | ServiceStatus)}>
          {statussen.map(s => <option key={s.waarde} value={s.waarde}>{s.label}</option>)}
        </Selecteer>
        <span className="text-xs text-inkt-faint">{dossiers?.length ?? 0} meldingen</span>
      </div>

      {dossiers && dossiers.length === 0 ? (
        <LegeStaat titel="Geen servicemeldingen" tekst="Meld hier klachten of interventies na oplevering. De garantie wordt automatisch afgetoetst op het dossier." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {dossiers?.map(d => (
            <button key={d.id} type="button" onClick={() => { zetFout(''); zetActiefId(d.id) }}
              className="rounded-card border border-stone2-200 bg-vlak-surface p-4 text-left shadow-sm transition hover:border-bronze-400">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-inkt">{weergaveNaam(d.klant)}</p>
                  {d.klant.bedrijfsnaam && (d.klant.voornaam || d.klant.naam) && (
                    <p className="text-xs text-inkt-muted">{persoon(d.klant.voornaam, d.klant.naam)}</p>
                  )}
                </div>
                <Badge status={d.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-inkt-body">{leeg(d.klacht)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-inkt-muted">
                <GarantieBadge binnen={d.garantieIndicatie} />
                {d.project && <span>Dossier {d.project.nummer ?? '—'} · {d.project.werfadres}</span>}
              </div>
              <div className="mt-2 flex gap-4 text-xs text-inkt-faint">
                <span>Gemeld {datum(d.gemeldOp)}</span>
                {d.geplandOp && <span>Gepland {datum(d.geplandOp)}</span>}
                {d.technieker && <span>Technieker {d.technieker}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {nieuwOpen && (
        <NieuweMelding medewerkers={medewerkers ?? []} fout={fout} zetFout={zetFout}
          onSluit={() => zetNieuwOpen(false)} onKlaar={() => { zetNieuwOpen(false); ververs() }} />
      )}
      {actief && (
        <MeldingDetail dossier={actief} medewerkers={medewerkers ?? []} fout={fout} zetFout={zetFout}
          onSluit={() => zetActiefId(null)} onWijzig={ververs} />
      )}
    </>
  )
}

function NieuweMelding({ medewerkers, fout, zetFout, onSluit, onKlaar }: {
  medewerkers: MedewerkerKeuze[]; fout: string; zetFout: (f: string) => void
  onSluit: () => void; onKlaar: () => void
}) {
  const [term, zetTerm] = useState('')
  const [klant, zetKlant] = useState<Klant | null>(null)
  const [klacht, zetKlacht] = useState('')
  const [techniekerId, zetTechniekerId] = useState('')
  const [geplandOp, zetGeplandOp] = useState('')

  const { data: klanten } = useQuery({
    queryKey: ['service-klantzoek', term],
    queryFn: () => api.get<Klant[]>(`/klanten?${new URLSearchParams(term ? { zoek: term } : {})}`),
    enabled: !klant
  })

  const maak = useMutation({
    mutationFn: () => api.post<{ id: string }>('/service', {
      klantId: klant!.id, klacht: klacht || null,
      techniekerId: techniekerId || null, geplandOp: geplandOp || null
    }),
    onSuccess: onKlaar,
    onError: (e: Error) => zetFout(e.message)
  })

  return (
    <Modaal open titel="Nieuwe servicemelding" onSluit={onSluit}>
      <div className="space-y-4">
        {!klant ? (
          <div>
            <VeldLabel>Klant</VeldLabel>
            <input value={term} onChange={e => zetTerm(e.target.value)} placeholder="Zoek op naam, adres of telefoon"
              className="w-full rounded-control border border-stone2-300 bg-vlak-surface px-3 py-2 text-sm outline-none focus:border-bronze-500" />
            <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
              {klanten?.slice(0, 12).map(k => (
                <button key={k.id} type="button" onClick={() => zetKlant(k)}
                  className="flex w-full items-baseline justify-between rounded-control border border-stone2-200 bg-vlak-surface px-3 py-2 text-left text-sm transition hover:border-bronze-400">
                  <span className="font-medium text-inkt">{weergaveNaam(k)}</span>
                  <span className="text-xs text-inkt-faint">{leeg(k.gemeente)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-control bg-vlak-raised px-3 py-2 text-sm">
            <div>
              <p className="font-semibold text-inkt">{weergaveNaam(klant)}</p>
              {klant.bedrijfsnaam && (klant.voornaam || klant.naam) && (
                <p className="text-xs text-inkt-muted">{persoon(klant.voornaam, klant.naam)}</p>
              )}
            </div>
            <Knop onClick={() => zetKlant(null)}>Wijzig</Knop>
          </div>
        )}
        <TekstVak label="Klacht of vraag" rows={3} value={klacht} onChange={e => zetKlacht(e.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <Selecteer label="Technieker" optioneel value={techniekerId} onChange={e => zetTechniekerId(e.target.value)}>
            <option value="">Nog niet toegewezen</option>
            {medewerkers.map(m => <option key={m.id} value={m.id}>{m.naam}</option>)}
          </Selecteer>
          <div>
            <VeldLabel optioneel>Gewenste datum</VeldLabel>
            <input type="date" value={geplandOp} onChange={e => zetGeplandOp(e.target.value)}
              className="w-full rounded-control border border-stone2-300 bg-vlak-surface px-3 py-2 text-sm outline-none focus:border-bronze-500" />
          </div>
        </div>
        <p className="text-xs text-inkt-faint">
          De garantie wordt automatisch afgetoetst op het recentste dossier van deze klant.
        </p>
        {fout && <Melding soort="fout">{fout}</Melding>}
        <div className="flex justify-end gap-2">
          <Knop onClick={onSluit}>Annuleren</Knop>
          <Knop variant="primair" disabled={!klant || maak.isPending} onClick={() => maak.mutate()}>Melden</Knop>
        </div>
      </div>
    </Modaal>
  )
}

function MeldingDetail({ dossier, medewerkers, fout, zetFout, onSluit, onWijzig }: {
  dossier: ServiceRij; medewerkers: MedewerkerKeuze[]; fout: string; zetFout: (f: string) => void
  onSluit: () => void; onWijzig: () => void
}) {
  const [techniekerId, zetTechniekerId] = useState(dossier.techniekerId ?? '')
  const [geplandOp, zetGeplandOp] = useState(dossier.geplandOp ?? '')

  const bewaar = useMutation({
    mutationFn: () => api.patch(`/service/${dossier.id}`, {
      klantId: dossier.klant.id, klacht: null,
      techniekerId: techniekerId || null, geplandOp: geplandOp || null
    }),
    onSuccess: onWijzig,
    onError: (e: Error) => zetFout(e.message)
  })
  const zetStatus = useMutation({
    mutationFn: async (status: ServiceStatus) => {
      await api.patch(`/service/${dossier.id}`, {
        klantId: dossier.klant.id, klacht: null,
        techniekerId: techniekerId || null, geplandOp: geplandOp || null
      })
      return api.post(`/service/${dossier.id}/status`, { status })
    },
    onSuccess: onWijzig,
    onError: (e: Error) => zetFout(e.message)
  })

  return (
    <Modaal open titel="Servicemelding" onSluit={onSluit}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-inkt">{weergaveNaam(dossier.klant)}</p>
            {dossier.klant.bedrijfsnaam && (dossier.klant.voornaam || dossier.klant.naam) && (
              <p className="text-xs text-inkt-muted">{persoon(dossier.klant.voornaam, dossier.klant.naam)}</p>
            )}
            <p className="text-xs text-inkt-faint">{leeg(dossier.klant.telefoon)}</p>
          </div>
          <Badge status={dossier.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <GarantieBadge binnen={dossier.garantieIndicatie} />
          {dossier.project && (
            <Link to="/dossiers/$projectId" params={{ projectId: dossier.project.id }}
              className="text-xs font-semibold text-bronze-600 underline underline-offset-2">
              Dossier {dossier.project.nummer ?? '—'} · {dossier.project.werfadres}
            </Link>
          )}
        </div>
        <Paneel titel="Klacht of vraag">
          <p className="whitespace-pre-wrap text-sm text-inkt-body">{leeg(dossier.klacht)}</p>
        </Paneel>
        {dossier.status !== 'afgesloten' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Selecteer label="Technieker" optioneel value={techniekerId} onChange={e => zetTechniekerId(e.target.value)}>
              <option value="">Nog niet toegewezen</option>
              {medewerkers.map(m => <option key={m.id} value={m.id}>{m.naam}</option>)}
            </Selecteer>
            <div>
              <VeldLabel optioneel>Geplande datum</VeldLabel>
              <input type="date" value={geplandOp} onChange={e => zetGeplandOp(e.target.value)}
                className="w-full rounded-control border border-stone2-300 bg-vlak-surface px-3 py-2 text-sm outline-none focus:border-bronze-500" />
            </div>
          </div>
        )}
        <p className="text-xs text-inkt-faint">Gemeld op {datum(dossier.gemeldOp)}</p>
        {fout && <Melding soort="fout">{fout}</Melding>}
        <div className="flex flex-wrap justify-end gap-2">
          {dossier.status !== 'afgesloten' && (
            <Knop disabled={bewaar.isPending} onClick={() => bewaar.mutate()}>Bewaren</Knop>
          )}
          {dossier.status === 'gemeld' && (
            <Knop variant="primair" disabled={zetStatus.isPending || !geplandOp}
              onClick={() => zetStatus.mutate('ingepland')}>Inplannen</Knop>
          )}
          {dossier.status === 'ingepland' && (
            <Knop variant="primair" disabled={zetStatus.isPending}
              onClick={() => zetStatus.mutate('uitgevoerd')}>Uitgevoerd</Knop>
          )}
          {dossier.status === 'uitgevoerd' && (
            <>
              <Knop disabled={zetStatus.isPending} onClick={() => zetStatus.mutate('ingepland')}>Vervolginterventie</Knop>
              <Knop variant="primair" disabled={zetStatus.isPending}
                onClick={() => zetStatus.mutate('afgesloten')}>Afsluiten</Knop>
            </>
          )}
        </div>
      </div>
    </Modaal>
  )
}
