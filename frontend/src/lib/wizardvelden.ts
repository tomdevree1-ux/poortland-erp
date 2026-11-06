/* Kennis over de velden die de offertewizard van de website meestuurt.
   Eén bron voor de leadfiche: nette labels, vaste volgorde per groep en de
   situatietekening. Wijzigt de wizard? Vul dan hier de sleutel aan; de
   dekkingstest in de e2e-suite bewaakt dat dit gebeurt. */

export interface WizardVeld { label: string; waarde: string }
export interface WizardStap { titel: string; velden: WizardVeld[] }

/* ---- Labels ---- */
export const wizardVeldLabels: Record<string, string> = {
  Dienst: 'Dienst',
  // Poort en model
  typePoort: 'Type poort',
  model: 'Model',
  modellen: 'Gekozen modellen',
  modelStijl: 'Stijlgroep van het model',
  breedte: 'Totale opening breedte (cm)',
  zijhoogte: 'Zijhoogte (cm)',
  // Uitvoering en omgeving
  hellingLinksRechts: 'Helling links naar rechts',
  hellingNaarPoort: 'Helling naar de poort toe',
  bediening: 'Type bediening',
  ondergrond: 'Ondergrond aan de poort',
  doorzichtigheid: 'Doorzichtigheid poort',
  // Bovenaanzicht van de situatie
  typeOpening: 'Type opening',
  paalLinks: 'Paal links van de poort',
  aansluitingLinks: 'Links naast de poort',
  paalRechts: 'Paal rechts van de poort',
  aansluitingRechts: 'Rechts naast de poort',
  // Overkappingen
  uitvoering: 'Uitvoering',
  lengte: 'Lengte (cm)',
  hoogte: 'Hoogte (cm)',
  wanden: 'Aantal wanden',
  glazenSchuifwand: 'Glazen schuifwand',
  zonnewerendGlas: 'Zonnewerend glas',
  // Automatisering en onderhoud
  autoBeschrijving: 'Gegevens van de poort',
  bouwjaar: 'Bouwjaar',
  typeMotor: 'Type of merk motor'
}
export const wizardLabel = (l: string) => wizardVeldLabels[l] ?? l

const wizardDienstTekst: Record<string, string> = {
  poorten: 'Poorten', overkappingen: 'Overkapping',
  automatisering: 'Automatisering', onderhoud: 'Onderhoud'
}
export const wizardWaarde = (veld: WizardVeld) =>
  veld.label === 'Dienst' ? (wizardDienstTekst[veld.waarde] ?? veld.waarde) : veld.waarde

/* ---- Groepen in vaste volgorde, zodat elke lead er hetzelfde uitziet ---- */
export const WIZARD_GROEPEN: { titel: string; sleutels: string[] }[] = [
  { titel: 'Aanvraag', sleutels: ['Dienst'] },
  { titel: 'Poort en model', sleutels: ['typePoort', 'model', 'modellen', 'modelStijl', 'breedte', 'zijhoogte'] },
  {
    titel: 'Uitvoering en omgeving',
    sleutels: ['hellingLinksRechts', 'hellingNaarPoort', 'bediening', 'ondergrond', 'doorzichtigheid']
  },
  {
    titel: 'Situatie ter plaatse',
    sleutels: ['typeOpening', 'paalLinks', 'aansluitingLinks', 'paalRechts', 'aansluitingRechts']
  },
  {
    titel: 'Overkapping',
    sleutels: ['uitvoering', 'lengte', 'hoogte', 'wanden', 'glazenSchuifwand', 'zonnewerendGlas']
  },
  { titel: 'Bestaande installatie', sleutels: ['autoBeschrijving', 'bouwjaar', 'typeMotor'] }
]

export interface WizardGroep { titel: string; velden: WizardVeld[] }

/** Zet de platte veldenlijst om in groepen. Onbekende sleutels komen onderaan
    onder Overige gegevens terecht, zodat er nooit iets verloren gaat. */
