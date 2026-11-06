-- Feedback 2026-08-10: onbeperkt aantal plaatsingen en de vier werkbontypes
-- van de Leverings en Servicebon (LSB): plaatsing, automatisatie, onderhoud
-- en herstelling. Interventie gaat op in herstelling. Dezelfde lijn in de
-- planning: één generieke fase plaatsing in plaats van plaatsing_1 en _2.

-- Werkbon: volgnummer per dossier voor plaatsingen
alter table werkbon add column plaatsing_nummer int;
update werkbon set plaatsing_nummer = 1 where type = 'plaatsing_1';
update werkbon set plaatsing_nummer = 2 where type = 'plaatsing_2';

create type werkbon_type_nieuw as enum ('plaatsing','automatisatie','onderhoud','herstelling');
alter table werkbon alter column type type werkbon_type_nieuw
  using (case when type::text like 'plaatsing%' then 'plaatsing'
              else 'herstelling' end)::werkbon_type_nieuw;
drop type werkbon_type;
alter type werkbon_type_nieuw rename to werkbon_type;

-- Planning: plaatsing_1 en plaatsing_2 worden één fase plaatsing
create type projectfase_nieuw as enum ('voorbereiding','draadafsluiting','plaatsing','automatisering');
alter table planningsitem alter column fase type projectfase_nieuw
  using (case when fase::text like 'plaatsing%' then 'plaatsing'
              else fase::text end)::projectfase_nieuw;
drop type projectfase;
alter type projectfase_nieuw rename to projectfase;
