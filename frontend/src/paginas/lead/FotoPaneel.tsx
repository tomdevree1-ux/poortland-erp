import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { datum } from '../../lib/formaat'
import type { Lead } from '../../lib/types'
import { Badge, Knop, Paneel } from '../../ui'

/* Foto's bij een lead: uploaden, de uploadlink aanvragen of intrekken, en de
   fotostatus tonen. Opgesplitst uit LeadDetail.tsx (audit 2026-10-05), waar
   deze logica de pagina op 583 regels bracht. */
export default function FotoPaneel({ leadId, lead, bewerkbaar, onVervers, onFout }: {
  leadId: string
  lead: Lead
  bewerkbaar: boolean
  onVervers: () => void
  onFout: (boodschap: string) => void
}) {
  const ververs = onVervers
  const zetFout = onFout
  const bestandRef = useRef<HTMLInputElement>(null)
  const uploadFoto = useMutation({
    mutationFn: (bestand: File) => {
      const form = new FormData()
      form.append('bestand', bestand)
      return api.formulier(`/leads/${leadId}/fotos`, form)
    },
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const verwijderFoto = useMutation({
    mutationFn: (fotoId: string) => api.del(`/leads/${leadId}/fotos/${fotoId}`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })

  // Foto-opvraag via unieke uploadlink (feedback 2026-08-06). De link leeft op de
  // publieke website (www) en bevat enkel de token, geen persoonsgegevens.
  const uploadUrl = (token: string) => {
    const h = location.host
    const basis = h.startsWith('localhost') || h.startsWith('www.') ? location.origin : `${location.protocol}//www.${h}`
    return `${basis}/upload/${token}`
  }
  const vraagFotos = useMutation({
    mutationFn: () => api.post<{ token: string; geldigTot: string; url?: string }>(`/leads/${leadId}/uploadlink`),
    onSuccess: r => {
      ververs()
      const link = r.url || uploadUrl(r.token)
      const onderwerp = "Foto's voor uw poortaanvraag"
      const tekst = `Beste klant,

Bedankt voor uw aanvraag.

Om uw dossier zo goed mogelijk te kunnen voorbereiden, ontvangen wij graag enkele foto's van de huidige situatie en van de plaats waar u de poort wenst te laten plaatsen.

Gelieve indien mogelijk meerdere duidelijke foto's te maken vanuit verschillende hoeken. Zorg ervoor dat zowel de volledige doorgang als de directe omgeving goed zichtbaar zijn. Hoe meer informatie we vooraf hebben, hoe beter we uw aanvraag kunnen voorbereiden.

Via onderstaande persoonlijke link kunt u eenvoudig uw foto's uploaden:

${link}

Wanneer u deze link opent op een smartphone, kunt u ervoor kiezen om bestaande foto's te uploaden of onmiddellijk nieuwe foto's te nemen met uw camera. Wanneer u de link opent op een laptop of computer, kunt u eenvoudig bestaande foto's selecteren en uploaden.

Alvast hartelijk bedankt voor uw medewerking.

Met vriendelijke groeten,
Team Poortland`
      location.href = `mailto:${encodeURIComponent(lead?.email ?? '')}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(tekst)}`
    },
    onError: f => zetFout((f as Error).message)
  })
  const trekLinkIn = useMutation({
    mutationFn: () => api.del(`/leads/${leadId}/uploadlink`),
    onSuccess: ververs, onError: f => zetFout((f as Error).message)
  })
  const [linkGekopieerd, zetLinkGekopieerd] = useState(false)
  function kopieerLink() {
    if (!lead?.uploadToken) return
    navigator.clipboard.writeText(lead.uploadUrl || uploadUrl(lead.uploadToken))
    zetLinkGekopieerd(true)
    setTimeout(() => zetLinkGekopieerd(false), 2500)
  }

  return (
        <Paneel titel="Foto's van de plek" actie={bewerkbaar && (
          <>
            <input ref={bestandRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" hidden
              onChange={e => e.target.files?.[0] && uploadFoto.mutate(e.target.files[0])} />
            <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => bestandRef.current?.click()}
              disabled={uploadFoto.isPending}>{uploadFoto.isPending ? 'Bezig…' : 'Foto toevoegen'}</Knop>
            <Knop variant="primair" className="h-8 px-3 text-xs" onClick={() => vraagFotos.mutate()}
              disabled={vraagFotos.isPending}>{vraagFotos.isPending ? 'Bezig…' : "Vraag foto's aan ✉"}</Knop>
          </>)}>
          {!lead.fotos?.length ? (
            <p className="text-sm text-inkt-muted">Nog geen foto's. Vanaf het webformulier komen ze hier automatisch binnen.</p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {lead.fotos.map(f => (
                <figure key={f.id} className="group relative h-32 w-44 flex-none overflow-hidden rounded-control border border-inkt/10 bg-vlak-sunken">
                  <a href={f.url} target="_blank" rel="noreferrer" className="block h-full w-full">
                    <img src={f.url} alt={f.bestandsnaam} className="h-full w-full object-cover" />
                  </a>
                  {bewerkbaar && (
                    <button className="focusring absolute right-1 top-1 hidden rounded-chip bg-corten-600 px-1.5 text-xs text-stone2-50 group-hover:block"
                      onClick={e => { e.stopPropagation(); verwijderFoto.mutate(f.id) }} aria-label="Foto verwijderen">×</button>
                  )}
                </figure>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-inkt/[.07] pt-3 text-xs">
            <Badge status={lead.fotoStatus ?? 'nogGeenFotos'} />
            {lead.tokenActief && (
              <>
                <span className="text-inkt-faint">· link geldig tot {lead.uploadTokenGeldigTot ? datum(lead.uploadTokenGeldigTot) : '—'}</span>
                <Knop variant="ghost" className="h-7 px-2 text-xs" onClick={kopieerLink}>
                  {linkGekopieerd ? 'Gekopieerd ✓' : 'Kopieer link'}
                </Knop>
                <Knop variant="ghost" className="h-7 px-2 text-xs text-corten-600" onClick={() => trekLinkIn.mutate()}
                  disabled={trekLinkIn.isPending}>Link intrekken</Knop>
              </>
            )}
          </div>
      </Paneel>
  )
}
