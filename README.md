# Poortland ERP · monorepo

Eerste bouwslag (Bouwspec Flow 1): fundament, login, bestelproces van lead tot order
en Websitebeheer (TS-17). Techkeuzes conform de ADR's: C# met ASP.NET Core en EF Core,
Supabase EU (Postgres met RLS, Auth en Storage), React met Vite in TypeScript als PWA.

## Structuur

| Map | Inhoud |
|---|---|
| supabase/migrations | Volledig schema: enums, tabellen, audit, statusbewaking, rechtenmatrix, RLS en seeds |
| backend | ASP.NET Core API op .NET 10 (Poortland.Api) plus xUnit tests (Poortland.Tests) |
| frontend | React PWA met het huisstijlthema |
| e2e | Playwright scenario's gekoppeld aan de acceptatiecriteria |

## Platform UX regels (bindend voor elk scherm)

Vastgelegd op vraag van Poortland (2026-07-13). Deze regels gelden platformbreed
voor alle bestaande en toekomstige modules, tabellen, lijsten en detailweergaven.
Controleer bij elk nieuw of gewijzigd scherm automatisch of ze kloppen.

**1. Records openen vanuit tabellen en lijsten**

- Geen knoppen of links met Openen of Bekijken in rijen.
- De volledige rij is klikbaar: handcursor plus duidelijke hover indicatie
  (gebruik de klasse `rijKlik` uit ui.tsx) en 1 klik opent het detail.
