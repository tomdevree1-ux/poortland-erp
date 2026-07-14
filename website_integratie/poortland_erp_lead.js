/* Poortland ERP · leads versturen vanaf de website (contactformulier en offertewizard).
   Gebruik in de submit afhandeling van het formulier:

   poortlandVerstuurLead({
     endpoint: 'https://ERP_BACKEND_DOMEIN/api/v1/leads/webformulier',
     soort: 'contact', // of 'offerteaanvraag'
     velden: { naam, voornaam, email, telefoon, gemeente, typeAanvraag, gewensteTiming, vraag },
     wizardGegevens: { stappen: [...] }, // enkel bij offerteaanvraag
     fotos: bestandInput.files,          // optioneel, maximaal 5
     turnstileToken: token               // verplicht in productie
   }).then(a => toonBedankt(a.boodschap)).catch(f => toonFout(f.message))
*/
window.poortlandVerstuurLead = async function (opties) {
  if (!opties || !opties.endpoint) throw new Error('endpoint ontbreekt');
  var form = new FormData();
  form.append('soort', opties.soort === 'offerteaanvraag' ? 'offerteaanvraag' : 'contact');
  var velden = opties.velden || {};
  ['naam', 'voornaam', 'email', 'telefoon', 'klantType', 'bedrijfsnaam', 'btwNummer', 'straat', 'postcode', 'gemeente', 'typeAanvraag', 'gewensteTiming', 'vraag'].forEach(function (sleutel) {
    if (velden[sleutel]) form.append(sleutel, velden[sleutel]);
  });
  form.append('privacyAkkoord', 'true'); // enkel versturen na het aangevinkte akkoord
  if (opties.wizardGegevens) form.append('wizardGegevens', JSON.stringify(opties.wizardGegevens));
  if (opties.turnstileToken) form.append('turnstileToken', opties.turnstileToken);
  if (opties.fotos) {
    var lijst = Array.prototype.slice.call(opties.fotos, 0, 5);
    lijst.forEach(function (foto) { form.append('fotos', foto); });
  }
  var antwoord = await fetch(opties.endpoint, { method: 'POST', body: form });
  var json = {};
  try { json = await antwoord.json(); } catch (f) { }
  if (!antwoord.ok) throw new Error(json.fout || 'Versturen mislukt. Probeer later opnieuw.');
  return json;
};
