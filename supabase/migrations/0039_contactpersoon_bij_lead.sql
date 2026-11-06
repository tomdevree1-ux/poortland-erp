-- 0039: contactpersonen ook aan een lead koppelbaar (feedback klant 2026-08-06).
--
-- Een contactpersoon hoort voortaan bij een klant OF bij een lead (minstens een
-- van beide). Bij het omzetten van de lead naar een klant koppelt de applicatie
-- de contactpersonen automatisch aan de klant, zodat ze op beide fiches zichtbaar
-- zijn zonder duplicatie. Daarnaast krijgt de contactpersoon een eigen klanttype
-- (particulier of bedrijf, met bedrijfsnaam en btw), en een vlag die aangeeft of
-- deze persoon de offerte moet ontvangen.

alter table contactpersoon alter column klant_id drop not null;
alter table contactpersoon add column lead_id uuid references lead(id) on delete cascade;
alter table contactpersoon add column type klant_type not null default 'particulier';
alter table contactpersoon add column bedrijfsnaam text;
alter table contactpersoon add column btw_nummer text;
alter table contactpersoon add column ontvangt_offerte boolean not null default false;
alter table contactpersoon add constraint contactpersoon_koppeling
  check (klant_id is not null or lead_id is not null);
create index idx_contactpersoon_lead on contactpersoon(lead_id) where verwijderd_op is null;
