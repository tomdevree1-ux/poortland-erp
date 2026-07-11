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

## Omgevingen

Dev nu in een eigen Poortland organisatie op Supabase. Test, staging en productie volgen
TS-15 (aparte projecten, synthetische data buiten productie, backups met PITR plus een
onafhankelijke offsite dump).
