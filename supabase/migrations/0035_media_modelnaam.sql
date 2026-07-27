-- 0035 Modelnaam op websitefoto's (vraag Poortland 2026-07-24).
-- De realisatiespagina verdwijnt; gepubliceerde foto's verschijnen voortaan in
-- de modellentabs van de categoriepagina's, naast het model met deze naam.
alter table website_media add column model_naam text;
