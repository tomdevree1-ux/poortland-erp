import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../../lib/api'
import { datum, leeg, weergaveNaam } from '../../lib/formaat'
import type { Onderdeel, OnderdeelStatus, ProductieData } from '../../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, Th, Td, VuilbakKnop, statusTekst } from '../../ui'

/* Opgesplitst uit DossierDetail.tsx (audit 2026-10-05): het productiedossier
   is een eigen scherm binnen het dossier en stond die pagina op 620 regels. */

/* TS-07: het digitale productiedossier. De volgende stap per onderdeel volgt de
   behandelingsketen en respecteert de van toepassing vlaggen; de databank
   bewaakt de overgang als tweede laag. */
function volgendeStap(o: Onderdeel): OnderdeelStatus | null {
  switch (o.status) {
    case 'besteld': return 'inProductie'
    case 'inProductie': return o.voorbehandelingVanToepassing ? 'voorbehandeling'
      : (o.lakwerkVanToepassing ? 'lakwerk' : 'klaarVoorMontage')
    case 'voorbehandeling': return o.lakwerkVanToepassing ? 'lakwerk' : 'klaarVoorMontage'
    case 'lakwerk': return 'klaarVoorMontage'
    case 'klaarVoorMontage': return 'gemonteerd'
    default: return null
  }
}

