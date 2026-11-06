import { expect, test, type Locator, type Page } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'
import { meldAan } from './hulp'

/* De offertewizard van de website vult de leadfiche in het ERP. Deze suite
   bewaakt die keten van begin tot eind:
   1. de volledige wizard invullen en versturen (poortenflow, vijf stappen)
   2. controleren dat elk ingevuld veld ongeschonden in wizardGegevens zit
   3. controleren dat de leadfiche elke waarde met een net label toont
   4. een dekkingstest die faalt zodra de wizard een veld toevoegt dat het ERP
      niet kent, zodat website en ERP niet stil uit elkaar groeien. */

// De website draait op het www-domein naast het ERP.
const siteUrl = (pad: string) =>
  `https://www.${new URL(process.env.E2E_BASE_URL ?? 'https://localhost').host}${pad}`

// De verwachte samenstelling: sleutel uit de wizard, wat we aanklikken of
// typen, de waarde die in wizardGegevens hoort te staan en het label dat de
// leadfiche toont. Eén tabel voor invullen én nakijken.
const KEUZES: { sleutel: string; knop: string; waarde: string; label: string }[] = [
  { sleutel: 'typePoort', knop: 'Massief houten poort', waarde: 'Massief houten poort', label: 'Type poort' },
  { sleutel: 'hellingLinksRechts', knop: 'Licht hellend', waarde: 'Licht hellend', label: 'Helling links naar rechts' },
  { sleutel: 'hellingNaarPoort', knop: 'Stijgt naar de poort toe', waarde: 'Stijgt naar de poort toe', label: 'Helling naar de poort toe' },
  { sleutel: 'bediening', knop: 'Automatisch', waarde: 'Automatisch', label: 'Type bediening' },
  { sleutel: 'ondergrond', knop: 'Klinker', waarde: 'Klinker', label: 'Ondergrond aan de poort' },
  { sleutel: 'typeOpening', knop: 'Dubbele draaipoort', waarde: 'Dubbele draaipoort', label: 'Type opening' },
  { sleutel: 'paalLinks', knop: 'Brievenbuspaal', waarde: 'Brievenbuspaal', label: 'Paal links van de poort' },
  { sleutel: 'aansluitingLinks', knop: 'Muur', waarde: 'Muur', label: 'Links naast de poort' },
  { sleutel: 'paalRechts', knop: 'Zuil', waarde: 'Zuil', label: 'Paal rechts van de poort' },
  { sleutel: 'aansluitingRechts', knop: 'Vrije ruimte', waarde: 'Vrije ruimte', label: 'Rechts naast de poort' }
]
const MATEN = [
  { sleutel: 'breedte', waarde: '360', label: 'Totale opening breedte (cm)' },
  { sleutel: 'zijhoogte', waarde: '185', label: 'Zijhoogte (cm)' }
]
// De contactgegevens in de laatste stap.
const CONTACT: [string, string][] = [
  ['voornaam', 'Test'], ['email', ''], ['telefoon', '0470 00 00 00'],
  ['adres', 'Teststraat 1'], ['postcode', '2800'], ['stad', 'Mechelen']
]

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

/* Elk veld in de wizard draagt data-veld met de sleutel die ook naar het ERP
   gaat. Daarop mikken is stabieler dan op zichtbare tekst: 'Muur' bestaat links
   én rechts van de poort, en verplichte labels dragen een sterretje. */
async function kies(modal: Locator, sleutel: string, tekst: string) {
  // Sommige knoppen dragen een subtitel, dus matchen we op het begin.
  const naam = new RegExp('^' + tekst.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '( \\(.*\\))?$')
  await modal.locator(`[data-veld="${sleutel}"]`).getByRole('button', { name: naam }).click()
}
async function vul(modal: Locator, sleutel: string, waarde: string) {
  await modal.locator(`[data-veld="${sleutel}"]`).locator('input, textarea').first().fill(waarde)
}

