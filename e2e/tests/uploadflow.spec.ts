import { expect, test } from '@playwright/test'
import { meldAan, maakLeadEnOpen } from './hulp'

// Feedback 2026-08-06, fase 3: foto-opvraag via unieke uploadlink. De medewerker
// genereert een link op de leadfiche, de klant uploadt zonder login via de
// publieke pagina, en de foto plus status verschijnen terug op de leadfiche.
test.describe('Foto-opvraag via uploadlink', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  // De uploadpagina detecteert de browsertaal; de test verwacht de Nederlandse
  // teksten, dus de testbrowser draait in het Nederlands.
  test.use({ locale: 'nl-BE' })

  // De klant krijgt de link op het websitedomein (www). Daar draait ook geen
  // service worker van de ERP-app die de navigatie zou kunnen afvangen.
  const siteUrl = (pad: string) =>
    `https://www.${new URL(process.env.E2E_BASE_URL ?? 'https://localhost').host}${pad}`

  // Kleinst mogelijke geldige PNG (1x1), voldoende voor de serverzijdige
  // inhoudsvalidatie met ImageSharp.
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

  test('link genereren, publiek uploaden en status zien veranderen', async ({ page }) => {
    const naam = `E2E Upload ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    // Startstatus: nog geen foto's
    await expect(page.getByText("Nog geen foto's", { exact: false }).first()).toBeVisible()

    // Link genereren; de token vangen we uit het API-antwoord. De mailto die
    // daarna opent negeert de headless browser vanzelf.
    const antwoord = page.waitForResponse(r =>
      r.url().includes('/uploadlink') && r.request().method() === 'POST', { timeout: 15000 })
    await page.getByRole('button', { name: /Vraag foto's aan/ }).click()
    const { token } = await (await antwoord).json() as { token: string }
    expect(token.length).toBeGreaterThan(20)

    // Status op de fiche: uploadlink verstuurd, met kopieer en intrek acties
    await expect(page.getByText('Uploadlink verstuurd')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'Kopieer link' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Link intrekken' })).toBeVisible()

    // De publieke uploadpagina laadt zonder login, op het websitedomein
    await page.goto(siteUrl(`/upload/${token}`))
    await expect(page.getByRole('heading', { name: "Foto's van de plek" })).toBeVisible()

    // Foto kiezen via de bestandsinvoer en versturen
    await page.locator('#invoerBestanden').setInputFiles({
      name: 'testfoto.png', mimeType: 'image/png', buffer: Buffer.from(pngBase64, 'base64')
    })
    await page.getByRole('button', { name: '1 foto versturen' }).click()
    await expect(page.getByText('Uw foto\'s zijn goed ontvangen')).toBeVisible({ timeout: 20000 })

    // Terug op de leadfiche: status ontvangen en de foto staat erbij.
    // Na het aanmelden landen we op het dashboard, dus eerst naar de leadinbox.
    await meldAan(page)
    await page.goto('/leads')
    await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
    await page.getByText(naam).first().click()
    await expect(page.getByText("Foto's ontvangen").first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('img[alt="testfoto.png"]')).toBeVisible()
  })

  test('een ingetrokken link is niet meer geldig', async ({ page }) => {
    const naam = `E2E UploadWeg ${Date.now()}`
    await meldAan(page)
    await maakLeadEnOpen(page, naam)

    const antwoord = page.waitForResponse(r =>
      r.url().includes('/uploadlink') && r.request().method() === 'POST', { timeout: 15000 })
    await page.getByRole('button', { name: /Vraag foto's aan/ }).click()
    const { token } = await (await antwoord).json() as { token: string }

    await expect(page.getByRole('button', { name: 'Link intrekken' })).toBeVisible()
    await page.getByRole('button', { name: 'Link intrekken' }).click()
    await expect(page.getByText("Nog geen foto's", { exact: false }).first()).toBeVisible({ timeout: 10000 })

    // De publieke pagina weigert de ingetrokken token netjes
    await page.goto(siteUrl(`/upload/${token}`))
    await expect(page.getByText('niet meer geldig')).toBeVisible({ timeout: 10000 })
  })
})
