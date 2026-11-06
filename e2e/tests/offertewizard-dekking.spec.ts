import { expect, test, type Locator, type Page } from '@playwright/test'
import { meldAan } from './hulp'

/* Bredere dekking van de offertewizard, als aanvulling op offertewizard.spec.ts
   (dat één volledig poortpad van begin tot eind volgt). Hier bewaken we:
   - de drie andere diensten: overkapping, automatisering en onderhoud
   - elke keuzeknop van de poortenflow minstens één keer aangeklikt
   - randgevallen: leeg formulier, deselecteren, terugbladeren, bedrijf met btw
     nummer en de schuifpoorttak van het bovenaanzicht */

const siteUrl = (pad: string) =>
  `https://www.${new URL(process.env.E2E_BASE_URL ?? 'https://localhost').host}${pad}`

// Mikken op data-veld in plaats van op zichtbare tekst: labels dragen een
// sterretje en dezelfde optienaam bestaat links én rechts van de poort.
const veld = (modal: Locator, sleutel: string) => modal.locator(`[data-veld="${sleutel}"]`)
// Sommige knoppen dragen een subtitel, bijvoorbeeld 'Stalen poort (staal en
// cortenstaal)'. We matchen daarom op het begin van de naam.
const knopNaam = (tekst: string) =>
  new RegExp('^' + tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '( \\(.*\\))?$')
const kies = (modal: Locator, sleutel: string, tekst: string) =>
  veld(modal, sleutel).getByRole('button', { name: knopNaam(tekst) }).click()
const vul = (modal: Locator, sleutel: string, waarde: string) =>
  veld(modal, sleutel).locator('input, textarea').first().fill(waarde)
const volgende = (modal: Locator) => modal.getByRole('button', { name: 'Volgende' }).click()

// De site kan een popup tonen die door het ERP beheerd wordt (bijvoorbeeld
// afwijkende openingsuren). Die verschijnt pas nadat de inhoud geladen is en
// vangt daarna kliks af, dus we wachten er kort op en sluiten ze.
async function sluitPopup(page: Page) {
  const popup = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: 'Sluiten' }) }).first()
  try {
    await popup.waitFor({ state: 'visible', timeout: 4000 })
    await popup.getByRole('button', { name: 'Sluiten' }).click()
    await popup.waitFor({ state: 'hidden', timeout: 5000 })
  } catch {
    // Geen popup actief: niets te doen.
  }
}

// Opent de wizard op de startstap.
async function openWizard(page: Page) {
  await page.goto(siteUrl('/'))
  await sluitPopup(page)
  await page.getByRole('button', { name: /Vraag (een|uw) prijsraming aan/i })
    .or(page.getByRole('link', { name: /Vraag (een|uw) prijsraming aan/i })).first().click()
  // Op naam, zodat een popup van de site niet als wizard wordt gezien.
  const modal = page.getByRole('dialog', { name: 'Prijsraming aanvragen' })
  await expect(modal.getByRole('heading', { name: 'Waarvoor wenst u een prijsraming aan te vragen?' })).toBeVisible()
  return modal
}

// Het model is verplicht bij een poortaanvraag; we nemen het eerste uit de lijst.
async function kiesEersteModel(modal: Locator) {
  await modal.locator('[data-modellijst] > button').click()
  const eerste = modal.locator('[data-modellijst] [role="listbox"] button').first()
  const naam = (await eerste.innerText()).trim()
  await eerste.click()
  return naam
}

