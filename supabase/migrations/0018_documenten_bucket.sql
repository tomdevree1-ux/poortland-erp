-- 0018 Private bucket voor bevroren documenten (SSOT nuance: een verzonden
-- offerte wordt als PDF bevroren zodat het historische document niet mee
-- verandert wanneer klantgegevens later wijzigen).
insert into storage.buckets (id, name, public)
values ('documenten', 'documenten', false)
on conflict (id) do nothing;
