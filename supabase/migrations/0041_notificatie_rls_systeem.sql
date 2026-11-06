-- 0041: notificatie aanmaken door de systeemrol (bevonden 2026-08-10).
--
-- Zelfde familie als 0038: een INSERT met RETURNING vereist dat de nieuwe rij
-- zichtbaar is onder de select-policy. De systeemrol (publiek uploadportaal,
-- achtergrondtaken) maakt notificaties aan voor medewerkers, maar is zelf geen
-- medewerker en heeft geen D-recht, dus de RETURNING werd geweigerd met
-- "new row violates row-level security policy". Empirisch bewezen: zonder
-- RETURNING slaagt dezelfde insert. Oplossing: wie mag aanmaken (C) mag de
-- nieuwe rij ook zien.

alter policy notificatie_select on notificatie
  using (((medewerker_id = huidige_medewerker_id()) or mag('notificatie','D') or mag('notificatie','C'))
    and (verwijderd_op is null or mag('notificatie','U')));
