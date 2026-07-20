-- 0031 Facturatievoorbereiding (TS-10, FR-014).
-- Geen eigen facturatiemotor (ADR-005): het factuurvoorstel bundelt de
-- goedgekeurde offerte en het uitgevoerde werk, de boekhouding keurt goed en
-- geeft door aan Exact Online (of exporteert) en meldt het nummer terug.

create type factuur_status as enum ('concept','goedgekeurd','gefactureerd');
create type factuur_soort as enum ('voorschot','eind');
create type factuurregel_bron as enum ('offerte','meerwerk','handmatig');

create table factuurvoorstel (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  order_id uuid references "order"(id) on delete set null,
  soort factuur_soort not null default 'eind',
  status factuur_status not null default 'concept',
  afwijking_bevestigd boolean not null default false,
  totaal_excl_btw numeric(12,2) not null default 0,
  totaal_btw numeric(12,2) not null default 0,
  totaal_incl_btw numeric(12,2) not null default 0,
  exact_nummer text,
  goedgekeurd_op timestamptz,
  gefactureerd_op timestamptz,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_factuurvoorstel_project on factuurvoorstel (project_id) where verwijderd_op is null;
create index idx_factuurvoorstel_status on factuurvoorstel (status) where verwijderd_op is null;

create table factuurvoorstelregel (
  id uuid primary key default gen_random_uuid(),
  factuurvoorstel_id uuid not null references factuurvoorstel(id) on delete cascade,
  volgnummer integer not null default 1,
  bron factuurregel_bron not null default 'offerte',
  omschrijving text not null,
  aantal numeric(12,2) not null default 1,
  eenheid text,
  eenheidsprijs numeric(12,2) not null default 0,
  btw btw_tarief not null default 'p21',
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_factuurvoorstelregel_voorstel on factuurvoorstelregel (factuurvoorstel_id) where verwijderd_op is null;

create trigger trg_meta_factuurvoorstel before update on factuurvoorstel
  for each row execute function bijwerk_metadata();
create trigger trg_audit_factuurvoorstel after insert or update or delete on factuurvoorstel
  for each row execute function schrijf_audit();
create trigger trg_status_factuurvoorstel before update on factuurvoorstel
  for each row execute function bewaak_status('factuurvoorstel');
create trigger trg_meta_factuurvoorstelregel before update on factuurvoorstelregel
  for each row execute function bijwerk_metadata();
create trigger trg_audit_factuurvoorstelregel after insert or update or delete on factuurvoorstelregel
  for each row execute function schrijf_audit();

insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('factuurvoorstel','concept','goedgekeurd','{boekhouding,beheerder}'),
  ('factuurvoorstel','goedgekeurd','concept','{boekhouding,beheerder}'),
  ('factuurvoorstel','goedgekeurd','gefactureerd','{boekhouding,beheerder}')
on conflict do nothing;

-- Rechten (TS-10 sectie 7): boekhouding volledig op de facturatie, verkoop
-- leest mee, productie en montage niets.
insert into recht (rol, entiteit, acties) values
  ('boekhouding','factuurvoorstel','RCUDSA'),
  ('verkoop','factuurvoorstel','R'),
  ('beheerder','factuurvoorstel','RCUDSA')
on conflict (rol, entiteit) do update set acties = excluded.acties;

-- De boekhouding sluit de order en het dossier af na facturatie
-- (overgang gemonteerd naar afgesloten bestond al in de statusdata,
-- maar de RLS updatepaden stonden nog dicht voor deze rol).
insert into recht (rol, entiteit, acties) values
  ('boekhouding','order','RS'),
  ('boekhouding','project','RS')
on conflict (rol, entiteit) do update set acties = excluded.acties;

drop policy if exists order_update on "order";
create policy order_update on "order" for update
  using (mag('order','U') or mag('order','S'))
  with check (mag('order','U') or mag('order','S'));
drop policy if exists project_update on project;
create policy project_update on project for update
  using (mag('project','U') or mag('project','S'))
  with check (mag('project','U') or mag('project','S'));

alter table factuurvoorstel enable row level security;
alter table factuurvoorstelregel enable row level security;

create policy factuurvoorstel_select on factuurvoorstel for select
  using (mag('factuurvoorstel','R') and verwijderd_op is null);
create policy factuurvoorstel_insert on factuurvoorstel for insert
  with check (mag('factuurvoorstel','C'));
create policy factuurvoorstel_update on factuurvoorstel for update
  using (mag('factuurvoorstel','U') or mag('factuurvoorstel','S'))
  with check (mag('factuurvoorstel','U') or mag('factuurvoorstel','S'));
create policy factuurvoorstel_delete on factuurvoorstel for delete
  using (mag('factuurvoorstel','D'));

create policy factuurvoorstelregel_select on factuurvoorstelregel for select
  using (mag('factuurvoorstel','R') and verwijderd_op is null);
create policy factuurvoorstelregel_insert on factuurvoorstelregel for insert
  with check (mag('factuurvoorstel','C') or mag('factuurvoorstel','U'));
create policy factuurvoorstelregel_update on factuurvoorstelregel for update
  using (mag('factuurvoorstel','U')) with check (mag('factuurvoorstel','U'));
create policy factuurvoorstelregel_delete on factuurvoorstelregel for delete
  using (mag('factuurvoorstel','U') or mag('factuurvoorstel','D'));

grant select, insert, update, delete on factuurvoorstel to erp_app;
grant select, insert, update, delete on factuurvoorstelregel to erp_app;
