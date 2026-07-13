-- 0017 Kort dossiernummer per project (discovery brondocumenten 2026-07-13,
-- zie voorbeelden/Analyse brondocumenten.md: de fiche toont nummer 6763).
-- De reeks start op 7000, veilig boven de hoogste gekende Lotus nummers.
create sequence if not exists project_nummer_reeks start with 7000;
alter table project add column nummer integer not null default nextval('project_nummer_reeks');
alter table project add constraint project_nummer_uniek unique (nummer);
grant usage, select on sequence project_nummer_reeks to erp_app;