export function groepeerWizard(stappen: WizardStap[]): WizardGroep[] {
  const alle = stappen.flatMap(s => s.velden).filter(v => v && String(v.waarde ?? '').trim() !== '')
  // Bij een poortaanvraag is 'geen modelvoorkeur' zelf ook informatie: dan weet
  // de verkoper dat de vraag gesteld is en de klant bewust openliet.
  const heeft = (s: string) => alle.some(v => v.label === s)
  if (heeft('typePoort') && !heeft('model'))
    alle.push({ label: 'model', waarde: 'Geen voorkeur opgegeven' })
  const gebruikt = new Set<string>()
  const groepen: WizardGroep[] = []
  for (const g of WIZARD_GROEPEN) {
    const velden: WizardVeld[] = []
    for (const sleutel of g.sleutels) {
      const gevonden = alle.find(v => v.label === sleutel)
      if (gevonden) { velden.push(gevonden); gebruikt.add(sleutel) }
    }
    if (velden.length) groepen.push({ titel: g.titel, velden })
  }
  const rest = alle.filter(v => !gebruikt.has(v.label))
  if (rest.length) groepen.push({ titel: 'Overige gegevens', velden: rest })
  return groepen
}

/* ---- Bovenaanzicht van de situatie ----
   Zelfde opbouw als de tekening die de klant in de wizard zag. Geeft null
   terug wanneer er te weinig gegevens zijn om iets zinnigs te tonen. */
