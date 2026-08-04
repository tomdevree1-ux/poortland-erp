# SEO en GEO: to-do bij livegang

Gebaseerd op de SEMANU-gids (SEO & GEO). Dit document lijst op wat al is
toegepast op de site en wat pas bij of na de livegang op poortland.be kan
gebeuren, omdat het toegang tot Google Search Console, het echte domein, de
serverlogs of Cloudflare vereist.

## Al toegepast (staat nu in de code)

- robots-meta `index, follow, max-snippet:-1, max-image-preview:large` in de head.
- Statische JSON-LD (LocalBusiness + WebSite) in de head, ook leesbaar zonder JavaScript.
- robots.txt met toegang voor zoekmachines en AI-crawlers, `Disallow: /api/` en verwijzing naar de sitemap.
- llms.txt met samenvatting, aanbod, kerncijfers en belangrijkste pagina's.
- sitemap.xml met de 15 pagina's (bestond al, ongewijzigd).
- noscript-fallback met kerninhoud (bedrijf, aanbod, kerncijfers, contact) voor crawlers zonder JavaScript.
- Titel, Open Graph en viewport waren al in orde; titel loopt per pagina mee.
- Canonical en og:url worden nu per pagina bijgewerkt (JavaScript). Voordien wees
  elke subpagina naar de homepage als canonical, waardoor Google alleen de
  homepage zou indexeren. Opgelost.
- Meertalige site (NL, FR, EN, DE) met Nederlands als terugval.

## Kleine resterende punten (binnen de huidige architectuur)

- **Meta description loopt nog niet per pagina mee.** Alle routes tonen de
  homepage-description in de statische head. Geen rankingfactor, wel bepalend
  voor de klik. Kan later per route bijgewerkt worden zoals nu al met canonical
  gebeurt. Lage prioriteit.
- **Titel en description in andere talen.** Bij taalwissel blijft de paginatitel
  Nederlands. Hangt samen met het punt "één URL voor vier talen" hieronder; niet
  apart op te lossen zonder per-taal URLs.

## Bij livegang doen (heeft GSC, echt domein, logs of Cloudflare nodig)

### 1. Google Search Console (hoofdstuk 1)
- Domein `poortland.be` toevoegen en verifiëren (DNS-record of bestand).
- Sitemap indienen onder Sitemaps: `https://poortland.be/sitemap.xml`.
- Per belangrijke pagina URL-inspectie draaien en indexering aanvragen.
- Controle `site:poortland.be` in Google: staan de pagina's in de index?
- Nakijken dat het live domein GEEN `noindex` meer draagt (de robots-meta staat nu goed, maar dubbelchecken na deploy).

