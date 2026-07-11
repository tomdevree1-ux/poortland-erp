-- 0002 Enum types (TS-01 sectie 4 plus TS-17 en bouwspec flow 1)
-- Nota BS-02: de waarde 'systeem' is toegevoegd aan rol voor automatische
-- overgangen door achtergrondtaken (TS-02 sectie 9 open punt, zie bouwspec).
create type rol as enum ('verkoop','planning','productie','montage','boekhouding','beheerder','systeem');
create type klant_type as enum ('particulier','bedrijf');
create type taal as enum ('nl','fr','en');
create type lead_kanaal as enum ('telefoon','email','webformulier','sociale_media');
create type lead_status as enum ('nieuw','gekwalificeerd','omgezet','verloren');
create type offerte_status as enum ('nieuw','verzonden','goedgekeurd','geweigerd','verlopen');
create type order_status as enum ('aangemaakt','in_productie','externe_behandeling','klaar_voor_montage','gemonteerd','afgesloten','geannuleerd');
create type onderdeel_status as enum ('besteld','in_productie','voorbehandeling','lakwerk','klaar_voor_montage','gemonteerd');
create type werkbon_status as enum ('open','uitgevoerd','klant_getekend','verwerkt_in_facturatie');
create type servicedossier_status as enum ('gemeld','ingepland','uitgevoerd','afgesloten');
create type projectfase as enum ('voorbereiding','draadafsluiting','plaatsing_1','plaatsing_2','automatisering');
create type werkbon_type as enum ('plaatsing_1','plaatsing_2','interventie');
create type factuur_type as enum ('voorschot','eindfactuur');
create type bijlage_soort as enum ('foto','tekening','document','handtekening');
create type leverancier_type as enum ('voorbehandeling','lakwerk','product');
create type btw_tarief as enum ('p0','p6','p21');
create type opvolgtaak_status as enum ('open','uitgevoerd','vervallen');
create type website_content_status as enum ('concept','gepubliceerd','gearchiveerd');
create type artikel_eenheid as enum ('stuk','lopende_meter','vierkante_meter');
create type opvolgtaak_type as enum ('na_opmeting','na_offerte','lead_opvolging');
create type communicatie_status as enum ('gelogd','verzonden','mislukt');
