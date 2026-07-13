-- 0013 Leadcaptatie vanaf de website: contactformulier en offertewizard
-- (TS-04 sectie 2, kanalenbeslissing Poortland 2026-07-13 binnen TBD-4)

-- Twee nieuwe kanalen naast de bestaande.
alter type lead_kanaal add value if not exists 'contact_website';
alter type lead_kanaal add value if not exists 'offerteaanvraag_website';

-- De lead draagt voortaan alle velden van het contactformulier.
alter table lead add column type_aanvraag text;
alter table lead add column gemeente text;
alter table lead add column gewenste_timing text;
alter table lead add column privacy_akkoord boolean not null default false;
alter table lead add column privacy_akkoord_op timestamptz;
alter table lead add column wizard_gegevens jsonb;

-- Zoekkolom vernieuwen zodat de gemeente meezoekt.
alter table lead drop column zoek;
alter table lead add column zoek tsvector generated always as (
  to_tsvector('simple',
    coalesce(naam,'') || ' ' || coalesce(email::text,'') || ' ' || coalesce(telefoon,'') || ' ' ||
    coalesce(eerste_vraag,'') || ' ' || coalesce(gemeente,''))
) stored;
create index idx_lead_zoek on lead using gin (zoek);

-- Foto's bij een lead, privaat bewaard (reizen later mee naar het dossier).
create table lead_bijlage (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references lead(id) on delete cascade,
  bestandsnaam text not null,
  content_type text not null,
  bestand_pad text not null,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
create index idx_lead_bijlage_lead on lead_bijlage (lead_id);

create trigger trg_meta_lead_bijlage before update on lead_bijlage
  for each row execute function bijwerk_metadata();
create trigger trg_audit_lead_bijlage after insert or update or delete on lead_bijlage
  for each row execute function schrijf_audit();

alter table lead_bijlage enable row level security;
create policy lead_bijlage_select on lead_bijlage for select using (mag('lead','R') and verwijderd_op is null);
create policy lead_bijlage_insert on lead_bijlage for insert with check (mag('lead','C') or mag('lead','U'));
create policy lead_bijlage_update on lead_bijlage for update using (mag('lead','U')) with check (mag('lead','U'));
create policy lead_bijlage_delete on lead_bijlage for delete using (mag('lead','U') or mag('lead','D'));

grant select, insert, update, delete on lead_bijlage to erp_app;

-- Privaat bucket voor de uploads vanaf de website.
insert into storage.buckets (id, name, public)
values ('lead_uploads', 'lead_uploads', false)
on conflict (id) do nothing;
