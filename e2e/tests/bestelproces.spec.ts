import { expect, test } from '@playwright/test'
import { meldAan, maakLeadEnOpen } from './hulp'

// FR-001, FR-002, FR-004, FR-007 en FR-008 als end to end scenario.
// Volgt de huidige flow: een lead wordt DIRECT omgezet (geen kwalificatiestap),
// het omzetvenster heeft twee tegels en een gesplitst werfadres, en het dossier
// heeft het tabblad Productie met stuklijst en behandelingsketen.
test.describe('Kernflow van lead tot productie', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  // De omzetmodal is lang; een hoog venster zorgt dat de knoppen binnen beeld vallen
  // ook op de huidige uitrol (waar de modal nog geen eigen scroll heeft).
  test.use({ viewport: { width: 1280, height: 1400 } })

  test('lead omzetten, offerte maken en stuklijst starten', async ({ page }) => {
    const uniek = `E2E ${Date.now()}`

    // Login en een verse lead aanmaken via de gedeelde helper (dialooggebonden
    // selectors, betrouwbaar onder parallelle uitvoering)
    await meldAan(page)
    await maakLeadEnOpen(page, uniek)
    await expect(page.getByText('Voornaam')).toBeVisible()

    // Direct omzetten zonder kwalificatiestap; nieuwe klant staat vooraf ingevuld
    await page.getByRole('button', { name: /Dossier aanmaken/ }).click()
    await expect(page.getByRole('button', { name: 'Nieuwe klant aanmaken' })).toBeVisible()

    // Werfadres overnemen uit de klantgegevens en omzetten
    await page.getByRole('button', { name: 'Neem klantadres over' }).click()
    await page.getByRole('button', { name: 'Omzetten', exact: true }).click()

    // Het dossier opent met een dossiernummer en de offerte kan gemaakt worden
    await expect(page.getByText(/Dossier \d+/)).toBeVisible()
    // Vang de POST naar het offerte-endpoint op om status en foutmelding te zien.
    const offerteResp = page.waitForResponse(
      r => /\/projecten\/[^/]+\/offertes(\?|$)/.test(r.url()) && r.request().method() === 'POST',
      { timeout: 16000 }
    ).catch(() => null)
    await page.getByRole('button', { name: /Offerte maken/ }).click()
    const resp = await offerteResp
    if (!resp) throw new Error('Na de klik op "Offerte maken" vertrok er geen POST naar /projecten/.../offertes. De knop startte geen aanvraag.')
    if (!resp.ok()) throw new Error(`POST offertes gaf HTTP ${resp.status()}: ${(await resp.text()).slice(0, 400)}`)

    await page.waitForURL(/\/offertes\//, { timeout: 15000 })
    await expect(page.getByText(/OFF-\d{4}-\d{4}/)).toBeVisible({ timeout: 15000 })

    // Terug naar het dossier voor de productieflow (FR-007 en FR-008)
    await page.getByRole('button', { name: 'Terug' }).click()
    await page.getByRole('button', { name: 'Productie' }).click()
    await page.getByRole('button', { name: 'Stuklijst starten' }).click()
    await page.getByRole('button', { name: 'Onderdeel toevoegen' }).click()
    const onderdeel = page.getByRole('dialog', { name: 'Onderdeel toevoegen' })
    await onderdeel.getByLabel('Productcode').fill('E2E-100')
    await onderdeel.getByRole('button', { name: 'Opslaan' }).click()
    await expect(page.getByText('E2E-100')).toBeVisible()
    await expect(page.getByText('Besteld')).toBeVisible()

    // Een stap verder in de behandelingsketen; welke stap ook volgt, de status
    // mag niet meer op Besteld staan (de keten loopt door).
    await page.getByRole('button', { name: /→/ }).first().click()
    await expect(page.getByText('Besteld')).toHaveCount(0)
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
