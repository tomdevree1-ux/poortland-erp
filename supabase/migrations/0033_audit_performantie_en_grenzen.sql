-- 0033 Bevindingen uit de diepteronde (performantie en randgevallen).
-- Twee indexen op velden die de code vaak filtert plus databankgrenzen die
-- de applicatie nu al afdwingt maar die als laatste vangnet horen te bestaan.

-- Performantie: filters en sorteringen zonder index (audit performantie 2 en 6).
create index if not exists idx_planning_medewerker on planningsitem (medewerker_id)
  where verwijderd_op is null;
create index if not exists idx_werkbon_status on werkbon (status)
  where verwijderd_op is null;
-- De voorstellenlijst sorteert op aangemaakt_op en de servicelijst op status en
-- gemeld_op; beide vielen terug op een volledige sort.
create index if not exists idx_factuurvoorstel_aangemaakt on factuurvoorstel (aangemaakt_op desc)
  where verwijderd_op is null;
create index if not exists idx_service_status_gemeld on servicedossier (status, gemeld_op desc)
  where verwijderd_op is null;

-- Randgevallen: een factuurregel moet een positief aantal hebben; de prijs mag
-- negatief zijn voor een kortingregel (audit randgevallen 1). Spiegelt de
-- bestaande check op offerteregel.
alter table factuurvoorstelregel
  add constraint factuurvoorstelregel_aantal_positief check (aantal > 0);

-- Werkbonuren: einde niet vóór begin (audit randgevallen 5).
alter table werkbon
  add constraint werkbon_uren_volgorde
  check (uren_begin is null or uren_einde is null or uren_einde >= uren_begin);
