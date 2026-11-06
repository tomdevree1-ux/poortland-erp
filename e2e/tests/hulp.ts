import { expect, type Page } from '@playwright/test'

// Gedeelde login voor de UAT-suites. Vereist E2E_EMAIL en E2E_WACHTWOORD.
export async function meldAan(page: Page) {
  await page.goto('/aanmelden')
  await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
  await page.getByLabel('Wachtwoord').fill(process.env.E2E_WACHTWOORD!)
  await page.getByRole('button', { name: 'Aanmelden' }).click()
  // Slaagt de login niet, toon dan de echte foutmelding van het aanmeldscherm in
  // plaats van een stille timeout (bv. verkeerde inloggegevens in E2E_WACHTWOORD).
  try {
    await expect(page.getByRole('link', { name: 'Leads', exact: true })).toBeVisible({ timeout: 8000 })
  } catch {
    const zichtbaar = (await page.locator('body').innerText()).replace(/\n{2,}/g, ' | ').slice(0, 300)
    throw new Error(`Aanmelden mislukte (controleer E2E_EMAIL en E2E_WACHTWOORD). Scherm toont: ${zichtbaar}`)
  }
}

// Maakt een verse lead aan vanuit de leadinbox en opent de fiche.
export async function maakLeadEnOpen(page: Page, naam: string) {
  await page.goto('/leads')
  await page.getByRole('button', { name: /Nieuwe lead/ }).click()
  const modal = page.getByRole('dialog', { name: 'Nieuwe lead' })
  await modal.getByLabel('Voornaam').fill('Test')
  await modal.getByLabel('Naam', { exact: true }).fill(naam)
  // Verplichte minimumvelden (zelfde regels als het websiteformulier)
  await modal.getByLabel('Email').fill(`e2e.${Date.now()}@poortland.local`)
  await modal.getByLabel('Telefoon').fill('0470 00 00 00')
  await modal.getByLabel('Straat en huisnummer').fill('Teststraat 1')
  await modal.getByLabel('Postcode').fill('2800')
  await modal.getByLabel('Stad of gemeente').fill('Mechelen')
  await modal.getByRole('button', { name: 'Bewaren' }).click()
  // Wacht tot het venster echt dicht is: zolang de overlay er staat vangt die de
  // klik op de leadnaam af (de flaky onder parallelle last).
  await expect(modal).toBeHidden({ timeout: 15000 })
  // Zoek de nieuwe lead op zodat ze zeker in de lijst staat, ook onder parallelle
  // uitvoering waar de inbox veel leads bevat.
  await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
  await page.getByText(naam).first().click()
  await expect(page.getByText(naam).first()).toBeVisible()
}
