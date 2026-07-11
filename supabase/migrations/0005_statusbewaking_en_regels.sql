-- 0005 Statusbewaking en bedrijfsregels (TS-02 sectie 6, TS-01 sectie 7, masterdocument 4.7)

-- Bewakingstrigger: de overgang moet in statusovergang staan en de gebruiker
-- moet het recht S op de entiteit hebben plus een rol die de overgang mag.
create or replace function bewaak_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    if not mag(tg_argv[0], 'S') then
      raise exception 'Geen recht op statuswijziging voor %', tg_argv[0]
        using errcode = '42501';
    end if;
    if not exists (
      select 1 from statusovergang s
      where s.entiteit = tg_argv[0]
        and s.van_status = old.status::text
        and s.naar_status = new.status::text
        and s.toegestane_rollen && huidige_rollen()
    ) then
      raise exception 'Ongeldige of niet toegestane overgang % naar % op %',
        old.status, new.status, tg_argv[0] using errcode = 'P0001';
    end if;
  end if;
  return new;
end; $$;

create trigger trg_status_lead before update on lead
  for each row execute function bewaak_status('lead');
create trigger trg_status_offerte before update on offerte
  for each row execute function bewaak_status('offerte');
create trigger trg_status_order before update on "order"
  for each row execute function bewaak_status('order');
create trigger trg_status_project before update on project
  for each row execute function bewaak_status('project');
create trigger trg_status_website_media before update on website_media
  for each row execute function bewaak_status('website_content');
create trigger trg_status_website_popup before update on website_popup
  for each row execute function bewaak_status('website_content');

-- Toegelaten overgangen (masterdocument 4.7, TS-04 sectie 3, TS-05 sectie 4, TS-17).
insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('lead','nieuw','gekwalificeerd','{verkoop,beheerder}'),
  ('lead','nieuw','verloren','{verkoop,beheerder}'),
  ('lead','gekwalificeerd','omgezet','{verkoop,beheerder}'),
  ('lead','gekwalificeerd','verloren','{verkoop,beheerder}'),
  ('offerte','nieuw','verzonden','{verkoop,beheerder}'),
  ('offerte','verzonden','goedgekeurd','{verkoop,beheerder,systeem}'),
  ('offerte','verzonden','geweigerd','{verkoop,beheerder}'),
  ('offerte','verzonden','verlopen','{systeem,beheerder}'),
  ('offerte','verlopen','verzonden','{verkoop,beheerder}'),
  ('order','aangemaakt','in_productie','{productie,planning,beheerder}'),
  ('order','in_productie','externe_behandeling','{productie,beheerder}'),
  ('order','externe_behandeling','in_productie','{productie,beheerder}'),
  ('order','in_productie','klaar_voor_montage','{productie,beheerder}'),
  ('order','klaar_voor_montage','gemonteerd','{montage,beheerder}'),
  ('order','gemonteerd','afgesloten','{boekhouding,beheerder}'),
  ('order','aangemaakt','geannuleerd','{verkoop,beheerder}'),
  ('order','in_productie','geannuleerd','{verkoop,beheerder}'),
  ('project','aangemaakt','in_productie','{productie,planning,beheerder}'),
  ('project','in_productie','externe_behandeling','{productie,beheerder}'),
  ('project','externe_behandeling','in_productie','{productie,beheerder}'),
  ('project','in_productie','klaar_voor_montage','{productie,beheerder}'),
  ('project','klaar_voor_montage','gemonteerd','{montage,beheerder}'),
  ('project','gemonteerd','afgesloten','{boekhouding,beheerder}'),
  ('project','aangemaakt','geannuleerd','{verkoop,beheerder}'),
  ('project','in_productie','geannuleerd','{verkoop,beheerder}'),
  ('website_content','concept','gepubliceerd','{verkoop,beheerder}'),
  ('website_content','gepubliceerd','gearchiveerd','{verkoop,beheerder}'),
  ('website_content','gepubliceerd','concept','{verkoop,beheerder}'),
  ('website_content','gearchiveerd','concept','{verkoop,beheerder}');

-- TS-01 sectie 7 regel 2: per project maximaal 1 goedgekeurde offerte.
create unique index offerte_1_goedgekeurd_per_project on offerte (project_id)
  where status = 'goedgekeurd' and verwijderd_op is null;

-- TS-01 sectie 7 regel 2 aanvulling: versienummer uniek per project.
create unique index offerte_versie_uniek_per_project on offerte (project_id, versie_offerte)
  where verwijderd_op is null;

-- TS-01 sectie 7 regel 3: een order komt uit exact 1 goedgekeurde offerte.
create or replace function controleer_order_offerte() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_status offerte_status;
begin
  select status into v_status from offerte where id = new.offerte_id;
  if v_status is distinct from 'goedgekeurd' then
    raise exception 'Een order vereist een goedgekeurde offerte';
  end if;
  return new;
end; $$;
create trigger trg_order_uit_goedgekeurde_offerte before insert on "order"
  for each row execute function controleer_order_offerte();

-- TS-17 sectie 4.3 regel 1: maximaal 1 gepubliceerde popup.
create unique index popup_1_gepubliceerd on website_popup ((true))
  where status = 'gepubliceerd' and verwijderd_op is null;

-- TS-17 sectie 4.3 regels 2 en 3: publicatie eisen voor media.
create or replace function controleer_media_publicatie() returns trigger
language plpgsql as $$
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
create trigger trg_media_publicatie before update on website_media
  for each row execute function controleer_media_publicatie();

-- Zelfde publicatiemetadata voor de popup.
create or replace function controleer_popup_publicatie() returns trigger
language plpgsql as $$
begin
  if new.status = 'gepubliceerd' and old.status is distinct from 'gepubliceerd' then
    new.gepubliceerd_op := now();
    new.gepubliceerd_door := huidige_medewerker_id();
  end if;
  return new;
end; $$;
create trigger trg_popup_publicatie before update on website_popup
  for each row execute function controleer_popup_publicatie();
