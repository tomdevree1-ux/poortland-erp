-- 0007 Row Level Security (TS-02 sectie 5) en de applicatierol erp_app
-- De backend meldt aan als erp_app (geen eigenaar, geen bypass) en zet per
-- verzoek request.jwt.claims zodat auth.jwt() en de mag() functie werken.
-- Het wachtwoord van erp_app wordt buiten de migraties gezet (nooit in de repo).

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'erp_app') then
    create role erp_app login;
  end if;
end $$;

grant usage on schema public to erp_app;
grant select, insert, update, delete on all tables in schema public to erp_app;
grant usage, select on all sequences in schema public to erp_app;
grant execute on all functions in schema public to erp_app;

-- Append only audit en de nummerreeks blijven buiten bereik van de applicatierol.
revoke insert, update, delete on audit_log from erp_app;
revoke all on offerte_reeks from erp_app;

-- RLS aan op alles.
alter table medewerker enable row level security;
alter table medewerker_rol enable row level security;
alter table recht enable row level security;
alter table statusovergang enable row level security;
alter table instelling enable row level security;
alter table klant enable row level security;
alter table contactpersoon enable row level security;
alter table contactmoment enable row level security;
alter table lead enable row level security;
alter table project enable row level security;
alter table artikel enable row level security;
alter table offerte enable row level security;
alter table offerteregel enable row level security;
alter table "order" enable row level security;
alter table offerte_reeks enable row level security;
alter table opvolgtaak enable row level security;
alter table communicatie enable row level security;
alter table notificatie enable row level security;
alter table website_media enable row level security;
alter table website_popup enable row level security;
alter table audit_log enable row level security;

-- Generiek patroon per entiteit (TS-02 sectie 5.3).
-- medewerker: eigen rij zichtbaar, beheer via gebruikersbeheer.
create policy medewerker_select on medewerker for select
  using ((auth_user_id = auth.uid() or mag('gebruikersbeheer','R')) and verwijderd_op is null);
create policy medewerker_insert on medewerker for insert
  with check (mag('gebruikersbeheer','C'));
create policy medewerker_update on medewerker for update
  using (mag('gebruikersbeheer','U') or auth_user_id = auth.uid())
  with check (mag('gebruikersbeheer','U') or auth_user_id = auth.uid());
create policy medewerker_delete on medewerker for delete
  using (mag('gebruikersbeheer','D'));

create policy medewerker_rol_select on medewerker_rol for select
  using (mag('gebruikersbeheer','R') or medewerker_id = huidige_medewerker_id());
create policy medewerker_rol_insert on medewerker_rol for insert
  with check (mag('gebruikersbeheer','C'));
create policy medewerker_rol_delete on medewerker_rol for delete
  using (mag('gebruikersbeheer','D'));

-- Referentiedata: leesbaar voor elke aangemelde gebruiker, beheer door de beheerder.
create policy recht_select on recht for select using (huidige_medewerker_id() is not null);
create policy recht_beheer on recht for all
  using (mag('instellingen','U')) with check (mag('instellingen','U'));
create policy statusovergang_select on statusovergang for select using (huidige_medewerker_id() is not null);
create policy statusovergang_beheer on statusovergang for all
  using (mag('instellingen','U')) with check (mag('instellingen','U'));
create policy instelling_select on instelling for select using (huidige_medewerker_id() is not null);
create policy instelling_beheer on instelling for all
  using (mag('instellingen','U')) with check (mag('instellingen','U'));

-- klant plus ondergeschikte tabellen volgen de entiteit klant uit de matrix.
create policy klant_select on klant for select using (mag('klant','R') and verwijderd_op is null);
create policy klant_insert on klant for insert with check (mag('klant','C'));
create policy klant_update on klant for update using (mag('klant','U')) with check (mag('klant','U'));
create policy klant_delete on klant for delete using (mag('klant','D'));

create policy contactpersoon_select on contactpersoon for select using (mag('klant','R') and verwijderd_op is null);
create policy contactpersoon_insert on contactpersoon for insert with check (mag('klant','C'));
create policy contactpersoon_update on contactpersoon for update using (mag('klant','U')) with check (mag('klant','U'));
create policy contactpersoon_delete on contactpersoon for delete using (mag('klant','D'));

create policy contactmoment_select on contactmoment for select using (mag('klant','R') and verwijderd_op is null);
create policy contactmoment_insert on contactmoment for insert with check (mag('klant','C') or mag('klant','U'));
create policy contactmoment_update on contactmoment for update using (mag('klant','U')) with check (mag('klant','U'));
create policy contactmoment_delete on contactmoment for delete using (mag('klant','D'));

create policy lead_select on lead for select using (mag('lead','R') and verwijderd_op is null);
create policy lead_insert on lead for insert with check (mag('lead','C'));
create policy lead_update on lead for update using (mag('lead','U')) with check (mag('lead','U'));
create policy lead_delete on lead for delete using (mag('lead','D'));

