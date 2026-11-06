import { expect, test } from '@playwright/test'
import { meldAan } from './hulp'

// UAT-05: de planning heeft vier weergaves die dezelfde planning tonen.
test.describe('Planning: weergaves', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('wisselen tussen week, planbord, maand en vandaag', async ({ page }) => {
    await meldAan(page)
    await page.goto('/planning')
    await expect(page.getByRole('heading', { name: 'Planning' })).toBeVisible()

    for (const label of ['Week', 'Planbord', 'Maand', 'Vandaag']) {
      const knop = page.getByRole('button', { name: label, exact: true })
      await knop.click()
      // De actieve weergaveknop krijgt de bronzen markering
      await expect(knop).toHaveClass(/bg-bronze-500/)
    }
  })
})
