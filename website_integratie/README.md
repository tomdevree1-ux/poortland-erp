# Websitekoppeling Poortland ERP

Twee losse scripts, geen sleutels en geen buildstap nodig. De website blijft
volledig los van het ERP: lezen via de publieke contentlaag en versturen via
1 publiek leadendpoint (TS-17 en de bouwspec).

## 1. Galerij en popup (werkt vandaag al)

Voeg toe aan de site:

    <script src="poortland_erp_content.js"
      data-content-url="https://rbttjhjrdnndamagqmui.supabase.co/storage/v1/object/public/website_publiek/content.json"
      defer></script>

Zet op de gewenste plek (galerijpagina, footermenu, waar dan ook):

    <div data-poortland-galerij></div>

Weergaven en filters: `data-weergave="strook"` (horizontale scrol voor
productpagina's), `data-weergave="banner"` (lopende band op de homepagina),
`data-filters="true"` (realisaties met filterchips) en de filters
`data-product-soort` (poort of overkapping), `data-poort-type` (hout, metaal of
hout_metaal) en `data-uitvoering` (draaipoort of schuifpoort). Voorbeelden staan
in Poortland_Website_ERP_Koppeling.md in de projectmap.
De popup verschijnt automatisch wanneer er in het ERP een gepubliceerde popup
binnen de actieve periode staat, hoogstens 1 keer per bezoeker per 7 dagen,
sluitbaar met Escape. Publiceren en depubliceren in het ERP werkt binnen 5 minuten
door (cache van content.json).

Let op per omgeving: de content URL bevat het projectref. Bij go live wijst de
website naar het productieproject en nooit naar staging (zie de hoofdREADME).

## 2. Contactformulier en offertewizard

Voeg `poortland_erp_lead.js` toe en roep bij het versturen `poortlandVerstuurLead`
aan (voorbeeld staat bovenaan dat bestand). Veldwaarden voor typeAanvraag:
nieuwe-poort, hekwerk, automatisatie, onderhoud, showroom of andere. Voor
gewensteTiming: zo-snel, 3-maand, 6-maand of orientatie. De wizardstructuur:

    { "stappen": [{ "titel": "...", "velden": [{ "label": "...", "waarde": "..." }] }] }

Endpoint per omgeving:

| Omgeving | Endpoint |
|---|---|
| Lokaal testen | http://localhost:5000/api/v1/leads/webformulier |
| Productie | https://HET_BACKEND_DOMEIN/api/v1/leads/webformulier (volgt bij de hosting) |

Vereisten voor productie: de backend gehost op een EU container (TS-15), het
websitedomein in de CORS lijst van de backend (Cors:Origins) en de Cloudflare
Turnstile sleutels ingevuld zodat het formulier beschermd is. In dev staat
Turnstile automatisch uit.
