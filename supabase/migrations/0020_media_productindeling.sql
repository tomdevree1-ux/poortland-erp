-- 0020 Productindeling op websitefoto's (vraag Poortland 2026-07-13):
-- poort of overkapping, bij poorten het type (hout, metaal of combinatie)
-- en de uitvoering (draaipoort of schuifpoort). De website filtert hierop.
alter table website_media add column product_soort text
  check (product_soort in ('poort','overkapping'));
alter table website_media add column poort_type text
  check (poort_type in ('hout','metaal','hout_metaal'));
alter table website_media add column poort_uitvoering text
  check (poort_uitvoering in ('draaipoort','schuifpoort'));

create index idx_website_media_product on website_media (product_soort, poort_type)
  where verwijderd_op is null;

-- Publicatiebewaking uitgebreid: de indeling moet compleet zijn voor publicatie.
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
    if new.product_soort is null then
      raise exception 'Publicatie vereist de keuze poort of overkapping';
    end if;
    if new.product_soort = 'poort' and (new.poort_type is null or new.poort_uitvoering is null) then
      raise exception 'Publicatie van een poort vereist het poorttype en de uitvoering';
    end if;
    new.gepubliceerd_op := now();
    new.gepubliceerd_door := huidige_medewerker_id();
  end if;
  return new;
end; $$;
