# Diepgaande securityaudit Poortland ERP en website

Datum 2026-07-24. Uitgevoerd als productie audit vanuit de rol van aanvaller, tegen de dev omgeving (Supabase project Poortland ERP dev), de volledige code in deze repo, de migraties en policies, en de Caddy configuratie. De databank is rechtstreeks bevraagd op rollen, rechten, policies en functies. Er zijn geen belastingaanvallen op de draaiende server gedaan; dat hoort een afgesproken pentest te zijn.

Uitgangspunt van deze audit: niets is veilig tot het bewezen is. De nadruk lag op de fouten die door AI gegenereerde applicaties stelselmatig maken, met als belangrijkste vraag of de databankbeveiliging ergens omzeild wordt om iets werkend te krijgen.

## Fase 1 — Architectuur en aanvalsvlak

Authenticatie via Supabase Auth met tweestapsverificatie (TOTP). Autorisatie op rol via row level security in Postgres, aangedreven door de functie mag(entiteit, actie) en de claims uit het token. Databank Postgres 17 op Supabase. ORM is EF Core met Npgsql. Backend is een .NET API. Frontend is een Vite React applicatie (geen Next.js, dus geen Server Actions of servermiddleware). Daarnaast een statische marketingsite. Opslag via Supabase buckets. Externe diensten: Cloudflare Turnstile voor botbescherming en Brevo voor e-mail. Geen betaalprovider in het systeem.

Het externe aanvalsvlak is klein: één publiek formulierendpoint, één gezondheidscheck, de statische site, en de aanmelding via Supabase. Al de rest zit achter authenticatie én row level security.

## Fase 2 — Authenticatie

Alle twaalf controllers dragen op klasseniveau [Authorize]. Van de 110 endpoints staan er twee bewust open: het formulier /leads/webformulier en /gezond. De middleware staat in de juiste volgorde (UseAuthentication, UseAuthorization, dan MapControllers). Tokens worden gevalideerd op uitgever, geldigheidsduur en handtekening. De API werkt met een token in de kop, niet met cookies, dus zwakke cookievlaggen of sessieovername via cookies zijn niet van toepassing. Geen bevinding.

## Fase 3 — Autorisatie

De autorisatie zit in de databank, niet enkel in de interface. Elke policy hangt aan mag(); nergens staat USING (true). Het model is op rol gebaseerd: dit is een intern werkinstrument waar het team samenwerkt, dus verkoop ziet alle leads en klanten. Dat is een ontwerpkeuze, geen IDOR. Horizontale escalatie tussen gebruikers bestaat hier niet als concept omdat de grens op rol ligt, niet op eigenaar. Verticale escalatie is geblokkeerd: een rol toekennen vereist mag('gebruikersbeheer', ...), dus een gewone gebruiker kan zichzelf niet promoveren. Client aangeleverde identiteiten worden niet vertrouwd (de eigenaar van een weblead wordt serverzijdig gekozen). Geen bevinding.

## Fase 4 — Supabase

Row level security aan op alle 35 tabellen. De rollen anon en authenticated hebben nul directe tabelrechten. Geen enkele SECURITY DEFINER functie is uitvoerbaar door anon of authenticated, dus er is geen RPC aanvalsvlak. Alle elf zulke functies hebben een vast search_path.

De auth hook custom_access_token_hook is nagekeken omdat die de rollen in het token zet. Hij leidt de rollen serverzijdig af uit de tabellen, geeft een lege rollenlijst bij een inactieve of verwijderde medewerker, en overschrijft de rollenclaim, zodat een gebruiker geen eigen rollen kan meesmokkelen. Veilig. Geen bevinding.

Belangrijkste controle van deze audit: draait de app met een rol die RLS omzeilt? Nee. De applicatierol erp_app heeft rolbypassrls = false. Alle databanktoegang via de ORM valt dus onder row level security, ook vanuit de API zelf. De servicesleutel (die RLS wel zou omzeilen) wordt uitsluitend gebruikt voor opslagbewerkingen en het versturen van een uitnodiging, nooit voor databevragingen, en staat enkel in de serveromgeving. Dit is precies het punt waar door AI gegenereerde apps meestal de mist ingaan, en hier is het correct. Geen bevinding.

## Fase 5 — Databank

Alle toegang loopt via EF Core met parameters. De weinige stukken ruwe SQL (de zoekfuncties en het zetten van de claims) gebruiken geparametriseerde interpolatie, geen samengeplakte strings. UPDATE en DELETE lopen via de ORM met de entiteit op sleutel, en row level security beperkt wat de rol mag raken. De offertenummering gebruikt een aparte tabel achter een functie om nummers zonder gaten of botsingen uit te delen, wat een raceconditie voorkomt. Geen bevinding op injectie.

## Fase 6 — API

