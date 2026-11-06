import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { api } from '../../lib/api'
import { euro } from '../../lib/formaat'
import { Badge, Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, TekstVak, VuilbakKnop } from '../../ui'

/* Koopjes uit voorraad (overleg 2026-10-05). Jef zet er zelf een online met
   foto's, de kenmerken en een prijs inclusief btw. Verkocht blijft met een
   label op de site staan tot hij het koopje verbergt. */

type Foto = { id: string; bestandPadWeb?: string; bestandPadThumb?: string; altTekst?: string; volgnummer: number }
type Koopje = {
  id: string
  materiaal: string
  model?: string
  ral?: string
  breedteCm?: number
  hoogteCm?: number
  extraInfo?: string
  prijsInclBtw?: number
  status: 'concept' | 'zichtbaar' | 'verkocht' | 'verborgen'
  volgnummer: number
  verkochtOp?: string
  fotos: Foto[]
}
type Vorm = {
  materiaal: string; model: string; ral: string
  breedteCm: string; hoogteCm: string; extraInfo: string; prijsInclBtw: string
}

const leegVorm: Vorm = { materiaal: '', model: '', ral: '', breedteCm: '', hoogteCm: '', extraInfo: '', prijsInclBtw: '' }
const publiekeBasis = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/website_publiek/`
  : ''
const beeld = (pad?: string) => (pad ? publiekeBasis + pad : '')

export default function KoopjesTab() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [open, zetOpen] = useState<string | null>(null)
  const [vorm, zetVorm] = useState<Vorm>(leegVorm)
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const [verwijderId, zetVerwijderId] = useState<string | null>(null)
  const [nieuweFotos, zetNieuweFotos] = useState<File[]>([])
  const bestandRef = useRef<HTMLInputElement>(null)
  const nieuwBestandRef = useRef<HTMLInputElement>(null)

  /* Voorbeeldjes van de nog niet geüploade foto's. De url's worden terug
     vrijgegeven zodra de lijst wijzigt, anders lekt het geheugen vol. */
  const voorbeelden = useMemo(() => nieuweFotos.map(b => URL.createObjectURL(b)), [nieuweFotos])
  useEffect(() => () => voorbeelden.forEach(URL.revokeObjectURL), [voorbeelden])

  const { data: koopjes } = useQuery({ queryKey: ['koopjes'], queryFn: () => api.get<Koopje[]>('/koopjes') })
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['koopjes'] }) }
  const faal = (f: unknown) => zetFout(f instanceof Error ? f.message : 'Er ging iets mis.')
  const naarInvoer = (v: Vorm) => ({
    materiaal: v.materiaal.trim(),
    model: v.model.trim() || null,
    ral: v.ral.trim() || null,
    breedteCm: v.breedteCm ? Number(v.breedteCm) : null,
    hoogteCm: v.hoogteCm ? Number(v.hoogteCm) : null,
    extraInfo: v.extraInfo.trim() || null,
    prijsInclBtw: v.prijsInclBtw ? Number(v.prijsInclBtw.replace(',', '.')) : null
  })

  const stuurFoto = (id: string, bestand: File) => {
    const form = new FormData()
    form.append('bestand', bestand)
    return api.formulier(`/koopjes/${id}/fotos`, form)
  }
  /* Alles in één venster: gegevens, foto's en meteen online zetten. Het koopje
     bestaat nog niet wanneer de foto's gekozen worden, dus gaan ze er vlak na
     het aanmaken bij, één voor één zodat de volgorde klopt. */
  const maak = useMutation({
    mutationFn: async (online: boolean) => {
      const k = await api.post<Koopje>('/koopjes', naarInvoer(vorm))
      for (const bestand of nieuweFotos) await stuurFoto(k.id, bestand)
      if (online && nieuweFotos.length) await api.patch(`/koopjes/${k.id}/status`, { status: 'zichtbaar' })
      return k
    },
    onSuccess: () => {
      ververs(); zetNieuwOpen(false); zetVorm(leegVorm); zetNieuweFotos([])
    },
    onError: faal
  })
  const bewaar = useMutation({
    mutationFn: (id: string) => api.put<Koopje>(`/koopjes/${id}`, naarInvoer(vorm)),
    onSuccess: () => { ververs(); zetOpen(null) }, onError: faal
  })
  const zetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Koopje['status'] }) =>
      api.patch(`/koopjes/${id}/status`, { status }),
    onSuccess: ververs, onError: faal
  })
  const verplaats = useMutation({
    mutationFn: ({ id, richting }: { id: string; richting: number }) =>
      api.patch(`/koopjes/${id}/volgorde`, { richting }),
    onSuccess: ververs, onError: faal
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/koopjes/${id}`),
    onSuccess: () => { ververs(); zetVerwijderId(null); zetOpen(null) }, onError: faal
  })
  const uploadFoto = useMutation({
    mutationFn: async ({ id, bestanden }: { id: string; bestanden: File[] }) => {
      for (const bestand of bestanden) await stuurFoto(id, bestand)
    },
    onSuccess: ververs, onError: faal
  })
  const verwijderFoto = useMutation({
    mutationFn: ({ id, fotoId }: { id: string; fotoId: string }) => api.del(`/koopjes/${id}/fotos/${fotoId}`),
    onSuccess: ververs, onError: faal
  })

  const huidig = koopjes?.find(k => k.id === open)
  function startBewerken(k: Koopje) {
    zetVorm({
      materiaal: k.materiaal ?? '', model: k.model ?? '', ral: k.ral ?? '',
      breedteCm: k.breedteCm != null ? String(k.breedteCm) : '',
      hoogteCm: k.hoogteCm != null ? String(k.hoogteCm) : '',
      extraInfo: k.extraInfo ?? '',
      prijsInclBtw: k.prijsInclBtw != null ? String(k.prijsInclBtw) : ''
    })
    zetOpen(k.id)
  }

  const velden = (
    <div className="space-y-3">
      <Invoer label="Materiaal" placeholder="Staal, aluminium, massief hout…"
        value={vorm.materiaal} onChange={e => zetVorm({ ...vorm, materiaal: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <Invoer label="Model" optioneel value={vorm.model} onChange={e => zetVorm({ ...vorm, model: e.target.value })} />
        <Invoer label="RAL kleur" optioneel placeholder="7016" value={vorm.ral} onChange={e => zetVorm({ ...vorm, ral: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Invoer label="Breedte in cm" optioneel inputMode="numeric" value={vorm.breedteCm}
          onChange={e => zetVorm({ ...vorm, breedteCm: e.target.value.replace(/\D/g, '') })} />
        <Invoer label="Hoogte in cm" optioneel inputMode="numeric" value={vorm.hoogteCm}
          onChange={e => zetVorm({ ...vorm, hoogteCm: e.target.value.replace(/\D/g, '') })} />
      </div>
      <Invoer label="Prijs inclusief btw" optioneel inputMode="decimal" placeholder="1950"
        value={vorm.prijsInclBtw} onChange={e => zetVorm({ ...vorm, prijsInclBtw: e.target.value })} />
      <TekstVak label="Extra informatie" optioneel rows={4}
        placeholder="Bijvoorbeeld: nieuw, nooit geplaatst. Inclusief palen en beslag."
        value={vorm.extraInfo} onChange={e => zetVorm({ ...vorm, extraInfo: e.target.value })} />
    </div>
  )

  return (
    <>
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <div className="mb-4 flex items-center justify-between">
        <p className="max-w-[70ch] text-sm text-inkt-muted">
          Poorten en overkappingen uit voorraad. Een koopje komt op de website zodra het op{' '}
          <span className="font-medium text-inkt">zichtbaar</span> staat en er minstens een foto bij zit.
          Verkocht blijft met een label staan tot je het verbergt.
        </p>
        <PlusKnop label="Koopje toevoegen" onClick={() => { zetVorm(leegVorm); zetNieuwOpen(true) }} />
      </div>

      {!koopjes?.length ? (
        <Paneel titel="Koopjes"><p className="text-sm text-inkt-muted">Nog geen koopjes.</p></Paneel>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {koopjes.map((k, i) => (
            <Paneel key={k.id} titel={[k.materiaal, k.model].filter(Boolean).join(' · ')}
              actie={<>
                <button type="button" aria-label="Naar boven" className="focusring px-1 text-inkt-muted disabled:opacity-30"
                  disabled={i === 0} onClick={() => verplaats.mutate({ id: k.id, richting: -1 })}><ArrowUp size={15} /></button>
                <button type="button" aria-label="Naar onder" className="focusring px-1 text-inkt-muted disabled:opacity-30"
                  disabled={i === koopjes.length - 1} onClick={() => verplaats.mutate({ id: k.id, richting: 1 })}><ArrowDown size={15} /></button>
                <PotloodKnop onClick={() => startBewerken(k)} />
                <VuilbakKnop onClick={() => zetVerwijderId(k.id)} />
              </>}>
              <div className="mb-2 flex items-center gap-2">
                <Badge status={k.status} />
                <span className="text-xs text-inkt-faint">{k.fotos.length} foto{k.fotos.length === 1 ? '' : "'s"}</span>
              </div>
              {k.fotos.length > 0 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                  {k.fotos.map(f => (
                    <img key={f.id} src={beeld(f.bestandPadThumb ?? f.bestandPadWeb)} alt={f.altTekst ?? ''}
                      className="h-20 w-28 flex-none rounded-control border border-inkt/10 object-cover" />
                  ))}
                </div>
              )}
              <dl className="text-sm">
                {k.ral && <Regel label="RAL">{k.ral}</Regel>}
                {(k.breedteCm || k.hoogteCm) && <Regel label="Afmetingen">{k.breedteCm ?? '—'} × {k.hoogteCm ?? '—'} cm</Regel>}
                {k.prijsInclBtw != null && <Regel label="Prijs incl. btw">{euro(k.prijsInclBtw)}</Regel>}
              </dl>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-inkt/[.07] pt-3">
                {k.status !== 'zichtbaar' && (
                  <Knop variant="primair" className="h-8 px-3 text-xs" disabled={!k.fotos.length}
                    onClick={() => zetStatus.mutate({ id: k.id, status: 'zichtbaar' })}>
                    {k.status === 'verkocht' ? 'Terug te koop zetten' : 'Online zetten'}
                  </Knop>
                )}
                {k.status === 'zichtbaar' && (
                  <Knop variant="secundair" className="h-8 px-3 text-xs"
                    onClick={() => zetStatus.mutate({ id: k.id, status: 'verkocht' })}>Verkocht</Knop>
                )}
                {k.status !== 'verborgen' && k.status !== 'concept' && (
                  <Knop variant="ghost" className="h-8 px-3 text-xs"
                    onClick={() => zetStatus.mutate({ id: k.id, status: 'verborgen' })}>Van de site halen</Knop>
                )}
                {!k.fotos.length && k.status !== 'zichtbaar' && (
                  <span className="text-xs text-inkt-faint">Voeg eerst een foto toe.</span>
                )}
              </div>
            </Paneel>
          ))}
        </div>
      )}

      <Modaal open={nieuwOpen} titel="Nieuw koopje" onSluit={() => { zetNieuwOpen(false); zetNieuweFotos([]) }}>
        {velden}
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">
            Foto's{nieuweFotos.length > 0 && ` (${nieuweFotos.length})`}
          </p>
          {nieuweFotos.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {nieuweFotos.map((b, i) => (
                <figure key={b.name + i} className="group relative h-24 w-32 overflow-hidden rounded-control border border-inkt/10">
                  <img src={voorbeelden[i]} alt="" className="h-full w-full object-cover" />
                  <button type="button" aria-label={`Foto ${i + 1} weghalen`}
                    className="focusring absolute right-1 top-1 hidden rounded-chip bg-corten-600 px-1.5 text-xs text-stone2-50 group-hover:block"
                    onClick={() => zetNieuweFotos(nieuweFotos.filter((_, j) => j !== i))}>×</button>
                </figure>
              ))}
            </div>
          )}
          <input ref={nieuwBestandRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic" hidden
            onChange={e => {
              const gekozen = Array.from(e.target.files ?? [])
              if (gekozen.length) zetNieuweFotos([...nieuweFotos, ...gekozen])
              e.target.value = ''
            }} />
          <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => nieuwBestandRef.current?.click()}>
            Foto's kiezen
          </Knop>
          <p className="mt-1.5 text-xs text-inkt-faint">
            {nieuweFotos.length
              ? 'De eerste foto is het beeld op het overzicht.'
              : 'Zonder foto kan het koopje niet online, wel bewaard worden als concept.'}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-inkt/10 pt-4">
          <Knop variant="ghost" onClick={() => { zetNieuwOpen(false); zetNieuweFotos([]) }}>Annuleren</Knop>
          <Knop variant="secundair" disabled={maak.isPending || !vorm.materiaal.trim()}
            onClick={() => maak.mutate(false)}>Bewaren als concept</Knop>
          <Knop variant="primair" disabled={maak.isPending || !vorm.materiaal.trim() || !nieuweFotos.length}
            onClick={() => maak.mutate(true)}>
            {maak.isPending ? 'Bezig…' : 'Online zetten'}
          </Knop>
        </div>
      </Modaal>

      <Modaal open={!!huidig} titel="Koopje bewerken" onSluit={() => zetOpen(null)}>
        {huidig && (
          <>
            {velden}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">
                Foto's ({huidig.fotos.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {huidig.fotos.map(f => (
                  <figure key={f.id} className="group relative h-24 w-32 overflow-hidden rounded-control border border-inkt/10">
                    <img src={beeld(f.bestandPadThumb ?? f.bestandPadWeb)} alt={f.altTekst ?? ''} className="h-full w-full object-cover" />
                    <button type="button" aria-label="Foto verwijderen"
                      className="focusring absolute right-1 top-1 hidden rounded-chip bg-corten-600 px-1.5 text-xs text-stone2-50 group-hover:block"
                      onClick={() => verwijderFoto.mutate({ id: huidig.id, fotoId: f.id })}>×</button>
                  </figure>
                ))}
              </div>
              <input ref={bestandRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic" hidden
                onChange={e => {
                  const gekozen = Array.from(e.target.files ?? [])
                  if (gekozen.length) uploadFoto.mutate({ id: huidig.id, bestanden: gekozen })
                  e.target.value = ''
                }} />
              <Knop variant="secundair" className="mt-3 h-8 px-3 text-xs" disabled={uploadFoto.isPending}
                onClick={() => bestandRef.current?.click()}>
                {uploadFoto.isPending ? 'Bezig…' : "Foto's toevoegen"}
              </Knop>
              <p className="mt-1.5 text-xs text-inkt-faint">De eerste foto is het beeld op het overzicht.</p>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-inkt/10 pt-4">
              <Knop variant="ghost" onClick={() => zetOpen(null)}>Sluiten</Knop>
              <Knop variant="primair" disabled={bewaar.isPending} onClick={() => bewaar.mutate(huidig.id)}>Opslaan</Knop>
            </div>
          </>
        )}
      </Modaal>

      <Modaal open={!!verwijderId} titel="Koopje verwijderen?" onSluit={() => zetVerwijderId(null)}>
        <p className="text-sm text-inkt-body">Het koopje en de foto's verdwijnen van de website.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Knop variant="ghost" onClick={() => zetVerwijderId(null)}>Annuleren</Knop>
          <Knop variant="primair" onClick={() => verwijderId && verwijder.mutate(verwijderId)}>Verwijderen</Knop>
        </div>
      </Modaal>
    </>
  )
}

function Regel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-inkt/[.06] py-1 last:border-0">
      <dt className="text-inkt-muted">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}
