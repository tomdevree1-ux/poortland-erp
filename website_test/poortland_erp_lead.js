/* Poortland ERP · leads versturen vanaf de website (contactformulier en offertewizard).
   Gebruik in de submit afhandeling van het formulier:

   poortlandVerstuurLead({
     endpoint: 'https://ERP_BACKEND_DOMEIN/api/v1/leads/webformulier',
     soort: 'contact', // of 'offerteaanvraag'
     velden: { naam, voornaam, email, telefoon, klantType, bedrijfsnaam, btwNummer, straat, postcode, gemeente, typeAanvraag, gewensteTiming, vraag },
     wizardGegevens: { stappen: [...] }, // enkel bij offerteaanvraag
     fotos: bestandInput.files,          // optioneel, maximaal 5
     turnstileToken: token               // optioneel; wordt anders vanzelf opgehaald
   }).then(a => toonBedankt(a.boodschap)).catch(f => toonFout(f.message))

   Botbescherming met Cloudflare Turnstile:
   Zet de publieke sitesleutel in de config, dan haalt de verzender vanzelf een
   token op en stuurt het mee. Zonder sleutel verandert er niets en valt de
   backend terug op de snelheidslimiet.
     window.POORTLAND_ERP = { leadEndpoint: '...', turnstileSiteKey: '0x4AAA...' };
   De bijhorende geheime sleutel hoort op de server (Turnstile:Secret).
*/
(function () {
  var turnstileGeladen = null;
  function laadTurnstile() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileGeladen) return turnstileGeladen;
    turnstileGeladen = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true; s.defer = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Turnstile kon niet laden')); };
      document.head.appendChild(s);
    });
    return turnstileGeladen;
  }

  // Vraagt op de achtergrond een Turnstile token. Zonder sitesleutel of bij een
  // fout geeft het een lege string terug zodat het formulier blijft werken.
  window.poortlandTurnstileToken = function () {
    var cfg = window.POORTLAND_ERP || {};
    var key = cfg.turnstileSiteKey;
    if (!key) return Promise.resolve('');
    return laadTurnstile().then(function () {
      return new Promise(function (resolve) {
        var box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.bottom = '16px';
        box.style.right = '16px';
        box.style.zIndex = '2147483647';
        document.body.appendChild(box);
        var klaar = false;
        function af(token) {
          if (klaar) return;
          klaar = true;
          try { window.turnstile.remove(id); } catch (e) { }
          setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 300);
          resolve(token || '');
        }
        var id = window.turnstile.render(box, {
          sitekey: key,
          callback: function (t) { af(t); },
          'error-callback': function () { af(''); },
          'timeout-callback': function () { af(''); }
        });
        // Vangnet: nooit langer dan 30 seconden blijven wachten.
        setTimeout(function () { af(''); }, 30000);
      });
    }).catch(function () { return ''; });
  };

  window.poortlandVerstuurLead = async function (opties) {
    if (!opties || !opties.endpoint) throw new Error('endpoint ontbreekt');
    var token = opties.turnstileToken;
    if (!token && window.poortlandTurnstileToken) {
      try { token = await window.poortlandTurnstileToken(); } catch (f) { token = ''; }
    }
    var form = new FormData();
    form.append('soort', opties.soort === 'offerteaanvraag' ? 'offerteaanvraag' : 'contact');
    var velden = opties.velden || {};
    ['naam', 'voornaam', 'email', 'telefoon', 'klantType', 'bedrijfsnaam', 'btwNummer', 'straat', 'postcode', 'gemeente', 'typeAanvraag', 'gewensteTiming', 'vraag'].forEach(function (sleutel) {
      if (velden[sleutel]) form.append(sleutel, velden[sleutel]);
    });
    form.append('privacyAkkoord', 'true'); // enkel versturen na het aangevinkte akkoord
    if (opties.wizardGegevens) form.append('wizardGegevens', JSON.stringify(opties.wizardGegevens));
    if (token) form.append('turnstileToken', token);
    if (opties.fotos) {
      var lijst = Array.prototype.slice.call(opties.fotos, 0, 5);
      for (var fi = 0; fi < lijst.length; fi++) {
        if (lijst[fi] && lijst[fi].size > 10 * 1024 * 1024)
          throw new Error("De foto '" + (lijst[fi].name || 'nummer ' + (fi + 1)) + "' is groter dan 10 MB. Verklein de foto en probeer opnieuw.");
      }
      lijst.forEach(function (foto) { form.append('fotos', foto); });
    }
    var antwoord = await fetch(opties.endpoint, { method: 'POST', body: form });
    var json = {};
    try { json = await antwoord.json(); } catch (f) { }
    if (!antwoord.ok) throw new Error(json.fout || 'Versturen mislukt. Probeer later opnieuw.');
    return json;
  };
})();
