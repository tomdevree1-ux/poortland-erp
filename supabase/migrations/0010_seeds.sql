-- 0010 Seeds: instellingen, artikelcatalogus v1 en opslagbuckets
-- Synthetische data, geen persoonsgegevens (TS-15 sectie 2).

insert into instelling (sleutel, waarde, omschrijving) values
  ('opvolgtermijn_dagen', '14', 'Kalenderdagen zonder reactie voor een automatische opvolgtaak (TS-04, FR-005)'),
  ('offerte_geldigheid_dagen', '30', 'Standaard geldigheidsduur van een offerte in dagen'),
  ('popup_frequentie_dagen', '7', 'Vertoningsfrequentie van de website popup per bezoeker (TS-17)'),
  ('bootstrap_beheerder_email', '"tomdevree1@gmail.com"', 'De eerste aanmelding met dit emailadres wordt automatisch beheerder'),
  ('bedrijfsgegevens', '{"naam":"Poortland BV","adres":"Mechelen","land":"BE"}', 'Gegevens voor de offertehoofding')
on conflict (sleutel) do nothing;

insert into artikel (code, omschrijving, eenheid, basisprijs, btw_default) values
  ('POORT-DRAAI-ALU',    'Aluminium draaipoort enkel',          'stuk',            2450.00, 'p21'),
  ('POORT-DRAAI-ALU-D',  'Aluminium draaipoort dubbel',         'stuk',            3950.00, 'p21'),
  ('POORT-SCHUIF-ALU',   'Aluminium schuifpoort',               'stuk',            5200.00, 'p21'),
  ('POORT-SCHUIF-COR',   'Corten schuifpoort',                  'stuk',            6800.00, 'p21'),
  ('HEK-PANEEL',         'Hekwerk paneel',                      'lopende_meter',    185.00, 'p21'),
  ('AUTOM-24V',          'Poortautomatisatie 24V set',          'stuk',            1450.00, 'p21'),
  ('BESLAG-INOX',        'Inox beslagset',                      'stuk',             240.00, 'p21'),
  ('LAK-RAL',            'Lakwerk in RAL kleur',                'vierkante_meter',   48.00, 'p21'),
  ('PLAATSING-DAG',      'Plaatsing (dagtarief)',               'stuk',             680.00, 'p21')
on conflict (code) do nothing;

-- Opslag: originelen privaat en de publicatielaag publiek (TS-17 sectie 3).
insert into storage.buckets (id, name, public)
values ('website_origineel', 'website_origineel', false),
       ('website_publiek', 'website_publiek', true)
on conflict (id) do nothing;