test.describe('Offertewizard website naar leadfiche', () => {
  test.skip(!process.env.E2E_EMAIL, 'Zet E2E_EMAIL en E2E_WACHTWOORD om deze suite te draaien')
  test.use({ locale: 'nl-BE' })

  test('volledige poortaanvraag verstuurt alle velden en toont ze in het ERP', async ({ page }) => {
    const naam = `E2E Wizard ${Date.now()}`
    await page.goto(siteUrl('/'))
    await sluitPopup(page)

    // Stap 1: dienst kiezen
    await page.getByRole('button', { name: /Vraag (een|uw) prijsraming aan/i })
      .or(page.getByRole('link', { name: /Vraag (een|uw) prijsraming aan/i })).first().click()
    // Op naam, zodat een popup van de site niet als wizard wordt gezien.
    const modal = page.getByRole('dialog', { name: 'Prijsraming aanvragen' })
    await expect(modal.getByRole('heading', { name: 'Waarvoor wenst u een prijsraming aan te vragen?' })).toBeVisible()
    await modal.getByText('Poorten', { exact: true }).click()

    // Stap 2: type poort, model en maten
    await expect(modal.getByRole('heading', { name: 'Prijsraming voor een poort' })).toBeVisible()
    await kies(modal, 'typePoort', 'Massief houten poort')
    // Model via de eigen uitklaplijst; de eerste modelnaam volstaat.
    await modal.locator('[data-modellijst] > button').click()
    // Sinds 2026-09-13 staat er geen 'geen voorkeur' meer in de lijst.
    const eersteModel = modal.locator('[data-modellijst] [role="listbox"] button').first()
    const modelNaam = (await eersteModel.innerText()).trim()
    await eersteModel.click()
    for (const m of MATEN) await vul(modal, m.sleutel, m.waarde)
    await modal.getByRole('button', { name: 'Volgende' }).click()

    // Stap 3: helling, bediening en ondergrond
    await expect(modal.getByRole('heading', { name: 'Uitvoering en omgeving' })).toBeVisible()
    for (const s of ['hellingLinksRechts', 'hellingNaarPoort', 'bediening', 'ondergrond'])
      await kies(modal, s, KEUZES.find(k => k.sleutel === s)!.knop)
    await modal.getByRole('button', { name: 'Volgende' }).click()

    // Stap 4: het bovenaanzicht
    await expect(modal.getByText('Bovenaanzicht van uw poort', { exact: true })).toBeVisible()
    for (const s of ['typeOpening', 'paalLinks', 'aansluitingLinks', 'paalRechts', 'aansluitingRechts'])
      await kies(modal, s, KEUZES.find(k => k.sleutel === s)!.knop)
    await modal.getByRole('button', { name: 'Volgende' }).click()

    // Stap 5: contactgegevens en versturen
    await expect(modal.getByRole('heading', { name: 'Uw gegevens' })).toBeVisible()
    await vul(modal, 'naam', naam)
    for (const [sleutel, waarde] of CONTACT)
      await vul(modal, sleutel, sleutel === 'email' ? `e2e.wizard.${Date.now()}@poortland.local` : waarde)

    const verstuurd = page.waitForResponse(r =>
      r.url().includes('/leads/webformulier') && r.request().method() === 'POST', { timeout: 20000 })
    await modal.getByRole('button', { name: /Prijsraming aanvragen/ }).click()
    const antwoord = await verstuurd
    expect(antwoord.status(), 'het webformulier moet de aanvraag aanvaarden').toBeLessThan(300)
    await expect(modal.getByRole('heading', { name: 'Bedankt voor uw aanvraag' })).toBeVisible({ timeout: 15000 })

    // ---- Controle op de doorgegeven gegevens ----
    await meldAan(page)
    await page.goto('/leads')
    await page.getByPlaceholder('Zoek naam, email of vraag…').fill(naam)
    // De fiche haalt de lead op zodra we ze openen; de wachter moet dus al
    // klaarstaan vóór de klik.
    const fiche = page.waitForResponse(r =>
      /\/api\/v1\/leads\/[0-9a-f-]+$/.test(r.url()) && r.request().method() === 'GET', { timeout: 20000 })
    await page.getByText(naam).first().click()
    await expect(page.getByText(naam).first()).toBeVisible()
    const leadJson = await fiche.then(r => r.json()).catch(() => null)
    const velden: Record<string, string> = {}
    if (leadJson?.wizardGegevens) {
      const data = JSON.parse(leadJson.wizardGegevens) as { stappen: { velden: { label: string; waarde: string }[] }[] }
      data.stappen.flatMap(s => s.velden).forEach(v => { velden[v.label] = v.waarde })
    }
    // Elk aangeklikt veld moet exact terugkomen in wizardGegevens.
    for (const k of KEUZES) expect(velden[k.sleutel], `veld ${k.sleutel} in wizardGegevens`).toBe(k.waarde)
    for (const m of MATEN) expect(velden[m.sleutel], `veld ${m.sleutel} in wizardGegevens`).toBe(m.waarde)
    expect(velden.model, 'het gekozen model in wizardGegevens').toBe(modelNaam)

    // ---- Controle op de weergave in de leadfiche ----
    const paneel = page.getByText('Offerteaanvraag (wizard van de website)').locator('xpath=ancestor::section[1]')
    await expect(paneel).toBeVisible()
    for (const k of [...KEUZES, ...MATEN.map(m => ({ label: m.label, waarde: m.waarde }))]) {
      await expect(paneel.getByText(k.label, { exact: true }).first(),
        `label ${k.label} op de leadfiche`).toBeVisible()
      await expect(paneel.getByText(k.waarde, { exact: true }).first(),
        `waarde ${k.waarde} op de leadfiche`).toBeVisible()
    }
    // Geen ruwe sleutels meer zichtbaar
    for (const k of KEUZES) await expect(paneel.getByText(k.sleutel, { exact: true })).toHaveCount(0)
    // Het bovenaanzicht wordt hertekend uit de gegevens
    await expect(paneel.locator('svg[aria-label*="Bovenaanzicht"]')).toBeVisible()
  })

  // Statische controle, draait ook zonder inloggegevens: elk veld dat de wizard
  // kan versturen moet in de labeltabel van het ERP staan.
  test('elk wizardveld heeft een label in het ERP', async () => {
    const wortel = join(__dirname, '..', '..')
    const wizard = readFileSync(join(wortel, 'website_test', 'js', '02-shared-nl.js'), 'utf8')
    const labels = readFileSync(join(wortel, 'frontend', 'src', 'lib', 'wizardvelden.ts'), 'utf8')
    const modalStart = wizard.indexOf('function OfferteModal')
    const modalCode = wizard.slice(modalStart, wizard.indexOf('/* ---- Premium categoriepagina', modalStart))
    const sleutels = new Set<string>()
    for (const m of modalCode.matchAll(/\n\s{4}name: '([A-Za-z0-9_]+)'/g)) sleutels.add(m[1])
    // 'model' en 'modelStijl' komen via set() en niet via een name-veld
    for (const m of modalCode.matchAll(/set\('([A-Za-z0-9_]+)'/g)) sleutels.add(m[1])
    // De contactvelden en de losse velden gaan naar hun eigen leadkolommen en
    // niet naar wizardGegevens. Die uitsluitingslijst lezen we uit de wizard
    // zelf, zodat deze test meebeweegt als daar iets wijzigt.
    const contactRegel = modalCode.match(/const contactKeys = \[([^\]]+)\]/)
    const apart = new Set<string>(['opmerkingen', 'timing', 'klantType', 'bedrijfsnaam', 'btwNummer'])
    for (const m of (contactRegel?.[1] ?? '').matchAll(/'([A-Za-z0-9_]+)'/g)) apart.add(m[1])
    const meegestuurd = [...sleutels].filter(s => !apart.has(s))
    expect(meegestuurd.length, 'de wizard moet velden naar het ERP sturen').toBeGreaterThan(10)
    const ontbreekt = meegestuurd.filter(s => !labels.includes(`  ${s}:`))
    expect(ontbreekt, `deze wizardvelden missen een label in frontend/src/lib/wizardvelden.ts`).toEqual([])
  })
})