// Vult de laatste stap in en verstuurt. Geeft de statuscode terug.
async function verstuur(page: Page, modal: Locator, naam: string, bedrijf?: { naam: string; btw: string }) {
  await expect(modal.getByRole('heading', { name: 'Uw gegevens' })).toBeVisible()
  if (bedrijf) {
    await modal.getByRole('button', { name: 'Bedrijf', exact: true }).click()
    await vul(modal, 'bedrijfsnaam', bedrijf.naam)
    await vul(modal, 'btwNummer', bedrijf.btw)
  }
  await vul(modal, 'voornaam', 'Test')
  await vul(modal, 'naam', naam)
  await vul(modal, 'email', `e2e.${Date.now()}@poortland.local`)
  await vul(modal, 'telefoon', '0470 00 00 00')
  await vul(modal, 'adres', 'Teststraat 1')
  await vul(modal, 'postcode', '2800')
  await vul(modal, 'stad', 'Mechelen')
  const heen = page.waitForResponse(r =>
    r.url().includes('/leads/webformulier') && r.request().method() === 'POST', { timeout: 20000 })
  await modal.getByRole('button', { name: /Prijsraming aanvragen/ }).click()
  const antwoord = await heen
  await expect(modal.getByRole('heading', { name: 'Bedankt voor uw aanvraag' })).toBeVisible({ timeout: 15000 })
  return antwoord.status()
}

// Haalt de wizardvelden van een lead op via de leadfiche.
async function leesWizard(page: Page, naam: string) {
  await meldAan(page)
  await page.goto('/leads')
  await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
  const fiche = page.waitForResponse(r =>
    /\/api\/v1\/leads\/[0-9a-f-]+$/.test(r.url()) && r.request().method() === 'GET', { timeout: 20000 })
  await page.getByText(naam).first().click()
  const lead = await fiche.then(r => r.json())
  const velden: Record<string, string> = {}
  if (lead?.wizardGegevens) {
    const data = JSON.parse(lead.wizardGegevens) as { stappen: { velden: { label: string; waarde: string }[] }[] }
    data.stappen.flatMap(s => s.velden).forEach(v => { velden[v.label] = v.waarde })
  }
  return { lead, velden }
}

