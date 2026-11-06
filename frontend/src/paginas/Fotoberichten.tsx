import { useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Check, ExternalLink, Trash2, UserPlus } from 'lucide-react'
import { api } from '../lib/api'
import { useZoekterm } from '../lib/zoek'
import { datum, leeg } from '../lib/formaat'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Th, Td, rijKlik } from '../ui'

/* Fotoberichten: foto's die binnenkomen via de vaste publieke pagina /fotos
   (migraties 0044 en 0045). Bestaande klanten sturen daar een beeld van hun
   geplaatste poort. Belangrijk is het vinkje publicatie: enkel wie dat bewust
   aankruiste geeft ons toestemming om de foto bij de realisaties te tonen.
   Inzendingen horen bij geen enkele lead of klant, vandaar een eigen sectie. */

type Rij = {
  id: string
  naam: string
  email?: string | null
  telefoon?: string | null
  bericht?: string | null
  herkomst?: string | null
  gemeente?: string | null
  geplaatstJaar?: number | null
  publicatieAkkoord: boolean
  status: 'nieuw' | 'behandeld'
  leadId?: string | null
  behandeldOp?: string | null
  aangemaaktOp: string
  aantalFotos: number
}
type Foto = { id: string; bestandsnaam: string; url: string }
type Detail = Omit<Rij, 'aantalFotos'> & { fotos: Foto[] }
type LeadTreffer = { id: string; naam: string; voornaam?: string | null; gemeente?: string | null }

export const FOTOPAGINA = '/fotos'

