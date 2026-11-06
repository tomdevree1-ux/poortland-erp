import { expect, test } from '@playwright/test'

// FR-015 (service en nazorg) en FR-016 (rapportering) plus rooktests voor de
// veld en facturatiepagina's. Vereist dat migraties 0029 tot 0031 toegepast
// zijn; zonder die tabellen falen de service en facturatiescenario's.

async function meld(page: import('@playwright/test').Page) {
  await page.goto('/aanmelden')
  await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
  await page.getByLabel('Wachtwoord').fill(process.env.E2E_WACHTWOORD!)
  await page.getByRole('button', { name: 'Aanmelden' }).click()
  await expect(page.getByRole('link', { name: 'Leads', exact: true })).toBeVisible()
}

test.describe('Service en nazorg', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('melding aanmaken met garantietoets en inplannen', async ({ page }) => {
    await meld(page)
    await page.goto('/service')
    await expect(page.getByRole('button', { name: 'Nieuwe melding' })).toBeVisible()

    await page.getByRole('button', { name: 'Nieuwe melding' }).click()
    const zoekveld = page.getByPlaceholder('Zoek op naam, adres of telefoon')
    await expect(zoekveld).toBeVisible()

    // Eerste beschikbare klant kiezen; zonder klanten stopt de test netjes.
    const eersteKlant = page.locator('.max-h-56 button').first()
    try {
      await eersteKlant.waitFor({ timeout: 5000 })
    } catch {
      test.skip(true, 'Geen klanten op deze omgeving om een servicemelding voor te maken')
    }
    await eersteKlant.click()

    await page.getByLabel('Klacht of vraag').fill('E2E servicemelding: poort sluit niet volledig')
    await page.getByLabel('Gewenste datum').fill('2026-08-03')
    await page.getByRole('button', { name: 'Melden' }).click()

    // De melding staat in de lijst met een garantiebadge (binnen of buiten).
    const kaart = page.getByText('E2E servicemelding: poort sluit niet volledig').first()
    await expect(kaart).toBeVisible()
    await expect(page.getByText(/(Binnen|Buiten) garantie/).first()).toBeVisible()

    // Inplannen: gemeld wordt ingepland.
    await kaart.click()
    await page.getByLabel('Geplande datum').fill('2026-08-03')
    await page.getByRole('button', { name: 'Inplannen' }).click()
    await expect(page.getByText('Ingepland').first()).toBeVisible()
  })
})

test.describe('Rapportering op het dashboard', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('dashboard toont de rapporten', async ({ page }) => {
    await meld(page)
    await page.goto('/')
    await expect(page.getByText('Omzet per maand', { exact: false })).toBeVisible()
    await expect(page.getByText('Leadconversie')).toBeVisible()
    await expect(page.getByText('Orders per status')).toBeVisible()
    await expect(page.getByText('Doorlooptijd offerte')).toBeVisible()
  })
})

test.describe('Veld en facturatie rooktest', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('veldpagina en facturatiepagina laden', async ({ page }) => {
    await meld(page)
    await page.goto('/veld')
    await expect(page.getByText(/werkbon/i).first()).toBeVisible()

    await page.goto('/facturatie')
    await expect(page.getByText('Factuurklare dossiers')).toBeVisible()
    await expect(page.getByText('Factuurvoorstellen')).toBeVisible()
  })
})
