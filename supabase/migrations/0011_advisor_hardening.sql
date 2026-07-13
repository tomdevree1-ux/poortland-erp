-- 0011 Hardening na de security advisors (bouwspec hoofdstuk 9, verificatieronde)

-- 1. search_path vastzetten op de resterende functies.
create or replace function bijwerk_metadata() returns trigger
language plpgsql set search_path = public as $$
begin
  new.gewijzigd_op := now();
  new.gewijzigd_door := coalesce(huidige_medewerker_id(), new.gewijzigd_door);
  new.versie := old.versie + 1;
  return new;
end; $$;

create or replace function audit_onaantastbaar() returns trigger
language plpgsql set search_path = public as $$
begin
  raise exception 'audit_log is append only';
end; $$;

create or replace function controleer_media_publicatie() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.status = 'gepubliceerd' and old.status is distinct from 'gepubliceerd' then
    if new.alt_tekst is null or btrim(new.alt_tekst) = '' then
      raise exception 'Publicatie vereist een alt tekst';
    end if;
    if new.bestand_pad_web is null or new.bestand_pad_thumb is null then
      raise exception 'Publicatie vereist de webafgeleiden';
    end if;
    if new.personen_in_beeld and not new.toestemming_bevestigd then
      raise exception 'Publicatie met personen in beeld vereist bevestigde toestemming';
    end if;
    new.gepubliceerd_op := now();
    new.gepubliceerd_door := huidige_medewerker_id();
  end if;
  return new;
end; $$;

create or replace function controleer_popup_publicatie() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.status = 'gepubliceerd' and old.status is distinct from 'gepubliceerd' then
    new.gepubliceerd_op := now();
    new.gepubliceerd_door := huidige_medewerker_id();
  end if;
  return new;
end; $$;

-- 2. Extensies horen niet in public (advisor 0014).
create schema if not exists extensions;
alter extension citext set schema extensions;
alter extension pg_trgm set schema extensions;

-- De ene functie die het citext type bij naam gebruikt krijgt extensions in het pad.
create or replace function verwerk_nieuwe_auth_gebruiker() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  v_bootstrap citext;
  v_medewerker_id uuid;
begin
  select nullif(waarde #>> '{}', '')::citext into v_bootstrap
    from instelling where sleutel = 'bootstrap_beheerder_email';
  insert into medewerker (auth_user_id, naam, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'naam', split_part(new.email, '@', 1)),
    new.email::citext
  )
  on conflict (email) do update set auth_user_id = excluded.auth_user_id
  returning id into v_medewerker_id;
  if v_bootstrap is not null and new.email::citext = v_bootstrap then
    insert into medewerker_rol (medewerker_id, rol)
    values (v_medewerker_id, 'beheerder')
    on conflict do nothing;
  end if;
  return new;
end; $$;

-- 3. De definer view (advisor ERROR) wordt een functie met dezelfde minimale kolommen.
drop view if exists medewerker_overzicht;
create or replace function medewerker_keuzes()
returns table (id uuid, naam text, is_actief boolean)
language sql stable security definer set search_path = public as $$
  select id, naam, is_actief from medewerker where verwijderd_op is null;
$$;

-- 4. Het PostgREST datapad gaat volledig dicht: data loopt uitsluitend via de
-- C# API als erp_app (masterdocument 4.2). De frontend gebruikt enkel Auth.
revoke all on all tables in schema public from anon, authenticated;
revoke execute on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from anon, authenticated;

-- Wat wel expliciet toegang houdt.
grant execute on function medewerker_keuzes() to erp_app;
grant execute on function custom_access_token_hook(jsonb) to supabase_auth_admin;
