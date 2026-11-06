-- Een werkbonregel kan nu naar een artikel uit de catalogus verwijzen. De
-- omschrijving blijft bestaan en wordt overgenomen van het artikel op het
-- moment van toevoegen, zodat de bon leesbaar blijft wanneer een artikel later
-- hernoemd of geschrapt wordt. De verwijzing is optioneel: een plaatser kan
-- nog altijd vrije tekst invullen voor iets wat niet in de catalogus staat.
alter table werkbonregel
  add column if not exists artikel_id uuid references artikel(id),
  add column if not exists artikel_code text;

create index if not exists werkbonregel_artikel_idx on werkbonregel (artikel_id)
  where verwijderd_op is null;

comment on column werkbonregel.artikel_id is
  'Optionele verwijzing naar de catalogus. Leeg bij een regel in vrije tekst.';
comment on column werkbonregel.artikel_code is
  'De code zoals ze op het moment van toevoegen gold, blijft staan ook als het artikel verdwijnt.';
