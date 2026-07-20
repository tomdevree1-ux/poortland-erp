-- 0030 Service en nazorg (TS-11, FR-015).
-- Het servicedossier vervangt de telefonische klachtenafhandeling: altijd aan
-- een klant gekoppeld, optioneel aan een project, met een berekende
-- garantie-indicatie en het statusmodel gemeld, ingepland, uitgevoerd en
-- afgesloten (vervolginterventie mag terug naar ingepland).

create table servicedossier (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid not null references klant(id) on delete restrict,
  project_id uuid references project(id) on delete set null,
  status servicedossier_status not null default 'gemeld',
  technieker_id uuid references medewerker(id),
  garantie_indicatie boolean not null default false,
  klacht text,
  gemeld_op timestamptz not null default now(),
  gepland_op date,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_service_klant on servicedossier (klant_id) where verwijderd_op is null;
create index idx_service_status on servicedossier (status) where verwijderd_op is null;

create trigger trg_meta_servicedossier before update on servicedossier
  for each row execute function bijwerk_metadata();
create trigger trg_audit_servicedossier after insert or update or delete on servicedossier
  for each row execute function schrijf_audit();
create trigger trg_status_servicedossier before update on servicedossier
  for each row execute function bewaak_status('servicedossier');

insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('servicedossier','gemeld','ingepland','{planning,montage,beheerder}'),
  ('servicedossier','ingepland','uitgevoerd','{montage,planning,beheerder}'),
  ('servicedossier','uitgevoerd','ingepland','{planning,montage,beheerder}'),
  ('servicedossier','uitgevoerd','afgesloten','{planning,beheerder}')
on conflict do nothing;

alter table servicedossier enable row level security;

create policy service_select on servicedossier for select using (mag('servicedossier','R') and verwijderd_op is null);
create policy service_insert on servicedossier for insert with check (mag('servicedossier','C'));
create policy service_update on servicedossier for update using (mag('servicedossier','U') or mag('servicedossier','S'))
  with check (mag('servicedossier','U') or mag('servicedossier','S'));
create policy service_delete on servicedossier for delete using (mag('servicedossier','D'));

grant select, insert, update, delete on servicedossier to erp_app;
