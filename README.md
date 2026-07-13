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

**3. Gegevensregel naam en voornaam**

- Naam en voornaam zijn altijd en overal twee aparte velden: bij leads, klanten,
  contactpersonen, medewerkers en in elk formulier of contract dat personen bevat
  (ook het websiteformulier). Weergave gebeurt samengesteld via de helper
  `persoon()` uit lib/formaat.ts als voornaam gevolgd door naam.
- Bij bedrijven blijft naam de bedrijfsnaam en blijft voornaam leeg.

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

**5. Consistentie**

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
