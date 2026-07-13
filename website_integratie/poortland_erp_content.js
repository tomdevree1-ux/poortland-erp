/* Poortland ERP · websitekoppeling voor galerijen, stroken, banner en popup (TS-17).
   Basis:
   <script src="poortland_erp_content.js" data-content-url="…/content.json" defer></script>

   Weergaven (zet een leeg element op de gewenste plek):
   1. Raster (standaard):      <div data-poortland-galerij></div>
   2. Productstrook:           <div data-poortland-galerij data-weergave="strook"
                                    data-product-soort="poort" data-poort-type="hout"></div>
      (horizontale scrol, enkel het eigen producttype: houten poorten alleen
      op de landingspagina van houten poorten)
   3. Realisaties met filters: <div data-poortland-galerij data-filters="true"></div>
      (alles wordt getoond en de bezoeker filtert zelf)
   4. Lopende banner homepagina: <div data-poortland-galerij data-weergave="banner"></div>
      (alle foto's door elkaar in een doorlopende band)

   Filterwaarden: data-product-soort poort of overkapping,
   data-poort-type hout, metaal of hout_metaal,
   data-uitvoering draaipoort of schuifpoort. Geen sleutels nodig. */
(function () {
  var script = document.currentScript;
  var contentUrl = script && script.dataset ? script.dataset.contentUrl : null;
  if (!contentUrl) { console.warn('Poortland ERP: data-content-url ontbreekt'); return; }
  var sleutel = 'poortland_popup_gezien_op';
  var typeLabels = { hout: 'Houten poorten', metaal: 'Metalen poorten', hout_metaal: 'Hout en metaal' };

  fetch(contentUrl, { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (inhoud) {
      if (!inhoud) return;
      var houders = document.querySelectorAll('[data-poortland-galerij]');
      Array.prototype.forEach.call(houders, function (houder) {
        renderHouder(houder, inhoud.fotos || []);
      });
      toonPopup(inhoud.popup, inhoud.popupFrequentieDagen || 7);
    })
    .catch(function () { /* stil falen: de site blijft gewoon werken */ });

  function filterFotos(fotos, d) {
    return fotos.filter(function (f) {
      if (d.productSoort && f.productSoort !== d.productSoort) return false;
      if (d.poortType && f.poortType !== d.poortType) return false;
      if (d.uitvoering && f.uitvoering !== d.uitvoering) return false;
      if (d.categorie && f.categorie !== d.categorie) return false;
      return true;
    });
  }

  function beeld(f, stijl) {
    var anker = document.createElement('a');
    anker.href = f.url; anker.target = '_blank'; anker.rel = 'noreferrer';
    var img = document.createElement('img');
    img.src = f.thumb; img.alt = f.alt || ''; img.loading = 'lazy';
    img.style.cssText = stijl;
    anker.appendChild(img);
    return anker;
  }

  function renderRaster(houder, fotos) {
    var raster = document.createElement('div');
    raster.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px';
    fotos.forEach(function (f) {
      raster.appendChild(beeld(f, 'width:100%;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px'));
    });
    return raster;
  }

  function renderStrook(fotos) {
    var strook = document.createElement('div');
    strook.style.cssText = 'display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch';
    fotos.forEach(function (f) {
      var item = beeld(f, 'height:220px;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px');
      item.style.cssText = 'flex:0 0 auto;scroll-snap-align:start';
      strook.appendChild(item);
    });
    return strook;
  }

  function renderBanner(fotos) {
    var buiten = document.createElement('div');
    buiten.style.cssText = 'overflow:hidden;position:relative';
    var band = document.createElement('div');
    band.style.cssText = 'display:flex;gap:14px;width:max-content;animation:poortlandband 40s linear infinite';
    var lijst = fotos.concat(fotos); // dubbel voor een naadloze lus
    lijst.forEach(function (f) {
      var item = beeld(f, 'height:180px;aspect-ratio:4/3;object-fit:cover;display:block;border-radius:6px');
      item.style.cssText = 'flex:0 0 auto';
      band.appendChild(item);
    });
    band.addEventListener('mouseenter', function () { band.style.animationPlayState = 'paused'; });
    band.addEventListener('mouseleave', function () { band.style.animationPlayState = 'running'; });
    if (!document.getElementById('poortland-band-stijl')) {
      var stijl = document.createElement('style');
      stijl.id = 'poortland-band-stijl';
      stijl.textContent = '@keyframes poortlandband{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
      document.head.appendChild(stijl);
    }
    buiten.appendChild(band);
    return buiten;
  }

  function renderMetFilters(houder, fotos) {
    var wrap = document.createElement('div');
    var actief = { poortType: '', uitvoering: '' };
    var balk = document.createElement('div');
    balk.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px';
    var lijstHouder = document.createElement('div');

    function chip(tekst, groep, waarde) {
      var knop = document.createElement('button');
      knop.type = 'button';
      knop.textContent = tekst;
      knop.style.cssText = 'padding:6px 14px;border-radius:999px;border:1px solid currentColor;background:none;color:inherit;font:inherit;font-size:13px;cursor:pointer;opacity:.55';
      knop.addEventListener('click', function () {
        actief[groep] = waarde;
        teken();
      });
      knop.dataset.groep = groep; knop.dataset.waarde = waarde;
      return knop;
    }

    [['Alle', 'poortType', ''], ['Houten poorten', 'poortType', 'hout'],
     ['Metalen poorten', 'poortType', 'metaal'], ['Hout en metaal', 'poortType', 'hout_metaal'],
     ['Draaipoorten', 'uitvoering', 'draaipoort'], ['Schuifpoorten', 'uitvoering', 'schuifpoort']]
      .forEach(function (c) { balk.appendChild(chip(c[0], c[1], c[2])); });

    function teken() {
      Array.prototype.forEach.call(balk.children, function (knop) {
        var aan = actief[knop.dataset.groep] === knop.dataset.waarde;
        if (knop.dataset.waarde === '' && knop.dataset.groep === 'poortType') {
          aan = actief.poortType === '' && actief.uitvoering === '';
          if (aan) actief.uitvoering = '';
        }
        knop.style.opacity = aan ? '1' : '.55';
        knop.style.fontWeight = aan ? '700' : '400';
      });
      var selectie = fotos.filter(function (f) {
        if (f.productSoort !== 'poort') return false;
        if (actief.poortType && f.poortType !== actief.poortType) return false;
        if (actief.uitvoering && f.uitvoering !== actief.uitvoering) return false;
        return true;
      });
      lijstHouder.innerHTML = '';
      lijstHouder.appendChild(renderRaster(lijstHouder, selectie));
    }
    wrap.appendChild(balk);
    wrap.appendChild(lijstHouder);
    teken();
    return wrap;
  }

  function renderHouder(houder, fotos) {
    var d = houder.dataset || {};
    var weergave = d.weergave || 'raster';
    var element;
    if (d.filters === 'true') {
      element = renderMetFilters(houder, fotos);
    } else {
      var selectie = filterFotos(fotos, d);
      if (!selectie.length) return;
      if (weergave === 'strook') element = renderStrook(selectie);
      else if (weergave === 'banner') element = renderBanner(selectie);
      else element = renderRaster(houder, selectie);
    }
    houder.innerHTML = '';
    houder.appendChild(element);
  }

  function toonPopup(popup, dagen) {
    if (!popup || !popup.titel) return;
    try {
      var gezien = localStorage.getItem(sleutel);
      if (gezien && (Date.now() - Number(gezien)) < dagen * 864e5) return;
    } catch (f) { }
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
