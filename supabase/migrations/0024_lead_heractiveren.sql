-- 0024 Een verloren lead opnieuw activeren (verloren -> nieuw).
-- Verkoop of beheerder mag een als verloren gemarkeerde lead terug in de inbox
-- brengen. De overgang verloren -> nieuw komt naast de bestaande overgangen.
insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen)
select 'lead', 'verloren', 'nieuw', '{verkoop,beheerder}'
where not exists (
  select 1 from statusovergang
  where entiteit = 'lead' and van_status = 'verloren' and naar_status = 'nieuw'
);
