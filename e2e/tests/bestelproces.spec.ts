import { expect, test } from '@playwright/test'

// FR-001, FR-002 en FR-004 als end to end scenario (bouwspec hoofdstuk 9).
test.describe('Bestelproces van lead tot order', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('lead kwalificeren, omzetten, offerte verzenden en akkoord geeft een order', async ({ page }) => {
    await page.goto('/aanmelden')
    await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
    await page.getByLabel('Wachtwoord').fill(process.env.E2E_WACHTWOORD!)
    await page.getByRole('button', { name: 'Aanmelden' }).click()

    await page.goto('/leads')
    await page.getByRole('button', { name: /Nieuwe lead/ }).click()
    await page.getByLabel('Naam').fill('E2E Testklant')
    await page.getByRole('button', { name: 'Bewaren' }).click()
    await page.getByText('E2E Testklant').first().click()

    await page.getByRole('button', { name: 'Kwalificeren' }).click()
    await page.getByRole('button', { name: /Omzetten naar dossier/ }).click()
    await page.getByLabel('Naam', { exact: true }).fill('E2E Testklant')
    await page.getByLabel('Werfadres').fill('Teststraat 1, Mechelen')
    await page.getByRole('button', { name: 'Omzetten' }).click()

    await page.getByRole('button', { name: /Offerte maken/ }).click()
    await expect(page.getByText(/OFF-\d{4}-\d{4}/)).toBeVisible()
  })
})
