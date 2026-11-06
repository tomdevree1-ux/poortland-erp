import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { api } from '../lib/api'
import { euro } from '../lib/formaat'
import {
  Invoer, Knop, Melding, Modaal, Paneel, PlusKnop, PotloodKnop, Selecteer, TekstVak, VuilbakKnop
} from '../ui'

/* De artikelcatalogus van Poortland: 910 regels uit het productbestand van
   25 september 2026, in de indeling van Poortland zelf. Te veel om in een keer
   te tonen, dus zoeken, filteren en bladeren gebeuren in de databank. */

type Rij = {
  id: string; code: string; naam: string; eenheid: Eenheid; basisprijs: number
  btwDefault: string; isActief: boolean
  categorie1?: string; categorie2?: string; leverancier?: string; merk?: string
  prijsOntbreekt: boolean
}
type Eenheid = 'stuk' | 'lopende_meter' | 'vierkante_meter'
type Detail = Rij & {
  omschrijving: string; leverancierNummer?: string; model?: string
  type?: string; stdMaten?: string; poortlandId?: number
}
type Lijst = { aantal: number; pagina: number; paginaGrootte: number; rijen: Rij[] }
type Filters = {
  categorieen: { c1: string; c2?: string; aantal: number }[]
  leveranciers: { naam: string; aantal: number }[]
  merken: { naam: string; aantal: number }[]
}
type Vorm = {
  code: string; naam: string; omschrijving: string; eenheid: Eenheid; basisprijs: string
  btwDefault: string; isActief: boolean; categorie1: string; categorie2: string
  leverancier: string; leverancierNummer: string; merk: string; model: string
  type: string; stdMaten: string
}

const leegVorm: Vorm = {
  code: '', naam: '', omschrijving: '', eenheid: 'stuk', basisprijs: '', btwDefault: 'p21',
  isActief: true, categorie1: '', categorie2: '', leverancier: '', leverancierNummer: '',
  merk: '', model: '', type: '', stdMaten: ''
}
const eenheidTekst: Record<Eenheid, string> = {
  stuk: 'stuk', lopende_meter: 'per meter', vierkante_meter: 'per m²'
}

