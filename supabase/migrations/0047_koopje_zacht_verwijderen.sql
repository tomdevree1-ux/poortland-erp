-- Zacht verwijderen van koopjes en vacatures werkte niet: "new row violates
-- row-level security policy for table koopje".
--
-- Oorzaak: een zachte verwijdering is een update die verwijderd_op vult.
-- Postgres toetst de nieuwe rij daarna ook aan het leesbeleid, en dat beleid
-- sloot verwijderde rijen uit. De rij die je net verwijderde voldoet dus niet
-- meer aan het beleid en de hele update wordt geweigerd.
--
-- klant_select en lead_select zijn eerder al op deze manier rechtgezet. De
-- tabellen uit migratie 0046 misten die correctie. Wie mag wijzigen, mag de
-- verwijderde rij ook nog zien. De lijsten in het ERP en content.json filteren
-- verwijderde rijen zelf al weg, dus er verandert niets aan wat men te zien
-- krijgt.

drop policy if exists koopje_select on koopje;
create policy koopje_select on koopje for select
  using (mag('website_content','R') and (verwijderd_op is null or mag('website_content','U')));

drop policy if exists koopje_foto_select on koopje_foto;
create policy koopje_foto_select on koopje_foto for select
  using (mag('website_content','R') and (verwijderd_op is null or mag('website_content','U')));

drop policy if exists vacature_select on vacature;
create policy vacature_select on vacature for select
  using (mag('website_content','R') and (verwijderd_op is null or mag('website_content','U')));
