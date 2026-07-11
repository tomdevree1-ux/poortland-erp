-- 0004 Hulpfuncties, metadata en audit trail (TS-02 sectie 5.2, TS-01 sectie 8)

-- Rollen van de huidige gebruiker. Eerst uit de JWT claims (API pad en auth hook),
-- met terugval op de tabel medewerker_rol via auth.uid() zolang de access token
-- hook niet geactiveerd is (bouwspec BS-01 nota).
create or replace function huidige_rollen() returns rol[]
language sql stable security definer set search_path = public as $$
  select case
    when auth.jwt() ? 'rollen' then
      coalesce(array(select jsonb_array_elements_text(auth.jwt() -> 'rollen')::rol), '{}'::rol[])
    else
      coalesce((
        select array_agg(mr.rol)
        from medewerker m
        join medewerker_rol mr on mr.medewerker_id = m.id
        where m.auth_user_id = auth.uid()
          and m.is_actief
          and m.verwijderd_op is null
      ), '{}'::rol[])
  end;
$$;

-- Medewerker id van de huidige gebruiker, uit de claims of via auth.uid().
create or replace function huidige_medewerker_id() returns uuid
language sql stable security definer set search_path = public as $$
  select case
    when auth.jwt() ? 'medewerker_id' then (auth.jwt() ->> 'medewerker_id')::uuid
    else (select m.id from medewerker m where m.auth_user_id = auth.uid() and m.verwijderd_op is null)
  end;
$$;

-- Mag de huidige gebruiker actie X op entiteit Y (TS-02 sectie 5.2).
create or replace function mag(p_entiteit text, p_actie text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from recht r
    where r.rol = any (huidige_rollen())
      and r.entiteit = p_entiteit
      and position(p_actie in r.acties) > 0
  );
$$;

-- Metadata trigger: gewijzigd_op, gewijzigd_door en optimistische versie.
create or replace function bijwerk_metadata() returns trigger
language plpgsql as $$
begin
  new.gewijzigd_op := now();
  new.gewijzigd_door := coalesce(huidige_medewerker_id(), new.gewijzigd_door);
  new.versie := old.versie + 1;
  return new;
end; $$;

-- Audit trigger (append only, TS-01 sectie 8). Security definer zodat de
-- applicatierol zelf geen schrijfrecht op audit_log nodig heeft.
create or replace function schrijf_audit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_actie text;
  v_oud jsonb;
  v_nieuw jsonb;
  v_id uuid;
begin
  if tg_op = 'INSERT' then
    v_actie := 'insert'; v_oud := null; v_nieuw := to_jsonb(new); v_id := new.id;
  elsif tg_op = 'UPDATE' then
    v_oud := to_jsonb(old); v_nieuw := to_jsonb(new); v_id := new.id;
    if row(old.*) is not distinct from row(new.*) then return new; end if;
    if v_oud ? 'status' and (v_oud ->> 'status') is distinct from (v_nieuw ->> 'status') then
      v_actie := 'status_wijziging';
    elsif (v_oud ->> 'verwijderd_op') is null and (v_nieuw ->> 'verwijderd_op') is not null then
      v_actie := 'delete';
    else
      v_actie := 'update';
    end if;
  else
    v_actie := 'delete'; v_oud := to_jsonb(old); v_nieuw := null; v_id := old.id;
  end if;
  insert into audit_log (actor_id, actie, entiteit_type, entiteit_id, oude_waarde, nieuwe_waarde)
  values (huidige_medewerker_id(), v_actie, tg_table_name, v_id, v_oud, v_nieuw);
  return coalesce(new, old);
end; $$;

-- Append only afdwingen op audit_log.
create or replace function audit_onaantastbaar() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_log is append only';
end; $$;
create trigger trg_audit_geen_update before update or delete on audit_log
  for each row execute function audit_onaantastbaar();

-- Metadata en audit koppelen aan de domeintabellen.
do $$
declare t text;
begin
  foreach t in array array[
    'medewerker','klant','contactpersoon','contactmoment','lead','project',
    'artikel','offerte','offerteregel','order','opvolgtaak','communicatie',
    'notificatie','website_media','website_popup'
  ] loop
    execute format('create trigger trg_meta_%1$s before update on %1$I for each row execute function bijwerk_metadata()', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on %1$I for each row execute function schrijf_audit()', t);
  end loop;
end $$;

-- medewerker_rol heeft geen id kolom, aparte lichte variant.
create or replace function schrijf_audit_zonder_id() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log (actor_id, actie, entiteit_type, entiteit_id, oude_waarde, nieuwe_waarde)
  values (huidige_medewerker_id(),
          lower(tg_op),
          tg_table_name,
          coalesce(new.medewerker_id, old.medewerker_id),
          case when tg_op = 'DELETE' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return coalesce(new, old);
end; $$;

-- Kritieke referentiedata ook in de audit (NF-B04).
create trigger trg_audit_medewerker_rol after insert or delete on medewerker_rol
  for each row execute function schrijf_audit_zonder_id();
