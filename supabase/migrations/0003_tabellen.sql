-- 0003 Tabellen flow 1 (TS-01 secties 3 en 6, TS-17 sectie 4, bouwspec hoofdstuk 4)
-- Elke domeintabel draagt de standaard auditkolommen uit TS-01 sectie 3.

-- 6.1 medewerker
create table medewerker (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete restrict,
  naam text not null,
  email citext not null unique,
  telefoon text,
  is_actief boolean not null default true,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.16 rollen per medewerker
create table medewerker_rol (
  medewerker_id uuid not null references medewerker(id) on delete cascade,
  rol rol not null,
  primary key (medewerker_id, rol)
);

-- TS-02 sectie 5.1: de rechtenmatrix als data
create table recht (
  rol rol not null,
  entiteit text not null,
  acties text not null,
  primary key (rol, entiteit)
);

-- TS-02 sectie 6.1: toegelaten statusovergangen als data
create table statusovergang (
  entiteit text not null,
  van_status text not null,
  naar_status text not null,
  toegestane_rollen rol[] not null,
  primary key (entiteit, van_status, naar_status)
);

-- Bouwspec hoofdstuk 4: configuratie boven code
create table instelling (
  sleutel text primary key,
  waarde jsonb not null,
  omschrijving text
);

-- 6.2 klant
create table klant (
  id uuid primary key default gen_random_uuid(),
  type klant_type not null,
  naam text not null,
  btw_nummer text,
  straat text,
  postcode text,
  gemeente text,
  land text not null default 'BE',
  email citext,
  telefoon text,
  communicatietaal taal not null default 'nl',
  communicatievoorkeur text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint klant_bedrijf_btw check (type <> 'bedrijf' or btw_nummer is not null)
);

-- 6.3 contactpersoon
create table contactpersoon (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid not null references klant(id) on delete cascade,
  naam text not null,
  functie text,
  email citext,
  telefoon text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.6 project
create table project (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid not null references klant(id) on delete restrict,
  werfadres text not null,
  omschrijving text,
  status order_status not null default 'aangemaakt',
  garantie_maanden integer not null default 24,
  verwachte_opleverdatum date,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.4 contactmoment
create table contactmoment (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid not null references klant(id) on delete cascade,
  project_id uuid references project(id) on delete set null,
  medewerker_id uuid not null references medewerker(id),
  type text not null check (type in ('telefoon','email','bezoek')),
  datum timestamptz not null default now(),
  notitie text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.5 lead
create table lead (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid references klant(id) on delete set null,
  kanaal lead_kanaal not null,
  status lead_status not null default 'nieuw',
  eigenaar_id uuid not null references medewerker(id),
  opvolgdatum date,
  naam text,
  email citext,
  telefoon text,
  eerste_vraag text,
  prijsindicatie numeric(12,2),
  verlies_reden text,
  omgezet_project_id uuid references project(id) on delete set null,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- Bouwspec hoofdstuk 4: artikelcatalogus v1 (open punt TS-01 en TS-05)
create table artikel (
  id uuid primary key default gen_random_uuid(),
  code citext not null unique,
  omschrijving text not null,
  eenheid artikel_eenheid not null default 'stuk',
  basisprijs numeric(12,2) not null,
  btw_default btw_tarief not null default 'p21',
  is_actief boolean not null default true,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.7 offerte
create table offerte (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  nummer text not null unique,
  versie_offerte integer not null default 1,
  status offerte_status not null default 'nieuw',
  taal taal not null default 'nl',
  geldig_tot date not null,
  korting_percentage numeric(5,2) not null default 0,
  korting_bedrag numeric(12,2) not null default 0,
  totaal_excl_btw numeric(12,2) not null default 0,
  totaal_btw numeric(12,2) not null default 0,
  totaal_incl_btw numeric(12,2) not null default 0,
  verzonden_op timestamptz,
  beslist_op timestamptz,
  weiger_reden text,
  ondertekend_document_pad text,
  ondertekend_op timestamptz,
  esignature_referentie text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint offerte_totaal_consistent check (totaal_incl_btw = totaal_excl_btw + totaal_btw),
  constraint offerte_korting_geldig check (korting_percentage >= 0 and korting_percentage <= 100 and korting_bedrag >= 0)
);

-- 6.8 offerteregel
create table offerteregel (
  id uuid primary key default gen_random_uuid(),
  offerte_id uuid not null references offerte(id) on delete cascade,
  volgnummer integer not null,
  soort text not null default 'product' check (soort in ('product','optie','accessoire','vrij')),
  artikel_id uuid references artikel(id) on delete set null,
  omschrijving text not null,
  aantal numeric(12,2) not null default 1 check (aantal > 0),
  eenheid artikel_eenheid not null default 'stuk',
  eenheidsprijs numeric(12,2) not null,
  korting_bedrag numeric(12,2) not null default 0 check (korting_bedrag >= 0),
  btw btw_tarief not null,
  totaal numeric(12,2) not null,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  unique (offerte_id, volgnummer)
);

-- 6.9 order (aanhalingstekens want gereserveerd woord)
create table "order" (
  id uuid primary key default gen_random_uuid(),
  offerte_id uuid not null unique references offerte(id) on delete restrict,
  datum_goedkeuring date not null,
  status order_status not null default 'aangemaakt',
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- Nummering: reeks per jaar (TS-01 sectie 11 voorstel OFF-{jaar}-{volgnummer})
create table offerte_reeks (
  jaar integer primary key,
  volgende integer not null default 1
);

-- 6.17 opvolgtaak (FR-005)
create table opvolgtaak (
  id uuid primary key default gen_random_uuid(),
  type opvolgtaak_type not null,
  offerte_id uuid references offerte(id) on delete cascade,
  lead_id uuid references lead(id) on delete cascade,
  medewerker_id uuid not null references medewerker(id),
  due_datum date not null,
  status opvolgtaak_status not null default 'open',
  omschrijving text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.17 communicatie (verzonden klantcommunicatie bij het dossier)
create table communicatie (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid not null references klant(id) on delete cascade,
  project_id uuid references project(id) on delete set null,
  offerte_id uuid references offerte(id) on delete set null,
  kanaal text not null default 'email' check (kanaal = 'email'),
  onderwerp text not null,
  inhoud text,
  inhoud_pad text,
  verzonden_op timestamptz not null default now(),
  status communicatie_status not null default 'gelogd',
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- 6.17 notificatie (interne meldingen)
create table notificatie (
  id uuid primary key default gen_random_uuid(),
  medewerker_id uuid not null references medewerker(id) on delete cascade,
  type text not null,
  titel text not null,
  boodschap text,
  entiteit_type text,
  entiteit_id uuid,
  gelezen_op timestamptz,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- TS-17 sectie 4.1 website_media
create table website_media (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  alt_tekst text,
  categorie text,
  volgnummer integer not null default 0,
  status website_content_status not null default 'concept',
  bestand_pad_origineel text not null,
  bestand_pad_web text,
  bestand_pad_thumb text,
  breedte integer,
  hoogte integer,
  personen_in_beeld boolean not null default false,
  toestemming_bevestigd boolean not null default false,
  gepubliceerd_op timestamptz,
  gepubliceerd_door uuid references medewerker(id),
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

-- TS-17 sectie 4.2 website_popup
create table website_popup (
  id uuid primary key default gen_random_uuid(),
  titel text not null check (char_length(titel) <= 80),
  body_tekst text not null check (char_length(body_tekst) <= 500),
  actief_van date not null,
  actief_tot date not null,
  status website_content_status not null default 'concept',
  gepubliceerd_op timestamptz,
  gepubliceerd_door uuid references medewerker(id),
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint popup_periode_geldig check (actief_tot >= actief_van)
);

-- TS-01 sectie 8 audit_log (append only)
create table audit_log (
  id bigint generated always as identity primary key,
  tijdstip timestamptz not null default now(),
  actor_id uuid,
  actie text not null,
  entiteit_type text not null,
  entiteit_id uuid,
  oude_waarde jsonb,
  nieuwe_waarde jsonb
);
