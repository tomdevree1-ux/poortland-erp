-- 0026 Productie en stuklijst (TS-07, FR-007 en FR-008).
-- Digitaal productiedossier: stuklijst met versiebeheer, onderdelen met
-- behandelingsketen (voorbehandeling en lakwerk met leverancier en ETA) en
-- PDF tekeningen met metadata. Het statusmodel per onderdeel wordt bewaakt
-- door bewaak_status (TS-02) plus een eigen controle op de van
-- toepassing vlaggen zodat overslaan alleen mag wanneer dat klopt.

-- 6.11 leverancier
create table leverancier (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  type leverancier_type not null,
  email text,
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

-- 6.10 stuklijst: per project maximaal 1 actieve versie
create table stuklijst (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete restrict,
  versie_stuklijst integer not null default 1,
  is_actief boolean not null default true,
  datum_opmaak date not null default current_date,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create unique index idx_stuklijst_actief_per_project
  on stuklijst (project_id) where is_actief and verwijderd_op is null;

create table productieonderdeel (
  id uuid primary key default gen_random_uuid(),
  stuklijst_id uuid not null references stuklijst(id) on delete cascade,
  productcode text not null,
  omschrijving text,
  afmetingen text,
  materiaal text,
  status onderdeel_status not null default 'besteld',
  voorbehandeling_van_toepassing boolean not null default true,
  lakwerk_van_toepassing boolean not null default true,
  leverancier_voorbehandeling_id uuid references leverancier(id),
  leverancier_lakwerk_id uuid references leverancier(id),
  lakwerk_ral text,
  eta_voorbehandeling date,
  eta_lakwerk date,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_onderdeel_stuklijst on productieonderdeel (stuklijst_id) where verwijderd_op is null;

-- 6.12 tekening: PDF uit AutoCAD, doorzoekbaar op bestandsnaam en metadata
create table tekening (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  -- documentversie van de tekening zelf; de kolom versie blijft de
  -- optimistische rijversie die bijwerk_metadata verhoogt
  tekening_versie integer not null default 1,
  datum date not null default current_date,
  auteur_id uuid references medewerker(id),
  bestandsnaam text not null,
  bestand_pad text not null,
  metadata jsonb,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_tekening_project on tekening (project_id) where verwijderd_op is null;

-- Metadata en audit triggers volgens het vaste stramien (0004)
do $$
declare t text;
begin
  foreach t in array array['leverancier','stuklijst','productieonderdeel','tekening'] loop
    execute format('create trigger trg_meta_%1$s before update on %1$I for each row execute function bijwerk_metadata()', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on %1$I for each row execute function schrijf_audit()', t);
  end loop;
end $$;

-- Statusbewaking per onderdeel (rechtenmatrix entiteit stuklijst)
create trigger trg_status_productieonderdeel before update on productieonderdeel
  for each row execute function bewaak_status('stuklijst');

-- Toegestane overgangen: lineair met overslaan enkel via de vlaggen (TS-07 sectie 3)
insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('stuklijst','besteld','in_productie','{productie,beheerder}'),
  ('stuklijst','in_productie','voorbehandeling','{productie,beheerder}'),
  ('stuklijst','in_productie','lakwerk','{productie,beheerder}'),
  ('stuklijst','in_productie','klaar_voor_montage','{productie,beheerder}'),
  ('stuklijst','voorbehandeling','lakwerk','{productie,beheerder}'),
  ('stuklijst','voorbehandeling','klaar_voor_montage','{productie,beheerder}'),
  ('stuklijst','lakwerk','klaar_voor_montage','{productie,beheerder}'),
  ('stuklijst','klaar_voor_montage','gemonteerd','{productie,montage,beheerder}')
on conflict do nothing;

-- Vlaggenbewaking: een behandeling overslaan mag alleen wanneer ze niet van
-- toepassing is, en een behandeling ingaan mag alleen wanneer ze wel van
-- toepassing is (TS-07 sectie 3).
create or replace function controleer_onderdeel_vlaggen() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'voorbehandeling' and not new.voorbehandeling_van_toepassing then
      raise exception 'Voorbehandeling is niet van toepassing op dit onderdeel';
    end if;
    if new.status = 'lakwerk' and not new.lakwerk_van_toepassing then
      raise exception 'Lakwerk is niet van toepassing op dit onderdeel';
    end if;
    if old.status = 'in_productie' and new.status = 'lakwerk' and new.voorbehandeling_van_toepassing then
      raise exception 'Voorbehandeling overslaan kan alleen wanneer ze niet van toepassing is';
    end if;
    if old.status = 'in_productie' and new.status = 'klaar_voor_montage'
       and (new.voorbehandeling_van_toepassing or new.lakwerk_van_toepassing) then
      raise exception 'Behandelingen overslaan kan alleen wanneer ze niet van toepassing zijn';
    end if;
    if old.status = 'voorbehandeling' and new.status = 'klaar_voor_montage' and new.lakwerk_van_toepassing then
      raise exception 'Lakwerk overslaan kan alleen wanneer het niet van toepassing is';
    end if;
  end if;
  return new;
end; $$;
create trigger trg_vlaggen_productieonderdeel before update on productieonderdeel
  for each row execute function controleer_onderdeel_vlaggen();

-- Rechten voor de leverancierstabel (naast de bestaande stuklijst en tekening rijen)
insert into recht (rol, entiteit, acties) values
  ('verkoop','leverancier','R'), ('planning','leverancier','R'), ('productie','leverancier','RCU'),
  ('montage','leverancier','R'), ('boekhouding','leverancier','R'), ('beheerder','leverancier','RCUD')
on conflict (rol, entiteit) do update set acties = excluded.acties;

-- RLS volgens het vaste patroon
alter table leverancier enable row level security;
alter table stuklijst enable row level security;
alter table productieonderdeel enable row level security;
alter table tekening enable row level security;

create policy leverancier_select on leverancier for select using (mag('leverancier','R') and verwijderd_op is null);
create policy leverancier_insert on leverancier for insert with check (mag('leverancier','C'));
create policy leverancier_update on leverancier for update using (mag('leverancier','U')) with check (mag('leverancier','U'));
create policy leverancier_delete on leverancier for delete using (mag('leverancier','D'));

create policy stuklijst_select on stuklijst for select using (mag('stuklijst','R') and verwijderd_op is null);
create policy stuklijst_insert on stuklijst for insert with check (mag('stuklijst','C'));
create policy stuklijst_update on stuklijst for update using (mag('stuklijst','U') or mag('stuklijst','S'))
  with check (mag('stuklijst','U') or mag('stuklijst','S'));
create policy stuklijst_delete on stuklijst for delete using (mag('stuklijst','D'));

create policy onderdeel_select on productieonderdeel for select using (mag('stuklijst','R') and verwijderd_op is null);
create policy onderdeel_insert on productieonderdeel for insert with check (mag('stuklijst','C'));
create policy onderdeel_update on productieonderdeel for update using (mag('stuklijst','U') or mag('stuklijst','S'))
  with check (mag('stuklijst','U') or mag('stuklijst','S'));
create policy onderdeel_delete on productieonderdeel for delete using (mag('stuklijst','D'));

create policy tekening_select on tekening for select using (mag('tekening','R') and verwijderd_op is null);
create policy tekening_insert on tekening for insert with check (mag('tekening','C'));
create policy tekening_update on tekening for update using (mag('tekening','U')) with check (mag('tekening','U'));
create policy tekening_delete on tekening for delete using (mag('tekening','D'));

-- Grants: nieuwe tabellen vallen niet onder de grants van 0007
grant select, insert, update, delete on leverancier, stuklijst, productieonderdeel, tekening to erp_app;

-- Private bucket voor de PDF tekeningen (signed urls via de backend)
insert into storage.buckets (id, name, public)
values ('tekeningen', 'tekeningen', false)
on conflict (id) do nothing;
