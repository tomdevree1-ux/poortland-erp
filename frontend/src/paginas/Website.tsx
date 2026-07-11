import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import type { Media, Popup } from '../lib/types'
import { Badge, Invoer, Knop, LegeStaat, Melding, PaginaKop, Paneel, TekstVak } from '../ui'

/* TS-17 Websitebeheer: foto's en de popup. Het ERP schrijft, de website leest. */
export default function Website() {
  const [tab, zetTab] = useState<'fotos' | 'popup'>('fotos')
  return (
    <>
      <PaginaKop eyebrow="Websitebeheer · CR-01" titel="Website" />
      <div className="mb-5 flex gap-1 border-b border-inkt/10">
        {([['fotos', 'Foto’s'], ['popup', 'Popup']] as const).map(([sleutel, tekst]) => (
          <button key={sleutel} onClick={() => zetTab(sleutel)}
            className={clsx('focusring px-4 py-2 text-sm font-semibold',
              tab === sleutel ? 'border-b-2 border-bronze-500 text-inkt' : 'text-inkt-muted hover:text-inkt')}>
            {tekst}
          </button>
        ))}
      </div>
      {tab === 'fotos' ? <FotoTab /> : <PopupTab />}
    </>
  )
}

function FotoTab() {
  const qc = useQueryClient()
  const bestandRef = useRef<HTMLInputElement>(null)
  const [fout, zetFout] = useState<string>()
  const { data: media } = useQuery({ queryKey: ['media'], queryFn: () => api.get<Media[]>('/website/media') })
  const ververs = () => qc.invalidateQueries({ queryKey: ['media'] })

  const upload = useMutation({
    mutationFn: async (bestand: File) => {
      const form = new FormData()
      form.append('bestand', bestand)
      form.append('titel', bestand.name.replace(/\.[^.]+$/, ''))
      return api.formulier<Media>('/website/media', form)
    },
    onSuccess: () => { zetFout(undefined); ververs() },
    onError: f => zetFout((f as Error).message)
  })
  const wijzig = useMutation({
    mutationFn: ({ id, ...deel }: { id: string } & Partial<Media>) => api.patch<Media>(`/website/media/${id}`, deel),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const publiceer = useMutation({
    mutationFn: (id: string) => api.post<Media>(`/website/media/${id}/publiceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const depubliceer = useMutation({
    mutationFn: (id: string) => api.post<Media>(`/website/media/${id}/depubliceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-inkt-muted">Gepubliceerde foto's verschijnen in de galerij van de site. EXIF gegevens worden automatisch gestript.</p>
        <input ref={bestandRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden
          onChange={e => e.target.files?.[0] && upload.mutate(e.target.files[0])} />
        <Knop variant="primair" onClick={() => bestandRef.current?.click()} disabled={upload.isPending}>
          {upload.isPending ? 'Bezig met verwerken…' : 'Foto uploaden ↗'}
        </Knop>
      </div>
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      {media && media.length === 0 ? (
        <LegeStaat titel="Nog geen foto's" tekst="Upload de eerste realisatie voor de website."
          actie={<Knop variant="primair" onClick={() => bestandRef.current?.click()}>Foto uploaden ↗</Knop>} />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {media?.map(m => (
            <div key={m.id} className="overflow-hidden rounded-card border border-inkt/[.07] bg-vlak-surface">
              <div className="aspect-[4/3] bg-forest-800">
                <img src={m.voorbeeld} alt={m.altTekst ?? m.titel} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">{m.titel}</span>
                  <Badge status={m.status} />
                </div>
                <Invoer label="Alt tekst" placeholder="Beschrijf de foto voor de bezoeker"
                  defaultValue={m.altTekst ?? ''} onBlur={e => e.target.value !== (m.altTekst ?? '') && wijzig.mutate({ id: m.id, altTekst: e.target.value })} />
                <label className="flex items-center gap-2 text-xs text-inkt-muted">
                  <input type="checkbox" checked={m.personenInBeeld}
                    onChange={e => wijzig.mutate({ id: m.id, personenInBeeld: e.target.checked })} />
                  Personen in beeld
                </label>
                {m.personenInBeeld && (
                  <label className="flex items-center gap-2 text-xs text-corten-600">
                    <input type="checkbox" checked={m.toestemmingBevestigd}
                      onChange={e => wijzig.mutate({ id: m.id, toestemmingBevestigd: e.target.checked })} />
                    Toestemming van de personen bevestigd
                  </label>
                )}
                <div className="flex justify-end gap-2">
                  {m.status !== 'gepubliceerd'
                    ? <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => publiceer.mutate(m.id)}>Publiceren</Knop>
                    : <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => depubliceer.mutate(m.id)}>Depubliceren</Knop>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function PopupTab() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const { data: popups } = useQuery({ queryKey: ['popup'], queryFn: () => api.get<Popup[]>('/website/popup') })
  const concept = popups?.find(p => p.status === 'concept')
  const actief = popups?.find(p => p.status === 'gepubliceerd')
  const [vorm, zetVorm] = useState<{ titel: string; bodyTekst: string; actiefVan: string; actiefTot: string } | null>(null)
  const huidig = vorm ?? {
    titel: concept?.titel ?? '', bodyTekst: concept?.bodyTekst ?? '',
    actiefVan: concept?.actiefVan ?? new Date().toISOString().slice(0, 10),
    actiefTot: concept?.actiefTot ?? new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)
  }
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['popup'] }) }
  const bewaar = useMutation({
    mutationFn: () => api.put<Popup>('/website/popup', huidig),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const publiceer = useMutation({
    mutationFn: (id: string) => api.post<Popup>(`/website/popup/${id}/publiceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const depubliceer = useMutation({
    mutationFn: (id: string) => api.post<Popup>(`/website/popup/${id}/depubliceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  return (
    <div className="grid grid-cols-2 gap-6">
      <Paneel titel="Popup instellen">
        {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
        {actief && (
          <div className="mb-4">
            <Melding soort="ok">
              Nu actief: "{actief.titel}" tot {actief.actiefTot}.
              <button className="focusring ml-2 font-semibold underline" onClick={() => depubliceer.mutate(actief.id)}>Intrekken</button>
            </Melding>
          </div>
        )}
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaar.mutate() }}>
          <Invoer label="Titel" maxLength={80} value={huidig.titel}
            onChange={e => zetVorm({ ...huidig, titel: e.target.value })} required />
          <TekstVak label="Bodytekst" maxLength={500} value={huidig.bodyTekst}
            onChange={e => zetVorm({ ...huidig, bodyTekst: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Actief van" type="date" value={huidig.actiefVan}
              onChange={e => zetVorm({ ...huidig, actiefVan: e.target.value })} required />
            <Invoer label="Actief tot" type="date" value={huidig.actiefTot}
              onChange={e => zetVorm({ ...huidig, actiefTot: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-2">
            <Knop variant="secundair" disabled={bewaar.isPending}>Bewaren als concept</Knop>
            {concept && <Knop type="button" variant="primair" onClick={() => publiceer.mutate(concept.id)}>Publiceren ↗</Knop>}
          </div>
          <p className="text-xs text-inkt-faint">
            Maximaal 1 actieve popup. Bezoekers zien hem hoogstens 1 keer per 7 dagen en hij is sluitbaar met Escape.
            Voor minder dringende boodschappen presteert een stille banner vaak beter dan een popup.
          </p>
        </form>
      </Paneel>
      <Paneel titel="Voorbeeld op de website">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card bg-forest-950 p-6">
          <div className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 bg-forest-900 px-3">
            <span className="h-2 w-2 rounded-full bg-stone2-500/40" /><span className="h-2 w-2 rounded-full bg-stone2-500/40" /><span className="h-2 w-2 rounded-full bg-stone2-500/40" />
          </div>
          <div className="w-full max-w-xs rounded-card bg-stone2-50 p-5 shadow-2xl">
            <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">Poortland</div>
            <div className="mt-1 font-display text-xl font-medium text-inkt">{huidig.titel || 'Titel van de popup'}</div>
            <p className="mt-2 text-sm leading-relaxed text-inkt-muted">{huidig.bodyTekst || 'De bodytekst verschijnt hier zoals de bezoeker ze ziet.'}</p>
            <div className="mt-4 flex justify-end"><span className="rounded-control bg-bronze-500 px-3 py-1.5 text-xs font-semibold text-stone2-50">Sluiten</span></div>
          </div>
        </div>
      </Paneel>
    </div>
  )
}
