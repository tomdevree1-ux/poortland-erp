-- 0006 De bindende rollenmatrix als data (TS-02 sectie 4, TS-17 sectie 7)
-- R lezen, C aanmaken, U wijzigen, D verwijderen, S statuswijziging, A goedkeuren.
-- De rijen voor stuklijst, tekening, planning, werkbon, factuur, servicedossier
-- en rapport staan er al zodat latere slagen geen matrixmigratie meer nodig hebben.
-- BS-02: de rol systeem krijgt het minimum voor achtergrondtaken.

insert into recht (rol, entiteit, acties) values
  -- Klantgegevens (dekt ook contactpersoon en contactmoment)
  ('verkoop','klant','RCU'), ('planning','klant','RU'), ('productie','klant','R'),
  ('montage','klant','R'), ('boekhouding','klant','RU'), ('beheerder','klant','RCUD'),
  ('systeem','klant','R'),
  -- Lead
  ('verkoop','lead','RCUS'), ('planning','lead','R'), ('productie','lead','R'),
  ('montage','lead','R'), ('boekhouding','lead','R'), ('beheerder','lead','RCUDS'),
  ('systeem','lead','RC'),
  -- Offerte
  ('verkoop','offerte','RCUSA'), ('planning','offerte','R'), ('productie','offerte','R'),
  ('montage','offerte','R'), ('boekhouding','offerte','R'), ('beheerder','offerte','RCUDSA'),
  ('systeem','offerte','RS'),
  -- Order en project
  ('verkoop','project','RCUS'), ('planning','project','RUS'), ('productie','project','RUS'),
  ('montage','project','R'), ('boekhouding','project','R'), ('beheerder','project','RCUDS'),
  ('systeem','project','R'),
  ('verkoop','order','RCUS'), ('planning','order','RUS'), ('productie','order','RUS'),
  ('montage','order','R'), ('boekhouding','order','R'), ('beheerder','order','RCUDS'),
  ('systeem','order','R'),
  -- Stuklijst en onderdeel (volgende slag)
  ('verkoop','stuklijst','R'), ('planning','stuklijst','R'), ('productie','stuklijst','RCUS'),
  ('montage','stuklijst','R'), ('boekhouding','stuklijst','R'), ('beheerder','stuklijst','RCUDS'),
  -- Tekening (volgende slag)
  ('verkoop','tekening','RCU'), ('planning','tekening','R'), ('productie','tekening','RCU'),
  ('montage','tekening','R'), ('beheerder','tekening','RCUD'),
  -- Planning (volgende slag)
  ('verkoop','planning','R'), ('planning','planning','RCUS'), ('productie','planning','R'),
  ('montage','planning','R'), ('boekhouding','planning','R'), ('beheerder','planning','RCUDS'),
  -- Werkbon (volgende slag)
  ('verkoop','werkbon','R'), ('planning','werkbon','RCU'), ('productie','werkbon','R'),
  ('montage','werkbon','RCUS'), ('boekhouding','werkbon','R'), ('beheerder','werkbon','RCUDS'),
  -- Facturatiegegevens (volgende slag)
  ('verkoop','factuur','R'), ('planning','factuur','R'),
  ('boekhouding','factuur','RCUSA'), ('beheerder','factuur','RCUDS'),
  -- Servicedossier (volgende slag)
  ('verkoop','servicedossier','RC'), ('planning','servicedossier','RCUS'), ('productie','servicedossier','R'),
  ('montage','servicedossier','RCUS'), ('boekhouding','servicedossier','R'), ('beheerder','servicedossier','RCUDS'),
  -- Rapporten
  ('verkoop','rapport','R'), ('planning','rapport','R'), ('productie','rapport','R'),
  ('montage','rapport','R'), ('boekhouding','rapport','R'), ('beheerder','rapport','RCUD'),
  -- Gebruikers en rechten
  ('beheerder','gebruikersbeheer','RCUDS'),
  -- Templates en instellingen (dekt recht, statusovergang en instelling)
  ('beheerder','instellingen','RCUDS'),
  -- Websitecontent (TS-17, CR-01)
  ('verkoop','website_content','RCUS'), ('planning','website_content','R'),
  ('productie','website_content','R'), ('montage','website_content','R'),
  ('boekhouding','website_content','R'), ('beheerder','website_content','RCUDS'),
  -- Artikelcatalogus (bouwspec hoofdstuk 4)
  ('verkoop','artikel','R'), ('planning','artikel','R'), ('productie','artikel','R'),
  ('montage','artikel','R'), ('boekhouding','artikel','R'), ('beheerder','artikel','RCUD'),
  -- Opvolgtaken (FR-005)
  ('verkoop','opvolgtaak','RCU'), ('planning','opvolgtaak','R'), ('productie','opvolgtaak','R'),
  ('montage','opvolgtaak','R'), ('boekhouding','opvolgtaak','R'), ('beheerder','opvolgtaak','RCUD'),
  ('systeem','opvolgtaak','RC'),
  -- Communicatie bij het dossier
  ('verkoop','communicatie','RC'), ('planning','communicatie','R'), ('productie','communicatie','R'),
  ('montage','communicatie','R'), ('boekhouding','communicatie','R'), ('beheerder','communicatie','RCUD'),
  ('systeem','communicatie','RC'),
  -- Notificaties (eigen rijen, zie RLS beleid)
  ('verkoop','notificatie','RU'), ('planning','notificatie','RU'), ('productie','notificatie','RU'),
  ('montage','notificatie','RU'), ('boekhouding','notificatie','RU'), ('beheerder','notificatie','RCUD'),
  ('systeem','notificatie','C'),
  -- Audit trail leesbaar voor de beheerder (RFP 8.7)
  ('beheerder','audit','R');
