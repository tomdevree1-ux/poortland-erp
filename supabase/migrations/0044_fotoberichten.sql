-- 0044: fotoberichten, een klantonafhankelijk fotoportaal (vraag Tom 2026-09-24).
--
-- Naast de uploadlink per lead (0040) komt er een vaste publieke pagina
-- poortland.be/fotos. Die link kan in de nieuwsbrief, in een mailhandtekening
-- of op een QR-code. Wie foto's stuurt hoort dus nog bij geen enkele lead of
-- klant: de inzending staat op zichzelf en belandt in een aparte sectie in het
-- ERP. Een medewerker kan ze daarna behandelen en desgewenst aan een lead
-- koppelen.
--
-- Rechten: we hangen de inzendingen aan het rechtendomein 'lead'. Wie leads mag
-- lezen ziet de inzendingen, wie leads mag aanmaken (ook de rol systeem, zie
-- 0006) mag ze wegschrijven vanuit het publieke portaal.

create type fotobericht_status as enum ('nieuw', 'behandeld');

create table fotobericht (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  email citext,
  telefoon text,
  bericht text,
  herkomst text,
  status fotobericht_status not null default 'nieuw',
  lead_id uuid references lead(id),
  behandeld_op timestamptz,
  behandeld_door uuid references medewerker(id),
  privacy_akkoord boolean not null default false,
  privacy_akkoord_op timestamptz,
  aangemaakt_op timestamptz not null default now(),
  aangemaakt_door uuid references medewerker(id),
  gewijzigd_op timestamptz not null default now(),
  gewijzigd_door uuid references medewerker(id),
  versie integer not null default 1,
  verwijderd_op timestamptz,
  bewaren_tot date
);
comment on table fotobericht is
  'Losse foto-inzending via de publieke pagina /fotos, niet gebonden aan een lead of klant.';
comment on column fotobericht.herkomst is
  'Waar de bezoeker vandaan kwam, bijvoorbeeld nieuwsbrief of qr, uit de parameter bron.';
comment on column fotobericht.lead_id is
  'Ingevuld zodra een medewerker de inzending aan een lead koppelt.';

create index idx_fotobericht_status on fotobericht (status, aangemaakt_op desc);
create index idx_fotobericht_lead on fotobericht (lead_id) where lead_id is not null;

create table fotobericht_bijlage (
  id uuid primary key default gen_random_uuid(),
  fotobericht_id uuid not null references fotobericht(id) on delete cascade,
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
create index idx_fotobericht_bijlage_bericht on fotobericht_bijlage (fotobericht_id);

create trigger trg_meta_fotobericht before update on fotobericht
  for each row execute function bijwerk_metadata();
create trigger trg_audit_fotobericht after insert or update or delete on fotobericht
  for each row execute function schrijf_audit();
create trigger trg_meta_fotobericht_bijlage before update on fotobericht_bijlage
  for each row execute function bijwerk_metadata();
create trigger trg_audit_fotobericht_bijlage after insert or update or delete on fotobericht_bijlage
  for each row execute function schrijf_audit();

alter table fotobericht enable row level security;
-- Zoals 0041: wie mag aanmaken moet de nieuwe rij ook zien, anders faalt een
-- insert met RETURNING vanuit het publieke portaal.
create policy fotobericht_select on fotobericht for select
  using ((mag('lead','R') or mag('lead','C')) and (verwijderd_op is null or mag('lead','U')));
create policy fotobericht_insert on fotobericht for insert
  with check (mag('lead','C') or mag('lead','U'));
create policy fotobericht_update on fotobericht for update
  using (mag('lead','U')) with check (mag('lead','U'));
create policy fotobericht_delete on fotobericht for delete using (mag('lead','D'));

alter table fotobericht_bijlage enable row level security;
create policy fotobericht_bijlage_select on fotobericht_bijlage for select
  using ((mag('lead','R') or mag('lead','C')) and (verwijderd_op is null or mag('lead','U')));
create policy fotobericht_bijlage_insert on fotobericht_bijlage for insert
  with check (mag('lead','C') or mag('lead','U'));
create policy fotobericht_bijlage_update on fotobericht_bijlage for update
  using (mag('lead','U')) with check (mag('lead','U'));
create policy fotobericht_bijlage_delete on fotobericht_bijlage for delete using (mag('lead','D'));

grant select, insert, update, delete on fotobericht to erp_app;
grant select, insert, update, delete on fotobericht_bijlage to erp_app;

-- Privaat bucket, los van lead_uploads zodat de bewaartermijn apart kan.
insert into storage.buckets (id, name, public)
values ('foto_inzendingen', 'foto_inzendingen', false)
on conflict (id) do nothing;
