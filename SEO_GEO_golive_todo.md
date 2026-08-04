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
- Titel, meta description, canonical, Open Graph en viewport waren al in orde.
- Meertalige site (NL, FR, EN, DE) met Nederlands als terugval.

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
