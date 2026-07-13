-- 0019 Offertesjabloon instellingen: echte bedrijfsgegevens (uit de LSB
-- brondocumenten), de voorwaardentekst en het voorschotpercentage als data
-- zodat de beheerder ze kan aanpassen zonder release (configuratie boven code).
insert into instelling (sleutel, waarde, omschrijving) values
  ('bedrijfsgegevens',
   '{"naam":"Poortland nv","straat":"Hombeeksesteenweg 164 166","postcode":"2800","gemeente":"Mechelen","telefoon":"015 43 21 11","btw":"BE 0464.838.351"}',
   'Bedrijfsgegevens voor documenthoofdingen'),
  ('voorschot_percentage', '30', 'Voorschot bij bestelling als percentage van het totaal incl. btw'),
  ('offerte_voorwaarden',
   '"Voorschot bij bestelling, saldo na plaatsing. Levertermijn in overleg na opmeting. Garantie 24 maanden op constructie en automatisatie. Betaling 14 dagen na factuurdatum. Deze offerte is vrijblijvend tot de vermelde geldigheidsdatum."',
   'Voorwaardentekst onderaan de offerte')
on conflict (sleutel) do update set waarde = excluded.waarde, omschrijving = excluded.omschrijving;
