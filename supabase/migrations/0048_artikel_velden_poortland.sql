-- De artikeltabel krijgt de velden van het productbestand dat Poortland
-- aanleverde (export 25 september 2026, 915 regels). Zijn indeling blijft
-- leidend: categorie 1 en 2, leverancier met artikelnummer, merk, model, type
-- en standaardmaten. Het oude Id komt mee als herkenningspunt, het is geen
-- sleutel want 43 nummers worden door meerdere verschillende producten gedeeld.

alter table artikel
  add column if not exists naam               text,
  add column if not exists categorie1         text,
  add column if not exists categorie2         text,
  add column if not exists leverancier        text,
  add column if not exists leverancier_nummer text,
  add column if not exists merk               text,
  add column if not exists model              text,
  add column if not exists type               text,
  add column if not exists std_maten          text,
  add column if not exists poortland_id       integer,
  add column if not exists prijs_ontbreekt    boolean not null default false;

-- Bestaande regels hebben nog geen naam; de omschrijving dient als terugval.
update artikel set naam = omschrijving where naam is null;
alter table artikel alter column naam set not null;

comment on column artikel.naam is
  'Korte naam op offerte en werkbon. Gelijk aan de omschrijving, of afgeleid uit merk, type of model wanneer die leeg was.';
comment on column artikel.poortland_id is
  'Het Id uit het productbestand van Poortland. Niet uniek, enkel ter herkenning.';
comment on column artikel.prijs_ontbreekt is
  'Staat aan zolang er geen prijs bekend is. Het aangeleverde bestand bevatte geen enkele prijs.';

-- Zoeken en filteren in het artikelenscherm.
create index if not exists artikel_categorie_idx on artikel (categorie1, categorie2)
  where verwijderd_op is null;
create index if not exists artikel_leverancier_idx on artikel (leverancier)
  where verwijderd_op is null;
create index if not exists artikel_naam_idx on artikel (lower(naam))
  where verwijderd_op is null;