export default function Artikelen() {
  const qc = useQueryClient()
  const [zoek, zetZoek] = useState('')
  const [traag, zetTraag] = useState('')
  const [cat1, zetCat1] = useState('')
  const [cat2, zetCat2] = useState('')
  const [lev, zetLev] = useState('')
  const [merk, zetMerk] = useState('')
  const [alleenActief, zetAlleenActief] = useState(true)
  const [pagina, zetPagina] = useState(0)
  const [open, zetOpen] = useState<string | null>(null)
  const [nieuwOpen, zetNieuwOpen] = useState(false)
  const [vorm, zetVorm] = useState<Vorm>(leegVorm)
  const [verwijderId, zetVerwijderId] = useState<string | null>(null)
  const [fout, zetFout] = useState<string>()

  // Wachten tot het typen stilvalt, anders bevraagt elk teken de databank.
  useEffect(() => {
    const t = setTimeout(() => { zetTraag(zoek); zetPagina(0) }, 300)
    return () => clearTimeout(t)
  }, [zoek])

  const { data: filters } = useQuery({
    queryKey: ['artikel-filters'],
    queryFn: () => api.get<Filters>('/artikelen/filters'),
    staleTime: 10 * 60 * 1000
  })
  const sleutel = ['artikelen', traag, cat1, cat2, lev, merk, alleenActief, pagina] as const
  const { data, isPending } = useQuery({
    queryKey: sleutel,
    queryFn: () => {
      const p = new URLSearchParams()
      if (traag) p.set('zoek', traag)
      if (cat1) p.set('categorie1', cat1)
      if (cat2) p.set('categorie2', cat2)
      if (lev) p.set('leverancier', lev)
      if (merk) p.set('merk', merk)
      p.set('alleenActief', String(alleenActief))
      p.set('pagina', String(pagina))
      return api.get<Lijst>(`/artikelen?${p}`)
    }
  })
  const { data: detail } = useQuery({
    queryKey: ['artikel', open],
    queryFn: () => api.get<Detail>(`/artikelen/${open}`),
    enabled: !!open
  })

  const subcategorieen = useMemo(
    () => (filters?.categorieen ?? []).filter(c => !cat1 || c.c1 === cat1),
    [filters, cat1]
  )

  const ververs = () => {
    zetFout(undefined)
    qc.invalidateQueries({ queryKey: ['artikelen'] })
    qc.invalidateQueries({ queryKey: ['artikel-filters'] })
  }
  const faal = (f: unknown) => zetFout(f instanceof Error ? f.message : 'Er ging iets mis.')
  const naarInvoer = (v: Vorm) => ({
    code: v.code.trim(), naam: v.naam.trim(), omschrijving: v.omschrijving.trim() || v.naam.trim(),
    eenheid: v.eenheid, basisprijs: Number((v.basisprijs || '0').replace(',', '.')),
    btwDefault: v.btwDefault, isActief: v.isActief,
    categorie1: v.categorie1.trim() || null, categorie2: v.categorie2.trim() || null,
    leverancier: v.leverancier.trim() || null, leverancierNummer: v.leverancierNummer.trim() || null,
    merk: v.merk.trim() || null, model: v.model.trim() || null,
    type: v.type.trim() || null, stdMaten: v.stdMaten.trim() || null
  })

  const maak = useMutation({
    mutationFn: () => api.post('/artikelen', naarInvoer(vorm)),
    onSuccess: () => { ververs(); zetNieuwOpen(false); zetVorm(leegVorm) }, onError: faal
  })
  const bewaar = useMutation({
    mutationFn: (id: string) => api.patch(`/artikelen/${id}`, naarInvoer(vorm)),
    onSuccess: () => { ververs(); zetOpen(null); qc.invalidateQueries({ queryKey: ['artikel'] }) },
    onError: faal
  })
  const verwijder = useMutation({
    mutationFn: (id: string) => api.del(`/artikelen/${id}`),
    onSuccess: () => { ververs(); zetVerwijderId(null); zetOpen(null) }, onError: faal
  })

  useEffect(() => {
    if (detail) zetVorm({
      code: detail.code, naam: detail.naam, omschrijving: detail.omschrijving,
      eenheid: detail.eenheid, basisprijs: detail.basisprijs ? String(detail.basisprijs) : '',
      btwDefault: detail.btwDefault, isActief: detail.isActief,
      categorie1: detail.categorie1 ?? '', categorie2: detail.categorie2 ?? '',
      leverancier: detail.leverancier ?? '', leverancierNummer: detail.leverancierNummer ?? '',
      merk: detail.merk ?? '', model: detail.model ?? '',
      type: detail.type ?? '', stdMaten: detail.stdMaten ?? ''
    })
  }, [detail])

  const aantal = data?.aantal ?? 0
  const laatste = Math.max(0, Math.ceil(aantal / (data?.paginaGrootte ?? 50)) - 1)

  const velden = (bewerken: boolean) => (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
        <Invoer label="Code" value={vorm.code} disabled={bewerken}
          onChange={e => zetVorm({ ...vorm, code: e.target.value })} />
        <Invoer label="Naam" value={vorm.naam}
          onChange={e => zetVorm({ ...vorm, naam: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Invoer label="Categorie 1" optioneel value={vorm.categorie1}
          onChange={e => zetVorm({ ...vorm, categorie1: e.target.value })} />
        <Invoer label="Categorie 2" optioneel value={vorm.categorie2}
          onChange={e => zetVorm({ ...vorm, categorie2: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Selecteer label="Eenheid" value={vorm.eenheid}
          onChange={e => zetVorm({ ...vorm, eenheid: e.target.value as Eenheid })}>
          <option value="stuk">stuk</option>
          <option value="lopende_meter">per meter</option>
          <option value="vierkante_meter">per m²</option>
        </Selecteer>
        <Invoer label="Prijs" optioneel inputMode="decimal" placeholder="0,00" value={vorm.basisprijs}
          onChange={e => zetVorm({ ...vorm, basisprijs: e.target.value })} />
        <Selecteer label="Btw" value={vorm.btwDefault}
          onChange={e => zetVorm({ ...vorm, btwDefault: e.target.value })}>
          <option value="p21">21 procent</option>
          <option value="p6">6 procent</option>
          <option value="p0">0 procent</option>
        </Selecteer>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Invoer label="Leverancier" optioneel value={vorm.leverancier}
          onChange={e => zetVorm({ ...vorm, leverancier: e.target.value })} />
        <Invoer label="Artikelnummer leverancier" optioneel value={vorm.leverancierNummer}
          onChange={e => zetVorm({ ...vorm, leverancierNummer: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Invoer label="Merk" optioneel value={vorm.merk}
          onChange={e => zetVorm({ ...vorm, merk: e.target.value })} />
        <Invoer label="Model" optioneel value={vorm.model}
          onChange={e => zetVorm({ ...vorm, model: e.target.value })} />
        <Invoer label="Type" optioneel value={vorm.type}
          onChange={e => zetVorm({ ...vorm, type: e.target.value })} />
      </div>
      <Invoer label="Standaardmaten" optioneel value={vorm.stdMaten}
        onChange={e => zetVorm({ ...vorm, stdMaten: e.target.value })} />
      <TekstVak label="Omschrijving" optioneel rows={2} value={vorm.omschrijving}
        onChange={e => zetVorm({ ...vorm, omschrijving: e.target.value })} />
      <label className="flex items-center gap-2 text-sm text-inkt-body">
        <input type="checkbox" checked={vorm.isActief}
          onChange={e => zetVorm({ ...vorm, isActief: e.target.checked })} />
        Actief, mag gekozen worden op offertes en bonnen
      </label>
    </div>
  )

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-600">Catalogus</p>
          <h1 className="font-display text-3xl text-inkt">Artikelen</h1>
        </div>
        <PlusKnop label="Artikel toevoegen" onClick={() => { zetVorm(leegVorm); zetNieuwOpen(true) }} />
      </div>

      {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}

      <Paneel titel="Zoeken en filteren">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search size={15} className="pointer-events-none absolute left-3 top-[34px] text-inkt-faint" />
            <Invoer label="Zoek op naam, code, merk of artikelnummer" value={zoek}
              className="[&_input]:pl-9" onChange={e => zetZoek(e.target.value)} />
          </div>
          <Selecteer label="Categorie" value={cat1}
            onChange={e => { zetCat1(e.target.value); zetCat2(''); zetPagina(0) }}>
            <option value="">Alle</option>
            {[...new Set((filters?.categorieen ?? []).map(c => c.c1))].map(c =>
              <option key={c} value={c}>{c}</option>)}
          </Selecteer>
          <Selecteer label="Subcategorie" value={cat2}
            onChange={e => { zetCat2(e.target.value); zetPagina(0) }}>
            <option value="">Alle</option>
            {subcategorieen.filter(c => c.c2).map(c =>
              <option key={`${c.c1}-${c.c2}`} value={c.c2}>{c.c2} ({c.aantal})</option>)}
          </Selecteer>
          <Selecteer label="Leverancier" value={lev} onChange={e => { zetLev(e.target.value); zetPagina(0) }}>
            <option value="">Alle</option>
            {(filters?.leveranciers ?? []).map(l =>
              <option key={l.naam} value={l.naam}>{l.naam} ({l.aantal})</option>)}
          </Selecteer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Selecteer label="Merk" klein value={merk} onChange={e => { zetMerk(e.target.value); zetPagina(0) }}>
            <option value="">Alle merken</option>
            {(filters?.merken ?? []).map(m =>
              <option key={m.naam} value={m.naam}>{m.naam} ({m.aantal})</option>)}
          </Selecteer>
          <label className="flex items-center gap-2 pt-5 text-sm text-inkt-body">
            <input type="checkbox" checked={alleenActief}
              onChange={e => { zetAlleenActief(e.target.checked); zetPagina(0) }} />
            Alleen actieve artikelen
          </label>
          {(zoek || cat1 || cat2 || lev || merk) && (
            <Knop variant="ghost" className="mt-5 h-8 px-3 text-xs"
              onClick={() => { zetZoek(''); zetCat1(''); zetCat2(''); zetLev(''); zetMerk(''); zetPagina(0) }}>
              Filters wissen
            </Knop>
          )}
        </div>
      </Paneel>

      <div className="mt-4">
        <Paneel titel={`${aantal} artikel${aantal === 1 ? '' : 'en'}`}>
          {isPending ? (
            <p className="text-sm text-inkt-muted">Bezig met laden…</p>
          ) : !data?.rijen.length ? (
            <p className="text-sm text-inkt-muted">Geen artikel gevonden met deze filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-inkt/15 text-left text-[11px] uppercase tracking-[0.12em] text-inkt-muted">
                    <th className="py-2 pr-3 font-semibold">Code</th>
                    <th className="py-2 pr-3 font-semibold">Naam</th>
                    <th className="py-2 pr-3 font-semibold">Categorie</th>
                    <th className="py-2 pr-3 font-semibold">Merk</th>
                    <th className="py-2 pr-3 font-semibold">Leverancier</th>
                    <th className="py-2 pr-3 text-right font-semibold">Prijs</th>
                    <th className="py-2 w-8" />
                  </tr>
                </thead>
                <tbody>
                  {data.rijen.map(r => (
                    <tr key={r.id} className="border-b border-inkt/[.07] last:border-0">
                      <td className="py-2 pr-3 whitespace-nowrap font-mono text-xs text-inkt-muted">{r.code}</td>
                      <td className="py-2 pr-3">
                        <span className={r.isActief ? 'text-inkt' : 'text-inkt-faint line-through'}>{r.naam}</span>
                        <span className="ml-2 text-xs text-inkt-faint">{eenheidTekst[r.eenheid]}</span>
                      </td>
                      <td className="py-2 pr-3 text-xs text-inkt-muted">
                        {r.categorie1}{r.categorie2 ? ` · ${r.categorie2}` : ''}
                      </td>
                      <td className="py-2 pr-3 text-xs text-inkt-muted">{r.merk ?? '—'}</td>
                      <td className="py-2 pr-3 text-xs text-inkt-muted">{r.leverancier ?? '—'}</td>
                      <td className="py-2 pr-3 text-right whitespace-nowrap">
                        {r.prijsOntbreekt
                          ? <span className="text-xs text-bronze-600">geen prijs</span>
                          : euro(r.basisprijs)}
                      </td>
                      <td className="py-2 text-right"><PotloodKnop onClick={() => zetOpen(r.id)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {laatste > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-inkt/[.07] pt-3">
              <Knop variant="ghost" className="h-8 px-3 text-xs" disabled={pagina === 0}
                onClick={() => zetPagina(p => Math.max(0, p - 1))}>Vorige</Knop>
              <span className="text-xs text-inkt-muted">Pagina {pagina + 1} van {laatste + 1}</span>
              <Knop variant="ghost" className="h-8 px-3 text-xs" disabled={pagina >= laatste}
                onClick={() => zetPagina(p => Math.min(laatste, p + 1))}>Volgende</Knop>
            </div>
          )}
        </Paneel>
      </div>

      <Modaal open={nieuwOpen} titel="Nieuw artikel" onSluit={() => zetNieuwOpen(false)}>
        {velden(false)}
        <div className="mt-5 flex justify-end gap-2 border-t border-inkt/10 pt-4">
          <Knop variant="ghost" onClick={() => zetNieuwOpen(false)}>Annuleren</Knop>
          <Knop variant="primair" disabled={maak.isPending || !vorm.code.trim() || !vorm.naam.trim()}
            onClick={() => maak.mutate()}>Aanmaken</Knop>
        </div>
      </Modaal>

      <Modaal open={!!open} titel="Artikel bewerken" onSluit={() => zetOpen(null)}>
        {detail && (
          <>
            {velden(true)}
            {detail.poortlandId != null && (
              <p className="mt-3 text-xs text-inkt-faint">
                Nummer in het bestand van Poortland: {detail.poortlandId}
              </p>
            )}
            <div className="mt-5 flex justify-between gap-2 border-t border-inkt/10 pt-4">
              <VuilbakKnop onClick={() => zetVerwijderId(detail.id)} />
              <div className="flex gap-2">
                <Knop variant="ghost" onClick={() => zetOpen(null)}>Sluiten</Knop>
                <Knop variant="primair" disabled={bewaar.isPending || !vorm.naam.trim()}
                  onClick={() => bewaar.mutate(detail.id)}>Opslaan</Knop>
              </div>
            </div>
          </>
        )}
      </Modaal>

      <Modaal open={!!verwijderId} titel="Artikel verwijderen?" onSluit={() => zetVerwijderId(null)}>
        <p className="text-sm text-inkt-body">
          Het artikel verdwijnt uit de catalogus. Bonnen en offertes waarop het al staat blijven ongewijzigd.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Knop variant="ghost" onClick={() => zetVerwijderId(null)}>Annuleren</Knop>
          <Knop variant="primair" onClick={() => verwijderId && verwijder.mutate(verwijderId)}>Verwijderen</Knop>
        </div>
      </Modaal>
    </>
  )
}
