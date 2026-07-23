-- 0034 Bannerbeheer (TS-17): meerdere geplande banners toestaan zolang hun
-- periodes elkaar niet overlappen. De oude regel liet maar 1 gepubliceerde
-- banner toe; de overlapbewaking gebeurt nu in de applicatie (WebsiteContentService)
-- met een nette melding, dus de te strikte index mag weg.

drop index if exists popup_1_gepubliceerd;
