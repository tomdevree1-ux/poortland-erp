-- 0028 Planning (TS-08, FR-010 en FR-011).
-- Ploegen en planningsitems per projectfase. De planner wijst een medewerker
-- of een ploeg toe; het item is zichtbaar in de centrale planning, het
-- persoonlijke werkschema en het dossier. Klantcommunicatie (bevestiging en
-- reminder) verstuurt de achtergrondtaak en logt in communicatie.

create table ploeg (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  is_actief boolean not null default true,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);

create table ploeg_lid (
  ploeg_id uuid not null references ploeg(id) on delete cascade,
  medewerker_id uuid not null references medewerker(id) on delete cascade,
  primary key (ploeg_id, medewerker_id)
);

create table planningsitem (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  fase projectfase not null,
  medewerker_id uuid references medewerker(id),
  ploeg_id uuid references ploeg(id),
  geplande_datum date not null,
  status text not null default 'gepland' check (status in ('gepland','bevestigd','uitgevoerd')),
  benodigde_materialen text,
  klantafspraken text,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date,
  constraint planningsitem_toewijzing check (medewerker_id is not null or ploeg_id is not null)
);
create index idx_planning_datum on planningsitem (geplande_datum) where verwijderd_op is null;
create index idx_planning_project on planningsitem (project_id) where verwijderd_op is null;

-- Metadata en audit volgens het vaste stramien
do $$
declare t text;
begin
  foreach t in array array['ploeg','planningsitem'] loop
    execute format('create trigger trg_meta_%1$s before update on %1$I for each row execute function bijwerk_metadata()', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on %1$I for each row execute function schrijf_audit()', t);
  end loop;
end $$;

-- RLS volgens de matrix: entiteit planning (planner RCUS, rest leest)
alter table ploeg enable row level security;
alter table ploeg_lid enable row level security;
alter table planningsitem enable row level security;

create policy ploeg_select on ploeg for select using (mag('planning','R') and verwijderd_op is null);
create policy ploeg_insert on ploeg for insert with check (mag('planning','C'));
create policy ploeg_update on ploeg for update using (mag('planning','U')) with check (mag('planning','U'));
create policy ploeg_delete on ploeg for delete using (mag('planning','D'));

create policy ploeg_lid_select on ploeg_lid for select using (mag('planning','R'));
create policy ploeg_lid_insert on ploeg_lid for insert with check (mag('planning','U'));
create policy ploeg_lid_delete on ploeg_lid for delete using (mag('planning','U'));

create policy planningsitem_select on planningsitem for select using (mag('planning','R') and verwijderd_op is null);
create policy planningsitem_insert on planningsitem for insert with check (mag('planning','C'));
create policy planningsitem_update on planningsitem for update using (mag('planning','U') or mag('planning','S'))
  with check (mag('planning','U') or mag('planning','S'));
create policy planningsitem_delete on planningsitem for delete using (mag('planning','D'));

grant select, insert, update, delete on ploeg, ploeg_lid, planningsitem to erp_app;
