-- 0040: foto-opvraag via unieke uploadlink (feedback klant 2026-08-06).
--
-- Een medewerker genereert per lead een cryptografisch veilige uploadtoken.
-- De klant uploadt foto's via een publieke pagina zonder login; de token is het
-- enige dat in de URL staat (geen lead-id of persoonsgegevens). Standaard 30
-- dagen geldig; opnieuw genereren overschrijft de oude token en intrekken zet
-- ze op null. De fotostatus wordt afgeleid: foto's aanwezig = ontvangen, anders
-- token actief = link verstuurd, anders nog geen foto's.

alter table lead add column upload_token text;
alter table lead add column upload_token_geldig_tot timestamptz;
alter table lead add column upload_link_verstuurd_op timestamptz;
create unique index idx_lead_upload_token on lead(upload_token) where upload_token is not null;
