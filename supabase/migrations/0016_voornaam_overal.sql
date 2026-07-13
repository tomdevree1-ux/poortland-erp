-- 0016 Naam en voornaam altijd gescheiden (gegevensregel Poortland 2026-07-13)
alter table lead add column voornaam text;
alter table klant add column voornaam text;
alter table medewerker add column voornaam text;

-- Zoekkolommen vernieuwen zodat de voornaam meezoekt.
alter table lead drop column zoek;
alter table lead add column zoek tsvector generated always as (
  to_tsvector('simple',
    coalesce(voornaam,'') || ' ' || coalesce(naam,'') || ' ' || coalesce(email::text,'') || ' ' ||
    coalesce(telefoon,'') || ' ' || coalesce(eerste_vraag,'') || ' ' || coalesce(gemeente,''))
) stored;
create index idx_lead_zoek on lead using gin (zoek);

alter table klant drop column zoek;
alter table klant add column zoek tsvector generated always as (
  to_tsvector('simple',
    coalesce(voornaam,'') || ' ' || coalesce(naam,'') || ' ' || coalesce(email::text,'') || ' ' ||
    coalesce(btw_nummer,'') || ' ' || coalesce(straat,'') || ' ' || coalesce(postcode,'') || ' ' ||
    coalesce(gemeente,''))
) stored;
create index idx_klant_zoek on klant using gin (zoek);

-- Keuzelijstfunctie toont voortaan de volledige naam.
create or replace function medewerker_keuzes()
returns table (id uuid, naam text, is_actief boolean)
language sql stable security definer set search_path = public as $$
  select id, btrim(coalesce(voornaam || ' ', '') || naam) as naam, is_actief
  from medewerker where verwijderd_op is null;
$$;
grant execute on function medewerker_keuzes() to erp_app;
