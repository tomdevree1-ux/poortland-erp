import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { api } from '../lib/api'
import ArtikelKiezer, { type ArtikelKeuze } from '../ArtikelKiezer'
import { datum, euro } from '../lib/formaat'
import type { Artikel, Offerte, Offerteregel } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PotloodKnop, Selecteer, TekstVak, Th, Td } from '../ui'

/* Offerte editor (TS-05 sectie 8): regels uit de catalogus of vrij, kortingen
   en automatisch berekende totalen. De backend rekent, dit scherm toont. */
export default function OfferteEditor() {
  const { offerteId } = useParams({ from: '/app/offertes/$offerteId' })
  const qc = useQueryClient()
  const { data: offerte } = useQuery({ queryKey: ['offerte', offerteId], queryFn: () => api.get<Offerte>(`/offertes/${offerteId}`) })
  const [regels, zetRegels] = useState<Offerteregel[]>([])
  const [kortingPct, zetKortingPct] = useState(0)
  const [kortingBedrag, zetKortingBedrag] = useState(0)
  const [fout, zetFout] = useState<string>()
  const [weigerOpen, zetWeigerOpen] = useState(false)
  const [reden, zetReden] = useState('')
  const [bewerkModus, zetBewerkModus] = useState(false)
  const [btwVerlegd, zetBtwVerlegd] = useState(false)
  const [model, zetModel] = useState('')
  const magBewerken = offerte?.status === 'nieuw'
  const bewerkbaar = magBewerken && bewerkModus

  useEffect(() => {
    if (offerte && !bewerkModus) {
      zetRegels(offerte.regels.map(r => ({ ...r })))
      zetKortingPct(offerte.kortingPercentage)
      zetKortingBedrag(offerte.kortingBedrag)
      zetBtwVerlegd(!!offerte.btwVerlegd)
      zetModel(offerte.model ?? '')
    }
  }, [offerte?.id, offerte?.status, offerte?.gewijzigdOp, bewerkModus])

  function annuleerBewerken() {
    if (offerte) {
      zetRegels(offerte.regels.map(r => ({ ...r })))
      zetKortingPct(offerte.kortingPercentage)
      zetKortingBedrag(offerte.kortingBedrag)
      zetBtwVerlegd(!!offerte.btwVerlegd)
      zetModel(offerte.model ?? '')
    }
    zetFout(undefined)
    zetBewerkModus(false)
  }

  // De catalogus telt 910 artikelen, dus zoeken in plaats van een keuzelijst.
  async function voegArtikelToe(keuze: ArtikelKeuze | null) {
    if (!keuze) return
    const artikel = await api.get<Artikel>(`/artikelen/${keuze.id}`)
    zetRegels([...regels, {
      soort: 'product', artikelId: artikel.id, omschrijving: artikel.naam || artikel.omschrijving,
      aantal: 1, eenheid: artikel.eenheid, eenheidsprijs: artikel.basisprijs,
      kortingBedrag: 0, btw: artikel.btwDefault
    }])
  }
  function voegVrijeRegelToe() {
    zetRegels([...regels, { soort: 'vrij', omschrijving: '', aantal: 1, eenheid: 'stuk', eenheidsprijs: 0, kortingBedrag: 0, btw: 'p21' }])
  }
  function wijzig(i: number, deel: Partial<Offerteregel>) {
    zetRegels(regels.map((r, x) => (x === i ? { ...r, ...deel } : r)))
  }

  const bewaar = useMutation({
    mutationFn: () => api.patch<Offerte>(`/offertes/${offerteId}`, {
      regels: regels.map(r => ({ soort: r.soort, artikelId: r.artikelId ?? null, omschrijving: r.omschrijving,
        detail: r.detail || null,
        aantal: Number(r.aantal), eenheid: r.eenheid, eenheidsprijs: Number(r.eenheidsprijs),
        kortingBedrag: Number(r.kortingBedrag), btw: r.btw })),
      kortingPercentage: Number(kortingPct), kortingBedrag: Number(kortingBedrag), geldigTot: null,
      btwVerlegd: btwVerlegd, model: model || null
    }),
    onSuccess: () => { zetFout(undefined); zetBewerkModus(false); qc.invalidateQueries({ queryKey: ['offerte', offerteId] }) },
    onError: f => zetFout((f as Error).message)
  })
  const actie = (pad: string, body?: unknown) => useMutation({
    mutationFn: () => api.post<unknown>(`/offertes/${offerteId}/${pad}`, body),
    onSuccess: () => { zetFout(undefined); zetWeigerOpen(false); qc.invalidateQueries({ queryKey: ['offerte', offerteId] }) },
    onError: (f: unknown) => zetFout((f as Error).message)
  })
  const verzenden = actie('verzenden')
  const akkoord = actie('akkoord')
  // Een prijsraming wordt na het plaatsbezoek een offerte (feedback 2026-09-13).
  const naarOfferte = useMutation({
    mutationFn: () => api.post<Offerte>(`/offertes/${offerteId}/naar-offerte`),
    onSuccess: () => qc.invalidateQueries(),
    onError: f => zetFout((f as Error).message)
  })
  const nieuweVersie = useMutation({
    mutationFn: () => api.post<Offerte>(`/offertes/${offerteId}/nieuwe-versie`),
    onSuccess: () => qc.invalidateQueries(),
    onError: f => zetFout((f as Error).message)
  })
  const weigeren = useMutation({
    mutationFn: () => api.post<Offerte>(`/offertes/${offerteId}/weigeren`, { reden }),
    onSuccess: () => { zetWeigerOpen(false); qc.invalidateQueries({ queryKey: ['offerte', offerteId] }) },
    onError: f => zetFout((f as Error).message)
  })

  if (!offerte) return null
  const isRaming = offerte.soort === 'prijsraming'
  return (
    <>
      <PaginaKop eyebrow={`${isRaming ? 'Prijsraming' : 'Offerte'} · versie ${offerte.versieOfferte}`} titel={offerte.nummer}
        actie={bewerkModus ? (
          <div className="flex gap-2">
            <Knop variant="ghost" onClick={annuleerBewerken}>Annuleren</Knop>
            <Knop variant="primair" onClick={() => bewaar.mutate()} disabled={bewaar.isPending}>
              {bewaar.isPending ? 'Bezig…' : 'Opslaan'}</Knop>
          </div>
        ) : (
          <div className="flex gap-2">
            <Knop variant="neutraal" onClick={() => api.download(`/offertes/${offerte.id}/pdf`)}>PDF</Knop>
            {magBewerken && <Knop variant="secundair" onClick={() => zetBewerkModus(true)}>Bewerken</Knop>}
            {magBewerken && offerte.regels.length > 0 &&
              <Knop variant="primair" onClick={() => verzenden.mutate()}>Verzenden ↗</Knop>}
            {offerte.status === 'verzonden' && <Knop variant="primair" onClick={() => akkoord.mutate()}>Akkoord klant ↗</Knop>}
            {offerte.status === 'verzonden' && <Knop variant="ghost" onClick={() => zetWeigerOpen(true)}>Weigeren</Knop>}
            {(offerte.status === 'verzonden' || offerte.status === 'goedgekeurd' || offerte.status === 'geweigerd' || offerte.status === 'verlopen') &&
              <Knop variant="neutraal" onClick={() => nieuweVersie.mutate()}>Nieuwe versie</Knop>}
            {isRaming && <Knop variant="secundair" onClick={() => naarOfferte.mutate()}
              disabled={naarOfferte.isPending}>Omzetten naar offerte ↗</Knop>}
          </div>
        )} />
      <div className="mb-4 flex items-center gap-4 text-sm text-inkt-muted">
        <Badge status={offerte.status} />
        <span>Geldig tot {datum(offerte.geldigTot)}</span>
        <Link to="/dossiers/$projectId" params={{ projectId: offerte.projectId }}
          className="font-semibold text-bronze-600 hover:text-bronze-500">Naar het dossier</Link>
      </div>
      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
      {!magBewerken && offerte.status !== 'goedgekeurd' && (
        <div className="mb-4"><Melding soort="info">
          Deze versie is {offerte.status}. Wijzigingen vragen een nieuwe versie (TS-05).
        </Melding></div>
      )}

      <Paneel titel="Regels" actie={bewerkbaar && (
        <div className="flex gap-2">
          <div className="w-72">
            <ArtikelKiezer waarde={null} label="" onKies={voegArtikelToe} />
          </div>
          <Knop variant="neutraal" type="button" onClick={voegVrijeRegelToe}>Vrije regel</Knop>
        </div>)}>
        {regels.length === 0 ? <p className="text-sm text-inkt-muted">Nog geen regels. Kies een artikel of voeg een vrije regel toe.</p> : (
          <table className="w-full border-separate border-spacing-0">
            <thead><tr><Th>Omschrijving</Th><Th rechts>Aantal</Th><Th>Eenheid</Th><Th rechts>Prijs</Th><Th rechts>Korting</Th><Th>Btw</Th><Th rechts>Totaal</Th><Th /></tr></thead>
            <tbody>
              {regels.map((r, i) => (
                <tr key={i}>
                  <Td>
                    <input disabled={!bewerkbaar} className="focusring w-full bg-transparent" value={r.omschrijving}
                      onChange={e => wijzig(i, { omschrijving: e.target.value })} />
                    {(bewerkbaar || r.detail) && (
                      <input disabled={!bewerkbaar} className="focusring mt-1 w-full bg-transparent text-xs text-inkt-muted"
                        placeholder="Extra info, bijvoorbeeld de gebruikte profielen"
                        value={r.detail ?? ''} onChange={e => wijzig(i, { detail: e.target.value })} />
                    )}
                  </Td>
                  <Td rechts><input disabled={!bewerkbaar} type="number" step="0.01" min="0.01" className="focusring w-20 bg-transparent text-right"
                    value={r.aantal} onChange={e => wijzig(i, { aantal: Number(e.target.value) })} /></Td>
                  <Td>
                    <Selecteer klein className="w-24" disabled={!bewerkbaar} value={r.eenheid}
                      onChange={e => wijzig(i, { eenheid: e.target.value as Offerteregel['eenheid'] })}>
                      <option value="stuk">stuk</option><option value="lopendeMeter">lm</option><option value="vierkanteMeter">m2</option>
                    </Selecteer>
                  </Td>
                  <Td rechts><input disabled={!bewerkbaar} type="number" step="0.01" className="focusring w-24 bg-transparent text-right"
                    value={r.eenheidsprijs} onChange={e => wijzig(i, { eenheidsprijs: Number(e.target.value) })} /></Td>
                  <Td rechts><input disabled={!bewerkbaar} type="number" step="0.01" min="0" className="focusring w-20 bg-transparent text-right"
                    value={r.kortingBedrag} onChange={e => wijzig(i, { kortingBedrag: Number(e.target.value) })} /></Td>
                  <Td>
                    <Selecteer klein className="w-24" disabled={!bewerkbaar} value={r.btw}
                      onChange={e => wijzig(i, { btw: e.target.value as Offerteregel['btw'] })}>
                      <option value="p21">21%</option><option value="p6">6%</option><option value="p0">0%</option>
                    </Selecteer>
                  </Td>
                  <Td rechts>{euro(r.totaal)}</Td>
                  <Td rechts>{bewerkbaar && <button className="focusring text-corten-600" onClick={() => zetRegels(regels.filter((_, x) => x !== i))}>×</button>}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-5 flex items-end justify-between gap-6">
          <div className="flex gap-4">
            <Invoer label="Korting %" type="number" step="0.01" min="0" max="100" disabled={!bewerkbaar}
              value={kortingPct} onChange={e => zetKortingPct(Number(e.target.value))} className="w-28" />
            <Invoer label="Korting €" type="number" step="0.01" min="0" disabled={!bewerkbaar}
              value={kortingBedrag} onChange={e => zetKortingBedrag(Number(e.target.value))} className="w-28" />
            <Invoer label="Model" disabled={!bewerkbaar} value={model}
              onChange={e => zetModel(e.target.value)} className="w-56" optioneel />
            <label className="flex items-center gap-2 pb-2 text-sm text-inkt-body">
              <input type="checkbox" checked={btwVerlegd} disabled={!bewerkbaar}
                onChange={e => zetBtwVerlegd(e.target.checked)} className="h-4 w-4 accent-bronze-600" />
              Btw verlegd
            </label>
          </div>
          <dl className="cijfers space-y-1 text-right text-sm">
            <div className="flex justify-between gap-10"><dt className="text-inkt-muted">Totaal excl. btw</dt><dd>{euro(offerte.totaalExclBtw)}</dd></div>
            <div className="flex justify-between gap-10"><dt className="text-inkt-muted">Btw</dt>
              <dd>{offerte.btwVerlegd ? 'verlegd' : euro(offerte.totaalBtw)}</dd></div>
            <div className="flex justify-between gap-10 font-display text-xl font-semibold text-bronze-600">
              <dt>Totaal incl. btw</dt><dd>{euro(offerte.totaalInclBtw)}</dd></div>
          </dl>
        </div>
        {bewerkbaar && <p className="mt-3 text-xs text-inkt-faint">De totalen worden berekend bij het opslaan. De backend rekent, het scherm toont.</p>}
      </Paneel>

      <Modaal open={weigerOpen} titel="Offerte geweigerd" onSluit={() => zetWeigerOpen(false)}>
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); weigeren.mutate() }}>
          <TekstVak label="Reden van de klant" value={reden} onChange={e => zetReden(e.target.value)} required />
          <div className="flex justify-end gap-2">
            <Knop type="button" variant="ghost" onClick={() => zetWeigerOpen(false)}>Annuleren</Knop>
            <Knop variant="destructief" disabled={weigeren.isPending}>Registreren</Knop>
          </div>
        </form>
      </Modaal>
    </>
  )
}
