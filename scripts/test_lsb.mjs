// Test van de vinkjesregels in het globaal overzicht (frontend/src/paginas/dossier/lsb.ts).
// Draaien vanuit erp/frontend:  node ../scripts/test_lsb.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'

const hier = dirname(fileURLToPath(import.meta.url))
const bron = join(hier, '../frontend/src/paginas/dossier/lsb.ts')
const require = createRequire(join(process.cwd(), 'package.json'))
const { transformSync } = require('esbuild')
const js = transformSync(readFileSync(bron, 'utf8'), { loader: 'ts', format: 'esm' }).code
const { lsbKolommen, opKolom, kiesKolom } = await import('data:text/javascript,' + encodeURIComponent(js))

let ok = 0, fout = 0
const is = (naam, a, b) => {
  const g = JSON.stringify(a) === JSON.stringify(b)
  g ? ok++ : fout++
  console.log(`${g ? 'OK  ' : 'FOUT'} ${naam}${g ? '' : `: kreeg ${JSON.stringify(a)}, verwacht ${JSON.stringify(b)}`}`)
}

const k1 = lsbKolommen(1)
is('een plaatsing: vier kolommen, plaatsing laatst', k1.map(k => k.titel), ['Automatisatie', 'Herstelling', 'Onderhoud', 'Plaatsing'])
const k3 = lsbKolommen(3)
is('drie plaatsingen genummerd achteraan', k3.slice(3).map(k => k.titel), ['Plaatsing 1', 'Plaatsing 2', 'Plaatsing 3'])
is('nul plaatsingen geeft er toch een', lsbKolommen(0).length, 4)

const leeg = { lsbType: null, lsbPlaatsingNummer: null }
const auto = k3[0], p2 = k3[4], p3 = k3[5]
is('vinkje zetten op automatisatie', kiesKolom(leeg, auto), { lsbType: 'automatisatie', lsbPlaatsingNummer: null })
is('vinkje op plaatsing 2 bewaart het nummer', kiesKolom(leeg, p2), { lsbType: 'plaatsing', lsbPlaatsingNummer: 2 })
const opP2 = { lsbType: 'plaatsing', lsbPlaatsingNummer: 2 }
is('van plaatsing 2 naar plaatsing 3 verhuist het vinkje', kiesKolom(opP2, p3), { lsbType: 'plaatsing', lsbPlaatsingNummer: 3 })
is('van plaatsing naar automatisatie wist het nummer', kiesKolom(opP2, auto), { lsbType: 'automatisatie', lsbPlaatsingNummer: null })
is('zelfde vinkje opnieuw: geen LSB meer', kiesKolom(opP2, p2), leeg)
is('regel op plaatsing 2 staat niet op plaatsing 3', opKolom(opP2, p3), false)
is('regel zonder LSB staat nergens aangevinkt', k3.some(k => opKolom(leeg, k)), false)
is('precies een vinkje per regel', k3.filter(k => opKolom(opP2, k)).length, 1)

console.log(`\n${ok} op ${ok + fout}`)
process.exit(fout ? 1 : 0)