Elk endpoint zit achter authenticatie en rolcontrole. Het externe formulier heeft een snelheidslimiet van vijf per minuut per IP. Foutmeldingen zijn nette meldingen zonder stacktraces. Zie bevinding L2 over een algemene limiet.

## Fase 7 — Invoervalidatie

De frontend is React en ontsmet waarden bij het tonen. Nergens dangerouslySetInnerHTML, innerHTML met gebruikersinhoud, eval of new Function; de enige innerHTML wist een lege container. De marketingsite heeft geen van die patronen. Padtraversal is uitgesloten: opslagpaden worden serverzijdig opgebouwd met willekeurige identificatoren, de bestandsnaam bepaalt het pad niet, en de bestandsextensie kan geen schuine strepen bevatten. Uitgaande verzoeken gaan enkel naar vaste adressen (Cloudflare, Supabase, Brevo), dus geen SSRF. Het wachtwoordherstel gebruikt de eigen herkomst als terugkeeradres, dus geen open doorverwijzing. Geen bevinding.

## Fase 8 — Secrets en configuratie

Geen echte sleutels in de repo, met een controle in de bouwstraat die daarop scant. Instellingenbestand met lege plaatshouders. CORS beperkt tot de eigen herkomst. Swagger enkel buiten productie. Securityheaders toegevoegd tijdens deze audit (bevinding L1). TLS via Caddy. Zie bevinding L1.

## Fase 9 — Opslag

Zes buckets, enkel de publieke websitebucket is publiek. Uploads worden op de echte inhoud gevalideerd (eerste bytes), niet op de naam, met een groottelimiet. Privébestanden worden via ondertekende adressen geserveerd. Geen bevinding.

## Fase 10 — Frontend

Geen geheimen in de frontend; enkel de publieke sleutel. De sessie staat in de browseropslag, de standaard voor Supabase en aanvaardbaar voor een intern portaal; er is geen XSS lek om die te stelen. Geen cookies dus geen CSRF op de API. Klikkaping afgedekt met frameheaders. Zie bevinding I1.

## Fase 11 — Businesslogica

Offertetotalen worden serverzijdig herberekend, dus een vals totaal opdringen kan niet. Statusovergangen worden door een databanktrigger getoetst aan een tabel met toegelaten overgangen, dus een ongeldige sprong kan ook niet via een omweg. Geen betaalstroom aanwezig, dus betalingen overslaan of kortingsbonnen misbruiken is niet van toepassing. Uitnodigingen zijn enkel voor de beheerder en er is geen open registratie. Wachtwoordherstel en login geven neutrale meldingen, dus gebruikers zijn niet op te sommen. Zie bevinding I2.

## Fase 12 — Patronen van door AI gegenereerde code

Elk van de klassieke valkuilen is nagekeken en niet aangetroffen: routes zijn beschermd, autorisatie zit in de databank en niet enkel in de client, elke functie met verhoogde rechten heeft een vast search_path, geen ontbrekende of te ruime row level security, geen publieke RPC, de servicesleutel staat niet in de frontend en wordt niet voor data gebruikt, geen verborgen beheer, debug of testroute, geen tijdelijke omzeiling of TODO die de beveiliging verzwakt. De enige bewuste versoepeling (Turnstile laat door zonder sleutel) is gedocumenteerd en wordt met bevinding M1 gesloten.

## Fase 13 — Afhankelijkheden

De frontend meldt nul kwetsbaarheden. Aanbeveling: voeg een scan op de serverpakketten toe aan de bouwstraat (bevinding L3).

## Fase 14 — Productieharding

Swagger staat uit in productie, foutmeldingen verbergen details, er is een audittabel met triggers. Brute kracht op de login wordt door de eigen limieten van Supabase Auth beperkt; het formulier heeft een eigen limiet. Zie bevindingen M1 en L2.

---

# Bevindingen

## M1 — Botbescherming laat door tot de sleutel is ingesteld

Severity: Medium. CWE-799 (onvoldoende beheersing van interactiefrequentie), ook CWE-693. OWASP A07 (identificatie en authenticatie). Betrokken bestanden: Adapters/Supabase.cs (TurnstileValidator), Controllers/LeadsController.cs (Webformulier). Confidence: hoog.

Technische uitleg: de Turnstile controle geeft true terug zolang Turnstile:Secret leeg is, zodat het formulier tijdens de test werkt. Uitbuitbaar omdat een bot dan enkel de snelheidslimiet van vijf per minuut per IP tegenkomt; met wisselende adressen kan die spamleads binnenduwen. Aanvalsscenario: een script post herhaald naar /leads/webformulier vanaf verschillende adressen en vult de leadlijst met rommel. Impact: vervuilde leads en verloren tijd voor verkoop, mogelijk misbruik van de fotoupload voor opslag. Aanbevolen fix: stel het geheim en de sitesleutels in (de bekabeling staat nu klaar aan beide kanten). Voorbeeld: zet Turnstile__Secret in de serveromgeving en window.POORTLAND_ERP.turnstileSiteKey in de site; de code verifieert dan automatisch elk verzoek.

