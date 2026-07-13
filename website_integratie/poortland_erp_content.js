/* Poortland ERP · websitekoppeling voor de galerij en de popup (TS-17).
   Gebruik:
   <script src="poortland_erp_content.js"
     data-content-url="https://rbttjhjrdnndamagqmui.supabase.co/storage/v1/object/public/website_publiek/content.json"
     defer></script>
   Galerij: zet waar gewenst <div data-poortland-galerij></div>
   (optioneel met data-categorie="realisaties"). De popup verschijnt vanzelf
   hoogstens 1 keer per bezoeker per ingestelde periode. Geen sleutels nodig:
   de website leest alleen. */
(function () {
  var script = document.currentScript;
  var contentUrl = script && script.dataset ? script.dataset.contentUrl : null;
  if (!contentUrl) { console.warn('Poortland ERP: data-content-url ontbreekt'); return; }
  var sleutel = 'poortland_popup_gezien_op';

  fetch(contentUrl, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (inhoud) {
      if (!inhoud) return;
      renderGalerij(inhoud.fotos || []);
      toonPopup(inhoud.popup, inhoud.popupFrequentieDagen || 7);
    })
    .catch(function () { /* stil falen: de site blijft gewoon werken */ });

  function renderGalerij(fotos) {
    var houders = document.querySelectorAll('[data-poortland-galerij]');
    Array.prototype.forEach.call(houders, function (houder) {
      var categorie = houder.dataset ? houder.dataset.categorie : null;
      var lijst = categorie ? fotos.filter(function (f) { return f.categorie === categorie; }) : fotos;
      if (!lijst.length) return;
      var raster = document.createElement('div');
      raster.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px';
      lijst.forEach(function (f) {
        var anker = document.createElement('a');
        anker.href = f.url; anker.target = '_blank'; anker.rel = 'noreferrer';
        var beeld = document.createElement('img');
        beeld.src = f.thumb; beeld.alt = f.alt || ''; beeld.loading = 'lazy';
        beeld.style.cssText = 'width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px';
        anker.appendChild(beeld);
        raster.appendChild(anker);
      });
      houder.innerHTML = '';
      houder.appendChild(raster);
    });
  }

  function toonPopup(popup, dagen) {
    if (!popup || !popup.titel) return;
    try {
      var gezien = localStorage.getItem(sleutel);
      if (gezien && (Date.now() - Number(gezien)) < dagen * 864e5) return;
    } catch (f) { /* private modus: dan gewoon tonen */ }

    var sluier = document.createElement('div');
    sluier.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,22,15,.55);padding:20px';
    var kaart = document.createElement('div');
    kaart.setAttribute('role', 'dialog');
    kaart.setAttribute('aria-modal', 'true');
    kaart.setAttribute('aria-label', popup.titel);
    kaart.style.cssText = 'max-width:420px;width:100%;background:#FAF6EE;color:#141C15;border-radius:8px;padding:26px;font-family:inherit;box-shadow:0 24px 60px rgba(15,22,15,.35)';
    kaart.innerHTML =
      '<div style="font-size:10.5px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#8A6A3C">Poortland</div>' +
      '<div style="font-size:24px;font-weight:600;margin-top:6px">' + ontsmet(popup.titel) + '</div>' +
      '<p style="font-size:14px;line-height:1.65;color:#6E6450;margin:10px 0 18px;white-space:pre-line">' + ontsmet(popup.body) + '</p>' +
      '<div style="text-align:right"><button type="button" style="background:#A6824C;color:#FAF6EE;border:0;border-radius:5px;padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer">Sluiten</button></div>';
    sluier.appendChild(kaart);
    document.body.appendChild(sluier);
    var knop = kaart.querySelector('button');
    function sluit() {
      sluier.remove();
      document.removeEventListener('keydown', opToets);
      try { localStorage.setItem(sleutel, String(Date.now())); } catch (f) { }
    }
    function opToets(e) { if (e.key === 'Escape') sluit(); }
    knop.addEventListener('click', sluit);
    sluier.addEventListener('click', function (e) { if (e.target === sluier) sluit(); });
    document.addEventListener('keydown', opToets);
    knop.focus();
  }

  function ontsmet(tekst) {
    var d = document.createElement('div');
    d.textContent = tekst == null ? '' : String(tekst);
    return d.innerHTML;
  }
})();
