-- 0022 Directe omzetting van een lead naar dossier zonder de tussenstap kwalificeren.
-- Verkoop of beheerder mag een nieuwe lead meteen omzetten. De overgang
-- nieuw -> omgezet komt naast de bestaande nieuw -> gekwalificeerd -> omgezet,
-- zodat bestaande werkwijzen blijven werken.
insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen)
select 'lead', 'nieuw', 'omgezet', '{verkoop,beheerder}'
where not exists (
  select 1 from statusovergang
  where entiteit = 'lead' and van_status = 'nieuw' and naar_status = 'omgezet'
);
