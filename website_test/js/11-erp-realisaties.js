/* Poortland ERP · realisatiesectie "Recent geplaatst" op de website (TS-17).
   Hangt onder de vaste projecten op de realisatiespagina een galerij met
   filters, gevoed door content.json. Werkt in de React SPA: de app rendert
   elke pagina in <main class="pl-page"> met een wisselende key, dus React
   remount die main volledig bij navigatie. Wij hangen onze sectie in die
   main; bij het verlaten van de pagina verdwijnt ze mee, zonder React te
   hinderen. De sectie verschijnt enkel wanneer er gepubliceerde foto's zijn.
   Laat de site nooit breken: alles faalt stil.

   Vereist dat poortland_erp_content.js ook geladen is (die rendert de
   galerij zelf zodra de container [data-poortland-galerij] in de DOM staat). */
(function () {
  var url = (function () {
    var s = document.querySelector('script[data-content-url]');
    if (s && s.dataset && s.dataset.contentUrl) return s.dataset.contentUrl;
    return window.POORTLAND_ERP && window.POORTLAND_ERP.contentUrl;
  })();
  if (!url) return;

  var heeftFotos = false;

  fetch(url, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      heeftFotos = !!(j && j.fotos && j.fotos.length);
      if (!heeftFotos) return;       // niets gepubliceerd: geen lege sectie tonen
      probeer();
      var kijker = new MutationObserver(function () { probeer(); });
      kijker.observe(document.body, { childList: true, subtree: true });
    })
    .catch(function () { /* stil falen: de site blijft gewoon werken */ });

  // De realisatiespagina herken je aan haar unieke hero-titel.
  function opRealisaties() {
    var koppen = document.querySelectorAll('h1');
    for (var i = 0; i < koppen.length; i++) {
      if (/Elke poort vertelt een adres/i.test(koppen[i].textContent || '')) return true;
    }
    return false;
  }

  function probeer() {
    try {
      if (!heeftFotos || !opRealisaties()) return;
      if (document.getElementById('poortland-recent-geplaatst')) return;
      var main = document.querySelector('main.pl-page') ||
                 (function () {
                   var secties = document.querySelectorAll('section');
                   return secties.length ? secties[secties.length - 1].parentNode : null;
                 })();
      if (!main) return;

      var sectie = document.createElement('section');
      sectie.id = 'poortland-recent-geplaatst';
      sectie.style.cssText = 'padding:0 44px 96px;background:var(--surface-paper)';

      var binnen = document.createElement('div');
      binnen.style.cssText = 'max-width:1320px;margin:0 auto;border-top:1px solid var(--line-on-light-soft);padding-top:56px';

      var eyebrow = document.createElement('div');
      eyebrow.textContent = 'Recent geplaatst';
      eyebrow.style.cssText = 'font-family:var(--font-label);font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--text-faint);margin-bottom:14px';

      var kop = document.createElement('h2');
      kop.textContent = 'Vers van de werf.';
      kop.style.cssText = 'font-family:var(--font-display);font-weight:500;font-size:34px;color:var(--forest-950,#141C15);margin:0 0 8px;letter-spacing:-0.01em;line-height:1.05';

      var onder = document.createElement('p');
      onder.textContent = 'Foto’s die we recent publiceerden vanuit het atelier en de werf.';
      onder.style.cssText = 'font-family:var(--font-sans);font-size:15px;color:var(--text-muted);margin:0 0 26px;max-width:56ch;line-height:1.6';

      var galerij = document.createElement('div');
      galerij.setAttribute('data-poortland-galerij', '');
      galerij.setAttribute('data-filters', 'true');

      binnen.appendChild(eyebrow);
      binnen.appendChild(kop);
      binnen.appendChild(onder);
      binnen.appendChild(galerij);
      sectie.appendChild(binnen);
      main.appendChild(sectie);

      // poortland_erp_content.js vult de galerij; een handmatige scan versnelt dit.
      if (window.PoortlandErpContent && window.PoortlandErpContent.scan) {
        window.PoortlandErpContent.scan();
      }
    } catch (e) { /* stil falen */ }
  }
})();
