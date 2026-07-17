-- 0027 Serverzijdige zoekslag (vervolg op de zoekregels van taak 62).
-- Relevantie en fouttolerantie: accenten en hoofdletters tellen niet mee
-- (unaccent) en tikfouten vinden toch de juiste rij (pg_trgm similarity).
-- De functies draaien als invoker zodat RLS gewoon geldt; volgorde is
-- prefixtreffers eerst, dan gelijkenis, dan datum.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;

-- Immutable normalisatie zodat ze in indexen mag.
create or replace function zoeknorm(t text) returns text
language sql immutable parallel safe set search_path = ''
as $$ select lower(extensions.unaccent('extensions.unaccent'::regdictionary, coalesce(t, ''))) $$;

-- Trigram indexen op de genormaliseerde zoektekst per tabel.
create index if not exists idx_lead_zoek on lead
  using gin (zoeknorm(coalesce(naam, '') || ' ' || coalesce(voornaam, '') || ' ' || coalesce(bedrijfsnaam, '') || ' ' || coalesce(email, '') || ' ' || coalesce(gemeente, '') || ' ' || coalesce(eerste_vraag, '')) extensions.gin_trgm_ops);
create index if not exists idx_klant_zoek on klant
  using gin (zoeknorm(coalesce(naam, '') || ' ' || coalesce(voornaam, '') || ' ' || coalesce(bedrijfsnaam, '') || ' ' || coalesce(email, '') || ' ' || coalesce(gemeente, '')) extensions.gin_trgm_ops);
create index if not exists idx_project_zoek on project
  using gin (zoeknorm(coalesce(werfadres, '') || ' ' || coalesce(omschrijving, '')) extensions.gin_trgm_ops);

create or replace function zoek_leads(term text, archief boolean) returns table (id uuid)
language sql stable set search_path = public, extensions
as $$
  with q as (select zoeknorm(term) as t)
  select l.id
  from lead l, q
  where l.verwijderd_op is null
    and (l.gearchiveerd_op is not null) = archief
    and (
      zoeknorm(coalesce(l.naam, '') || ' ' || coalesce(l.voornaam, '') || ' ' || coalesce(l.bedrijfsnaam, '') || ' ' || coalesce(l.email, '') || ' ' || coalesce(l.gemeente, '') || ' ' || coalesce(l.eerste_vraag, '')) like '%' || q.t || '%'
      or extensions.similarity(zoeknorm(coalesce(l.naam, '') || ' ' || coalesce(l.voornaam, '') || ' ' || coalesce(l.bedrijfsnaam, '') || ' ' || coalesce(l.email, '') || ' ' || coalesce(l.gemeente, '')), q.t) > 0.3
    )
  order by
    (zoeknorm(coalesce(l.naam, '') || ' ' || coalesce(l.voornaam, '') || ' ' || coalesce(l.bedrijfsnaam, '')) like q.t || '%') desc,
    extensions.similarity(zoeknorm(coalesce(l.naam, '') || ' ' || coalesce(l.voornaam, '') || ' ' || coalesce(l.bedrijfsnaam, '') || ' ' || coalesce(l.email, '') || ' ' || coalesce(l.gemeente, '')), q.t) desc,
    l.aangemaakt_op desc
  limit 200
$$;

create or replace function zoek_klanten(term text) returns table (id uuid)
language sql stable set search_path = public, extensions
as $$
  with q as (select zoeknorm(term) as t)
  select k.id
  from klant k, q
  where k.verwijderd_op is null
    and (
      zoeknorm(coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '') || ' ' || coalesce(k.email, '') || ' ' || coalesce(k.gemeente, '')) like '%' || q.t || '%'
      or extensions.similarity(zoeknorm(coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '') || ' ' || coalesce(k.email, '') || ' ' || coalesce(k.gemeente, '')), q.t) > 0.3
    )
  order by
    (zoeknorm(coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '')) like q.t || '%') desc,
    extensions.similarity(zoeknorm(coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '') || ' ' || coalesce(k.email, '') || ' ' || coalesce(k.gemeente, '')), q.t) desc,
    k.naam
  limit 200
$$;

create or replace function zoek_projecten(term text) returns table (id uuid)
language sql stable set search_path = public, extensions
as $$
  with q as (select zoeknorm(term) as t)
  select p.id
  from project p
  join klant k on k.id = p.klant_id
  cross join q
  where p.verwijderd_op is null
    and (
      p.nummer::text = btrim(term)
      or zoeknorm(coalesce(p.werfadres, '') || ' ' || coalesce(p.omschrijving, '') || ' ' || coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '')) like '%' || q.t || '%'
      or extensions.similarity(zoeknorm(coalesce(p.werfadres, '') || ' ' || coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '')), q.t) > 0.3
    )
  order by
    (p.nummer::text = btrim(term)) desc,
    (zoeknorm(coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '') || ' ' || coalesce(p.werfadres, '')) like q.t || '%') desc,
    extensions.similarity(zoeknorm(coalesce(p.werfadres, '') || ' ' || coalesce(k.naam, '') || ' ' || coalesce(k.voornaam, '') || ' ' || coalesce(k.bedrijfsnaam, '')), q.t) desc,
    p.aangemaakt_op desc
  limit 200
$$;

-- PUBLIC staat dicht (0012): expliciet toekennen aan de applicatierol.
grant usage on schema extensions to erp_app;
grant execute on function zoeknorm(text) to erp_app;
grant execute on function zoek_leads(text, boolean) to erp_app;
grant execute on function zoek_klanten(text) to erp_app;
grant execute on function zoek_projecten(text) to erp_app;
