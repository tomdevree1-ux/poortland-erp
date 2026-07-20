import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { datum, leeg, weergaveNaam } from '../lib/formaat'
import type { WerkbonRij } from '../lib/types'
import { Badge, Invoer, Knop, LegeStaat, Melding, Modaal, PaginaKop, Paneel, Selecteer, Selectievak } from '../ui'

/* TS-09: het veldscherm van de plaatser. De eigen werkbonnen met het
   invulscherm (werken, materialen, meerwerk), foto's voor en na en de
   klanthandtekening op het scherm (FR-009, FR-012 en FR-013). */

const soortTekst: Record<string, string> = {
  uitgevoerd_werk: 'Uitgevoerd werk', materiaal: 'Materiaal', meerwerk: 'Meerwerk'
}
export const werkbonTypeTekst: Record<string, string> = {
  plaatsing1: 'Plaatsing 1', plaatsing2: 'Plaatsing 2', interventie: 'Interventie'
}

/* Handtekeningvlak: tekenen met vinger, stylus of muis op een canvas. */
function HandtekeningVlak({ bijKlaar, bijAnnuleer, bezig }:
  { bijKlaar: (dataUrl: string) => void; bijAnnuleer: () => void; bezig: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [getekend, zetGetekend] = useState(false)
  const tekenen = useRef(false)

  function positie(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    tekenen.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = e.currentTarget.getContext('2d')!
    const { x, y } = positie(e)
    ctx.beginPath(); ctx.moveTo(x, y)
  }
  function beweeg(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!tekenen.current) return
    const ctx = e.currentTarget.getContext('2d')!
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#141C15'
    const { x, y } = positie(e)
    ctx.lineTo(x, y); ctx.stroke()
    zetGetekend(true)
  }
  function stop() { tekenen.current = false }
  function wis() {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    zetGetekend(false)
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-inkt-muted">Laat de klant hieronder tekenen voor akkoord met de uitgevoerde werken.</p>
      <canvas ref={canvasRef} width={520} height={200}
        onPointerDown={start} onPointerMove={beweeg} onPointerUp={stop} onPointerLeave={stop}
        className="w-full touch-none rounded-control border border-inkt/20 bg-white" />
      <div className="flex items-center justify-between gap-2">
        <Knop type="button" variant="ghost" onClick={wis}>Wissen</Knop>
        <div className="flex gap-2">
          <Knop type="button" variant="ghost" onClick={bijAnnuleer}>Annuleren</Knop>
          <Knop type="button" variant="primair" disabled={!getekend || bezig}
            onClick={() => bijKlaar(canvasRef.current!.toDataURL('image/png'))}>
            {bezig ? 'Bezig…' : 'Bevestig handtekening'}
          </Knop>
        </div>
      </div>
    </div>
  )
}

