-- 0046: koopjes en vacatures (overleg Poortland 2026-10-05).
--
-- Koopjes zijn bestaande poorten of overkappingen uit voorraad die Jef zelf
-- online zet: meerdere foto's, materiaal, model, RAL kleur, maten, vrije uitleg
-- en een prijs inclusief btw. Een verkocht koopje blijft met een label staan tot
-- Jef het zelf verbergt, dat toont dat er beweging in de voorraad zit.
--
-- Vacatures volgen hetzelfde patroon: vrije blokken met een kop en opsommingen,
-- zodat een vacature kan groeien zonder databankwijziging. Solliciteren gebeurt
-- per mail, er worden dus geen cv's bewaard.
--
-- Beide hangen aan het rechtendomein 'website_content': wie de website beheert,
-- beheert ook deze twee. De publieke website leest ze enkel via content.json.

create type koopje_status as enum ('concept', 'zichtbaar', 'verkocht', 'verborgen');
create type vacature_status as enum ('concept', 'zichtbaar', 'gesloten');

create table koopje (
  id uuid primary key default gen_random_uuid(),
  materiaal text not null,
  model text,
  ral text,
  breedte_cm integer check (breedte_cm is null or breedte_cm between 20 and 2000),
  hoogte_cm integer check (hoogte_cm is null or hoogte_cm between 20 and 1000),
  extra_info text,
  prijs_incl_btw numeric(10,2) check (prijs_incl_btw is null or prijs_incl_btw >= 0),
  status koopje_status not null default 'concept',
  volgnummer integer not null default 0,
  verkocht_op timestamptz,
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
comment on table koopje is
  'Een poort of overkapping uit voorraad die op de website te koop staat.';
comment on column koopje.prijs_incl_btw is 'Prijs zoals de klant ze ziet, dus inclusief btw.';
comment on column koopje.volgnummer is 'Volgorde op de website, laag eerst.';

create index idx_koopje_zichtbaar on koopje (status, volgnummer) where verwijderd_op is null;

create table koopje_foto (
  id uuid primary key default gen_random_uuid(),
  koopje_id uuid not null references koopje(id) on delete cascade,
  bestand_pad_origineel text not null,
  bestand_pad_web text,
  bestand_pad_thumb text,
  alt_tekst text,
  volgnummer integer not null default 0,
  breedte integer,
  hoogte integer,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
comment on column koopje_foto.volgnummer is 'De eerste foto is het coverbeeld op het overzicht.';
create index idx_koopje_foto_koopje on koopje_foto (koopje_id, volgnummer);

create table vacature (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  intro text,
  -- Blokken: [{ "kop": "Taken", "punten": ["...", "..."] }, ...]
  blokken jsonb not null default '[]'::jsonb,
  status vacature_status not null default 'concept',
  volgnummer integer not null default 0,
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
comment on column vacature.blokken is
  'Vrije blokken met een kop en opsommingspunten, bijvoorbeeld Taken, Skills, Opleiding en Wij bieden.';
create index idx_vacature_zichtbaar on vacature (status, volgnummer) where verwijderd_op is null;

create trigger trg_meta_koopje before update on koopje
  for each row execute function bijwerk_metadata();
create trigger trg_audit_koopje after insert or update or delete on koopje
  for each row execute function schrijf_audit();
create trigger trg_meta_koopje_foto before update on koopje_foto
  for each row execute function bijwerk_metadata();
create trigger trg_audit_koopje_foto after insert or update or delete on koopje_foto
  for each row execute function schrijf_audit();
create trigger trg_meta_vacature before update on vacature
  for each row execute function bijwerk_metadata();
create trigger trg_audit_vacature after insert or update or delete on vacature
  for each row execute function schrijf_audit();

alter table koopje enable row level security;
create policy koopje_select on koopje for select
  using (mag('website_content','R') and verwijderd_op is null);
create policy koopje_insert on koopje for insert with check (mag('website_content','C'));
create policy koopje_update on koopje for update
  using (mag('website_content','U')) with check (mag('website_content','U'));
create policy koopje_delete on koopje for delete using (mag('website_content','D'));

alter table koopje_foto enable row level security;
create policy koopje_foto_select on koopje_foto for select
  using (mag('website_content','R') and verwijderd_op is null);
create policy koopje_foto_insert on koopje_foto for insert with check (mag('website_content','C'));
create policy koopje_foto_update on koopje_foto for update
  using (mag('website_content','U')) with check (mag('website_content','U'));
create policy koopje_foto_delete on koopje_foto for delete using (mag('website_content','D'));

alter table vacature enable row level security;
create policy vacature_select on vacature for select
  using (mag('website_content','R') and verwijderd_op is null);
create policy vacature_insert on vacature for insert with check (mag('website_content','C'));
create policy vacature_update on vacature for update
  using (mag('website_content','U')) with check (mag('website_content','U'));
create policy vacature_delete on vacature for delete using (mag('website_content','D'));

grant select, insert, update, delete on koopje to erp_app;
grant select, insert, update, delete on koopje_foto to erp_app;
grant select, insert, update, delete on vacature to erp_app;

-- Foto's van koopjes gaan in dezelfde buckets als de overige websitebeelden:
-- het origineel privaat, de webversie en de thumbnail publiek.