Status: de bekabeling is tijdens deze audit aangelegd. Resteert enkel het invullen van de sleutels vóór de publieke livegang.

## L1 — Securityheaders ontbraken (opgelost tijdens de audit)

Severity: Low. CWE-1021 (klikkaping), CWE-693. OWASP A05 (misconfiguratie). Betrokken bestand: infra/Caddyfile. Confidence: hoog. Toegevoegd op beide hostnames: HSTS, nosniff, frameweigering, referrer beleid en het verbergen van de serverkop. Bewust geen strikte inhoudspolitie omdat de site sterk op inline styles leunt; een politie in rapportmodus kan later. Status: verholpen, rolt mee met de volgende uitrol.

## L2 — Snelheidslimiet enkel op het formulier

Severity: Low. CWE-770 (geen beperking op middelen). OWASP A04 (onveilig ontwerp). Betrokken bestand: Program.cs. Confidence: hoog. De aanmelding leunt op de eigen limieten van Supabase. Als vangnet tegen misbruik van een intern account kan een algemene limiet over de hele API. Staat op de takenlijst, mag na de lancering.

## L3 — Geen automatische scan op serverpakketten

Severity: Low. OWASP A06 (kwetsbare onderdelen). Confidence: middel. De frontend wordt gescand (nul kwetsbaarheden). Voeg dotnet list package --vulnerable toe aan de bouwstraat zodat ook de serverpakketten bewaakt worden.

## I1 — Sessie in de browseropslag

Severity: Informatief. CWE-522. De Supabase bibliotheek bewaart de sessie in de browseropslag. Dit is de standaard en aanvaardbaar zonder XSS lek. Geen actie.

## I2 — Prijzen per regel worden vertrouwd van de verkoper

Severity: Informatief. Bewust want offertes zijn onderhandelbaar en enkel bevoegd personeel stelt ze op. De totalen worden wel serverzijdig herberekend. Geen actie.

## Reeds in orde

Lekwachtwoordcontrole staat aan (zichtbaar op je schermafbeelding). Tabel offerte_reeks heeft bewust row level security zonder beleid en is voor gewone gebruikers volledig dicht.

---

# Eindrapport

## Samenvatting

Dit is een degelijk gebouwde applicatie met een echte tweede verdedigingslaag in de databank. Er zijn geen kritieke of hoge kwetsbaarheden. De belangrijkste controle, of de app RLS omzeilt, valt positief uit: de applicatierol omzeilt RLS niet en de servicesleutel wordt nergens voor data gebruikt. Eén punt van gemiddelde ernst is operationeel en bekabeld: de botbescherming aanzetten met sleutels. De rest is laag of informatief, en twee punten zijn al opgelost.

## Scores

Beveiliging: 88 op 100. Productiegereedheid: 90 op 100, en 95 zodra de Turnstile sleutels ingevuld zijn.

## OWASP Top 10 dekking

A01 Toegangscontrole: sterk. A02 Cryptografie: goed. A03 Injectie: sterk. A04 Onveilig ontwerp: goed (kleine bevinding L2). A05 Misconfiguratie: goed (L1 verholpen). A06 Kwetsbare onderdelen: goed (L3 aanbevolen). A07 Authenticatie: goed (M1 te sluiten). A08 Integriteit: goed. A09 Logging: goed. A10 SSRF: goed.

## Prioriteit

Blokkerend voor de publieke livegang: enkel M1, de Turnstile sleutels invullen. Snelle winst die al klaar staat: de securityheaders (L1). Na de lancering optioneel: L2 en L3.

## Positieve bevindingen en sterktes

De applicatierol omzeilt RLS niet. Row level security op alle tabellen met een consistent rechtenmodel. Geen RPC aanvalsvlak. Geparametriseerde SQL overal. Veilige auth hook. Servicesleutel enkel serverzijdig en enkel voor opslag en uitnodiging. Uitnodiging alleen en tweestapsverificatie. Serverzijdige totalen en een databanktrigger op statusovergangen. Neutrale meldingen tegen het opsommen van gebruikers. Uploadvalidatie op de echte inhoud. Geen secrets in de repo, met een scan in de bouwstraat. Nul kwetsbaarheden in de frontendpakketten.

## Resterend aanvalsvlak

Na het aanzetten van Turnstile blijft het externe vlak: het formulierendpoint (met Turnstile en de limiet), de aanmelding (met tweestaps en de Supabase limieten) en de statische site. Klein en goed verdedigd.

## Aanbeveling voor uitrol

Productie na fixes. Concreet: klaar voor de publieke livegang zodra de Turnstile sleutels zijn ingevuld. De securityheaders rollen mee met de volgende uitrol. L2 en L3 zijn verbeteringen voor daarna.
