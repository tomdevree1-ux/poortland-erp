-- 0025 Bedrijfsklant met contactpersoon.
-- De klant krijgt een bedrijfsnaam naast naam en voornaam (de contactpersoon).
-- De lead krijgt klanttype, bedrijfsnaam, btw en postcode zodat het contact-
-- en offerteformulier van de website deze gegevens kunnen doorgeven en het
-- omzetvenster ze voorinvult.
alter table klant add column if not exists bedrijfsnaam text;
alter table lead add column if not exists klant_type text;
alter table lead add column if not exists bedrijfsnaam text;
alter table lead add column if not exists btw_nummer text;
alter table lead add column if not exists postcode text;