create policy project_select on project for select using (mag('project','R') and verwijderd_op is null);
create policy project_insert on project for insert with check (mag('project','C'));
create policy project_update on project for update using (mag('project','U')) with check (mag('project','U'));
create policy project_delete on project for delete using (mag('project','D'));

create policy artikel_select on artikel for select using (mag('artikel','R') and verwijderd_op is null);
create policy artikel_insert on artikel for insert with check (mag('artikel','C'));
create policy artikel_update on artikel for update using (mag('artikel','U')) with check (mag('artikel','U'));
create policy artikel_delete on artikel for delete using (mag('artikel','D'));

create policy offerte_select on offerte for select using (mag('offerte','R') and verwijderd_op is null);
create policy offerte_insert on offerte for insert with check (mag('offerte','C'));
create policy offerte_update on offerte for update using (mag('offerte','U') or mag('offerte','S'))
  with check (mag('offerte','U') or mag('offerte','S'));
create policy offerte_delete on offerte for delete using (mag('offerte','D'));

create policy offerteregel_select on offerteregel for select using (mag('offerte','R') and verwijderd_op is null);
create policy offerteregel_insert on offerteregel for insert with check (mag('offerte','U'));
create policy offerteregel_update on offerteregel for update using (mag('offerte','U')) with check (mag('offerte','U'));
create policy offerteregel_delete on offerteregel for delete using (mag('offerte','U'));

create policy order_select on "order" for select using (mag('order','R') and verwijderd_op is null);
create policy order_insert on "order" for insert with check (mag('order','C') or mag('offerte','A'));
create policy order_update on "order" for update using (mag('order','U') or mag('order','S'))
  with check (mag('order','U') or mag('order','S'));
create policy order_delete on "order" for delete using (mag('order','D'));

create policy opvolgtaak_select on opvolgtaak for select using (mag('opvolgtaak','R') and verwijderd_op is null);
create policy opvolgtaak_insert on opvolgtaak for insert with check (mag('opvolgtaak','C'));
create policy opvolgtaak_update on opvolgtaak for update
  using (mag('opvolgtaak','U') and (medewerker_id = huidige_medewerker_id() or 'beheerder' = any (huidige_rollen())))
  with check (mag('opvolgtaak','U') and (medewerker_id = huidige_medewerker_id() or 'beheerder' = any (huidige_rollen())));
create policy opvolgtaak_delete on opvolgtaak for delete using (mag('opvolgtaak','D'));

create policy communicatie_select on communicatie for select using (mag('communicatie','R') and verwijderd_op is null);
create policy communicatie_insert on communicatie for insert with check (mag('communicatie','C'));
create policy communicatie_delete on communicatie for delete using (mag('communicatie','D'));

-- Notificaties: iedereen ziet en beheert enkel de eigen meldingen.
create policy notificatie_select on notificatie for select
  using ((medewerker_id = huidige_medewerker_id() or mag('notificatie','D')) and verwijderd_op is null);
create policy notificatie_insert on notificatie for insert with check (mag('notificatie','C'));
create policy notificatie_update on notificatie for update
  using (mag('notificatie','U') and medewerker_id = huidige_medewerker_id())
  with check (mag('notificatie','U') and medewerker_id = huidige_medewerker_id());
create policy notificatie_delete on notificatie for delete using (mag('notificatie','D'));

create policy website_media_select on website_media for select using (mag('website_content','R') and verwijderd_op is null);
create policy website_media_insert on website_media for insert with check (mag('website_content','C'));
create policy website_media_update on website_media for update
  using (mag('website_content','U') or mag('website_content','S'))
  with check (mag('website_content','U') or mag('website_content','S'));
create policy website_media_delete on website_media for delete using (mag('website_content','D'));

create policy website_popup_select on website_popup for select using (mag('website_content','R') and verwijderd_op is null);
create policy website_popup_insert on website_popup for insert with check (mag('website_content','C'));
create policy website_popup_update on website_popup for update
  using (mag('website_content','U') or mag('website_content','S'))
  with check (mag('website_content','U') or mag('website_content','S'));
create policy website_popup_delete on website_popup for delete using (mag('website_content','D'));

-- Audit: enkel lezen en enkel de beheerder. Schrijven verloopt via de trigger.
create policy audit_select on audit_log for select using (mag('audit','R'));

-- offerte_reeks: geen policies, dus geen directe toegang. De nummering loopt
-- via de security definer functie in migratie 0009.

-- Nota: deze view is in migratie 0011 vervangen door de functie medewerker_keuzes()
-- na de security advisors. Historie blijft staan voor wie de reeks vers afspeelt.
-- Namen van collega's voor keuzelijsten (eigenaar van een lead of taak):
-- een beperkte weergave zonder contactgegevens, leesbaar voor de applicatie.
create view medewerker_overzicht as
  select id, naam, is_actief from medewerker where verwijderd_op is null;
grant select on medewerker_overzicht to erp_app;
