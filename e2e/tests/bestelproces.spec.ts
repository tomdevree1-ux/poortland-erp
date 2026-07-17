import { expect, test } from '@playwright/test'

// FR-001, FR-002, FR-004, FR-007 en FR-008 als end to end scenario.
// Volgt de huidige flow: een lead wordt DIRECT omgezet (geen kwalificatiestap),
// het omzetvenster heeft twee tegels en een gesplitst werfadres, en het dossier
// heeft het tabblad Productie met stuklijst en behandelingsketen.
test.describe('Kernflow van lead tot productie', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')

  test('lead omzetten, offerte maken en stuklijst starten', async ({ page }) => {
    const uniek = `E2E ${Date.now()}`

    await page.goto('/aanmelden')
    await page.getByLabel('Email').fill(process.env.E2E_EMAIL!)
    await page.getByLabel('Wachtwoord').fill(process.env.E2E_WACHTWOORD!)
    await page.getByRole('button', { name: 'Aanmelden' }).click()
    await expect(page.getByText('Leads')).toBeVisible()

    // Nieuwe lead met de volledige veldenset (klanttype, adres in delen)
    await page.goto('/leads')
    await page.getByRole('button', { name: /Nieuwe lead/ }).click()
    await page.getByLabel('Voornaam').fill('Test')
    await page.getByLabel('Naam', { exact: true }).fill(uniek)
    await page.getByLabel('Straat en huisnummer').fill('Teststraat 1')
    await page.getByLabel('Postcode').fill('2800')
    await page.getByLabel('Stad of gemeente').fill('Mechelen')
    await page.getByRole('button', { name: 'Bewaren' }).click()

    // Fiche toont voornaam en naam als aparte regels (gegevensregel)
    await page.getByText(uniek).first().click()
    await expect(page.getByText('Voornaam')).toBeVisible()

    // Direct omzetten zonder kwalificatiestap; nieuwe klant staat vooraf ingevuld
    await page.getByRole('button', { name: /Omzetten naar dossier/ }).click()
    await expect(page.getByRole('button', { name: 'Nieuwe klant aanmaken' })).toBeVisible()

    // Werfadres overnemen uit de klantgegevens en omzetten
    await page.getByRole('button', { name: 'Neem klantadres over' }).click()
    await page.getByRole('button', { name: 'Omzetten', exact: true }).click()

    // Het dossier opent met een dossiernummer en de offerte kan gemaakt worden
    await expect(page.getByText(/Dossier \d+/)).toBeVisible()
    await page.getByRole('button', { name: /Offerte maken/ }).click()
    await expect(page.getByText(/OFF-\d{4}-\d{4}/)).toBeVisible()

    // Terug naar het dossier voor de productieflow (FR-007 en FR-008)
    await page.getByRole('button', { name: 'Terug' }).click()
    await page.getByRole('button', { name: 'Productie' }).click()
    await page.getByRole('button', { name: 'Stuklijst starten' }).click()
    await page.getByRole('button', { name: 'Onderdeel toevoegen' }).click()
    await page.getByLabel('Productcode').fill('E2E-100')
    await page.getByRole('button', { name: 'Opslaan' }).click()
    await expect(page.getByText('E2E-100')).toBeVisible()
    await expect(page.getByText('Besteld')).toBeVisible()

    // Volgende stap in de behandelingsketen: besteld naar in productie
    await page.getByRole('button', { name: /In productie/ }).click()
    await expect(page.getByText('In productie').first()).toBeVisible()
  })
})

// FR-001: het publieke webformulier maakt een lead aan zonder login.
// Draait rechtstreeks tegen de API (same origin op staging).
test.describe('Webformulier leadcaptatie', () => {
  test.skip(!process.env.E2E_API_URL, 'Zet E2E_API_URL (bv. https://www.STAGING/api) om deze test te draaien')

  test('contactformulier levert een lead met gescheiden voornaam en naam', async ({ request }) => {
    const uniek = `e2e-${Date.now()}@poortland.local`
    const antwoord = await request.post(`${process.env.E2E_API_URL}/v1/leads/webformulier`, {
      multipart: {
        soort: 'contact',
        voornaam: 'End',
        naam: 'ToEnd',
        email: uniek,
        telefoon: '+32000000000',
        straat: 'Teststraat 1',
        typeAanvraag: 'poorten',
        gewensteTiming: 'zo-snel',
        vraag: 'E2E verificatie van de leadflow',
        privacyAkkoord: 'true'
      }
    })
    expect(antwoord.ok()).toBeTruthy()
    const json = await antwoord.json()
    expect(json.boodschap).toContain('Bedankt')
  })
})
