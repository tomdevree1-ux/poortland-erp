-- 0008 Indexen en zoekbaarheid (TS-01 sectie 9, NF-G05)

-- Vreemde sleutels en veel gefilterde statuskolommen.
create index idx_medewerker_rol_medewerker on medewerker_rol (medewerker_id);
create index idx_contactpersoon_klant on contactpersoon (klant_id);
create index idx_contactmoment_klant on contactmoment (klant_id);
create index idx_contactmoment_project on contactmoment (project_id);
create index idx_lead_klant on lead (klant_id);
create index idx_lead_eigenaar on lead (eigenaar_id);
create index idx_lead_status on lead (status) where verwijderd_op is null;
create index idx_lead_opvolgdatum on lead (opvolgdatum) where verwijderd_op is null;
create index idx_project_klant on project (klant_id);
create index idx_project_status on project (status) where verwijderd_op is null;
create index idx_offerte_project on offerte (project_id);
create index idx_offerte_status on offerte (status) where verwijderd_op is null;
create index idx_offerte_geldig_tot on offerte (geldig_tot) where verwijderd_op is null;
create index idx_offerteregel_offerte on offerteregel (offerte_id);
create index idx_offerteregel_artikel on offerteregel (artikel_id);
create index idx_order_offerte on "order" (offerte_id);
create index idx_order_status on "order" (status) where verwijderd_op is null;
create index idx_opvolgtaak_medewerker on opvolgtaak (medewerker_id);
create index idx_opvolgtaak_status_due on opvolgtaak (status, due_datum) where verwijderd_op is null;
create index idx_opvolgtaak_offerte on opvolgtaak (offerte_id);
create index idx_opvolgtaak_lead on opvolgtaak (lead_id);
create index idx_communicatie_klant on communicatie (klant_id);
create index idx_communicatie_project on communicatie (project_id);
create index idx_notificatie_medewerker on notificatie (medewerker_id, gelezen_op);
create index idx_website_media_status on website_media (status, volgnummer) where verwijderd_op is null;
create index idx_audit_entiteit on audit_log (entiteit_type, entiteit_id);
create index idx_audit_tijdstip on audit_log (tijdstip);

-- Full text zoeken vervangt het papieren dossier (TS-01 sectie 9).
alter table klant add column zoek tsvector generated always as (
  to_tsvector('simple',
    coalesce(naam,'') || ' ' || coalesce(email::text,'') || ' ' || coalesce(btw_nummer,'') || ' ' ||
    coalesce(straat,'') || ' ' || coalesce(postcode,'') || ' ' || coalesce(gemeente,''))
) stored;
create index idx_klant_zoek on klant using gin (zoek);
create index idx_klant_naam_trgm on klant using gin (naam gin_trgm_ops);

alter table project add column zoek tsvector generated always as (
  to_tsvector('simple', coalesce(werfadres,'') || ' ' || coalesce(omschrijving,''))
) stored;
create index idx_project_zoek on project using gin (zoek);

alter table offerte add column zoek tsvector generated always as (
  to_tsvector('simple', coalesce(nummer,''))
) stored;
create index idx_offerte_zoek on offerte using gin (zoek);

alter table lead add column zoek tsvector generated always as (
  to_tsvector('simple',
    coalesce(naam,'') || ' ' || coalesce(email::text,'') || ' ' || coalesce(telefoon,'') || ' ' ||
    coalesce(eerste_vraag,''))
) stored;
create index idx_lead_zoek on lead using gin (zoek);
