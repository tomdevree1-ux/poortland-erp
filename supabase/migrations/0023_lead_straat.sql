-- 0023 Straat en huisnummer op de lead.
-- Wordt ingevuld vanaf het contactformulier van de website en is bewerkbaar in
-- het ERP. Bij omzetting naar een dossier vult ze het adres van de klant voor.
alter table lead add column if not exists straat text;
