import { expect, test } from '@playwright/test'
import { meldAan, maakLeadEnOpen } from './hulp'

// Aanvulling op bestelproces.spec.ts: de levenscyclus van een lead binnen het ERP.
// Dekt bewerken, archiveren met herstellen, en definitief verwijderen.
// Elke test maakt een eigen verse lead aan zodat ze onafhankelijk draaien.
// De gedeelde helpers uit hulp.ts vullen ook de verplichte velden (email,
// telefoon) in; lokale kopieen liepen daar eerder op vast.
test.describe('Leadbeheer: bewerken, archiveren en verwijderen', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('een lead bewerken', async ({ page }) => {
    const naam = `E2E Bewerk ${Date.now()}`
    const nieuw = `${naam} GEWIJZIGD`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    // Het potloodicoon (aria-label Bewerken) opent de bewerkmodal
    await page.getByRole('button', { name: 'Bewerken' }).first().click()
    const bewerk = page.getByRole('dialog', { name: 'Lead bewerken' })
    await expect(bewerk).toBeVisible()
    await bewerk.getByLabel('Naam', { exact: true }).fill(nieuw)
    await bewerk.getByRole('button', { name: 'Opslaan' }).click()

    // De gewijzigde naam staat op de fiche
    await expect(page.getByText(nieuw).first()).toBeVisible()
  })

  test('een lead archiveren en herstellen', async ({ page }) => {
    const naam = `E2E Archief ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    await page.getByRole('button', { name: 'Archiveren' }).click()
    await expect(page.getByText(/staat in het archief/)).toBeVisible()

    await page.getByRole('button', { name: 'Herstellen' }).click()
    await expect(page.getByText(/staat in het archief/)).toHaveCount(0)
  })

  test('een lead verwijderen', async ({ page }) => {
    const naam = `E2E Verwijder ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    // Verwijderen in de kop opent een bevestigingsvenster
    await page.getByRole('button', { name: 'Verwijderen', exact: true }).click()
    const bevestig = page.getByRole('dialog', { name: 'Lead verwijderen?' })
    await expect(bevestig).toBeVisible()
    // Vang het echte DELETE-antwoord zodat een falen zichzelf verklaart
    const antwoord = page.waitForResponse(r =>
      /\/api\/v1\/leads\/[0-9a-f-]+$/.test(r.url()) && r.request().method() === 'DELETE', { timeout: 15000 }
    ).catch(() => null)
    await bevestig.getByRole('button', { name: 'Verwijderen' }).click()
    const resp = await antwoord
    if (!resp) throw new Error('Na de bevestiging vertrok er geen DELETE naar /api/v1/leads/{id}.')
    if (!resp.ok()) throw new Error(`DELETE gaf HTTP ${resp.status()}: ${(await resp.text()).slice(0, 300)}`)

    // Eerlijke controle (geen vals groen op een nog ladende lijst): zoek op de
    // exacte naam, wacht tot de zoekopdracht echt bij de server geweest is en eis
    // dat de naam nergens meer voorkomt. Op "Geen resultaten" rekenen kan niet:
    // de zoekfunctie matcht ook oudere E2E-leads met gelijkaardige namen.
    await expect(async () => {
      await page.goto('/leads')
      const gezocht = page.waitForResponse(r => r.url().includes('/api/v1/leads')
        && decodeURIComponent(r.url().replace(/\+/g, '%20')).includes(naam), { timeout: 8000 })
      await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
      await gezocht
      await expect(page.getByText(naam)).toHaveCount(0)
    }).toPass({ timeout: 20000 })
  })
})
