-- 0029 Veld en werkbon (TS-09, FR-009, FR-012 en FR-013), eerste online versie.
-- De digitale werkbon vervangt de doorslagbon: uitgevoerde werken, materialen
-- met afwijking van de stuklijst, meerwerk, foto's voor en na met tijdstempel
-- en gps, en de klanthandtekening op het scherm. De offline modus met PowerSync
-- volgt in een latere fase; de kolommen client_id en gesynchroniseerd_op staan
-- er al voor klaar (TS-01 sectie 6.13).

create table werkbon (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  plaatser_id uuid not null references medewerker(id),
  planningsitem_id uuid references planningsitem(id),
  type werkbon_type not null,
  status werkbon_status not null default 'open',
  uitvoeringsdatum date,
  uren_begin time,
  uren_einde time,
  opmerkingen text,
  klanthandtekening_pad text,
  getekend_op timestamptz,
  handtekening_methode text,
  gps_lat numeric(9,6),
  gps_lon numeric(9,6),
  client_id uuid,
  gesynchroniseerd_op timestamptz,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_werkbon_project on werkbon (project_id) where verwijderd_op is null;
create index idx_werkbon_plaatser on werkbon (plaatser_id) where verwijderd_op is null;

create table werkbonregel (
  id uuid primary key default gen_random_uuid(),
  werkbon_id uuid not null references werkbon(id) on delete cascade,
  soort text not null check (soort in ('uitgevoerd_werk','materiaal','meerwerk')),
  omschrijving text not null,
  aantal numeric(10,2),
  eenheid text,
  afwijking_van_stuklijst boolean not null default false,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_werkbonregel_werkbon on werkbonregel (werkbon_id) where verwijderd_op is null;

-- FR-009: foto's met tijdstempel en eventueel gps, voor en na de uitvoering.
create table werkbonfoto (
  id uuid primary key default gen_random_uuid(),
  werkbon_id uuid not null references werkbon(id) on delete cascade,
  moment text not null check (moment in ('voor','na')),
  bestandsnaam text not null,
  bestand_pad text not null,
  gps_lat numeric(9,6),
  gps_lon numeric(9,6),
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_werkbonfoto_werkbon on werkbonfoto (werkbon_id) where verwijderd_op is null;

do $$
declare t text;
begin
  foreach t in array array['werkbon','werkbonregel','werkbonfoto'] loop
    execute format('create trigger trg_meta_%1$s before update on %1$I for each row execute function bijwerk_metadata()', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on %1$I for each row execute function schrijf_audit()', t);
  end loop;
end $$;

-- Statusmodel volgens TS-09 sectie 4, bewaakt door de databank.
create trigger trg_status_werkbon before update on werkbon
  for each row execute function bewaak_status('werkbon');

insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('werkbon','open','uitgevoerd','{montage,beheerder}'),
  ('werkbon','uitgevoerd','klant_getekend','{montage,beheerder}'),
  ('werkbon','klant_getekend','verwerkt_in_facturatie','{boekhouding,beheerder}')
on conflict do nothing;

-- De boekhouding zet de werkbon naar facturatie: leesrecht plus statusrecht.
insert into recht (rol, entiteit, acties) values ('boekhouding','werkbon','RS')
on conflict (rol, entiteit) do update set acties = excluded.acties;

-- Publicatiebewaking: tekenen kan alleen met een handtekeningbestand.
create or replace function controleer_werkbon_handtekening() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.status = 'klant_getekend' and old.status is distinct from 'klant_getekend' then
    if new.klanthandtekening_pad is null then
      raise exception 'Tekenen vereist de klanthandtekening';
    end if;
    new.getekend_op := coalesce(new.getekend_op, now());
  end if;
  return new;
end; $$;
create trigger trg_handtekening_werkbon before update on werkbon
  for each row execute function controleer_werkbon_handtekening();

-- RLS volgens de matrix (entiteit werkbon).
alter table werkbon enable row level security;
alter table werkbonregel enable row level security;
alter table werkbonfoto enable row level security;

create policy werkbon_select on werkbon for select using (mag('werkbon','R') and verwijderd_op is null);
create policy werkbon_insert on werkbon for insert with check (mag('werkbon','C'));
create policy werkbon_update on werkbon for update using (mag('werkbon','U') or mag('werkbon','S'))
  with check (mag('werkbon','U') or mag('werkbon','S'));
create policy werkbon_delete on werkbon for delete using (mag('werkbon','D'));

create policy werkbonregel_select on werkbonregel for select using (mag('werkbon','R') and verwijderd_op is null);
create policy werkbonregel_insert on werkbonregel for insert with check (mag('werkbon','C') or mag('werkbon','U') or mag('werkbon','S'));
create policy werkbonregel_update on werkbonregel for update using (mag('werkbon','U') or mag('werkbon','S'))
  with check (mag('werkbon','U') or mag('werkbon','S'));
create policy werkbonregel_delete on werkbonregel for delete using (mag('werkbon','U') or mag('werkbon','S') or mag('werkbon','D'));

create policy werkbonfoto_select on werkbonfoto for select using (mag('werkbon','R') and verwijderd_op is null);
create policy werkbonfoto_insert on werkbonfoto for insert with check (mag('werkbon','C') or mag('werkbon','U') or mag('werkbon','S'));
create policy werkbonfoto_update on werkbonfoto for update using (mag('werkbon','U') or mag('werkbon','S'))
  with check (mag('werkbon','U') or mag('werkbon','S'));
create policy werkbonfoto_delete on werkbonfoto for delete using (mag('werkbon','U') or mag('werkbon','S') or mag('werkbon','D'));

grant select, insert, update, delete on werkbon, werkbonregel, werkbonfoto to erp_app;

-- Private bucket voor werkbonfoto's en handtekeningen.
insert into storage.buckets (id, name, public)
values ('werkbon', 'werkbon', false)
on conflict (id) do nothing;