export default function Veld() {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const [openId, zetOpenId] = useState<string | null>(null)
  const { data: bonnen } = useQuery({ queryKey: ['werkbonnen-mijn'], queryFn: () => api.get<WerkbonRij[]>('/werkbonnen/mijn') })
  const bon = (bonnen ?? []).find(b => b.id === openId) ?? null
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['werkbonnen-mijn'] }) }
  const bijFout = (f: unknown) => zetFout((f as Error).message)
  const bewerkbaar = bon != null && (bon.status === 'open' || bon.status === 'uitgevoerd')

  const wijzig = useMutation({
    mutationFn: (deel: Record<string, unknown>) => api.patch(`/werkbonnen/${bon!.id}`, deel),
    onSuccess: ververs, onError: bijFout
  })
  const [regelVorm, zetRegelVorm] = useState({ soort: 'uitgevoerd_werk', omschrijving: '', aantal: '', eenheid: '', afwijking: false })
  const maakRegel = useMutation({
    mutationFn: () => api.post(`/werkbonnen/${bon!.id}/regels`, {
      soort: regelVorm.soort, omschrijving: regelVorm.omschrijving,
      aantal: regelVorm.aantal !== '' ? Number(regelVorm.aantal) : null,
      eenheid: regelVorm.eenheid || null,
      afwijkingVanStuklijst: regelVorm.afwijking
    }),
    onSuccess: () => { ververs(); zetRegelVorm({ soort: 'uitgevoerd_werk', omschrijving: '', aantal: '', eenheid: '', afwijking: false }) },
    onError: bijFout
  })
  const verwijderRegel = useMutation({
    mutationFn: (id: string) => api.del(`/werkbonregels/${id}`),
    onSuccess: ververs, onError: bijFout
  })
  const fotoRef = useRef<HTMLInputElement>(null)
  const [fotoMoment, zetFotoMoment] = useState<'voor' | 'na'>('voor')
  const uploadFoto = useMutation({
    mutationFn: async (bestand: File) => {
      const form = new FormData()
      form.append('bestand', bestand)
      form.append('moment', fotoMoment)
      // FR-009: gps meesturen wanneer de tablet het toelaat.
      const gps = await new Promise<GeolocationPosition | null>(resolve => {
        if (!navigator.geolocation) return resolve(null)
        navigator.geolocation.getCurrentPosition(p => resolve(p), () => resolve(null), { timeout: 3000 })
      })
      if (gps) {
        form.append('gpsLat', String(gps.coords.latitude.toFixed(6)))
        form.append('gpsLon', String(gps.coords.longitude.toFixed(6)))
      }
      return api.formulier(`/werkbonnen/${bon!.id}/fotos`, form)
    },
    onSuccess: ververs, onError: bijFout
  })
  const afronden = useMutation({
    mutationFn: () => api.post(`/werkbonnen/${bon!.id}/afronden`, {}),
    onSuccess: ververs, onError: bijFout
  })
  const [tekenOpen, zetTekenOpen] = useState(false)
  const tekenen = useMutation({
    mutationFn: (dataUrl: string) => api.post(`/werkbonnen/${bon!.id}/tekenen`, { handtekeningPng: dataUrl }),
    onSuccess: () => { ververs(); zetTekenOpen(false) },
    onError: bijFout
  })

  const [urenVorm, zetUrenVorm] = useState({ begin: '', einde: '', opmerkingen: '' })
  function openBon(b: WerkbonRij) {
    zetOpenId(b.id)
    zetUrenVorm({ begin: b.urenBegin ?? '', einde: b.urenEinde ?? '', opmerkingen: b.opmerkingen ?? '' })
    zetFout(undefined)
  }

  return (
    <>
      <PaginaKop eyebrow="Veld · werkbonnen" titel="Veld" />
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      {!bon ? (
        (bonnen ?? []).length === 0 ? (
          <LegeStaat titel="Geen open werkbonnen"
            tekst="De planner maakt werkbonnen aan vanuit het dossier; jouw bonnen verschijnen hier." />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {bonnen!.map(b => (
              <button key={b.id} type="button" onClick={() => openBon(b)}
                className="focusring rounded-card border border-inkt/10 bg-vlak-surface p-4 text-left transition hover:border-bronze-500">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{b.project?.nummer ? `${b.project.nummer} · ` : ''}{weergaveNaam(b.project?.klant)}</span>
                  <Badge status={b.status} />
                </div>
                <div className="mt-1 text-sm text-inkt-muted">
                  {werkbonTypeTekst[b.type] ?? b.type} · {b.project?.werfadres} · {datum(b.uitvoeringsdatum)}
                </div>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Knop variant="ghost" onClick={() => zetOpenId(null)}>← Alle werkbonnen</Knop>
            <div className="flex items-center gap-3">
              <Badge status={bon.status} />
              {bon.status === 'open' && (
                <Knop variant="secundair" onClick={() => afronden.mutate()} disabled={afronden.isPending}>Werken afronden</Knop>
              )}
              {bon.status === 'uitgevoerd' && (
                <Knop variant="primair" onClick={() => zetTekenOpen(true)}>Klant laat tekenen ↗</Knop>
              )}
            </div>
          </div>

          <Paneel titel={`${bon.project?.nummer ? `Dossier ${bon.project.nummer} · ` : ''}${weergaveNaam(bon.project?.klant)} · ${werkbonTypeTekst[bon.type] ?? bon.type}`}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-inkt-muted">Werfadres</dt><dd className="font-semibold">{bon.project?.werfadres}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Datum</dt><dd>{datum(bon.uitvoeringsdatum)}</dd></div>
              <div className="flex justify-between"><dt className="text-inkt-muted">Plaatser</dt><dd>{bon.plaatser}</dd></div>
              {bon.getekendOp && <div className="flex justify-between"><dt className="text-inkt-muted">Getekend</dt><dd>{datum(bon.getekendOp)}</dd></div>}
            </dl>
            {bewerkbaar && (
              <form className="mt-4 grid grid-cols-3 items-end gap-4 border-t border-inkt/[.06] pt-4"
                onSubmit={e => { e.preventDefault(); wijzig.mutate({ urenBegin: urenVorm.begin || null, urenEinde: urenVorm.einde || null, opmerkingen: urenVorm.opmerkingen }) }}>
                <Invoer label="Uren begin" optioneel type="time" value={urenVorm.begin} onChange={e => zetUrenVorm({ ...urenVorm, begin: e.target.value })} />
                <Invoer label="Uren einde" optioneel type="time" value={urenVorm.einde} onChange={e => zetUrenVorm({ ...urenVorm, einde: e.target.value })} />
                <Knop variant="secundair" disabled={wijzig.isPending}>{wijzig.isPending ? 'Bezig…' : 'Uren bewaren'}</Knop>
                <Invoer label="Opmerkingen" optioneel className="col-span-3" value={urenVorm.opmerkingen}
                  onChange={e => zetUrenVorm({ ...urenVorm, opmerkingen: e.target.value })} />
              </form>
            )}
            {!bewerkbaar && bon.opmerkingen && <p className="mt-3 text-sm text-inkt-body">{bon.opmerkingen}</p>}
          </Paneel>

          <Paneel titel="Werken, materialen en meerwerk">
            {bon.regels.length === 0 ? (
              <p className="text-sm text-inkt-muted">Nog geen regels. Registreer hieronder de uitgevoerde werken.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {bon.regels.map(r => (
                  <li key={r.id} className="flex items-center justify-between gap-3 rounded-control border border-inkt/[.07] bg-vlak-surface px-3 py-1.5">
                    <span>
                      <span className="mr-2 rounded-chip bg-bronze-500/15 px-1.5 py-0.5 text-xs font-semibold text-bronze-600">{soortTekst[r.soort]}</span>
                      {r.omschrijving}
                      {r.aantal != null && <span className="text-inkt-muted"> · {r.aantal} {leeg(r.eenheid)}</span>}
                      {r.afwijkingVanStuklijst && <span className="ml-2 text-xs font-semibold text-corten-600">afwijking van stuklijst</span>}
                    </span>
                    {bewerkbaar && (
                      <button type="button" className="focusring text-corten-600" aria-label="Verwijderen"
                        onClick={() => verwijderRegel.mutate(r.id)}>×</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {bewerkbaar && (
              <form className="mt-4 space-y-3 border-t border-inkt/[.06] pt-4"
                onSubmit={e => { e.preventDefault(); maakRegel.mutate() }}>
                <div className="grid grid-cols-4 gap-3">
                  <Selecteer label="Soort" value={regelVorm.soort} onChange={e => zetRegelVorm({ ...regelVorm, soort: e.target.value })}>
                    <option value="uitgevoerd_werk">Uitgevoerd werk</option>
                    <option value="materiaal">Materiaal</option>
                    <option value="meerwerk">Meerwerk</option>
                  </Selecteer>
                  <Invoer label="Omschrijving" className="col-span-3" value={regelVorm.omschrijving}
                    onChange={e => zetRegelVorm({ ...regelVorm, omschrijving: e.target.value })} required />
                </div>
                <div className="flex items-end gap-3">
                  <Invoer label="Aantal" optioneel type="number" step="0.01" className="w-28" value={regelVorm.aantal}
                    onChange={e => zetRegelVorm({ ...regelVorm, aantal: e.target.value })} />
                  <Invoer label="Eenheid" optioneel placeholder="stuk, m, u…" className="w-32" value={regelVorm.eenheid}
                    onChange={e => zetRegelVorm({ ...regelVorm, eenheid: e.target.value })} />
                  {regelVorm.soort === 'materiaal' && (
                    <Selectievak checked={regelVorm.afwijking} onChange={v => zetRegelVorm({ ...regelVorm, afwijking: v })}>
                      Afwijking van de stuklijst
                    </Selectievak>
                  )}
                  <Knop variant="secundair" className="ml-auto" disabled={maakRegel.isPending || !regelVorm.omschrijving.trim()}>
                    Toevoegen
                  </Knop>
                </div>
              </form>
            )}
          </Paneel>

          <Paneel titel="Foto's voor en na" actie={bewerkbaar && (
            <div className="flex items-center gap-2">
              <Selecteer value={fotoMoment} onChange={e => zetFotoMoment(e.target.value as 'voor' | 'na')} className="w-28">
                <option value="voor">Voor</option>
                <option value="na">Na</option>
              </Selecteer>
              <input ref={fotoRef} type="file" accept="image/*" capture="environment" hidden
                onChange={e => { const b = e.target.files?.[0]; if (b) uploadFoto.mutate(b); e.target.value = '' }} />
              <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => fotoRef.current?.click()}
                disabled={uploadFoto.isPending}>{uploadFoto.isPending ? 'Bezig…' : 'Foto toevoegen'}</Knop>
            </div>)}>
            {bon.fotos.length === 0 ? (
              <p className="text-sm text-inkt-muted">Nog geen foto's. Leg de situatie voor en na de werken vast.</p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {bon.fotos.map(f => (
                  <figure key={f.id} className="overflow-hidden rounded-control border border-inkt/10 bg-vlak-sunken">
                    <a href={f.url} target="_blank" rel="noreferrer">
                      <img src={f.url} alt={f.bestandsnaam} className="aspect-[4/3] w-full object-cover" />
                    </a>
                    <figcaption className="px-2 py-1 text-xs text-inkt-muted">
                      {f.moment === 'voor' ? 'Voor' : 'Na'} · {datum(f.aangemaaktOp)}{f.gpsLat ? ' · gps' : ''}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </Paneel>

          {bon.handtekeningUrl && (
            <Paneel titel="Klanthandtekening">
              <img src={bon.handtekeningUrl} alt="Handtekening van de klant" className="h-28 rounded-control border border-inkt/10 bg-white" />
            </Paneel>
          )}
        </div>
      )}

      <Modaal open={tekenOpen} titel="Akkoord van de klant" onSluit={() => zetTekenOpen(false)}>
        <HandtekeningVlak bezig={tekenen.isPending}
          bijKlaar={dataUrl => tekenen.mutate(dataUrl)}
          bijAnnuleer={() => zetTekenOpen(false)} />
      </Modaal>
    </>
  )
}
