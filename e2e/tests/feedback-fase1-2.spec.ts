import { expect, test } from '@playwright/test'
import { meldAan, maakLeadEnOpen } from './hulp'

// Feedbackpunten 2026-08-06: contactpersonen bij een lead die meereizen naar de
// klant, de archiveer-keuze bij het verwijderen van een klant met dossiers, en de
// nieuwe dossierkolommen.
test.describe('Feedback fase 1 en 2', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  // De omzetmodal is lang; hoog venster zodat de knoppen in beeld vallen.
  test.use({ viewport: { width: 1280, height: 1400 } })

  test('contactpersoon bij lead reist mee naar de klantfiche', async ({ page }) => {
    const naam = `E2E Contact ${Date.now()}`
    const contactNaam = `Persoon${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    // Contactpersoon toevoegen op de leadfiche, aangeduid als offerte-ontvanger
    await page.getByRole('button', { name: 'Toevoegen', exact: true }).click()
    const modal = page.getByRole('dialog', { name: 'Contactpersoon toevoegen' })
    await expect(modal).toBeVisible()
    await modal.getByLabel('Voornaam').fill('Test')
    await modal.getByLabel('Naam', { exact: true }).fill(contactNaam)
    await modal.getByLabel('Telefoon').fill('0471 11 22 33')
    await modal.getByLabel('Email').fill(`contact.${Date.now()}@poortland.local`)
    await modal.getByText('Deze persoon ontvangt de offerte').click()
    await modal.getByRole('button', { name: 'Bewaren' }).click()
    await expect(page.getByText(contactNaam)).toBeVisible()
    await expect(page.getByText('Ontvangt offerte')).toBeVisible()

    // Omzetten naar een klant
    await page.getByRole('button', { name: /Dossier aanmaken/ }).click()
    const omzet = page.getByRole('dialog', { name: 'Omzetten naar klant en dossier' })
    await omzet.getByRole('button', { name: 'Neem klantadres over' }).click()
    await omzet.getByRole('button', { name: 'Omzetten', exact: true }).click()
    await expect(page.getByText(/Dossier \d+/)).toBeVisible()

    // De contactpersoon staat nu ook op de klantfiche
    await page.goto('/klanten')
    await page.getByPlaceholder('Zoek naam, gemeente of email…').fill(naam)
    await page.getByText(naam).first().click()
    await expect(page.getByText('Klantfiche')).toBeVisible()
    await expect(page.getByText(contactNaam)).toBeVisible()
    await expect(page.getByText('Ontvangt offerte')).toBeVisible()
    // En de herkomst van de aanvraag is raadpleegbaar
    await expect(page.getByText('Oorspronkelijke aanvraag').first()).toBeVisible()
  })

  test('extra contactpersoon meegeven bij het aanmaken van een lead', async ({ page }) => {
    const naam = `E2E MetContact ${Date.now()}`
    const contactNaam = `Meteen${Date.now()}`
    await meldAan(page)

    // Nieuwe lead met een extra contactpersoon rechtstreeks in het aanmaakvenster
    await page.goto('/leads')
    await page.getByRole('button', { name: /Nieuwe lead/ }).click()
    const modal = page.getByRole('dialog', { name: 'Nieuwe lead' })
    await modal.getByLabel('Voornaam').fill('Test')
    await modal.getByLabel('Naam', { exact: true }).fill(naam)
    await modal.getByLabel('Email').fill(`e2e.${Date.now()}@poortland.local`)
    await modal.getByLabel('Telefoon').fill('0470 00 00 00')
    await modal.getByLabel('Straat en huisnummer').fill('Teststraat 1')
    await modal.getByRole('button', { name: '+ Contactpersoon' }).click()
    // De persoonvelden staan in het omkaderde blok onderaan; de labels Naam en
    // Email bestaan nu twee keer, dus we mikken op de laatste (het persoonblok).
    await modal.getByLabel('Naam', { exact: true }).last().fill(contactNaam)
    await modal.getByLabel('Telefoon').last().fill('0471 99 88 77')
    await modal.getByText('Deze persoon ontvangt de offerte').click()
    await modal.getByRole('button', { name: 'Bewaren' }).click()
    await expect(modal).toBeHidden({ timeout: 15000 })

    // Op de leadfiche staat de contactpersoon er meteen bij
    await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
    await page.getByText(naam).first().click()
    await expect(page.getByText(contactNaam)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Ontvangt offerte')).toBeVisible()
  })

  test('klant met dossier verwijderen vraagt om de dossiers mee te archiveren', async ({ page }) => {
    const naam = `E2E KlantWeg ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)
    await page.getByRole('button', { name: /Dossier aanmaken/ }).click()
    const omzet = page.getByRole('dialog', { name: 'Omzetten naar klant en dossier' })
    await omzet.getByRole('button', { name: 'Neem klantadres over' }).click()
    await omzet.getByRole('button', { name: 'Omzetten', exact: true }).click()
    await expect(page.getByText(/Dossier \d+/)).toBeVisible()

    // Naar de klantfiche en verwijderen
    await page.goto('/klanten')
    await page.getByPlaceholder('Zoek naam, gemeente of email…').fill(naam)
    await page.getByText(naam).first().click()
    await page.getByRole('button', { name: 'Verwijderen', exact: true }).click()
    const bevestig = page.getByRole('dialog', { name: 'Klant verwijderen?' })
    await expect(bevestig).toBeVisible()

    // Zonder vinkje blijft de knop geblokkeerd; met vinkje gaat alles in een keer
    await expect(bevestig.getByRole('button', { name: 'Verwijderen' })).toBeDisabled()
    await bevestig.getByText(/Archiveer .* mee/).click()
    await bevestig.getByRole('button', { name: 'Verwijderen' }).click()
    await page.waitForURL(/\/klanten(\/)?$/, { timeout: 15000 })
  })

  test('dossierlijst toont de kolommen Adres en Telefoon', async ({ page }) => {
    await meldAan(page)
    await page.goto('/dossiers')
    for (const kop of ['Nr', 'Klant', 'Adres', 'Telefoon', 'Status', 'Waarde']) {
      await expect(page.getByRole('columnheader', { name: kop, exact: true })).toBeVisible()
    }
  })
})
