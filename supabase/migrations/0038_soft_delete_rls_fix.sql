-- 0038: soft delete versus RLS-selectpolicy (bevonden 2026-08-06).
--
-- Elke soft delete (update die verwijderd_op invult) faalde met
-- "new row violates row-level security policy": de nieuwe rij wordt door het
-- zetten van verwijderd_op meteen onzichtbaar voor de select-policy
-- (verwijderd_op is null), en Postgres weigert dan de update. Empirisch
-- bewezen op de stagingdatabank: met een versoepelde select-policy slaagt
-- exact dezelfde update.
--
-- Oplossing: wie mag bijwerken (U) op de entiteit, mag de zonet verwijderde rij
-- ook nog "zien" voor de RLS-controle. Pure lezers (enkel R) zien verwijderde
-- rijen nog steeds niet, dus de verdediging in de diepte blijft. De applicatie
-- filtert verwijderd_op bovendien overal expliciet in haar queries.

alter policy artikel_select on artikel
  using (mag('artikel','R') and (verwijderd_op is null or mag('artikel','U')));
alter policy communicatie_select on communicatie
  using (mag('communicatie','R') and (verwijderd_op is null or mag('communicatie','U')));
alter policy contactmoment_select on contactmoment
  using (mag('klant','R') and (verwijderd_op is null or mag('klant','U')));
alter policy contactpersoon_select on contactpersoon
  using (mag('klant','R') and (verwijderd_op is null or mag('klant','U')));
alter policy factuurvoorstel_select on factuurvoorstel
  using (mag('factuurvoorstel','R') and (verwijderd_op is null or mag('factuurvoorstel','U')));
alter policy factuurvoorstelregel_select on factuurvoorstelregel
  using (mag('factuurvoorstel','R') and (verwijderd_op is null or mag('factuurvoorstel','U')));
alter policy klant_select on klant
  using (mag('klant','R') and (verwijderd_op is null or mag('klant','U')));
alter policy lead_select on lead
  using (mag('lead','R') and (verwijderd_op is null or mag('lead','U')));
alter policy lead_bijlage_select on lead_bijlage
  using (mag('lead','R') and (verwijderd_op is null or mag('lead','U')));
alter policy leverancier_select on leverancier
  using (mag('leverancier','R') and (verwijderd_op is null or mag('leverancier','U')));
alter policy medewerker_select on medewerker
  using (((auth_user_id = auth.uid()) or mag('gebruikersbeheer','R'))
    and (verwijderd_op is null or mag('gebruikersbeheer','U')));
alter policy notificatie_select on notificatie
  using (((medewerker_id = huidige_medewerker_id()) or mag('notificatie','D'))
    and (verwijderd_op is null or mag('notificatie','U')));
alter policy offerte_select on offerte
  using (mag('offerte','R') and (verwijderd_op is null or mag('offerte','U')));
alter policy offerteregel_select on offerteregel
  using (mag('offerte','R') and (verwijderd_op is null or mag('offerte','U')));
alter policy opvolgtaak_select on opvolgtaak
  using (mag('opvolgtaak','R') and (verwijderd_op is null or mag('opvolgtaak','U')));
alter policy order_select on "order"
  using (mag('order','R') and (verwijderd_op is null or mag('order','U')));
alter policy planningsitem_select on planningsitem
  using (mag('planning','R') and (verwijderd_op is null or mag('planning','U')));
alter policy ploeg_select on ploeg
  using (mag('planning','R') and (verwijderd_op is null or mag('planning','U')));
alter policy onderdeel_select on productieonderdeel
  using (mag('stuklijst','R') and (verwijderd_op is null or mag('stuklijst','U')));
alter policy project_select on project
  using (mag('project','R') and (verwijderd_op is null or mag('project','U')));
alter policy service_select on servicedossier
  using (mag('servicedossier','R') and (verwijderd_op is null or mag('servicedossier','U')));
alter policy stuklijst_select on stuklijst
  using (mag('stuklijst','R') and (verwijderd_op is null or mag('stuklijst','U')));
alter policy tekening_select on tekening
  using (mag('tekening','R') and (verwijderd_op is null or mag('tekening','U')));
alter policy website_media_select on website_media
  using (mag('website_content','R') and (verwijderd_op is null or mag('website_content','U')));
alter policy website_popup_select on website_popup
  using (mag('website_content','R') and (verwijderd_op is null or mag('website_content','U')));
alter policy werkbon_select on werkbon
  using (mag('werkbon','R') and (verwijderd_op is null or mag('werkbon','U')));
alter policy werkbonfoto_select on werkbonfoto
  using (mag('werkbon','R') and (verwijderd_op is null or mag('werkbon','U')));
alter policy werkbonregel_select on werkbonregel
  using (mag('werkbon','R') and (verwijderd_op is null or mag('werkbon','U')));
