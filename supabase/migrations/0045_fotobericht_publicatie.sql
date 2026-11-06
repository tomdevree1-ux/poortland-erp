-- 0045: de fotopagina is bedoeld voor bestaande klanten die hun geplaatste poort
-- met ons willen delen, zodat Poortland ze bij de realisaties kan tonen
-- (correctie Tom 2026-09-24). Publiceren vraagt een eigen, uitdrukkelijke
-- toestemming naast het gewone privacyakkoord: de klant kiest bewust of het
-- beeld online mag. Wie enkel een foto stuurt zonder dat vinkje, deelt ze
-- vertrouwelijk met ons.

alter table fotobericht add column publicatie_akkoord boolean not null default false;
comment on column fotobericht.publicatie_akkoord is
  'De klant geeft toestemming om deze foto te tonen op de website en de sociale media van Poortland.';

alter table fotobericht add column gemeente text;
comment on column fotobericht.gemeente is
  'Optioneel, enkel om bij een realisatie de streek te kunnen vermelden.';

alter table fotobericht add column geplaatst_jaar integer;
comment on column fotobericht.geplaatst_jaar is 'Jaar van plaatsing, zoals de klant het opgaf.';
