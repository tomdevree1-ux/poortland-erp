import { expect, test } from '@playwright/test'

// LOGIN-01 tot LOGIN-05 (bouwspec hoofdstuk 5). Vereist E2E_EMAIL en E2E_WACHTWOORD.
test.describe('Loginmodule', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('aanmelden toont het dashboard voor een actieve medewerker', async ({ page }) => {
    await page.goto('/aanmelden')
    await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
    await page.getByLabel('Wachtwoord').fill(process.env.E2E_WACHTWOORD!)
    await page.getByRole('button', { name: 'Aanmelden' }).click()
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('zonder sessie gaat elke pagina naar aanmelden', async ({ page }) => {
    await page.goto('/dossiers')
    await expect(page).toHaveURL(/aanmelden/)
  })
})
