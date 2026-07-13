-- 0015 Leads archiveren (vraag Poortland 2026-07-13)
-- Archiveren is een vlag en geen status: het bindende statusmodel uit TS-01
-- blijft onaangeroerd. Verwijderen blijft soft delete voor de beheerder.
alter table lead add column gearchiveerd_op timestamptz;
create index idx_lead_archief on lead (gearchiveerd_op) where verwijderd_op is null;
