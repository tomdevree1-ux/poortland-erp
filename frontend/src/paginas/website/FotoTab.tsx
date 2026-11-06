import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../../lib/api'
import { datum } from '../../lib/formaat'
import type { Media, Popup } from '../../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, TekstVak, VuilbakKnop } from '../../ui'

/* Opgesplitst uit Website.tsx (audit 2026-10-05). */


const productLabels: Record<string, string> = { poort: 'Poort', overkapping: 'Overkapping' }
const poortTypeLabels: Record<string, string> = { hout: 'Houten poort', metaal: 'Metalen poort', hout_metaal: 'Combinatie hout en metaal' }
const uitvoeringLabels: Record<string, string> = { draaipoort: 'Draaipoort', schuifpoort: 'Schuifpoort' }

export default function FotoTab() {
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
  const leegUpload = { bestand: null as File | null, titel: '', productSoort: '', poortType: '', poortUitvoering: '', poortStijl: '', modelNaam: '' }
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
        if (v.poortStijl.trim()) form.append('poortStijl', v.poortStijl.trim())
        if (v.modelNaam.trim()) form.append('modelNaam', v.modelNaam.trim())
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
    productSoort: string; poortType: string; poortUitvoering: string; poortStijl: string; modelNaam: string
    personenInBeeld: boolean; toestemmingBevestigd: boolean } | null>(null)
  function openBewerk(m: Media) {
    zetBewerkFoto(m)
    zetFotoVorm({
      titel: m.titel, altTekst: m.altTekst ?? '',
      productSoort: m.productSoort ?? '', poortType: m.poortType ?? '',
      poortUitvoering: m.poortUitvoering ?? '', poortStijl: m.poortStijl ?? '', modelNaam: m.modelNaam ?? '',
      personenInBeeld: m.personenInBeeld, toestemmingBevestigd: m.toestemmingBevestigd
    })
  }
  const bewaarFoto = useMutation({
    mutationFn: () => api.patch<Media>(`/website/media/${bewerkFoto!.id}`, {
      titel: fotoVorm!.titel, altTekst: fotoVorm!.altTekst,
      productSoort: fotoVorm!.productSoort || null,
      poortType: fotoVorm!.poortType, poortUitvoering: fotoVorm!.poortUitvoering,
      poortStijl: fotoVorm!.poortStijl, modelNaam: fotoVorm!.modelNaam,
      personenInBeeld: fotoVorm!.personenInBeeld, toestemmingBevestigd: fotoVorm!.toestemmingBevestigd
    }),
    onSuccess: () => { ververs(); zetBewerkFoto(null) },
    onError: f => zetFout((f as Error).message)
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-6">
        <p className="text-sm text-inkt-muted">Gepubliceerde poortfoto's verschijnen op de site via drie parameters: materiaal (poorttype), stijl (de tab, bv. Klassiek met sierpunten) en model (de naam, bv. Brenta). Zo landt de foto in de juiste tab op de juiste plaats. EXIF gegevens worden automatisch gestript.</p>
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
          {uploadVorm.productSoort === 'poort' && (
            <div className="grid grid-cols-2 gap-4">
              <Invoer label="Stijl" optioneel placeholder="De tab op de site, bv. Klassiek met sierpunten"
                value={uploadVorm.poortStijl} onChange={e => zetUploadVorm({ ...uploadVorm, poortStijl: e.target.value })} />
              <Invoer label="Model" optioneel placeholder="De naam, bv. Brenta"
                value={uploadVorm.modelNaam} onChange={e => zetUploadVorm({ ...uploadVorm, modelNaam: e.target.value })} />
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
            {fotoVorm.productSoort === 'poort' && (
              <div className="grid grid-cols-2 gap-4">
                <Invoer label="Stijl" optioneel placeholder="De tab op de site, bv. Klassiek met sierpunten"
                  value={fotoVorm.poortStijl} onChange={e => zetFotoVorm({ ...fotoVorm, poortStijl: e.target.value })} />
                <Invoer label="Model" optioneel placeholder="De naam, bv. Brenta"
                  value={fotoVorm.modelNaam} onChange={e => zetFotoVorm({ ...fotoVorm, modelNaam: e.target.value })} />
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
