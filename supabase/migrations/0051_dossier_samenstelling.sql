-- 0051 Samenstelling van een dossier (Tom 2026-11-18, gratis binnen de
-- maandvergoeding, vragenlijst "Vragen voor Jef over het dossier").
--
-- Een dossier (project) bij een klant kan meerdere subprojecten hebben: elke
-- poort, afsluiting, garagepoort of overkapping die geplaatst wordt, met een
-- eigen locatie in een vrij veld (bijvoorbeeld "oprit" of "tuin achteraan").
-- Een subproject heeft onderdelen, zoals vleugel links en vleugel rechts, met
-- per vleugel een eigen breedte en hoogte. Onderdelen kunnen zelf onderdelen
-- hebben, zodat er geen vaste diepte is.
--
-- Het globaal overzicht van een project bestaat uit regels in vier rubrieken
-- (accessoires, automatisering, hekwerk, opdracht). Een regel verwijst naar een
-- artikel of is vrije tekst (enkel onder opdracht). De omschrijving hoort bij de
-- regel en laat het artikel zelf ongewijzigd. Een regel hangt aan het project en
-- optioneel aan een subproject of onderdeel. Elke regel komt op hoogstens een
-- Leverings en Servicebon (LSB); bij plaatsing kiest Jef welke plaatsing.

