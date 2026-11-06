// Bouwstap voor de marketingsite (audit 2026-08-11, G5 en H3).
// 1. Bundelt en minifieert de zestien losse scriptbestanden tot één bestand.
// 2. Genereert per route een index.html met eigen titel, beschrijving,
//    canonical en Open Graph tags, zodat zoekmachines en sociale voorbeelden
//    niet meer van JavaScript afhangen.
// Draait in de Docker bouwfase (zie Dockerfile.web); de bronmap blijft
// onaangeroerd zodat de site ook ongebundeld blijft werken tijdens ontwikkeling.
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const MAP = process.argv[2] || '.'
const PRODUCTIE_ORIGIN = 'https://poortland.be'

// Volgorde en selectie exact zoals de scripttags in index.html
let index = readFileSync(join(MAP, 'index.html'), 'utf8')
const scriptTags = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1])
const teBundelen = scriptTags.filter(s => s === '_ds_bundle.js' || s.startsWith('js/'))

// Bundelen en minifiëren (met terugval op enkel samenvoegen)
let bundel = teBundelen.map(b => readFileSync(join(MAP, b), 'utf8')).join('\n;\n')
try {
  const esbuild = await import('esbuild')
  bundel = (await esbuild.transform(bundel, { minify: true, target: 'es2017' })).code
  console.log('gebundeld en geminified:', teBundelen.length, 'bestanden')
} catch {
  console.log('esbuild niet beschikbaar; enkel samengevoegd:', teBundelen.length, 'bestanden')
}
mkdirSync(join(MAP, 'gebouwd'), { recursive: true })
writeFileSync(join(MAP, 'gebouwd', 'site.min.js'), bundel)

// In de geserveerde index vervangt één bundeltag de losse tags
let eerste = true
for (const b of teBundelen) {
  const tag = `<script src="${b}"></script>`
  index = index.replace(tag, eerste ? '<script src="/gebouwd/site.min.js"></script>' : '')
  eerste = false
}
// Alle verwijzingen absoluut maken zodat dezelfde HTML ook onder /faq/ werkt
index = index
  .replace(/src="(?!https?:|\/)/g, 'src="/')
  .replace(/href="(?!https?:|\/|#)/g, 'href="/')
writeFileSync(join(MAP, 'index.html'), index)

// Koppen per route: titels zoals de app ze zet, beschrijvingen uit het
// SEO contentdocument (Poortland contentstructuur SEO GEO).
const ROUTES = {
  '/metalen-poorten/': ['Metalen poorten op maat | Poortland Mechelen',
    'Stalen poorten op maat, klassiek of modern. Warm verzinkt, gemetalliseerd en gepoederlakt tegen roest. Draaipoort of schuifpoort uit Mechelen.'],
  '/houten-poorten/': ['Massief houten poorten op maat | Poortland Mechelen',
    'Massief houten tuinpoorten op maat in Padouk of Iroko. Enkele of dubbele draaipoort, manueel of geautomatiseerd. Warm maatwerk uit Mechelen.'],
  '/combinatie-staal-hout/': ['Poorten in hout en metaal op maat | Poortland',
    'Poorten met stalen draagstructuur en houten invulling. De sterkte van metaal met de warmte van hout, op maat uit Mechelen.'],
  '/overkappingen/': ['Overkappingen op maat | Poortland Mechelen',
    'Overkappingen op maat voor terras, oprit of tuin. Bescherming tegen regen, zon en wind, afgestemd op uw woning. Advies uit Mechelen.'],
  '/werkwijze/': ['Onze werkwijze van ontwerp tot plaatsing | Poortland',
    'Van adviesgesprek en opmeting tot productie in eigen atelier en plaatsing door eigen vakmensen. Zo werkt Poortland, stap voor stap.'],
  '/over-ons/': ['Over Poortland | vakmanschap in eigen beheer sinds 1999',
    'Poortland maakt poorten op maat in eigen atelier in Mechelen. Van ontwerp tot plaatsing met een ervaren team en een eigen showroom.'],
  '/automatisering/': ['Automatisering van poorten | Poortland Mechelen',
    'Automatische draaipoorten, schuifpoorten en garagepoorten met FAAC aandrijvingen. Parlofoon en video mogelijk. Plaatsing uit Mechelen.'],
  '/onderhoud/': ['Onderhoud van poorten | Poortland Mechelen',
    'Onderhoud, controle en herstelling van automatische poorten. Houd motor, scharnieren en bediening veilig en betrouwbaar. Service uit Mechelen.'],
  '/garantie/': ['Garantie en kwaliteit | Poortland',
    'Duidelijke garantie op lakkwaliteit, roestvorming en aandrijvingen. Poortland staat achter zijn maatwerk. Bekijk de voorwaarden.'],
  '/faq/': ['Veelgestelde vragen over poorten | Poortland',
    'Antwoorden over poorten op maat, materialen, automatisering, onderhoud en garantie bij Poortland in Mechelen.'],
  '/plaatsing-poorten/': ['Poort plaatsen op maat | Schuifpoorten en draaipoorten | Poortland',
    'Een poort laten plaatsen? Poortland zorgt voor een vakkundige plaatsing van schuifpoorten en draaipoorten, met stevige funderingen en een perfecte afwerking.'],
  '/koopjes/': ['Koopjes uit voorraad | Poortland Mechelen',
    'Poorten en overkappingen uit voorraad aan een scherpe prijs. Showmodellen en annulaties uit ons atelier in Mechelen, zolang de voorraad strekt.'],
  '/jobs/': ['Jobs bij Poortland | Mechelen',
    'Werken bij Poortland in Mechelen. Bekijk onze openstaande vacatures voor het atelier en de plaatsing, en solliciteer rechtstreeks per mail.'],
  '/contact/': ['Contact en adviesgesprek | Poortland Mechelen',
    'Contacteer Poortland in Mechelen voor advies, een offerte of service. Adres, telefoon, mail en showroom. Vraag uw prijsaanvraag aan.'],
  '/algemene-voorwaarden/': ['Algemene voorwaarden | Poortland',
    'De algemene verkoop en leveringsvoorwaarden van Poortland nv uit Mechelen.'],
  '/privacybeleid/': ['Privacybeleid | Poortland',
    'Hoe Poortland met uw persoonsgegevens omgaat: welke gegevens we verwerken, waarom en hoe lang.'],
  '/cookiebeleid/': ['Cookiebeleid | Poortland',
    'Welke cookies de website van Poortland gebruikt en hoe u uw voorkeuren beheert.']
}

const ontsmet = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
for (const [pad, [titel, beschrijving]] of Object.entries(ROUTES)) {
  const url = PRODUCTIE_ORIGIN + pad
  const kop = index
    .replace(/<title>[^<]*<\/title>/, `<title>${ontsmet(titel)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${ontsmet(beschrijving)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${ontsmet(titel)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${ontsmet(beschrijving)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  const doel = join(MAP, pad.slice(1))
  mkdirSync(doel, { recursive: true })
  writeFileSync(join(doel, 'index.html'), kop)
}
console.log('routekoppen geschreven:', Object.keys(ROUTES).length)