- Interactieve elementen binnen een rij (selectievakjes, iconen, menu's) blijven
  apart bedienbaar met `stopPropagation` zodat ze de rij niet onbedoeld openen.

**2. Wijzigen van gegevens**

- Gegevens staan standaard in leesmodus, nooit rechtstreeks bewerkbaar.
- Bewerken start altijd bewust via het potlood (`PotloodKnop` uit ui.tsx) of een
  duidelijke knop Bewerken. Pas dan worden velden bewerkbaar en verschijnen
  Opslaan en Annuleren. Na opslaan of annuleren keert het scherm terug naar
  leesmodus.
- Domeinacties (kwalificeren, verzenden, publiceren, archiveren en dergelijke)
  zijn geen bewerkingen en blijven gewone actieknoppen.

**3. Gegevensregel naam, voornaam en bedrijfsnaam**

- Naam en voornaam zijn altijd en overal twee aparte velden: bij leads, klanten,
  contactpersonen, medewerkers en in elk formulier of contract dat personen bevat
  (ook het websiteformulier). Nooit samenvoegen bij het opslaan of doorsturen.
- Weergave in lijsten en titels gebeurt samengesteld via `persoon()` uit
  lib/formaat.ts (voornaam gevolgd door naam). Op detailfiches en in ELK
  gegevenspaneel (lead, klantfiche, klantgegevens op het dossier) staan voornaam
  en naam als twee aparte regels, zodat een verkeerde splitsing meteen opvalt en
  met het potlood te corrigeren is. Nooit `x.naam` los renderen: altijd
  `persoon()`, `weergaveNaam()` of de twee aparte regels.
- SSOT voor de klant: de klant is 1 record. Bewerken kan vanaf de klantfiche én
  vanaf de klantgegevens op het dossier (potlood met type particulier of
  bedrijf); beide schrijven naar dezelfde PATCH en elke weergave leest mee.
- Bedrijven (sinds migratie 0025): `bedrijfsnaam` is een eigen veld en naam en
  voornaam blijven de contactpersoon. De weergavenaam overal (klantenlijst,
  klantfiche, dossiers, offerte PDF) komt uit `weergaveNaam()` in lib/formaat.ts:
  de bedrijfsnaam indien gekend, anders voornaam plus naam. Op de offerte PDF
  verschijnt de contactpersoon als "T.a.v." onder de bedrijfsnaam.
- **Les uit de veldenaudit (2026-07-16):** wanneer een gegevenscontract wijzigt
  (zoals het splitsen van een naamveld), hoort daar altijd een datafix voor de
  bestaande records bij. Records van vóór de wijziging blijven anders de oude
  vorm tonen in elk scherm dat erop bouwt (zo toonde het omzetvenster "Tom de
  Vree" volledig in het naamveld: die leads waren aangemaakt vóór de splitsing).
  Controleer bij zulke wijzigingen dus code én bestaande data. De volledige
  veldenmatrix van website tot offerte staat in
  `../Poortland_ERP_Veldenaudit.md` in de projectmap.

**4. Eén bron van waarheid en gegevensisolatie (SSOT)**

- Gekende gegevens worden altijd vooraf ingevuld en nooit opnieuw gevraagd:
  leadgegevens vullen de nieuwe klant, het klantadres is overneembaar als
  werfadres en de communicatietaal van de klant stuurt de offertetaal.
- Klantgegevens leven uitsluitend op de klant. Schermen en documenten tonen ze
  via de relatie en kopiëren ze nooit. De ene uitzondering is bewust: bij het
  verzenden wordt de offerte als bevroren PDF bewaard in de private bucket
  documenten, zodat het historische document niet mee verandert.
- Formulierstaat wordt gereset bij het openen van elk venster en bij het wisselen
  van record. Gegevens van record A mogen nooit zichtbaar zijn bij record B.
- Elke query op onderliggende gegevens filtert op het ouder id (contactpersoon op
  klant, foto op lead, regel op offerte) en de databank bewaakt dit met vreemde
  sleutels, unieke sleutels en RLS. Nieuwe endpoints volgen dit patroon altijd.

**5. Zoekregels (bindend voor elk zoekveld)**

Vastgelegd op vraag van Poortland (2026-07-13). Gelden voor alle bestaande en
toekomstige zoekvelden, tabellen en selectielijsten.

- **Realtime met debounce.** Zoeken werkt terwijl de gebruiker typt, zonder Enter
  of zoekknop, met een debounce van 250 ms. Eerdere zoekopdrachten worden
  vervangen door de meest recente. Bestaande resultaten blijven staan tot de
  nieuwe er zijn (nooit knipperen of verspringen) en trage zoekopdrachten tonen
  een subtiele indicator "zoeken…". Gebruik hiervoor altijd `useZoekterm()` uit
  lib/zoek.ts samen met `placeholderData: keepPreviousData`.
- **Partiële invoer.** Overeenkomsten tellen aan het begin van een woord, binnen
  een woord en over meerdere velden van hetzelfde record. Hoofdletterongevoelig
  en met genormaliseerde spaties. Accenten en leestekens worden waar relevant
  genormaliseerd.
- **Minimale zoeklengte.** Pure nummers en codes zoeken vanaf 1 teken, tekst
  vanaf 2 tekens en fouttolerantie start pas vanaf 3 tot 4 tekens. Onder het
  minimum wordt niet gezocht en zeker niet fuzzy.
- **Relevantievolgorde.** Exact volledig, dan exact begin van waarde, exact begin
  van woord, exact deel van waarde, overeenkomst over meerdere velden en pas
  daarna beperkte fuzzy. Sleutelvelden (dossiernummer, offertenummer,
  artikelcode, officiële naam) wegen zwaarder dan omschrijvingen en notities.
  Recent gebruik mag alleen gelijke tekstscores breken en nooit een betere
  tekstuele match verdringen.
- **Gecontroleerde fouttolerantie.** Hoogstens 1 ontbrekende, extra of foutieve
  letter of 2 omgewisselde letters, alleen bij voldoende lange termen, boven een
  minimumscore en wanneer sterke exacte resultaten ontbreken. Nooit fuzzy op
  codes, nummers, bedragen, datums en unieke identificatoren. Fuzzy resultaten
  staan onder de exacte in een aparte sectie "Mogelijk bedoelde resultaten".
- **Niet vervuilen.** Liever weinig sterke resultaten dan veel zwakke: een
  minimumscore, geen zoeken op stopwoorden of algemene woorden, geen semantische
  verwantschap tenzij uitdrukkelijk gevraagd, een beperkt aantal resultaten met
  een optie voor meer en nooit meerdere zwakke overeenkomsten optellen tot een
  schijnbaar sterke.
- **Meerdere woorden.** Woorden worden gecombineerd op hetzelfde record en de
  volgorde is vrij: "claes stijn" vindt Stijn Claes. Alles gevonden weegt
  zwaarder dan één woord gevonden en exacte combinaties winnen.
- **Presentatie.** Markeer het overeenkomende tekstdeel, toon nooit technische
  scores, maak waar nuttig duidelijk in welk veld de match zat, toon een heldere
  melding bij geen resultaten (Geen resultaten voor "term") en geef bij een
  vermoedelijke typefout een subtiele suggestie (Bedoelde je …). Pas een
  zoekterm nooit stil aan.
- **Prestaties.** Geïndexeerde velden (de gin en trigram indexen staan in de
  migraties), alleen functioneel relevante velden, serverzijde zoeken met een
  resultaatlimiet en zichtbare resultaten binnen ongeveer 300 ms onder normale
  omstandigheden.
- **Rechten.** Resultaten worden serverzijde gefilterd op rechten (API guard
  plus RLS). Afgeschermde gegevens lekken nooit via suggesties, aantallen,
  markering of foutmeldingen.
- **Consistentie.** Overal dezelfde logica. Afwijkingen per module alleen met
  een duidelijke functionele reden en expliciet vastgelegd in deze README.

Status: de klientzijde basis (debounce, minima, stabiele resultaten, indicator
en meldingen) is overal actief. De serverzijdige relevantiesortering, markering,
meerwoordencombinatie en fuzzy met pg_trgm score vormen een eigen bouwslag op
het bestaande indexfundament en staan gepland vóór de datasets groot worden.

**6. Consistentie**

- Overal dezelfde navigatielogica, dezelfde hover en cursorfeedback, dezelfde
  iconen en benamingen (Bewerken, Opslaan, Annuleren) en dezelfde scheiding
  tussen leesmodus en bewerkmodus.
- Geen alternatieve interactiepatronen toevoegen tenzij Poortland er
  uitdrukkelijk om vraagt.

## Huisstijlafspraak interface

**Nooit native browseropmaak voor interface elementen**, vastgelegd op vraag van
Poortland (2026-07-13). Dropdowns, dialogen, meldingen en bevestigingen gebruiken
altijd de platformcomponenten uit `frontend/src/ui.tsx` (Selecteer, Modaal, Melding).
Native `<select>` zonder eigen paneel en `alert`, `confirm` en `prompt` zijn verboden
in de hele codebase. Nieuwe formulier of feedbackelementen komen eerst als component
in ui.tsx in de huisstijl en worden pas daarna in schermen gebruikt.


Geen donkere vlakken in de ERP interface, vastgelegd op vraag van Poortland (2026-07-13).
Het hele werkvlak inclusief login en sidebar staat op papier en perkament tinten,
conform het voorbeeldscherm van de huisstijlgids (blad 08): de sidebar op net iets
dieper papier met een bronzen accentrand. Bosgroen blijft beschikbaar voor tekst
en accenten maar nooit als achtergrondvlak.

## Migratiewachtrij (actie nodig)

De migraties tot en met 0028 staan op het dev project. **0029 (werkbon), 0030
(servicedossier) en 0031 (facturatie) staan klaar in `supabase/migrations` maar
zijn nog niet toegepast** omdat de Supabase koppeling van de werkomgeving aan
het verkeerde account hangt. Toepassen kan op twee manieren: de Supabase
connector opnieuw verbinden met de Poortland organisatie of de drie bestanden
in volgorde in de SQL editor van het dashboard plakken. Tot dan werken de
pagina's Veld, Service en Facturatie niet op dev; het dashboard en de rest
vangen dat netjes op.

## Lokaal draaien

1. **Databank.** De migraties staan al op het dev project (of speel ze af met de Supabase CLI:
   `supabase link` en `supabase db push`).
2. **Backend.**
   - Zet de omgeving volgens `backend/Poortland.Api/.env.example`
     (verbinding als rol `erp_app` en de service sleutel enkel hier, nooit in de frontend).
   - `dotnet run --project backend/Poortland.Api --urls http://localhost:5000`
   - OpenAPI staat op `http://localhost:5000/swagger`.
3. **Frontend.**
   - `cd frontend && cp .env.example .env` en vul de Supabase URL en publishable key in.
   - `npm install && npm run dev` en open `http://localhost:5173`.
4. **Eerste aanmelding.** Registreer het bootstrapadres (instelling `bootstrap_beheerder_email`)
   via het Supabase dashboard (Authentication, Add user, Send invitation) of via de API.
   Die gebruiker wordt automatisch medewerker met de rol beheerder en nodigt daarna de rest uit
   via het scherm Beheer. Er is bewust geen open registratie.

## Beveiligingsafspraken in deze repo

- De backend verbindt als de rol `erp_app` (geen eigenaar, geen bypass) en zet per verzoek
  `request.jwt.claims` zodat RLS, `mag()` en de statusbewaking dezelfde identiteit zien.
  Het wachtwoord van `erp_app` staat nooit in de repo: zet het eenmalig met
  `alter role erp_app with password '...'` en bewaar het in de omgeving.
- De **access token hook** (rollen in het JWT, TS-02 sectie 2.2) activeer je in het dashboard:
  Authentication → Hooks → Customize Access Token → `custom_access_token_hook`.
  Zolang die uit staat werkt alles via de terugval in `huidige_rollen()`.
- **MFA (TOTP)**: verplicht beleid voor beheerder en boekhouding conform TS-02.
  Inschrijven kan via Supabase Auth (`mfa.enroll`) en het aanmeldscherm vraagt de code.
- Buckets: `website_origineel` (privaat, signed URLs) en `website_publiek`
  (alleen gepubliceerde afgeleiden zonder EXIF plus `content.json`).
- BS-01: dev met email plus wachtwoord en TOTP. Entra ID SSO blijft de productienorm
  en is in Supabase Auth een configuratie (OIDC provider) zodra de tenant bevestigd is.
- BS-02: de enumwaarde `systeem` bestaat voor achtergrondtaken met minimale rechten
  (invulling van het open punt in TS-02 sectie 9).

## Leadcaptatie vanaf de website (contract)

De marketingwebsite stuurt het contactformulier en de offertewizard naar 1 publiek
endpoint, beschermd met Cloudflare Turnstile. De twee kanalen heten in het ERP
Contact (website) en Offerteaanvraag (website).

`POST /api/v1/leads/webformulier` als multipart formulier met deze velden:

| Veld | Verplicht | Betekenis |
|---|---|---|
| soort | ja | contact of offerteaanvraag (bepaalt het kanaal) |
| naam | ja | naam van de aanvrager |
| email | ja | emailadres |
| telefoon | nee | telefoonnummer |
| gemeente | nee | gemeente van de werf |
| typeAanvraag | nee | nieuwe-poort, hekwerk, automatisatie, onderhoud, showroom of andere |
| gewensteTiming | nee | zo-snel, 3-maand, 6-maand of orientatie |
| vraag | nee | omschrijving van het project |
| privacyAkkoord | ja | moet true zijn, wordt met tijdstip gelogd (AVG) |
| wizardGegevens | nee | json tekst, enkel bij offerteaanvraag, zie structuur hieronder |
| fotos | nee | maximaal 5 afbeeldingen (jpeg, png, webp of heic, elk maximaal 10 MB) |
| turnstileToken | ja in productie | Cloudflare Turnstile antwoord |

Structuur van wizardGegevens: `{ "stappen": [{ "titel": "...", "velden": [{ "label": "...", "waarde": "..." }] }] }`.
Het ERP toont die stappen als bewerkbare wizard in het leaddetail. Alle contactvelden
staan op de lead en reizen mee bij omzetting: contactgegevens en gemeente naar de
klant en de omschrijving naar het project. Foto's landen privaat in de bucket
lead_uploads en zijn in het ERP zichtbaar via kortlevende signed URLs.

## Website koppeling (TS-17)

De marketingwebsite leest uitsluitend `content.json` en publieke afbeeldingen uit de bucket
`website_publiek`, bij voorkeur achter Cloudflare. Publiceren en depubliceren in het ERP
herschrijft dat bestand (cache 5 minuten). De website krijgt geen sleutels en geen schrijftoegang.

### Testwebsite mee op de dev server (end tot end testen)

Voor end tot end testen door de klant staat een statische snapshot van de marketingsite
in `website_test/` en serveert dezelfde Caddy die snapshot op een eigen hostname naast de
beheerapp. Standaard is dat `www.<domein>` (de beheerapp blijft op `<domein>`). De
formulieren op die snapshot posten same origin naar `/api`, dus geen CORS. De klant vult
de site in, de lead verschijnt in het ERP, en een gepubliceerde foto verschijnt op de
realisatiespagina. Ververs de snapshot met een nieuwe kopie van de marketingsite in
`website_test/` voor je opnieuw uitrolt. De echte marketingsite blijft los van deze repo;
`website_test/` is enkel een testkopie voor staging.

## Repo naar GitHub met CI (kwaliteitsronde)

De workflow `.github/workflows/ci.yml` draait bij elke push: backend build met
unit tests, frontend typecheck met build en een secretscan. Koppelen is twee
stappen: maak op github.com een lege private repo (bv. `poortland-erp`) en draai
daarna vanuit de map `erp`:

    git remote add origin git@github.com:JOUWACCOUNT/poortland-erp.git
    git push -u origin master

De e2e-suite draait bewust niet in CI (heeft een draaiende omgeving en een
testlogin nodig); draai die lokaal vanuit `e2e/` met E2E_EMAIL, E2E_WACHTWOORD
en optioneel E2E_API_URL.

## Dev server op Hetzner (infra map)

Eenmalig: Hetzner account met betaalmethode, een project en een API token
(Security, API tokens, lezen en schrijven). Daarna vanuit de infra map:
`export HETZNER_TOKEN=...` gevolgd door `bash zet_server_op.sh` (maakt SSH
sleutel, firewall en een cx22 server in Falkenstein aan) en `bash rol_uit.sh`
(bouwt en start alles in Docker met Caddy en automatische TLS op een nip.io
domein of een eigen domein via `export DOMEIN=...`). Opnieuw uitrollen na
wijzigingen is gewoon nogmaals `bash rol_uit.sh`. De geheimen reizen mee uit
appsettings.Development.json naar een niet gecommit .env.deploy bestand.

## Omgevingen en promotie naar productie

TS-15 voorziet ontwikkeling, test, staging en productie als aparte Supabase projecten
met dezelfde migratieset. Het huidige project (Poortland ERP dev) doet dienst als
ontwikkel en stagingomgeving tot de uitrol. Productie wordt een eigen project in de
Poortland organisatie en NOOIT een hergebruik van deze omgeving.

### Checklist bij het opzetten van elke nieuwe omgeving (zeker productie)

**Supabase dashboard, per project opnieuw**

| Instelling | Staging (nu) | Productie |
|---|---|---|
| Authentication → URL Configuration → Site URL | http://localhost:5173 | https://erp.poortland.be (het echte domein) |
| Additional Redirect URLs | leeg | het productiedomein plus eventuele preview omgevingen |
| Authentication → Hooks → Customize Access Token | custom_access_token_hook aan | idem, per project opnieuw activeren |
| Auth emails (SMTP) | ingebouwde mailer (beperkt) | eigen SMTP via Brevo met het Poortland afzenderadres |
| API sleutels | publishable en secret van dev | nieuwe sleutels van het productieproject, nooit hergebruiken |
| MFA beleid | aanbevolen | verplicht voor beheerder en boekhouding (TS-02) |

**Databank (via migraties en seeds, geen handwerk)**

- Dezelfde migratiereeks 0001 en verder afspelen via CI (TS-15 sectie 5).
- Nieuw en uniek wachtwoord voor erp_app per omgeving, gezet buiten de migraties.
- instelling.bootstrap_beheerder_email op het adres van de zaakvoerder zetten vóór de eerste aanmelding.
- instelling.bedrijfsgegevens nakijken voor de offertehoofding.
- Synthetische data blijft in dev en staging. Productie start leeg plus de migratie uit Lotus Notes (TS-14).

**Backend (appsettings per omgeving of omgevingsvariabelen)**

- ConnectionStrings:Poortland naar de pooler van het productieproject.
- Supabase:Url en Supabase:ServiceKey van het productieproject.
- Email:Modus van console naar brevo plus BrevoApiKey en het echte afzenderadres.
- Frontend:Origin (CORS) van localhost naar het productiedomein.
- Turnstile:Secret invullen zodat het publieke leadformulier beschermd is.
- Sentry DSN aanzetten (TS-15, EU regio).

**Frontend (buildtime variabelen)**

- VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY van het productieproject.
- De dev proxy in vite.config.ts geldt alleen lokaal. In productie serveert Cloudflare
  de statische build en routeert het pad /api naar de backend container op hetzelfde
  domein. Zo blijft de API relatief bereikbaar en is er geen CORS nodig.

**Websitebeheer (TS-17, opgelet)**

- De marketingwebsite leest content.json op een URL die het projectref bevat.
  Bij productie moet de website naar het productieproject wijzen en nooit naar staging,
  anders verschijnt testcontent op de echte site.

**Overig**

- Backups: PITR nakijken en de onafhankelijke nachtelijke dump inrichten (TS-15 sectie 7).
- DNS, WAF en rate limiting via Cloudflare voor het productiedomein.
- De go live checklist van TS-16 doorlopen vóór de omschakeling.

## Omgevingen

Dev nu in een eigen Poortland organisatie op Supabase. Test, staging en productie volgen
TS-15 (aparte projecten, synthetische data buiten productie, backups met PITR plus een
onafhankelijke offsite dump).
