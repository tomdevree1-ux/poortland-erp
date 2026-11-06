import { expect, test } from '@playwright/test'
import { meldAan, maakLeadEnOpen } from './hulp'

// UAT-02 en dwarscontrole: een lead wordt een klant via de omzetting, en de
// klantgegevens zijn achteraf bewerkbaar op de klantfiche.
test.describe('Klanten: omzetten en bewerken', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  // De omzetmodal is lang; hoog venster zodat de knoppen in beeld vallen.
  test.use({ viewport: { width: 1280, height: 1400 } })

  test('lead omzetten naar nieuwe klant en de fiche bewerken', async ({ page }) => {
    const naam = `E2E Klant ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    // Omzetten naar een nieuwe klant (standaardkeuze) met het klantadres als werf
    await page.getByRole('button', { name: /Dossier aanmaken/ }).click()
    const omzet = page.getByRole('dialog', { name: 'Omzetten naar klant en dossier' })
    await expect(omzet).toBeVisible()
    await omzet.getByRole('button', { name: 'Neem klantadres over' }).click()
    await omzet.getByRole('button', { name: 'Omzetten', exact: true }).click()
    await expect(page.getByText(/Dossier \d+/)).toBeVisible()

    // Klantfiche opzoeken in de klantenlijst
    await page.goto('/klanten')
    await page.getByPlaceholder('Zoek naam, gemeente of email…').fill(naam)
    await page.getByText(naam).first().click()
    await expect(page.getByText('Klantfiche')).toBeVisible()

    // Gegevens bewerken via het potlood en de wijziging controleren
    await page.getByRole('button', { name: 'Bewerken' }).first().click()
    const bewerk = page.getByRole('dialog', { name: 'Klantgegevens bewerken' })
    await expect(bewerk).toBeVisible()
    await bewerk.getByLabel('Telefoon').fill('0499 00 11 22')
    await bewerk.getByRole('button', { name: 'Opslaan' }).click()
    await expect(page.getByText('0499 00 11 22')).toBeVisible()
  })
})
