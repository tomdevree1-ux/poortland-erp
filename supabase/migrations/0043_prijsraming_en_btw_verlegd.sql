-- Feedback klant 2026-09-13 op het offertedocument.
--
-- 1. Onderscheid tussen een prijsraming (aanvraag via mail, telefoon of aan de
--    balie, dus nog zonder plaatsbezoek) en een offerte (na plaatsbezoek of op
--    basis van het plan van de architect). Een prijsraming kan met één klik
--    worden omgezet naar een offerte; de verwijzing naar de raming blijft.
-- 2. Btw verlegd (medecontractant): een vlag op het document zodat de
--    wettelijke vermelding verschijnt en er geen btw wordt aangerekend.

-- 1. Documentsoort
create type offerte_soort as enum ('prijsraming', 'offerte');
alter table offerte add column soort offerte_soort not null default 'offerte';
comment on column offerte.soort is
  'Prijsraming zonder plaatsbezoek of definitieve offerte na opmeting.';

-- Verwijzing naar de raming waaruit deze offerte is voortgekomen
alter table offerte add column uit_raming_id uuid references offerte(id);
comment on column offerte.uit_raming_id is
  'De prijsraming die naar deze offerte werd omgezet, indien van toepassing.';
create index offerte_uit_raming_idx on offerte(uit_raming_id) where uit_raming_id is not null;

-- 2. Btw verlegd
alter table offerte add column btw_verlegd boolean not null default false;
comment on column offerte.btw_verlegd is
  'Btw verlegd naar de medecontractant: geen btw aanrekenen en de wettelijke vermelding tonen.';

-- Bestaande documenten blijven offertes; niets te migreren.

-- 3. Model op het document en extra info per regel.
--    De klant miste een aanduiding van het model en wil in de omschrijving ook
--    technische details kwijt kunnen, zoals de gebruikte profielen of de opbouw
--    van de paal.
alter table offerte add column model text;
comment on column offerte.model is 'Het gekozen poortmodel, komt op het document onder de werf.';

alter table offerteregel add column detail text;
comment on column offerteregel.detail is
  'Extra technische informatie onder de omschrijving, bijvoorbeeld de gebruikte profielen.';
