-- 0009 Domeinfuncties: nummering, gebruikersbootstrap en de access token hook
-- (TS-01 sectie 11, TS-02 secties 2.2 en 5, bouwspec BS-01)

-- Offertenummer OFF-{jaar}-{volgnummer}, race vrij via rijvergrendeling.
create or replace function volgend_offertenummer() returns text
language plpgsql security definer set search_path = public as $$
declare
  v_jaar integer := extract(year from now())::integer;
  v_volgende integer;
begin
  insert into offerte_reeks (jaar, volgende) values (v_jaar, 1)
    on conflict (jaar) do nothing;
  update offerte_reeks set volgende = volgende + 1
    where jaar = v_jaar
    returning volgende - 1 into v_volgende;
  return 'OFF-' || v_jaar || '-' || lpad(v_volgende::text, 4, '0');
end; $$;

-- Nieuwe auth gebruiker wordt automatisch een medewerker. De eerste beheerder
-- ontstaat via de instelling bootstrap_beheerder_email (bouwspec hoofdstuk 5).
-- Daarna kent enkel de beheerder rollen toe (geen open registratie: uitnodigen
-- gebeurt door de beheerder via Supabase Auth of het beheerscherm).
create or replace function verwerk_nieuwe_auth_gebruiker() returns trigger
language plpgsql security definer set search_path = public as $$
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

drop trigger if exists trg_nieuwe_auth_gebruiker on auth.users;
create trigger trg_nieuwe_auth_gebruiker after insert on auth.users
  for each row execute function verwerk_nieuwe_auth_gebruiker();

-- Access token hook (TS-02 sectie 2.2): rollen en medewerker_id in het JWT.
-- Activeren in het dashboard onder Authentication, Hooks (zie README).
-- Zolang de hook uit staat werkt alles via de terugval in huidige_rollen().
create or replace function custom_access_token_hook(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_claims jsonb := coalesce(event -> 'claims', '{}'::jsonb);
  v_medewerker record;
  v_rollen jsonb;
begin
  select m.id, m.is_actief into v_medewerker
    from medewerker m
    where m.auth_user_id = (event ->> 'user_id')::uuid
      and m.verwijderd_op is null;
  if v_medewerker.id is null or not v_medewerker.is_actief then
    v_claims := v_claims || jsonb_build_object('rollen', '[]'::jsonb);
  else
    select coalesce(jsonb_agg(mr.rol::text), '[]'::jsonb) into v_rollen
      from medewerker_rol mr where mr.medewerker_id = v_medewerker.id;
    v_claims := v_claims
      || jsonb_build_object('rollen', v_rollen)
      || jsonb_build_object('medewerker_id', v_medewerker.id::text);
  end if;
  return jsonb_set(event, '{claims}', v_claims);
end; $$;

grant usage on schema public to supabase_auth_admin;
grant execute on function custom_access_token_hook(jsonb) to supabase_auth_admin;
grant select on medewerker, medewerker_rol to supabase_auth_admin;
revoke execute on function custom_access_token_hook(jsonb) from authenticated, anon, public;