### 2. AI-crawler bereikbaarheid (hoofdstuk 7) — belangrijk
- Op het live domein per bot testen dat de site echt bereikbaar is:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "OAI-SearchBot" https://poortland.be/
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "PerplexityBot" https://poortland.be/
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "ClaudeBot" https://poortland.be/
```

```bash
curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot" https://poortland.be/
```

- Elke test moet `200` geven. Bij `403`, `429` of `503` blokkeert er iets vooraf.

### 3. Cloudflare (staat op de to-do, hoofdstuk 7) — kritisch voor GEO
- Als Cloudflare voor de site komt: zet **Bot Fight Mode** UIT of zet AI-crawlers
  op de allowlist. Bot Fight Mode blokkeert crawlers (o.a. Perplexity) terwijl
  robots.txt hen toelaat. Dit is de meest voorkomende oorzaak van
  onzichtbaarheid in AI-antwoorden.
- Controleer daarna opnieuw met de curl-tests hierboven.
- Geen landenblokkade of snelheidsbeperking die crawlers afknijpt.

### 4. Core Web Vitals / snelheid (hoofdstuk 3)
- Na livegang het rapport Core Web Vitals in Search Console openen (velddata,
  komt pas na enkele weken echt verkeer).
- Lighthouse mobiel draaien op de belangrijkste pagina's (niet enkel home).
- Aandachtspunt bij een JavaScript-site: LCP en de eerste weergave. Zie punt 6.

### 5. Google Bedrijfsprofiel en vermeldingen buiten de site (hoofdstuk 10)
- Google Bedrijfsprofiel aanmaken/claimen voor Poortland Mechelen (echte reviews
  laat Google zelf zien; geen eigen sterren-markup plaatsen).
- `sameAs` in de JSON-LD aanvullen met de echte profielen zodra die er zijn
  (LinkedIn, Facebook, Instagram, bedrijvengidsen). Nu bewust leeg gelaten.
- Gegevens (naam, adres, telefoon) gelijk trekken over alle registers en gidsen.

### 6. Maandelijkse citatietest (hoofdstuk 9 en 11)
- Vaste set van ~15 vragen per motor (ChatGPT, Perplexity, Claude, Google
  AI-overzichten), uitgelogd, elke maand rond dezelfde datum.
- Meten: in hoeveel antwoorden Poortland genoemd wordt en welke concurrenten wel.
- Nulmeting vastleggen bij livegang, daarna maandelijks herhalen.

## De feedbackloop (hoofdstuk 11) — wekelijks volhouden na livegang

Een rapport toont cijfers en verandert niets; een loop draait rond. Het verschil
zit in stap 5: een week later nakijken of de wijziging is doorgevoerd en wat ze
opleverde. Alle gegevens zijn gratis (Search Console + analysepakket + eigen
technische controle). Houd het klein: hoogstens drie acties per week.

### De vijf stappen (elke week)
1. **Meten** — zoekdata uit Search Console, gedrag uit het analysepakket, en een technische controle van de belangrijkste pagina's. Elke meting als momentopname bewaren.
2. **Verklaren** — welke pagina bewoog, en welke wijziging ging daar 7 tot 14 dagen aan vooraf? Hiervoor dient het gebeurtenissenlogboek (zie hieronder).
3. **Voorstellen** — hoogstens drie acties, elk met een reden. Niets te doen mag ook.
4. **Wijzigen** — uitvoeren blijft mensenwerk, met een goedkeuringsstap. Niet automatisch publiceren.
5. **Nakijken** — 7 dagen later de cijfers van de betrokken pagina naast die van ervoor leggen. Ook "geen effect" wordt genoteerd. Dit is de stap die iedereen overslaat.

### Wat je meet, in drie lagen
- Zichtbaarheid: vertoningen, klikken, klikfrequentie, gemiddelde positie, zoekopdrachten per pagina (Search Console).
- Gedrag: sessies per kanaal, paginaweergaven, interactie, doelbereik (analysepakket).
- Techniek en GEO: HTTPS, titel/description, één H1, JSON-LD, laadgedrag, AI-crawlertoegang, bereikbaarheid (eigen controlescript, ~200 regels — eenmalig te bouwen).

### Actielijst met vier statussen (één tekstbestand volstaat)
- **open**: voorgesteld, nog niet uitgevoerd — vervalt na 3 weken.
- **uitgevoerd**: staat live met datum — na 7 dagen nameten.
- **gemeten**: effect nagekeken en genoteerd — blijft als geschiedenis, ook bij geen effect.
- **vervallen**: 3 weken niet opgepakt of achterhaald — zichtbaar afsluiten, niet stil schrappen.

### Ritme
- **Wekelijks** (± halfuur): stap 0 = vorige acties nakijken, dan meten en max. 3 nieuwe acties.
- **Maandelijks**: citatietest (zie punt 6 hierboven) + concurrentieblok (Google Ads Transparency Center, Meta Ad Library, Google Trends, 1- en 2-sterrenreviews van concurrenten).
- **Per kwartaal**: externe profielen naast de site leggen (naam, adres, telefoon gelijk trekken).
- **Voordeel voor Poortland**: het gebeurtenissenlogboek is er al — de Git-historie van deze repo is precies dat. Elke wijziging staat met datum vast.

### Vier regels die de loop eerlijk houden
- Signaalsterkte gaat voor actiedrang: bij weinig verkeer is weekruis geen signaal. Technische fouten wel meteen herstellen.
- Alleen handelen bij volledige zekerheid; twijfel wordt gerapporteerd, niet uitgevoerd.
- Elke ronde begint bij de actielijst, niet bij de nieuwe cijfers.
- De loop zelf maandelijks vereenvoudigen: wat nooit tot een handeling leidde, mag weg.

Uitbesteden loont alleen bij honderden pagina's, als er geen ontwikkelaar in huis
is, of als niemand het wekelijkse ritme volhoudt. Nooit uitbesteden: de beslissing
wat gemeten wordt en welke drempel een handeling rechtvaardigt.

## Groter aandachtspunt: JavaScript-rendering en per-taal URLs

De marketingsite is een client-side React-app: de server levert een lege schil
plus scripts, de inhoud ontstaat pas in de browser. Gevolgen:

- **Googlebot** rendert JavaScript en ziet meestal wel de inhoud, maar het is
  trager en foutgevoeliger dan echte server-HTML. De noscript-fallback en de
  statische JSON-LD verzachten dit nu.
- **Veel AI-crawlers voeren geen JavaScript uit.** Zonder de noscript-fallback
  zouden zij een lege pagina zien. Voor volwaardige GEO-citeerbaarheid is
  server-side rendering of prerendering (statische HTML per pagina) de echte
  oplossing. Dit is een bouwbeslissing, geen instelling — te overwegen na livegang.
- **Eén URL voor vier talen.** De taal wisselt zonder dat de URL verandert
  (localStorage). Daardoor kan Google maar één taalversie indexeren en werkt
  hreflang niet. Wil je FR, EN en DE echt vindbaar maken in Google, dan heb je
  aparte URLs per taal nodig (bijv. `/fr/`, `/en/`, `/de/`) plus hreflang. Ook
  dit is een bouwbeslissing. Nu tonen de andere talen zich enkel via de
  taalwisselaar en niet als eigen indexeerbare pagina's.

Aanbeveling: voor de Belgische markt is klassieke SEO in het Nederlands
voorlopig het belangrijkst (bij de SEMANU-nulmeting verscheen er in augustus 2026
nog geen Google AI-overzicht voor Nederlandstalige zoekopdrachten in België).
Prerendering en per-taal URLs zijn waardevolle vervolgstappen, maar geen blokkade
voor de livegang.

## Optioneel na livegang

- Per-pagina JSON-LD (`Service` op dienstpagina's, `FAQPage` op de faq-pagina,
  `BreadcrumbList`). Kan pas echt statisch zodra er prerendering is; anders enkel
  via JavaScript en dan met het voorbehoud hierboven.
- llms.txt twee keer per jaar bijwerken, samen met robots.txt.
- robots.txt twee keer per jaar naleven: leveranciers hernoemen AI-bots.
