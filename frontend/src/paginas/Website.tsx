import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum } from '../lib/formaat'
import type { Media, Popup } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, TekstVak, VuilbakKnop } from '../ui'

/* TS-17 Websitebeheer volgens de platform UX regels: leesmodus eerst,
   bewerken via het potlood met Opslaan en Annuleren. */
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

const productLabels: Record<string, string> = { poort: 'Poort', overkapping: 'Overkapping' }
const poortTypeLabels: Record<string, string> = { hout: 'Houten poort', metaal: 'Metalen poort', hout_metaal: 'Combinatie hout en metaal' }
const uitvoeringLabels: Record<string, string> = { draaipoort: 'Draaipoort', schuifpoort: 'Schuifpoort' }

function FotoTab() {
  const qc = useQueryClient()
  const bestandRef = useRef<HTMLInputElement>(null)
  const [fout, zetFout] = useState<string>()
  const { data: media, error: laadFout } = useQuery({ queryKey: ['media'], queryFn: () => api.get<Media[]>('/website/media') })
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60_000
  })
  const isBeheerder = mij?.rollen.includes('beheerder') ?? false
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['media'] }) }

  const [uploadOpen, zetUploadOpen] = useState(false)
  const leegUpload = { bestand: null as File | null, titel: '', productSoort: '', poortType: '', poortUitvoering: '' }
  const [uploadVorm, zetUploadVorm] = useState(leegUpload)
  function openUpload() { zetUploadVorm(leegUpload); zetUploadOpen(true) }
  const upload = useMutation({
    mutationFn: async () => {
      const v = uploadVorm
      if (!v.bestand) throw new Error('Kies eerst een foto.')
      const form = new FormData()
      form.append('bestand', v.bestand)
      form.append('titel', v.titel || v.bestand.name.replace(/\.[^.]+$/, ''))
      form.append('productSoort', v.productSoort)
      if (v.productSoort === 'poort') {
        form.append('poortType', v.poortType)
        form.append('poortUitvoering', v.poortUitvoering)
      }
      return api.formulier<Media>('/website/media', form)
    },
    onSuccess: () => { ververs(); zetUploadOpen(false) },
    onError: f => zetFout((f as Error).message)
  })
  const publiceer = useMutation({
    mutationFn: (id: string) => api.post<Media>(`/website/media/${id}/publiceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const depubliceer = useMutation({
    mutationFn: (id: string) => api.post<Media>(`/website/media/${id}/depubliceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  const [verwijderFoto, zetVerwijderFoto] = useState<Media | null>(null)
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/website/media/${id}`),
    onSuccess: () => { ververs(); zetVerwijderFoto(null) },
    onError: f => { zetFout((f as Error).message); zetVerwijderFoto(null) }
  })

  const [bewerkFoto, zetBewerkFoto] = useState<Media | null>(null)
  const [fotoVorm, zetFotoVorm] = useState<{ titel: string; altTekst: string
    productSoort: string; poortType: string; poortUitvoering: string
    personenInBeeld: boolean; toestemmingBevestigd: boolean } | null>(null)
  function openBewerk(m: Media) {
    zetBewerkFoto(m)
    zetFotoVorm({
      titel: m.titel, altTekst: m.altTekst ?? '',
      productSoort: m.productSoort ?? '', poortType: m.poortType ?? '',
      poortUitvoering: m.poortUitvoering ?? '',
      personenInBeeld: m.personenInBeeld, toestemmingBevestigd: m.toestemmingBevestigd
    })
  }
  const bewaarFoto = useMutation({
    mutationFn: () => api.patch<Media>(`/website/media/${bewerkFoto!.id}`, {
      titel: fotoVorm!.titel, altTekst: fotoVorm!.altTekst,
      productSoort: fotoVorm!.productSoort || null,
      poortType: fotoVorm!.poortType, poortUitvoering: fotoVorm!.poortUitvoering,
      personenInBeeld: fotoVorm!.personenInBeeld, toestemmingBevestigd: fotoVorm!.toestemmingBevestigd
    }),
    onSuccess: () => { ververs(); zetBewerkFoto(null) },
    onError: f => zetFout((f as Error).message)
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-6">
        <p className="text-sm text-inkt-muted">Gepubliceerde foto's verschijnen op de site volgens hun indeling: productpagina's tonen enkel het eigen poorttype, realisaties tonen alles met filters en de banner mengt alles. EXIF gegevens worden automatisch gestript.</p>
        <Knop variant="primair" className="shrink-0 whitespace-nowrap" onClick={openUpload}>Foto uploaden</Knop>
      </div>
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      {laadFout && <div className="mb-4"><Melding soort="fout">De foto's konden niet geladen worden: {(laadFout as Error).message}</Melding></div>}
      <div className="grid grid-cols-3 gap-5">
        {media?.map(m => (
          <div key={m.id} className="overflow-hidden rounded-card border border-inkt/[.07] bg-vlak-surface">
            <div className="aspect-[4/3] bg-vlak-sunken">
              {m.voorbeeld
                ? <img src={m.voorbeeld} alt={m.altTekst ?? m.titel} className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-inkt-faint">geen voorbeeld</div>}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{m.titel}</span>
                <Badge status={m.status} />
              </div>
              <dl className="text-xs text-inkt-muted">
                <div className="flex justify-between py-0.5"><dt>Product</dt>
                  <dd>{m.productSoort ? (m.productSoort === 'poort'
                    ? [poortTypeLabels[m.poortType ?? ''] ?? 'Poort', uitvoeringLabels[m.poortUitvoering ?? '']].filter(Boolean).join(' · ')
                    : 'Overkapping') : '—'}</dd></div>
                <div className="flex justify-between py-0.5"><dt>Alt tekst</dt><dd className="max-w-40 truncate text-right">{m.altTekst || '—'}</dd></div>
                {m.personenInBeeld && <div className="flex justify-between py-0.5"><dt>Personen in beeld</dt>
                  <dd>{m.toestemmingBevestigd ? 'toestemming ok' : 'toestemming nodig'}</dd></div>}
              </dl>
              <div className="flex items-center justify-end gap-2">
                {isBeheerder && <VuilbakKnop onClick={() => zetVerwijderFoto(m)} label="Foto verwijderen" />}
                <PotloodKnop onClick={() => openBewerk(m)} />
                {m.status !== 'gepubliceerd'
                  ? <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => publiceer.mutate(m.id)}>Publiceren</Knop>
                  : <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => depubliceer.mutate(m.id)}>Depubliceren</Knop>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {media?.length === 0 && <p className="text-sm text-inkt-muted">Nog geen foto's.</p>}

      <Modaal open={!!verwijderFoto} titel="Foto verwijderen" onSluit={() => zetVerwijderFoto(null)}>
        {verwijderFoto && (verwijderFoto.status === 'gepubliceerd' ? (
          <div className="space-y-4">
            <p className="text-sm text-inkt-body">
              "{verwijderFoto.titel}" staat nu op de website. Depubliceer de foto eerst, daarna kan je ze verwijderen.
            </p>
            <div className="flex justify-end gap-2">
              <Knop variant="ghost" onClick={() => zetVerwijderFoto(null)}>Annuleren</Knop>
              <Knop variant="secundair" disabled={depubliceer.isPending}
                onClick={() => depubliceer.mutate(verwijderFoto.id, { onSuccess: () => zetVerwijderFoto(null) })}>
                {depubliceer.isPending ? 'Bezig…' : 'Depubliceren'}
              </Knop>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-inkt-body">
              Je verwijdert "{verwijderFoto.titel}" uit de fotomodule. De foto stond niet op de website en dit kan niet ongedaan gemaakt worden.
            </p>
            <div className="flex justify-end gap-2">
              <Knop variant="ghost" onClick={() => zetVerwijderFoto(null)}>Annuleren</Knop>
              <Knop variant="destructief" disabled={verwijder.isPending}
                onClick={() => verwijder.mutate(verwijderFoto.id)}>
                {verwijder.isPending ? 'Bezig…' : 'Verwijderen'}
              </Knop>
            </div>
          </div>
        ))}
      </Modaal>

      <Modaal open={uploadOpen} titel="Foto uploaden" onSluit={() => zetUploadOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); upload.mutate() }}>
          <input ref={bestandRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden
            onChange={e => {
              const bestand = e.target.files?.[0] ?? null
              zetUploadVorm(v => ({ ...v, bestand, titel: v.titel || (bestand ? bestand.name.replace(/\.[^.]+$/, '') : '') }))
            }} />
          <div className="flex items-center gap-3">
            <Knop type="button" variant="secundair" onClick={() => bestandRef.current?.click()}>Kies foto</Knop>
            <span className="truncate text-sm text-inkt-muted">{uploadVorm.bestand?.name ?? 'Nog geen foto gekozen'}</span>
          </div>
          <Invoer label="Titel" value={uploadVorm.titel} onChange={e => zetUploadVorm({ ...uploadVorm, titel: e.target.value })} required />
          <Selecteer label="Product" value={uploadVorm.productSoort}
            onChange={e => zetUploadVorm({ ...uploadVorm, productSoort: e.target.value, poortType: '', poortUitvoering: '' })}>
            <option value="">Maak een keuze</option>
            <option value="poort">Poort</option>
            <option value="overkapping">Overkapping</option>
          </Selecteer>
          {uploadVorm.productSoort === 'poort' && (
            <div className="grid grid-cols-2 gap-4">
              <Selecteer label="Poorttype" value={uploadVorm.poortType}
                onChange={e => zetUploadVorm({ ...uploadVorm, poortType: e.target.value })}>
                <option value="">Maak een keuze</option>
                <option value="hout">Houten poort</option>
                <option value="metaal">Metalen poort</option>
                <option value="hout_metaal">Combinatie hout en metaal</option>
              </Selecteer>
              <Selecteer label="Uitvoering" value={uploadVorm.poortUitvoering}
                onChange={e => zetUploadVorm({ ...uploadVorm, poortUitvoering: e.target.value })}>
                <option value="">Maak een keuze</option>
                <option value="draaipoort">Draaipoort</option>
                <option value="schuifpoort">Schuifpoort</option>
              </Selecteer>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetUploadOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={upload.isPending || !uploadVorm.bestand || !uploadVorm.productSoort
              || (uploadVorm.productSoort === 'poort' && (!uploadVorm.poortType || !uploadVorm.poortUitvoering))}>
              {upload.isPending ? 'Bezig met verwerken…' : 'Uploaden'}
            </Knop>
          </div>
        </form>
      </Modaal>

      <Modaal open={!!bewerkFoto} titel="Foto bewerken" onSluit={() => zetBewerkFoto(null)}>
        {fotoVorm && (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarFoto.mutate() }}>
            <Invoer label="Titel" value={fotoVorm.titel} onChange={e => zetFotoVorm({ ...fotoVorm, titel: e.target.value })} required />
            <Invoer label="Alt tekst" placeholder="Beschrijf de foto voor de bezoeker"
              value={fotoVorm.altTekst} onChange={e => zetFotoVorm({ ...fotoVorm, altTekst: e.target.value })} />
            <Selecteer label="Product" value={fotoVorm.productSoort}
              onChange={e => zetFotoVorm({ ...fotoVorm, productSoort: e.target.value, poortType: '', poortUitvoering: '' })}>
              <option value="">Maak een keuze</option>
              <option value="poort">Poort</option>
              <option value="overkapping">Overkapping</option>
            </Selecteer>
            {fotoVorm.productSoort === 'poort' && (
              <div className="grid grid-cols-2 gap-4">
                <Selecteer label="Poorttype" value={fotoVorm.poortType}
                  onChange={e => zetFotoVorm({ ...fotoVorm, poortType: e.target.value })}>
                  <option value="">Maak een keuze</option>
                  <option value="hout">Houten poort</option>
                  <option value="metaal">Metalen poort</option>
                  <option value="hout_metaal">Combinatie hout en metaal</option>
                </Selecteer>
                <Selecteer label="Uitvoering" value={fotoVorm.poortUitvoering}
                  onChange={e => zetFotoVorm({ ...fotoVorm, poortUitvoering: e.target.value })}>
                  <option value="">Maak een keuze</option>
                  <option value="draaipoort">Draaipoort</option>
                  <option value="schuifpoort">Schuifpoort</option>
                </Selecteer>
              </div>
            )}
            <Selectievak checked={fotoVorm.personenInBeeld} onChange={v => zetFotoVorm({ ...fotoVorm, personenInBeeld: v })}>
              Personen in beeld
            </Selectievak>
            {fotoVorm.personenInBeeld && (
              <Selectievak className="text-corten-600" checked={fotoVorm.toestemmingBevestigd}
                onChange={v => zetFotoVorm({ ...fotoVorm, toestemmingBevestigd: v })}>
                Toestemming van de personen bevestigd
              </Selectievak>
            )}
            <div className="flex justify-end gap-2">
              <Knop type="button" variant="ghost" onClick={() => zetBewerkFoto(null)}>Annuleren</Knop>
              <Knop variant="primair" disabled={bewaarFoto.isPending}>{bewaarFoto.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
            </div>
          </form>
        )}
      </Modaal>
    </>
  )
}

function PopupTab() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [bewerkModus, zetBewerkModus] = useState(false)
  const { data: popups } = useQuery({ queryKey: ['popup'], queryFn: () => api.get<Popup[]>('/website/popup') })
  const concept = popups?.find(p => p.status === 'concept')
  const actief = popups?.find(p => p.status === 'gepubliceerd')
  const [vorm, zetVorm] = useState<{ titel: string; bodyTekst: string; actiefVan: string; actiefTot: string } | null>(null)
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['popup'] }) }

  function startBewerken() {
    zetVorm({
      titel: concept?.titel ?? '', bodyTekst: concept?.bodyTekst ?? '',
      actiefVan: concept?.actiefVan ?? new Date().toISOString().slice(0, 10),
      actiefTot: concept?.actiefTot ?? new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)
    })
    zetBewerkModus(true)
  }
  const bewaar = useMutation({
    mutationFn: () => api.put<Popup>('/website/popup', vorm),
    onSuccess: () => { ververs(); zetBewerkModus(false) },
    onError: f => zetFout((f as Error).message)
  })
  const publiceer = useMutation({
    mutationFn: (id: string) => api.post<Popup>(`/website/popup/${id}/publiceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const depubliceer = useMutation({
    mutationFn: (id: string) => api.post<Popup>(`/website/popup/${id}/depubliceer`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  const voorbeeld = bewerkModus ? vorm : concept
  return (
    <div className="grid grid-cols-2 gap-6">
      <Paneel titel="Popup" actie={bewerkModus ? (
        <div className="flex gap-2">
          <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => zetBewerkModus(false)}>Annuleren</Knop>
          <Knop variant="primair" className="h-8 px-3 text-xs" disabled={bewaar.isPending}
            onClick={() => bewaar.mutate()}>Opslaan</Knop>
        </div>
      ) : concept
        ? <PotloodKnop onClick={startBewerken} />
        : <PlusKnop onClick={startBewerken} label="Popup opstellen" />}>
        {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
        {actief && (
          <div className="mb-4">
            <Melding soort="ok">
              Nu actief: "{actief.titel}" tot {datum(actief.actiefTot)}.
              <button className="focusring ml-2 font-semibold underline" onClick={() => depubliceer.mutate(actief.id)}>Intrekken</button>
            </Melding>
          </div>
        )}
        {bewerkModus && vorm ? (
          <div className="space-y-4">
            <Invoer label="Titel" maxLength={80} value={vorm.titel}
              onChange={e => zetVorm({ ...vorm, titel: e.target.value })} required />
            <TekstVak label="Bodytekst" maxLength={500} value={vorm.bodyTekst}
              onChange={e => zetVorm({ ...vorm, bodyTekst: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Actief van" type="date" value={vorm.actiefVan}
                onChange={e => zetVorm({ ...vorm, actiefVan: e.target.value })} required />
              <Invoer label="Actief tot" type="date" value={vorm.actiefTot}
                onChange={e => zetVorm({ ...vorm, actiefTot: e.target.value })} required />
            </div>
          </div>
        ) : concept ? (
          <>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Status</dt><dd><Badge status={concept.status} /></dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Titel</dt><dd className="font-medium">{concept.titel}</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-inkt-muted">Bodytekst</dt>
                <dd className="max-w-64 text-right">{concept.bodyTekst}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Periode</dt>
                <dd>{datum(concept.actiefVan)} tot {datum(concept.actiefTot)}</dd></div>
            </dl>
            <div className="mt-4 flex justify-end">
              <Knop variant="primair" onClick={() => publiceer.mutate(concept.id)}>Publiceren ↗</Knop>
            </div>
          </>
        ) : (
          <p className="text-sm text-inkt-muted">Nog geen popup. Klik op het plusteken om er een op te stellen.</p>
        )}
        <p className="mt-4 text-xs text-inkt-faint">
          Maximaal 1 actieve popup. Bezoekers zien hem hoogstens 1 keer per 7 dagen en hij is sluitbaar met Escape.
          Voor minder dringende boodschappen presteert een stille banner vaak beter dan een popup.
        </p>
      </Paneel>
      <Paneel titel="Voorbeeld op de website">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-card border border-inkt/10 bg-vlak-sunken p-6">
          <div className="absolute inset-x-0 top-0 flex h-8 items-center gap-1.5 bg-stone2-300 px-3">
            <span className="h-2 w-2 rounded-full bg-inkt/20" /><span className="h-2 w-2 rounded-full bg-inkt/20" /><span className="h-2 w-2 rounded-full bg-inkt/20" />
          </div>
          <div className="w-full max-w-xs rounded-card bg-stone2-50 p-5 shadow-2xl">
            <div className="text-2xs font-bold uppercase tracking-[0.26em] text-bronze-600">Poortland</div>
            <div className="mt-1 font-display text-xl font-medium text-inkt">{voorbeeld?.titel || 'Titel van de popup'}</div>
            <p className="mt-2 text-sm leading-relaxed text-inkt-muted">{voorbeeld?.bodyTekst || 'De bodytekst verschijnt hier zoals de bezoeker ze ziet.'}</p>
            <div className="mt-4 flex justify-end"><span className="rounded-control bg-bronze-500 px-3 py-1.5 text-xs font-semibold text-stone2-50">Sluiten</span></div>
          </div>
        </div>
      </Paneel>
    </div>
  )
}
