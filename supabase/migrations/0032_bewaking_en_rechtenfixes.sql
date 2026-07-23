-- 0032 Bevindingen uit de brede audit (rechten, bewaking en hygiëne).
-- Drie reparaties op eerder toegepaste migraties plus opruiming:
--   1. montage kon de onderdeelstap naar gemonteerd niet zetten hoewel de
--      statusovergang (0026) en het endpoint dat wel bedoelden;
--   2. planningsitem was statusdragend zonder overgangsbewaking;
--   3. de rechtenmatrix bevatte dode rijen op de entiteit factuur die nergens
--      door een policy gebruikt worden (facturatie draait op factuurvoorstel);
--   4. ploeg_lid miste de audittrigger die medewerker_rol wel heeft.

-- 1. Montage zet de eindstap van de behandelingsketen (klaar voor montage
--    naar gemonteerd). Statusrecht volstaat; de overgangstabel bewaakt welke
--    sprong montage effectief mag maken.
insert into recht (rol, entiteit, acties) values ('montage','stuklijst','RS')
on conflict (rol, entiteit) do update set acties = excluded.acties;

-- 2. Planningsitems onder dezelfde overgangsbewaking als de rest.
insert into statusovergang (entiteit, van_status, naar_status, toegestane_rollen) values
  ('planning','gepland','bevestigd','{planning,beheerder}'),
  ('planning','bevestigd','gepland','{planning,beheerder}'),
  ('planning','gepland','uitgevoerd','{planning,montage,beheerder}'),
  ('planning','bevestigd','uitgevoerd','{planning,montage,beheerder}'),
  ('planning','uitgevoerd','gepland','{planning,beheerder}')
on conflict do nothing;

create trigger trg_status_planningsitem before update on planningsitem
  for each row execute function bewaak_status('planning');

-- 3. Dode matrixrijen opruimen: geen enkele policy gebruikt mag('factuur', ...).
delete from recht where entiteit = 'factuur';

-- 4. Wijzigingen aan de ploegsamenstelling horen in de audit trail (NF-B04),
--    naar het voorbeeld van medewerker_rol.
create trigger trg_audit_ploeg_lid after insert or delete on ploeg_lid
  for each row execute function schrijf_audit_zonder_id();
