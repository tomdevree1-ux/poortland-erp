-- 0021 De rol systeem mag medewerkers lezen om leads en taken toe te wijzen.
-- De publieke webformulierflow (anonieme leadcaptatie, FR-001) draait als systeem
-- en kiest een eigenaar uit de actieve medewerkers met rol verkoop of beheerder.
-- De RLS op medewerker en medewerker_rol vereist mag('gebruikersbeheer','R'), dus
-- zonder dit recht ziet de systeemcontext geen medewerkers en faalt het formulier
-- met "Nog geen medewerkers ingericht." Alleen lezen (R), geen wijzigen.
insert into recht (rol, entiteit, acties) values ('systeem','gebruikersbeheer','R')
on conflict (rol, entiteit) do update set acties = excluded.acties;