test.describe('Offertewizard, bredere dekking', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  test.use({ locale: 'nl-BE' })

  test('overkapping: eigen velden komen door', async ({ page }) => {
    const naam = `E2E Overkapping ${Date.now()}`
    const modal = await openWizard(page)
    await modal.getByText('Overkapping', { exact: true }).click()
    await expect(modal.getByRole('heading', { name: 'Prijsraming voor een overkapping' })).toBeVisible()
    // Vrijstaand geeft een vierde optie bij het aantal wanden.
    await veld(modal, 'uitvoering').getByRole('button', { name: /Vrijstaand/ }).click()
    await vul(modal, 'lengte', '500')
    await vul(modal, 'breedte', '350')
    await vul(modal, 'hoogte', '250')
    await kies(modal, 'wanden', '3')
    await kies(modal, 'glazenSchuifwand', 'Ja')
    await kies(modal, 'zonnewerendGlas', 'Nee')
    await volgende(modal)
    expect(await verstuur(page, modal, naam)).toBeLessThan(300)

    const { velden } = await leesWizard(page, naam)
    expect(velden.uitvoering).toBe('Vrijstaand')
    expect(velden.lengte).toBe('500')
    expect(velden.breedte).toBe('350')
    expect(velden.hoogte).toBe('250')
    expect(velden.wanden).toBe('3')
    expect(velden.glazenSchuifwand).toBe('Ja')
    expect(velden.zonnewerendGlas).toBe('Nee')
    const paneel = page.getByText('Offerteaanvraag (wizard van de website)').locator('xpath=ancestor::section[1]')
    for (const l of ['Uitvoering', 'Lengte (cm)', 'Aantal wanden', 'Glazen schuifwand'])
      await expect(paneel.getByText(l, { exact: true }).first(), `label ${l}`).toBeVisible()
  })

  test('automatisering van een bestaande poort', async ({ page }) => {
    const naam = `E2E Automatisering ${Date.now()}`
    const modal = await openWizard(page)
    await modal.getByText('Automatisering', { exact: true }).click()
    await expect(modal.getByRole('heading', { name: 'Prijsraming voor automatisering van een bestaande poort' })).toBeVisible()
    await vul(modal, 'autoBeschrijving', 'Bestaande schuifpoort van 4 meter, manueel bediend.')
    await kies(modal, 'typePoort', 'Schuifpoort')
    await volgende(modal)
    expect(await verstuur(page, modal, naam)).toBeLessThan(300)

    const { lead, velden } = await leesWizard(page, naam)
    expect(velden.typePoort).toBe('Schuifpoort')
    expect(velden.autoBeschrijving).toContain('Bestaande schuifpoort')
    expect(lead.typeAanvraag).toContain('automatisatie')
  })

  test('onderhoud met bouwjaar en motor', async ({ page }) => {
    const naam = `E2E Onderhoud ${Date.now()}`
    const modal = await openWizard(page)
    await modal.getByText('Onderhoud', { exact: true }).click()
    await expect(modal.getByRole('heading', { name: 'Onderhoud aanvragen' })).toBeVisible()
    await vul(modal, 'bouwjaar', '2018')
    await vul(modal, 'typeMotor', 'Faac 390')
    await vul(modal, 'opmerkingen', 'Poort opent moeilijk sinds de winter.')
    await volgende(modal)
    expect(await verstuur(page, modal, naam)).toBeLessThan(300)

    const { lead, velden } = await leesWizard(page, naam)
    expect(velden.bouwjaar).toBe('2018')
    expect(velden.typeMotor).toBe('Faac 390')
    // Het opmerkingenveld gaat naar de projectomschrijving, niet naar de wizard.
    expect(String(lead.eersteVraag ?? '')).toContain('Poort opent moeilijk')
  })

  test('elke keuzeknop van de poortenflow werkt en schrijft de juiste waarde weg', async ({ page }) => {
    // Per veld klikken we alle opties na elkaar aan; de laatste blijft staan en
    // moet exact zo in de leadfiche terechtkomen. Zo raakt elke knop aangeraakt
    // zonder voor elke combinatie een aparte aanvraag te versturen.
    const naam = `E2E Opties ${Date.now()}`
    const stap2 = {
      // Aluminium staat sinds 2026-09-13 los van staal.
      typePoort: ['Massief houten poort', 'Stalen poort', 'Aluminium poort', 'Combinatie hout en metaal']
    }
    const stap3 = {
      hellingLinksRechts: ['Vlak', 'Licht hellend', 'Sterk hellend'],
      hellingNaarPoort: ['Vlak', 'Stijgt naar de poort toe', 'Daalt naar de poort toe', 'Sterk of onregelmatig'],
      bediening: ['Manueel', 'Automatisch'],
      ondergrond: ['Klinker', 'Kasseien', 'Asfalt', 'Beton', 'Kiezel of dolomiet', 'Volle grond']
    }
    const stap4 = {
      // De draairichting is geschrapt: drie keuzes zonder links of rechts.
      typeOpening: ['Enkele draaipoort', 'Dubbele draaipoort', 'Schuifpoort'],
      paalLinks: ['Standaardpaal', 'Brievenbuspaal', 'Pakjespaal', 'Zuil', 'Geen paal'],
      aansluitingLinks: ['Woning', 'Muur', 'Vaste afsluiting', 'Aanpasbare afsluiting', 'Vrije ruimte'],
      paalRechts: ['Standaardpaal', 'Brievenbuspaal', 'Pakjespaal', 'Zuil', 'Geen paal'],
      aansluitingRechts: ['Woning', 'Muur', 'Vaste afsluiting', 'Aanpasbare afsluiting', 'Vrije ruimte']
    }
    const modal = await openWizard(page)
    await modal.getByText('Poorten', { exact: true }).click()
    for (const [sleutel, opties] of Object.entries(stap2)) for (const o of opties) await kies(modal, sleutel, o)
    await kiesEersteModel(modal)
    await volgende(modal)
    await expect(modal.getByRole('heading', { name: 'Uitvoering en omgeving' })).toBeVisible()
    for (const [sleutel, opties] of Object.entries(stap3)) for (const o of opties) await kies(modal, sleutel, o)
    await volgende(modal)
    await expect(modal.getByText('Bovenaanzicht van uw poort', { exact: true })).toBeVisible()
    for (const [sleutel, opties] of Object.entries(stap4)) for (const o of opties) await kies(modal, sleutel, o)
    await volgende(modal)
    expect(await verstuur(page, modal, naam)).toBeLessThan(300)

    const { velden } = await leesWizard(page, naam)
    const laatste = { ...stap2, ...stap3, ...stap4 }
    for (const [sleutel, opties] of Object.entries(laatste))
      expect(velden[sleutel], `laatst gekozen waarde van ${sleutel}`).toBe(opties[opties.length - 1])
  })

  test('model verplicht, deselecteren en terugbladeren', async ({ page }) => {
    const naam = `E2E Leeg ${Date.now()}`
    const modal = await openWizard(page)
    await modal.getByText('Poorten', { exact: true }).click()

    // Aanklikken en weer wegklikken: het veld mag daarna niet meer meegaan.
    await kies(modal, 'typePoort', 'Stalen poort')
    await expect(veld(modal, 'typePoort').getByRole('button', { name: knopNaam('Stalen poort') }))
      .toHaveCSS('border-width', '2px')
    await kies(modal, 'typePoort', 'Stalen poort')
    await expect(veld(modal, 'typePoort').getByRole('button', { name: knopNaam('Stalen poort') }))
      .toHaveCSS('border-width', '1px')

    // Zonder model blijven we op stap 2 staan met een melding.
    await volgende(modal)
    await expect(modal.getByText('Gelieve een model te kiezen.').first()).toBeVisible()
    await expect(modal.getByRole('heading', { name: 'Prijsraming voor een poort' })).toBeVisible()

    // Terugbladeren en een keuze wijzigen: de laatste waarde wint.
    await kies(modal, 'typePoort', 'Massief houten poort')
    await kiesEersteModel(modal)
    await volgende(modal)
    await kies(modal, 'bediening', 'Manueel')
    await modal.getByRole('button', { name: 'Terug' }).click()
    await volgende(modal)
    await kies(modal, 'bediening', 'Automatisch')
    await volgende(modal)
    await volgende(modal)
    expect(await verstuur(page, modal, naam, { naam: 'Testbedrijf bv', btw: 'BE0123456789' })).toBeLessThan(300)

    const { lead, velden } = await leesWizard(page, naam)
    expect(velden.typePoort, 'de gewijzigde keuze wint').toBe('Massief houten poort')
    expect(velden.bediening, 'de gewijzigde keuze wint').toBe('Automatisch')
    // Nooit aangeraakte velden mogen niet als lege waarde meekomen.
    for (const s of ['ondergrond', 'paalLinks', 'aansluitingRechts'])
      expect(velden[s] ?? '', `${s} is niet ingevuld en hoort leeg te blijven`).toBe('')
    expect(lead.klantType).toBe('bedrijf')
    expect(lead.bedrijfsnaam).toBe('Testbedrijf bv')
    expect(lead.btwNummer).toBe('BE0123456789')
  })

  test('schuifpoort tekent de schuifrichting in beide wizards', async ({ page }) => {
    const naam = `E2E Schuif ${Date.now()}`
    const modal = await openWizard(page)
    await modal.getByText('Poorten', { exact: true }).click()
    await kies(modal, 'typePoort', 'Stalen poort')
    await kiesEersteModel(modal)
    await vul(modal, 'breedte', '420')
    await volgende(modal)
    await volgende(modal)
    await kies(modal, 'typeOpening', 'Schuifpoort')
    await kies(modal, 'aansluitingLinks', 'Vrije ruimte')
    // De tekening in de wizard moet de schuifpijl bevatten.
    await expect(modal.locator('svg[aria-label*="Bovenaanzicht"]')).toBeVisible()
    await volgende(modal)
    expect(await verstuur(page, modal, naam)).toBeLessThan(300)

    const { velden } = await leesWizard(page, naam)
    expect(velden.typeOpening).toBe('Schuifpoort')
    // Het ERP hertekent dezelfde situatie uit de opgeslagen velden.
    const paneel = page.getByText('Offerteaanvraag (wizard van de website)').locator('xpath=ancestor::section[1]')
    await expect(paneel.locator('svg[aria-label*="Bovenaanzicht"]')).toBeVisible()
    await expect(paneel.getByText('Schuifpoort', { exact: true })).toBeVisible()
  })
})
