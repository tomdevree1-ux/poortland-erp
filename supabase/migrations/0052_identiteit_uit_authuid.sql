-- 0052 Identiteit in de databank altijd afleiden uit auth.uid(), nooit uit een
-- zelf meegestuurde claim (veiligheidsreview 2026-11-18, Tom akkoord).
--
-- huidige_medewerker_id() en huidige_rollen() vertrouwden een medewerker_id en
-- rollen die in het token stonden. Vandaag vult de access-token-hook die correct
-- in op basis van de echte gebruiker, dus voor een echte gebruiker verandert er
-- niets. Het verschil zit in de schade bij een lek: stond de JWT-sleutel ooit op
-- straat, dan kon een aanvaller een token maken met een zelfgekozen medewerker_id
-- en rollen, en die werden rechtstreeks geloofd. Door de identiteit uit auth.uid()
-- te halen verdwijnt die versterking.
--
-- Het systeempad (webformulier, zonder echte gebruiker) heeft geen medewerker en
-- enkel de rol systeem nodig. Daarom houdt de terugval enkel de rol systeem over;
-- een vervalste echte rol in een token wordt nooit meer gehonoreerd.

create or replace function public.huidige_medewerker_id()
returns uuid
language sql
stable
security definer
set search_path to 'public'
as $function$
  select m.id
    from medewerker m
   where m.auth_user_id = auth.uid()
     and m.verwijderd_op is null;
$function$;

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
    -- Terugval uitsluitend voor het systeempad: enkel de rol systeem mag uit het
    -- token komen, nooit een echte rol zoals beheerder of verkoop.
    (select array['systeem'::rol]
       where coalesce(auth.jwt() -> 'rollen', '[]'::jsonb) ? 'systeem'),
    '{}'::rol[]
  );
$function$;