export function situatieSvg(stappen: WizardStap[]): string | null {
  const w: Record<string, string> = {}
  stappen.flatMap(s => s.velden).forEach(v => { if (v) w[v.label] = String(v.waarde ?? '') })
  const relevante = ['typeOpening', 'paalLinks', 'paalRechts', 'aansluitingLinks', 'aansluitingRechts']
  if (!relevante.some(k => w[k])) return null

  const s: string[] = []
  const B = 960, H = 288, midY = 168
  const cm = parseFloat(String(w.breedte || '').replace(',', '.'))
  const openPx = Math.max(240, Math.min(430, isFinite(cm) && cm > 0 ? cm : 350))
  const x1 = (B - openPx) / 2, x2 = (B + openPx) / 2
  const lijn = (a: number, b: number, c: number, d: number, kleur: string, dikte: number, dash?: string) =>
    s.push(`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${kleur}" stroke-width="${dikte}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`)
  const txt = (x: number, y: number, t: string, kleur: string, gr: number, vet?: boolean, sp?: string) =>
    s.push(`<text x="${x}" y="${y}" fill="${kleur}" font-size="${gr}" text-anchor="middle"${vet ? ' font-weight="700"' : ''}${sp ? ` letter-spacing="${sp}"` : ''} font-family="inherit">${t}</text>`)
  const paalB = (p: string) => ({ Standaardpaal: 22, Brievenbuspaal: 30, Pakjespaal: 38, Zuil: 46 } as Record<string, number>)[p] || 0

  s.push('<defs><pattern id="plStip" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.5" fill="#DDD3BE"/></pattern>'
    + '<marker id="plPijl" markerWidth="10" markerHeight="10" refX="6.5" refY="5" orient="auto"><path d="M1.5 1.5 L7.5 5 L1.5 8.5" fill="none" stroke="#B7A27B" stroke-width="2" stroke-linecap="round"/></marker></defs>')
  s.push(`<rect x="${x1 + 3}" y="14" width="${openPx - 6}" height="${midY - 16}" rx="10" fill="#EDE6D8"/>`)
  s.push(`<rect x="${x1 + 3}" y="14" width="${openPx - 6}" height="${midY - 16}" rx="10" fill="url(#plStip)"/>`)
  txt((x1 + x2) / 2, 44, 'OPRIT', '#B9AD93', 14, true, '0.25em')

  const chip = (cx: number, tekst: string) => {
    s.push(`<rect x="${cx - 46}" y="52" width="92" height="30" rx="8" fill="#FFFFFF" stroke="#DCD5C6"/>`)
    txt(cx, 72, tekst, '#3E3A34', 13, true, '0.12em')
  }
  chip((34 + x1) / 2, 'LINKS')
  chip((x2 + B - 34) / 2, 'RECHTS')

  const struiken = (xs: number, xe: number) => {
    for (let gx = xs + 26; gx < xe - 18; gx += 56) {
      s.push(`<ellipse cx="${gx + 14}" cy="${midY - 24}" rx="26" ry="13" fill="#7E9469"/>`)
      s.push(`<ellipse cx="${gx}" cy="${midY - 18}" rx="20" ry="11" fill="#93A97E"/>`)
      s.push(`<ellipse cx="${gx + 26}" cy="${midY - 16}" rx="16" ry="9" fill="#6B8258"/>`)
    }
  }
  const planken = (xs: number, xe: number, vul: string, rand: string, dash?: boolean) => {
    for (let px = xs + 4; px < xe - 8; px += 15)
      s.push(`<rect x="${px}" y="${midY - 14}" width="8" height="28" rx="2" fill="${vul}" stroke="${rand}" stroke-width="1.5"${dash ? ' stroke-dasharray="3 3"' : ''}/>`)
  }
  const zijde = (links: boolean) => {
    const kant = links ? w.aansluitingLinks : w.aansluitingRechts
    const paal = links ? w.paalLinks : w.paalRechts
    const xs = links ? 34 : x2 + paalB(paal), xe = links ? x1 - paalB(paal) : B - 34
    if (kant === 'Woning') {
      s.push(`<rect x="${xs}" y="${midY - 52}" width="${xe - xs}" height="66" rx="5" fill="#D8D2C6" stroke="#55504A" stroke-width="2"/>`)
      lijn(xs + 14, midY - 19, xe - 14, midY - 19, '#B0A692', 1.6)
      lijn(xs, midY - 52, xs + 14, midY - 19, '#B0A692', 1.6)
      lijn(xs, midY + 14, xs + 14, midY - 19, '#B0A692', 1.6)
      lijn(xe, midY - 52, xe - 14, midY - 19, '#B0A692', 1.6)
      lijn(xe, midY + 14, xe - 14, midY - 19, '#B0A692', 1.6)
      txt((xs + xe) / 2, midY + 2, 'woning', '#8A8070', 13, false, '0.14em')
    } else if (kant === 'Muur') {
      struiken(xs, xe)
      s.push(`<rect x="${xs}" y="${midY - 12}" width="${xe - xs}" height="24" rx="4" fill="#DCD4C6" stroke="#B8AE9C" stroke-width="1.5"/>`)
      lijn(xs + 3, midY, xe - 3, midY, '#B8AE9C', 1.2)
      for (let bx = xs + 20; bx < xe - 6; bx += 40) { lijn(bx, midY - 12, bx, midY, '#B8AE9C', 1.2); lijn(bx + 20, midY, bx + 20, midY + 12, '#B8AE9C', 1.2) }
    } else if (kant === 'Vaste afsluiting') {
      struiken(xs, xe); lijn(xs + 4, midY, xe - 4, midY, '#8A8070', 3); planken(xs, xe, '#C9BFAD', '#8A8070')
    } else if (kant === 'Aanpasbare afsluiting') {
      struiken(xs, xe); lijn(xs + 4, midY, xe - 4, midY, '#B0A692', 3, '10 8'); planken(xs, xe, '#E6DFD2', '#B0A692', true)
    } else if (kant === 'Vrije ruimte') {
      lijn(xs + 4, midY, xe - 4, midY, '#B0A692', 2, '2 10')
      for (let gx = xs + 26; gx < xe - 10; gx += 60) {
        lijn(gx, midY - 4, gx - 5, midY - 15, '#8FA37E', 3); lijn(gx, midY - 4, gx, midY - 17, '#8FA37E', 3); lijn(gx, midY - 4, gx + 5, midY - 15, '#8FA37E', 3)
      }
    } else lijn(xs + 10, midY, xe - 6, midY, '#C9BFA9', 3.5, '11 11')
    if (paal && paal !== 'Geen paal') {
      const b = paalB(paal), px = links ? x1 - b : x2
      s.push(`<rect x="${px + 3}" y="${midY - b / 2 + 3}" width="${b}" height="${b}" rx="6" fill="rgba(20,28,21,0.18)"/>`)
      s.push(`<rect x="${px}" y="${midY - b / 2}" width="${b}" height="${b}" rx="6" fill="#9C9184" stroke="#55504A" stroke-width="2"/>`)
      s.push(`<rect x="${px + 3}" y="${midY - b / 2 + 3}" width="${b - 6}" height="${b / 2.6}" rx="4" fill="#B3A99B"/>`)
      if (paal === 'Brievenbuspaal') s.push(`<rect x="${px + 6}" y="${midY - 2}" width="${b - 12}" height="4" rx="2" fill="#3E3A34"/>`)
      if (paal === 'Pakjespaal') s.push(`<rect x="${px + 8}" y="${midY - 4}" width="${b - 16}" height="12" rx="2" fill="none" stroke="#3E3A34" stroke-width="2"/>`)
    }
  }
  zijde(true); zijde(false)

  const balk = (gx: number, gy: number, lang: number, hoek: number) => {
    s.push(`<g transform="rotate(${hoek} ${gx} ${gy})">`)
    s.push(`<rect x="${gx}" y="${gy - 9}" width="${lang}" height="18" rx="4" fill="#3E3A34" stroke="#2B2823" stroke-width="1.5"/>`)
    for (let px = gx + 12; px < gx + lang - 6; px += 15) lijn(px, gy - 8, px, gy + 8, '#5A554C', 2)
    s.push('</g>')
  }
  const boog = (pad: string) => s.push(`<path d="${pad}" fill="none" stroke="#B7A27B" stroke-width="2.5" stroke-dasharray="7 8" stroke-linecap="round" marker-end="url(#plPijl)"/>`)
  const ty = w.typeOpening
  const top = Math.min(openPx * 0.36, midY - 34)
  if (!ty) { lijn(x1 + 8, midY, x2 - 8, midY, '#B9AD93', 5.5, '5 10'); txt((x1 + x2) / 2, midY + 36, 'type nog te bepalen', '#8A6A3C', 14.5, true) }
  else if (ty === 'Ik weet het niet') { balk(x1 + 5, midY, openPx - 10, 0); txt((x1 + x2) / 2, midY + 36, 'type nog te bepalen', '#6E6450', 13) }
  else if (ty === 'Enkele draaipoort') {
    // Sinds 2026-09-13 vraagt de wizard geen draairichting meer.
    balk(x1, midY, openPx * 0.9, -26)
    boog(`M ${x2 - 16} ${midY - 10} A ${openPx * 0.82} ${openPx * 0.82} 0 0 0 ${x1 + openPx * 0.6} ${midY - top}`)
    txt((x1 + x2) / 2, midY + 36, 'draairichting nog te bepalen', '#9C8E72', 12)
  } else if (ty === 'Schuifpoort') {
    balk(x1 + 5, midY, openPx - 10, 0)
    txt((x1 + x2) / 2, midY + 36, 'schuifrichting nog te bepalen', '#9C8E72', 12)
  }
  else if (ty.indexOf('scharnier links') >= 0) {
    balk(x1, midY, openPx * 0.9, -26)
    boog(`M ${x2 - 16} ${midY - 10} A ${openPx * 0.82} ${openPx * 0.82} 0 0 0 ${x1 + openPx * 0.6} ${midY - top}`)
  } else if (ty.indexOf('scharnier rechts') >= 0) {
    s.push(`<g transform="rotate(26 ${x2} ${midY})">`)
    s.push(`<rect x="${x2 - openPx * 0.9}" y="${midY - 9}" width="${openPx * 0.9}" height="18" rx="4" fill="#3E3A34" stroke="#2B2823" stroke-width="1.5"/>`)
    for (let px = x2 - openPx * 0.9 + 12; px < x2 - 6; px += 15) s.push(`<line x1="${px}" y1="${midY - 8}" x2="${px}" y2="${midY + 8}" stroke="#5A554C" stroke-width="2"/>`)
    s.push('</g>')
    boog(`M ${x1 + 16} ${midY - 10} A ${openPx * 0.82} ${openPx * 0.82} 0 0 1 ${x2 - openPx * 0.6} ${midY - top}`)
  } else if (ty === 'Dubbele draaipoort') {
    const top2 = Math.min(openPx * 0.26, midY - 40)
    balk(x1, midY, openPx * 0.44, -22)
    s.push(`<g transform="rotate(22 ${x2} ${midY})">`)
    s.push(`<rect x="${x2 - openPx * 0.44}" y="${midY - 9}" width="${openPx * 0.44}" height="18" rx="4" fill="#3E3A34" stroke="#2B2823" stroke-width="1.5"/>`)
    for (let px = x2 - openPx * 0.44 + 12; px < x2 - 6; px += 15) s.push(`<line x1="${px}" y1="${midY - 8}" x2="${px}" y2="${midY + 8}" stroke="#5A554C" stroke-width="2"/>`)
    s.push('</g>')
    boog(`M ${(x1 + x2) / 2 - 18} ${midY - 10} A ${openPx * 0.44} ${openPx * 0.44} 0 0 0 ${x1 + openPx * 0.3} ${midY - top2}`)
    boog(`M ${(x1 + x2) / 2 + 18} ${midY - 10} A ${openPx * 0.44} ${openPx * 0.44} 0 0 1 ${x2 - openPx * 0.3} ${midY - top2}`)
  } else if (ty.indexOf('Schuifpoort') === 0) {
    const naarLinks = ty.indexOf('links') >= 0
    balk(x1 + 5, midY, openPx - 10, 0)
    const py = midY - 26, ax = naarLinks ? x1 - 6 : x2 + 6, bx = naarLinks ? ax - 62 : ax + 62
    s.push(`<line x1="${ax}" y1="${py}" x2="${bx}" y2="${py}" stroke="#B7A27B" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 8" marker-end="url(#plPijl)"/>`)
  }

  if (isFinite(cm) && cm > 0) {
    const my = midY + 52
    lijn(x1, my, x2, my, '#C0392B', 2); lijn(x1, my - 7, x1, my + 7, '#C0392B', 2); lijn(x2, my - 7, x2, my + 7, '#C0392B', 2)
    txt((x1 + x2) / 2, my + 19, `breedte ${cm} cm`, '#C0392B', 13.5, true)
  }
  const sy = midY + 104
  lijn(70, sy, (x1 + x2) / 2 - 110, sy, '#C9BFA9', 1.6, '8 8')
  lijn((x1 + x2) / 2 + 110, sy, B - 70, sy, '#C9BFA9', 1.6, '8 8')
  txt((x1 + x2) / 2, sy + 5, 'STRAATZIJDE', '#8A8070', 14, false, '0.28em')
  s.push(`<path d="M ${(x1 + x2) / 2 - 7} ${sy + 32} L ${(x1 + x2) / 2} ${sy + 22} L ${(x1 + x2) / 2 + 7} ${sy + 32} Z" fill="#8A6A3C"/>`)
  txt((x1 + x2) / 2, sy + 52, 'VOORAANZICHT', '#55504A', 12.5, true, '0.22em')
  return `<svg viewBox="0 0 ${B} ${H}" style="display:block;width:100%" role="img" aria-label="Bovenaanzicht van de poortsituatie zoals de klant ze samenstelde">${s.join('')}</svg>`
}