export default function Fotoberichten() {
  const qc = useQueryClient()
  const navigeer = useNavigate()
  const [weergave, zetWeergave] = useState<'nieuw' | 'behandeld' | 'alles'>('nieuw')
  const { term, invoer, zetInvoer } = useZoekterm()
  const [open, zetOpen] = useState<string | null>(null)
  const [koppelZoek, zetKoppelZoek] = useState('')
  const [fout, zetFout] = useState<string | null>(null)

  const { data, isFetching } = useQuery({
    queryKey: ['fotoberichten', weergave, term],
    queryFn: () => api.get<{ lijst: Rij[]; openstaand: number }>(
      `/fotoberichten?${new URLSearchParams({
        ...(weergave === 'alles' ? {} : { status: weergave }),
        ...(term ? { zoek: term } : {})
      })}`),
    placeholderData: keepPreviousData
  })

  const { data: detail } = useQuery({
    queryKey: ['fotobericht', open],
    queryFn: () => api.get<Detail>(`/fotoberichten/${open}`),
    enabled: !!open
  })

  const { data: leadTreffers } = useQuery({
    queryKey: ['leads-zoek', koppelZoek],
    queryFn: () => api.get<LeadTreffer[]>(`/leads?zoek=${encodeURIComponent(koppelZoek)}`),
    enabled: koppelZoek.trim().length >= 2
  })

  const ververs = () => {
    qc.invalidateQueries({ queryKey: ['fotoberichten'] })
    qc.invalidateQueries({ queryKey: ['fotobericht'] })
  }
  const faal = (e: unknown) => zetFout(e instanceof Error ? e.message : 'Er ging iets mis.')

  const zetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'nieuw' | 'behandeld' }) =>
      api.patch(`/fotoberichten/${id}/status`, { status }),
    onSuccess: ververs, onError: faal
  })
  const koppel = useMutation({
    mutationFn: ({ id, leadId }: { id: string; leadId?: string }) =>
      api.post<{ leadId: string }>(`/fotoberichten/${id}/koppel`, { leadId: leadId ?? null }),
    onSuccess: r => { ververs(); zetOpen(null); navigeer({ to: '/leads/$leadId', params: { leadId: r.leadId } }) },
    onError: faal
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/fotoberichten/${id}`),
    onSuccess: () => { ververs(); zetOpen(null) }, onError: faal
  })

  const lijst = data?.lijst ?? []
  const fotoUrl = `${location.origin.replace('//', '//www.').replace('//www.www.', '//www.')}${FOTOPAGINA}`

  return (
    <>
      <PaginaKop eyebrow="Binnengekomen" titel="Fotoberichten"
        actie={
          <Knop variant="secundair" onClick={() => navigator.clipboard?.writeText(fotoUrl)}>
            Kopieer de fotolink
          </Knop>
        } />

      <p className="mb-5 max-w-[70ch] text-sm text-inkt-muted">
        Foto's die klanten zelf bezorgen via <span className="font-medium text-inkt">poortland.be/fotos</span>,
        de link uit de nieuwsbrief. Enkel inzendingen met het label{' '}
        <span className="font-medium text-olive-600">Mag online</span> mogen op de website of de sociale media.
        Bij de andere gaf de klant die toestemming niet, gebruik ze dus enkel intern.
      </p>

      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {([['nieuw', 'Nieuw'], ['behandeld', 'Behandeld'], ['alles', 'Alles']] as const).map(([w, label]) => (
          <button key={w} type="button" onClick={() => zetWeergave(w)}
            className={`focusring rounded-control px-3 py-1.5 text-sm font-semibold transition ${
              weergave === w ? 'bg-bronze-500 text-stone2-50' : 'text-inkt-muted hover:bg-bronze-500/10'}`}>
            {label}{w === 'nieuw' && data?.openstaand ? ` (${data.openstaand})` : ''}
          </button>
        ))}
        <div className="ml-auto w-56">
          <Invoer placeholder="Zoek op naam, email of telefoon"
            value={invoer} onChange={e => zetInvoer(e.target.value)} />
        </div>
      </div>

      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr><Th>Van</Th><Th>Contact</Th><Th>Publicatie</Th><Th rechts>Foto's</Th><Th>Ontvangen</Th><Th>Status</Th></tr>
        </thead>
        <tbody>
          {lijst.map(r => (
            <tr key={r.id} className={rijKlik} onClick={() => { zetOpen(r.id); zetKoppelZoek(''); zetFout(null) }}>
              <Td><span className="font-medium text-inkt">{r.naam}</span>
                {r.gemeente && <span className="ml-2 text-xs text-inkt-faint">{r.gemeente}</span>}</Td>
              <Td><span className="text-inkt-body">{leeg(r.email ?? r.telefoon)}</span></Td>
              <Td><PublicatieLabel akkoord={r.publicatieAkkoord} /></Td>
              <Td rechts>{r.aantalFotos}</Td>
              <Td>{datum(r.aangemaaktOp)}</Td>
              <Td><Badge status={r.status} /></Td>
            </tr>
          ))}
          {!lijst.length && !isFetching && (
            <tr><Td className="py-8 text-center text-inkt-muted" >Nog geen inzendingen in deze weergave.</Td></tr>
          )}
        </tbody>
      </table>

      <Modaal open={!!open} titel="Fotobericht" onSluit={() => zetOpen(null)}>
        {!detail ? <p className="text-sm text-inkt-muted">Bezig met laden…</p> : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Gegeven label="Naam">{detail.naam}</Gegeven>
              <Gegeven label="Ontvangen">{datum(detail.aangemaaktOp)}</Gegeven>
              <Gegeven label="Email">{leeg(detail.email)}</Gegeven>
              <Gegeven label="Telefoon">{leeg(detail.telefoon)}</Gegeven>
              <Gegeven label="Gemeente">{leeg(detail.gemeente)}</Gegeven>
              <Gegeven label="Geplaatst in">{detail.geplaatstJaar ?? '—'}</Gegeven>
              {detail.herkomst && <Gegeven label="Herkomst">{detail.herkomst}</Gegeven>}
              <Gegeven label="Status"><Badge status={detail.status} /></Gegeven>
            </div>

            {detail.publicatieAkkoord ? (
              <Melding soort="ok">
                De klant gaf toestemming om deze foto's te tonen op de website en de sociale media.
                Vermeld hoogstens de streek, nooit de naam of het adres.
              </Melding>
            ) : (
              <Melding soort="info">
                Geen toestemming om te publiceren. Gebruik deze foto's enkel intern, tenzij de klant
                het alsnog uitdrukkelijk toestaat.
              </Melding>
            )}
            {detail.bericht && (
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">Bericht</p>
                <p className="whitespace-pre-wrap text-sm text-inkt-body">{detail.bericht}</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">
                Foto's ({detail.fotos.length})
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {detail.fotos.map(f => (
                  <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-control border border-inkt/10">
                    <img src={f.url} alt={f.bestandsnaam} loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-[1.04]" />
                  </a>
                ))}
              </div>
            </div>

            {detail.leadId ? (
              <Melding soort="ok">
                Deze foto's staan op een lead.{' '}
                <button type="button" className="underline"
                  onClick={() => { zetOpen(null); navigeer({ to: '/leads/$leadId', params: { leadId: detail.leadId! } }) }}>
                  Open de lead <ExternalLink size={12} className="inline" />
                </button>
              </Melding>
            ) : (
              <div className="rounded-control border border-inkt/10 bg-vlak-raised p-3">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">Aan een lead hangen</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Knop variant="primair" disabled={koppel.isPending}
                    onClick={() => koppel.mutate({ id: detail.id })}>
                    <UserPlus size={14} className="mr-1.5" /> Nieuwe lead maken
                  </Knop>
                </div>
                <Invoer label="Of zoek een bestaande lead" placeholder="Naam, email of telefoon"
                  value={koppelZoek} onChange={e => zetKoppelZoek(e.target.value)} />
                {!!leadTreffers?.length && (
                  <ul className="mt-2 max-h-40 overflow-auto rounded-control border border-inkt/10 bg-vlak">
                    {leadTreffers.slice(0, 8).map(l => (
                      <li key={l.id}>
                        <button type="button" disabled={koppel.isPending}
                          onClick={() => koppel.mutate({ id: detail.id, leadId: l.id })}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-bronze-500/10">
                          <span>{[l.voornaam, l.naam].filter(Boolean).join(' ')}</span>
                          <span className="text-xs text-inkt-faint">{leeg(l.gemeente)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 border-t border-inkt/10 pt-4">
              <Knop variant="secundair" disabled={zetStatus.isPending}
                onClick={() => zetStatus.mutate({
                  id: detail.id, status: detail.status === 'behandeld' ? 'nieuw' : 'behandeld'
                })}>
                <Check size={14} className="mr-1.5" />
                {detail.status === 'behandeld' ? 'Terug op nieuw zetten' : 'Markeer als behandeld'}
              </Knop>
              <Knop variant="ghost" className="ml-auto text-corten-600"
                onClick={() => { if (confirm('Deze inzending verwijderen?')) verwijder.mutate(detail.id) }}>
                <Trash2 size={14} className="mr-1.5" /> Verwijderen
              </Knop>
            </div>
          </div>
        )}
      </Modaal>
    </>
  )
}

function PublicatieLabel({ akkoord }: { akkoord: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-chip px-2 py-0.5 text-xs font-semibold ${
      akkoord ? 'bg-olive-500/15 text-olive-600' : 'bg-inkt/[.06] text-inkt-muted'}`}>
      {akkoord ? 'Mag online' : 'Enkel intern'}
    </span>
  )
}

function Gegeven({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-inkt-faint">{label}</p>
      <p className="text-inkt-body">{children}</p>
    </div>
  )
}
