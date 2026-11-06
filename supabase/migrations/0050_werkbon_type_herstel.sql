-- Herstel van migratie 0042. Die voegde de kolom plaatsing_nummer wel toe maar
-- de omzetting van de twee enums is nooit doorgelopen. Gevolg: de databank kende
-- enkel nog plaatsing en interventie, terwijl het ERP de vier types van de
-- Leverings en Servicebon aanbiedt. Een werkbon van het type automatisatie,
-- onderhoud of herstelling aanmaken gaf daardoor de fout
-- "invalid input value for enum werkbon_type".
--
-- Gecontroleerd voor deze ingreep: alle bestaande werkbonnen staan op plaatsing
-- en er zijn geen planningsitems, dus er gaat geen enkele waarde verloren.

-- Werkbontypes: de vier van de LSB. Interventie gaat op in herstelling.
do $$
begin
  if not exists (select 1 from pg_enum
                 where enumtypid = 'werkbon_type'::regtype and enumlabel = 'automatisatie') then
    create type werkbon_type_nieuw as enum ('plaatsing','automatisatie','onderhoud','herstelling');
    alter table werkbon alter column type type werkbon_type_nieuw
      using (case when type::text like 'plaatsing%' then 'plaatsing'
                  else 'herstelling' end)::werkbon_type_nieuw;
    drop type werkbon_type;
    alter type werkbon_type_nieuw rename to werkbon_type;
  end if;
end $$;

-- Projectfases: plaatsing_1 en plaatsing_2 worden een generieke fase plaatsing.
do $$
begin
  if exists (select 1 from pg_enum
             where enumtypid = 'projectfase'::regtype and enumlabel = 'plaatsing_1') then
    create type projectfase_nieuw as enum ('voorbereiding','draadafsluiting','plaatsing','automatisering');
    alter table planningsitem alter column fase type projectfase_nieuw
      using (case when fase::text like 'plaatsing%' then 'plaatsing'
                  else fase::text end)::projectfase_nieuw;
    drop type projectfase;
    alter type projectfase_nieuw rename to projectfase;
  end if;
end $$;
