/* Draait de offertewizard in node met een eenvoudige hookopslag, zodat de
   keuzelogica echt getest wordt en niet alleen de syntaxis. */
const fs = require('fs')

let haken = []
let wijzer = 0
let hertekenen = () => {}

const el = (t, p, ...c) => ({ t, p: p || {}, c: c.flat(Infinity).filter(x => x != null) })

global.React = {
  createElement: el,
  Fragment: 'frag',
  useState(begin) {
    const i = wijzer++
    if (!(i in haken)) haken[i] = typeof begin === 'function' ? begin() : begin
    const zet = v => { haken[i] = typeof v === 'function' ? v(haken[i]) : v }
    return [haken[i], zet]
  },
  useRef(v) { const i = wijzer++; if (!(i in haken)) haken[i] = { current: v }; return haken[i] },
  useEffect() {},
  useMemo(f) { const i = wijzer++; haken[i] = f(); return haken[i] },
  useCallback(f) { return f }
}
global.ReactDOM = { createRoot: () => ({ render() {} }), render() {} }
global.window = {
  React: global.React, ReactDOM: global.ReactDOM, addEventListener() {},
  location: { pathname: '/', search: '' },
  localStorage: { getItem: () => null, setItem() {} },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
}
global.document = {
  createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }),
  body: { appendChild() {}, removeChild() {} },
  documentElement: { lang: 'nl', style: { setProperty() {} } },
  addEventListener() {}, removeEventListener() {},
  querySelector: () => null, querySelectorAll: () => [], getElementById: () => ({}),
  head: { appendChild() {}, querySelectorAll: () => [] }, title: ''
}
global.navigator = { clipboard: null }
global.localStorage = window.localStorage
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })

;(0, eval)(fs.readFileSync('/tmp/ps/gebouwd/site.min.js', 'utf8'))

function teken() {
  wijzer = 0
  return window.OfferteModal({ _forceOpen: true, _startStep: 2, _startService: 'poorten' })
}
function knoppen(n, uit) {
  uit = uit || []
  if (n == null || typeof n !== 'object') return uit
  if (typeof n.t === 'function') {
    wijzer = wijzer // hooks van kinderen lopen in dezelfde volgorde mee
    try { return knoppen(n.t(n.p || {}), uit) } catch (e) { return uit }
  }
  if (n.t === 'button' && n.p && n.p.onClick) uit.push(n)
  ;(n.c || []).forEach(k => knoppen(k, uit))
  return uit
}
function tekst(n) {
  if (n == null) return ''
  if (typeof n !== 'object') return String(n)
  if (typeof n.t === 'function') { try { return tekst(n.t(n.p || {})) } catch (e) { return '' } }
  return (n.c || []).map(tekst).join(' ')
}
function klik(label) {
  const b = knoppen(teken()).find(x => tekst(x).trim() === label)
  if (!b) throw new Error('knop niet gevonden: ' + label)
  b.p.onClick({ preventDefault() {}, stopPropagation() {} })
}
function bevat(stuk) { return tekst(teken()).indexOf(stuk) >= 0 }

const uitslag = []
const controle = (naam, goed) => { uitslag.push([naam, goed]); console.log((goed ? 'OK   ' : 'FOUT ') + naam) }

try {
  controle('stap 2 opent met de poortvraag', bevat('Type poort'))
  controle('vier types staan er', bevat('Massief houten poort') && bevat('Stalen poort')
    && bevat('Aluminium poort') && bevat('Combinatie hout en metaal'))

  klik('Massief houten poort')
  controle('model vraagt om een keuze', bevat('Kies een model'))

  // het eerste model kiezen via de keuzelijst
  klik('Kies een model ▾')
  const voor = knoppen(teken()).map(b => tekst(b).trim()).filter(Boolean)
  const modelKnop = voor.find(x => /^(Essen|Aken|Keulen|Hamburg|Custom|Orinoco)/.test(x))
  if (!modelKnop) throw new Error('geen modelknop gevonden, zag: ' + voor.slice(0, 25).join(' | '))
  klik(modelKnop)
  controle('model gekozen en als chip getoond', bevat('1. ' + modelKnop))
  controle('uitleg over vier modellen verschijnt', bevat('tot vier modellen'))
  controle('knop nodigt uit voor een tweede', bevat('Nog een model toevoegen'))

  // tweede model
  klik('Nog een model toevoegen ▾')
  const tweede = knoppen(teken()).map(b => tekst(b).trim())
    .find(x => /^(Essen|Aken|Keulen|Hamburg|Custom|Orinoco)/.test(x) && x !== modelKnop)
  if (tweede) {
    klik(tweede)
    controle('tweede model erbij', bevat('2. ' + tweede))
    controle('regel over dezelfde afmetingen', bevat('dezelfde afmetingen'))
  }

  // verder zonder maten mag niet
  klik('Volgende')
  controle('zonder maten blijft de wizard staan', bevat('Type poort'))
  controle('melding over de maten', bevat('breedte') && bevat('zijhoogte'))
} catch (e) {
  controle('harnas liep door', false)
  console.log('   reden: ' + e.message)
}

const fouten = uitslag.filter(([, g]) => !g).length
console.log('\n' + (uitslag.length - fouten) + ' van ' + uitslag.length + ' controles in orde')
process.exit(fouten ? 1 : 0)
