-- 0014 Contactpersonen verbreed (vraag Poortland 2026-07-13)
-- Niet enkel bij bedrijven maar bij elke klant: tuinman, architect, elektricien,
-- concierge en dergelijke, met een apart voornaamveld.
alter table contactpersoon add column voornaam text;
