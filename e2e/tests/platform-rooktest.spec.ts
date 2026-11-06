import { expect, test } from '@playwright/test'
import { meldAan } from './hulp'

// Platformbrede rooktest: na een enkele login bezoekt de test elke hoofdpagina en
// bevestigt dat de paginakop verschijnt. Zo vangen we witte schermen, crashes en
// ontbrekende migraties (veld, service, facturatie) meteen op.
// [route, soort anker, ankertekst]. 'kop' = de h1 titel, 'eyebrow' = de bovenregel.
const paginas: [string, 'kop' | 'eyebrow', string][] = [
  ['/', 'kop', 'Dashboard'],
  ['/leads', 'kop', 'Leads'],
  ['/dossiers', 'kop', 'Dossiers'],
  ['/klanten', 'kop', 'Klanten'],
  ['/werkschema', 'eyebrow', 'Persoonlijk · opvolging'],
  ['/planning', 'kop', 'Planning'],
  ['/veld', 'kop', 'Veld'],
  ['/service', 'kop', 'Service'],
  ['/facturatie', 'kop', 'Facturatie'],
  ['/website', 'kop', 'Website'],
  ['/beheer', 'kop', 'Medewerkers'],
]

test.describe('Platform rooktest: elke hoofdpagina laadt', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('alle hoofdpaginas tonen hun paginakop', async ({ page }) => {
    await meldAan(page)
    for (const [route, soort, anker] of paginas) {
      await page.goto(route)
      const loc = soort === 'kop'
        ? page.getByRole('heading', { name: anker, exact: true })
        : page.getByText(anker, { exact: true })
      await expect(loc.first(), `pagina ${route} laadt met anker "${anker}"`).toBeVisible({ timeout: 12000 })
    }
  })
})
