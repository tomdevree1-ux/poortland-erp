-- 0037 Rollen voor echte gebruikers altijd live uit de databank halen.
-- Reden: een verouderd aanmeldtoken kan oude of ontbrekende rollen bevatten,
-- waardoor RLS schrijfacties weigert (42501: onvoldoende rechten) terwijl de
-- databank de gebruiker wel de juiste rol geeft. Lezen lukt dan wel (elke rol
-- mag lezen) maar wijzigen of verwijderen niet. Door de rollen op basis van
-- auth.uid() uit medewerker_rol te lezen, werken rolwijzigingen meteen en is er
-- geen heraanmelding nodig. Het systeempad (webformulier, zonder echte gebruiker)
-- valt terug op de rollen uit het token.
create or replace function public.huidige_rollen()
returns rol[]
language sql
stable
security definer
set search_path to 'public'
as $function$
  select coalesce(
    (select array_agg(mr.rol)
       from medewerker m
       join medewerker_rol mr on mr.medewerker_id = m.id
      where m.auth_user_id = auth.uid()
        and m.is_actief
        and m.verwijderd_op is null),
    (select coalesce(array(select jsonb_array_elements_text(auth.jwt() -> 'rollen')::rol), '{}'::rol[])
       where auth.jwt() ? 'rollen'),
    '{}'::rol[]
  );
$function$;
