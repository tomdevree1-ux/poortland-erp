-- 0036 Stijl (type) op websitefoto's (vraag Poortland 2026-07-24).
-- De website plaatst een poortfoto met drie parameters: materiaal (poort_type),
-- stijltab (poort_stijl, bv. Klassiek met sierpunten) en naam (model_naam).
alter table website_media add column poort_stijl text;