export default function ProductieTab({ projectId }: { projectId: string }) {
  const qc = useQueryClient()
  const [fout, zetFout] = useState<string>()
  const { data } = useQuery({
    queryKey: ['productie', projectId],
    queryFn: () => api.get<ProductieData>(`/projecten/${projectId}/productie`)
  })
  // Knoppen volgen de rechtenmatrix: productie bewerkt, montage zet enkel de
  // volgende stap in de keten en de rest leest mee.
  const { data: mij } = useQuery({
    queryKey: ['mij'],
    queryFn: () => api.get<{ medewerker: { naam: string; voornaam?: string }; rollen: string[] }>('/medewerkers/mij'),
    staleTime: 5 * 60 * 1000
  })
  const rollen = mij?.rollen ?? []
  const magBewerken = rollen.some(r => r === 'productie' || r === 'beheerder')
  const magStap = rollen.some(r => ['productie', 'montage', 'beheerder'].includes(r))
  const ververs = () => { zetFout(undefined); qc.invalidateQueries({ queryKey: ['productie', projectId] }) }
  const bijFout = (f: unknown) => zetFout((f as Error).message)

  const maakStuklijst = useMutation({
    mutationFn: () => api.post(`/projecten/${projectId}/stuklijst`, {}),
    onSuccess: ververs, onError: bijFout
  })
  const nieuweVersie = useMutation({
    mutationFn: () => api.post(`/stuklijsten/${data!.stuklijst!.id}/nieuwe-versie`, {}),
    onSuccess: ververs, onError: bijFout
  })
  const zetStatus = useMutation({
    mutationFn: (p: { id: string; status: OnderdeelStatus }) => api.post(`/onderdelen/${p.id}/status`, { status: p.status }),
    onSuccess: ververs, onError: bijFout
  })
  const verwijderOnderdeel = useMutation({
    mutationFn: (id: string) => api.del(`/onderdelen/${id}`),
    onSuccess: ververs, onError: bijFout
  })

  const leegOnderdeel = { productcode: '', omschrijving: '', afmetingen: '', materiaal: '',
    voorbehandelingVanToepassing: true, lakwerkVanToepassing: true,
    leverancierVoorbehandelingId: '', leverancierLakwerkId: '', lakwerkRal: '',
    etaVoorbehandeling: '', etaLakwerk: '' }
  const [onderdeelOpen, zetOnderdeelOpen] = useState(false)
  const [bewerkId, zetBewerkId] = useState<string | null>(null)
  const [vorm, zetVorm] = useState(leegOnderdeel)
  function openNieuw() { zetBewerkId(null); zetVorm(leegOnderdeel); zetOnderdeelOpen(true) }
  function openBewerk(o: Onderdeel) {
    zetBewerkId(o.id)
    zetVorm({
      productcode: o.productcode, omschrijving: o.omschrijving ?? '', afmetingen: o.afmetingen ?? '', materiaal: o.materiaal ?? '',
      voorbehandelingVanToepassing: o.voorbehandelingVanToepassing, lakwerkVanToepassing: o.lakwerkVanToepassing,
      leverancierVoorbehandelingId: o.leverancierVoorbehandelingId ?? '', leverancierLakwerkId: o.leverancierLakwerkId ?? '',
      lakwerkRal: o.lakwerkRal ?? '', etaVoorbehandeling: o.etaVoorbehandeling ?? '', etaLakwerk: o.etaLakwerk ?? ''
    })
    zetOnderdeelOpen(true)
  }
  const bewaarOnderdeel = useMutation({
    mutationFn: () => {
      const payload = {
        productcode: vorm.productcode, omschrijving: vorm.omschrijving || null,
        afmetingen: vorm.afmetingen || null, materiaal: vorm.materiaal || null,
        voorbehandelingVanToepassing: vorm.voorbehandelingVanToepassing, lakwerkVanToepassing: vorm.lakwerkVanToepassing,
        leverancierVoorbehandelingId: vorm.voorbehandelingVanToepassing ? (vorm.leverancierVoorbehandelingId || null) : null,
        leverancierLakwerkId: vorm.lakwerkVanToepassing ? (vorm.leverancierLakwerkId || null) : null,
        lakwerkRal: vorm.lakwerkVanToepassing ? (vorm.lakwerkRal || null) : null,
        etaVoorbehandeling: vorm.voorbehandelingVanToepassing ? (vorm.etaVoorbehandeling || null) : null,
        etaLakwerk: vorm.lakwerkVanToepassing ? (vorm.etaLakwerk || null) : null
      }
      return bewerkId ? api.patch(`/onderdelen/${bewerkId}`, payload)
        : api.post(`/stuklijsten/${data!.stuklijst!.id}/onderdelen`, payload)
    },
    onSuccess: () => { ververs(); zetOnderdeelOpen(false) },
    onError: bijFout
  })

  const bestandRef = useRef<HTMLInputElement>(null)
  const uploadTekening = useMutation({
    mutationFn: (b: File) => { const f = new FormData(); f.append('bestand', b); return api.formulier(`/projecten/${projectId}/tekeningen`, f) },
    onSuccess: ververs, onError: bijFout
  })
  const verwijderTekening = useMutation({
    mutationFn: (id: string) => api.del(`/tekeningen/${id}`),
    onSuccess: ververs, onError: bijFout
  })

  if (!data) return null
  const levNaam = (id?: string) => data.leveranciers.find(l => l.id === id)?.naam

  return (
    <div className="space-y-6">
      {fout && <Melding soort="fout">{fout}</Melding>}

      {!data.stuklijst ? (
        <Paneel titel="Stuklijst">
          <p className="mb-4 text-sm text-inkt-muted">
            Nog geen stuklijst voor dit dossier. Start de stuklijst en voeg de onderdelen toe;
            de behandelingsketen (voorbehandeling en lakwerk) volgt per onderdeel.
          </p>
          {magBewerken && (
            <Knop variant="primair" onClick={() => maakStuklijst.mutate()} disabled={maakStuklijst.isPending}>
              {maakStuklijst.isPending ? 'Bezig…' : 'Stuklijst starten'}
            </Knop>
          )}
        </Paneel>
      ) : (
        <Paneel titel={`Stuklijst versie ${data.stuklijst.versieStuklijst} · ${datum(data.stuklijst.datumOpmaak)}`}
          actie={
            <div className="flex items-center gap-3">
              <Badge status={data.productieStatus} />
              {magBewerken && (
                <>
                  <Knop variant="ghost" className="h-8 px-3 text-xs" onClick={() => nieuweVersie.mutate()} disabled={nieuweVersie.isPending}>
                    Nieuwe versie
                  </Knop>
                  <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={openNieuw}>Onderdeel toevoegen</Knop>
                </>
              )}
            </div>
          }>
          {data.onderdelen.length === 0 ? (
            <p className="text-sm text-inkt-muted">Nog geen onderdelen. Voeg het eerste onderdeel toe.</p>
          ) : (
            <table className="w-full border-separate border-spacing-0">
              <thead><tr>
                <Th>Productcode</Th><Th>Omschrijving</Th><Th>Afmetingen</Th><Th>Materiaal</Th>
                <Th>Behandelingen</Th><Th>Status</Th><Th>{''}</Th>
              </tr></thead>
              <tbody>
                {data.onderdelen.map(o => {
                  const volgende = volgendeStap(o)
                  return (
                    <tr key={o.id}>
                      <Td className="font-semibold">{o.productcode}</Td>
                      <Td>{leeg(o.omschrijving)}</Td>
                      <Td>{leeg(o.afmetingen)}</Td>
                      <Td>{leeg(o.materiaal)}</Td>
                      <Td>
                        <div className="space-y-1 text-xs">
                          <div className={o.voorbehandelingVanToepassing ? '' : 'text-inkt-faint line-through'}>
                            VB{o.voorbehandelingVanToepassing
                              ? ` · ${levNaam(o.leverancierVoorbehandelingId) ?? 'leverancier n.t.b.'}${o.etaVoorbehandeling ? ` · ${datum(o.etaVoorbehandeling)}` : ''}`
                              : ' n.v.t.'}
                          </div>
                          <div className={o.lakwerkVanToepassing ? '' : 'text-inkt-faint line-through'}>
                            LAK{o.lakwerkVanToepassing
                              ? ` · ${levNaam(o.leverancierLakwerkId) ?? 'leverancier n.t.b.'}${o.lakwerkRal ? ` · RAL ${o.lakwerkRal}` : ''}${o.etaLakwerk ? ` · ${datum(o.etaLakwerk)}` : ''}`
                              : ' n.v.t.'}
                          </div>
                        </div>
                      </Td>
                      <Td><Badge status={o.status} /></Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          {volgende && magStap && (
                            <Knop variant="secundair" className="h-7 whitespace-nowrap px-2.5 text-xs"
                              onClick={() => zetStatus.mutate({ id: o.id, status: volgende })} disabled={zetStatus.isPending}>
                              → {statusTekst[volgende]}
                            </Knop>
                          )}
                          {magBewerken && (
                            <>
                              <PotloodKnop onClick={() => openBewerk(o)} />
                              <VuilbakKnop onClick={() => verwijderOnderdeel.mutate(o.id)} />
                            </>
                          )}
                        </div>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {data.vorigeVersies.length > 0 && (
            <p className="mt-3 text-xs text-inkt-faint">
              Vorige versies: {data.vorigeVersies.map(v => `v${v.versieStuklijst} (${datum(v.datumOpmaak)})`).join(' · ')}
            </p>
          )}
        </Paneel>
      )}

      <Paneel titel="Tekeningen" actie={
        <>
          <input ref={bestandRef} type="file" accept="application/pdf" hidden
            onChange={e => { const b = e.target.files?.[0]; if (b) uploadTekening.mutate(b); e.target.value = '' }} />
          <Knop variant="secundair" className="h-8 px-3 text-xs" onClick={() => bestandRef.current?.click()}
            disabled={uploadTekening.isPending}>{uploadTekening.isPending ? 'Bezig…' : 'Tekening uploaden'}</Knop>
        </>}>
        {data.tekeningen.length === 0 ? (
          <p className="text-sm text-inkt-muted">Nog geen tekeningen. Upload de AutoCAD tekening als PDF; versie, datum en auteur worden vastgelegd.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {data.tekeningen.map(t => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-control border border-inkt/[.07] bg-vlak-surface px-3 py-2">
                <div>
                  <a href={t.url} target="_blank" rel="noreferrer" className="font-semibold text-bronze-600 hover:underline">
                    v{t.tekeningVersie} · {t.bestandsnaam}
                  </a>
                  <div className="text-xs text-inkt-muted">{datum(t.datum)}{t.auteur ? ` · ${t.auteur}` : ''}</div>
                </div>
                <VuilbakKnop onClick={() => verwijderTekening.mutate(t.id)} />
              </li>
            ))}
          </ul>
        )}
      </Paneel>

      <Modaal open={onderdeelOpen} titel={bewerkId ? 'Onderdeel bewerken' : 'Onderdeel toevoegen'} onSluit={() => zetOnderdeelOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); bewaarOnderdeel.mutate() }}>
          <div className="grid grid-cols-2 gap-4">
            <Invoer label="Productcode" value={vorm.productcode} onChange={e => zetVorm({ ...vorm, productcode: e.target.value })} required />
            <Invoer label="Materiaal" optioneel value={vorm.materiaal} onChange={e => zetVorm({ ...vorm, materiaal: e.target.value })} />
          </div>
          <Invoer label="Omschrijving" optioneel value={vorm.omschrijving} onChange={e => zetVorm({ ...vorm, omschrijving: e.target.value })} />
          <Invoer label="Afmetingen" optioneel placeholder="bv. 3500 x 1800 mm" value={vorm.afmetingen} onChange={e => zetVorm({ ...vorm, afmetingen: e.target.value })} />

          <div className="space-y-3 rounded-control bg-vlak-raised p-4">
            <Selectievak checked={vorm.voorbehandelingVanToepassing} onChange={v => zetVorm({ ...vorm, voorbehandelingVanToepassing: v })}>
              Voorbehandeling van toepassing
            </Selectievak>
            {vorm.voorbehandelingVanToepassing && (
              <div className="grid grid-cols-2 gap-4">
                <Selecteer label="Leverancier voorbehandeling" optioneel value={vorm.leverancierVoorbehandelingId}
                  onChange={e => zetVorm({ ...vorm, leverancierVoorbehandelingId: e.target.value })}>
                  <option value="">Nog te bepalen</option>
                  {data.leveranciers.filter(l => l.type !== 'lakwerk').map(l => <option key={l.id} value={l.id}>{l.naam}</option>)}
                </Selecteer>
                <Invoer label="Verwachte ETA" optioneel type="date" value={vorm.etaVoorbehandeling}
                  onChange={e => zetVorm({ ...vorm, etaVoorbehandeling: e.target.value })} />
              </div>
            )}
          </div>
          <div className="space-y-3 rounded-control bg-vlak-raised p-4">
            <Selectievak checked={vorm.lakwerkVanToepassing} onChange={v => zetVorm({ ...vorm, lakwerkVanToepassing: v })}>
              Lakwerk van toepassing
            </Selectievak>
            {vorm.lakwerkVanToepassing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Selecteer label="Leverancier lakwerk" optioneel value={vorm.leverancierLakwerkId}
                    onChange={e => zetVorm({ ...vorm, leverancierLakwerkId: e.target.value })}>
                    <option value="">Nog te bepalen</option>
                    {data.leveranciers.filter(l => l.type !== 'voorbehandeling').map(l => <option key={l.id} value={l.id}>{l.naam}</option>)}
                  </Selecteer>
                  <Invoer label="Verwachte ETA" optioneel type="date" value={vorm.etaLakwerk}
                    onChange={e => zetVorm({ ...vorm, etaLakwerk: e.target.value })} />
                </div>
                <Invoer label="RAL kleurcode" optioneel placeholder="bv. 7016" value={vorm.lakwerkRal}
                  onChange={e => zetVorm({ ...vorm, lakwerkRal: e.target.value })} />
              </>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetOnderdeelOpen(false)}>Annuleren</Knop>
            <Knop variant="primair" disabled={bewaarOnderdeel.isPending || !vorm.productcode.trim()}>
              {bewaarOnderdeel.isPending ? 'Bezig…' : 'Opslaan'}
            </Knop>
          </div>
        </form>
      </Modaal>
    </div>
  )
}