create table subproject (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  naam text not null,
  locatie text,
  soort text not null default 'poort'
    check (soort in ('poort', 'afsluiting', 'garagepoort', 'overkapping')),
  type text,
  volgnummer integer not null default 0,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
comment on table subproject is
  'Een poort, afsluiting, garagepoort of overkapping binnen een dossier, met een eigen locatie.';
comment on column subproject.soort is 'De groepen uit het datamodel Poortland de bomen.';
comment on column subproject.type is 'Vrije omschrijving, bijvoorbeeld dubbele draaipoort.';
create index idx_subproject_project on subproject (project_id, volgnummer) where verwijderd_op is null;

create table subproject_onderdeel (
  id uuid primary key default gen_random_uuid(),
  subproject_id uuid not null references subproject(id) on delete cascade,
  ouder_id uuid references subproject_onderdeel(id) on delete cascade,
  naam text not null,
  breedte_mm integer check (breedte_mm is null or breedte_mm between 1 and 50000),
  hoogte_mm integer check (hoogte_mm is null or hoogte_mm between 1 and 20000),
  volgnummer integer not null default 0,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint subproject_onderdeel_niet_eigen_ouder check (ouder_id is null or ouder_id <> id)
);
comment on table subproject_onderdeel is
  'Onderdeel van een subproject, bijvoorbeeld vleugel links of motor rechts. Kan zelf onderdelen hebben.';
comment on column subproject_onderdeel.breedte_mm is 'Breedte in millimeter, vooral voor vleugels.';
comment on column subproject_onderdeel.hoogte_mm is 'Hoogte in millimeter, vooral voor vleugels.';
create index idx_subproject_onderdeel_sub on subproject_onderdeel (subproject_id, volgnummer) where verwijderd_op is null;

create table projectregel (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  subproject_id uuid references subproject(id) on delete set null,
  onderdeel_id uuid references subproject_onderdeel(id) on delete set null,
  rubriek text not null
    check (rubriek in ('accessoires', 'automatisering', 'hekwerk', 'opdracht')),
  artikel_id uuid references artikel(id) on delete set null,
  artikel_code text,
  omschrijving text not null,
  aantal numeric(12,2) not null default 1 check (aantal > 0),
  opdracht_soort text
    check (opdracht_soort is null or opdracht_soort in ('plaatsing', 'automatisatie', 'herstelling')),
  geplande_datum date,
  lsb_type werkbon_type,
  lsb_plaatsing_nummer integer,
  volgnummer integer not null default 0,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint projectregel_artikel_of_opdracht check (artikel_id is not null or artikel_code is not null or rubriek = 'opdracht'),
  constraint projectregel_plaatsing_nummer check (
    (lsb_type is distinct from 'plaatsing' and lsb_plaatsing_nummer is null)
    or (lsb_type = 'plaatsing' and lsb_plaatsing_nummer is not null and lsb_plaatsing_nummer between 1 and 20))
);
comment on table projectregel is
  'Regel in het globaal overzicht van een dossier: een artikel of een opdracht, met de LSB waarop ze komt.';
comment on column projectregel.omschrijving is
  'Overgenomen van het artikel en aan te vullen voor dit dossier. Wijzigt het artikel zelf niet.';
comment on column projectregel.geplande_datum is 'Geplande datum van een opdracht, aanpasbaar en mag leeg zijn.';
comment on column projectregel.lsb_type is 'De LSB waarop deze regel komt. Leeg zolang er nog niet gekozen is.';
create index idx_projectregel_project on projectregel (project_id, rubriek, volgnummer) where verwijderd_op is null;
create index idx_projectregel_sub on projectregel (subproject_id) where verwijderd_op is null;
create index idx_projectregel_artikel on projectregel (artikel_id) where verwijderd_op is null;

-- Aantal plaatsingskolommen in het globaal overzicht. Jef kan er bijmaken.
alter table project add column lsb_plaatsingen integer not null default 1
  check (lsb_plaatsingen between 1 and 20);

-- Een werkbonregel onthoudt uit welke regel van het overzicht ze komt, zodat
-- het overzetten naar de LSB nooit dubbel gebeurt.
alter table werkbonregel add column projectregel_id uuid references projectregel(id) on delete set null;
create unique index werkbonregel_projectregel_uniek on werkbonregel (werkbon_id, projectregel_id)
  where projectregel_id is not null and verwijderd_op is null;

create trigger trg_meta_subproject before update on subproject
  for each row execute function bijwerk_metadata();
create trigger trg_audit_subproject after insert or update or delete on subproject
  for each row execute function schrijf_audit();
create trigger trg_meta_subproject_onderdeel before update on subproject_onderdeel
  for each row execute function bijwerk_metadata();
create trigger trg_audit_subproject_onderdeel after insert or update or delete on subproject_onderdeel
  for each row execute function schrijf_audit();
create trigger trg_meta_projectregel before update on projectregel
  for each row execute function bijwerk_metadata();
create trigger trg_audit_projectregel after insert or update or delete on projectregel
  for each row execute function schrijf_audit();

-- Rechten volgen het domein project, zoals het dossier zelf. De select policy
-- laat de eigen zacht verwijderde rij toe voor wie mag wijzigen (les van 0038).
alter table subproject enable row level security;
create policy subproject_select on subproject for select
  using (mag('project','R') and (verwijderd_op is null or mag('project','U')));
create policy subproject_insert on subproject for insert with check (mag('project','C') or mag('project','U'));
create policy subproject_update on subproject for update
  using (mag('project','U')) with check (mag('project','U'));
create policy subproject_delete on subproject for delete using (mag('project','D'));

alter table subproject_onderdeel enable row level security;
create policy subproject_onderdeel_select on subproject_onderdeel for select
  using (mag('project','R') and (verwijderd_op is null or mag('project','U')));
create policy subproject_onderdeel_insert on subproject_onderdeel for insert with check (mag('project','C') or mag('project','U'));
create policy subproject_onderdeel_update on subproject_onderdeel for update
  using (mag('project','U')) with check (mag('project','U'));
create policy subproject_onderdeel_delete on subproject_onderdeel for delete using (mag('project','D'));

alter table projectregel enable row level security;
create policy projectregel_select on projectregel for select
  using (mag('project','R') and (verwijderd_op is null or mag('project','U')));
create policy projectregel_insert on projectregel for insert with check (mag('project','C') or mag('project','U'));
create policy projectregel_update on projectregel for update
  using (mag('project','U')) with check (mag('project','U'));
create policy projectregel_delete on projectregel for delete using (mag('project','D'));

grant select, insert, update, delete on subproject to erp_app;
grant select, insert, update, delete on subproject_onderdeel to erp_app;
grant select, insert, update, delete on projectregel to erp_app;
