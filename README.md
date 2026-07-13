# Poortland ERP · monorepo

Eerste bouwslag (Bouwspec Flow 1): fundament, login, bestelproces van lead tot order
en Websitebeheer (TS-17). Techkeuzes conform de ADR's: C# met ASP.NET Core en EF Core,
Supabase EU (Postgres met RLS, Auth en Storage), React met Vite in TypeScript als PWA.

## Structuur

| Map | Inhoud |
|---|---|
| supabase/migrations | Volledig schema: enums, tabellen, audit, statusbewaking, rechtenmatrix, RLS en seeds |
| backend | ASP.NET Core API (Poortland.Api) plus xUnit tests (Poortland.Tests) |
| frontend | React PWA met het huisstijlthema |
| e2e | Playwright scenario's gekoppeld aan de acceptatiecriteria |

## Huisstijlafspraak interface

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

## Website koppeling (TS-17)

De marketingwebsite leest uitsluitend `content.json` en publieke afbeeldingen uit de bucket
`website_publiek`, bij voorkeur achter Cloudflare. Publiceren en depubliceren in het ERP
herschrijft dat bestand (cache 5 minuten). De website krijgt geen sleutels en geen schrijftoegang.

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
