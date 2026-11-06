import { expect, test } from '@playwright/test'
import { meldAan } from './hulp'

// Dwarscontroles uit het UAT-draaiboek die over de hele app gelden.
test.describe('Dwarscontroles', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('de terugknop gaat exact een pagina terug', async ({ page }) => {
    await meldAan(page)
    await page.goto('/leads')
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible()
    await page.goto('/klanten')
    await expect(page.getByRole('heading', { name: 'Klanten' })).toBeVisible()

    await page.getByRole('button', { name: 'Terug' }).click()
    await expect(page).toHaveURL(/\/leads(\/)?$/)
    await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible()
  })

  test('de zijbalk toont de kernmodules', async ({ page }) => {
    await meldAan(page)
    for (const module of ['Leads', 'Dossiers', 'Klanten', 'Planning', 'Service']) {
      await expect(page.getByRole('link', { name: module, exact: true })).toBeVisible()
    }
  })
})
