-- 0012 Functies dicht voor PUBLIC: Postgres geeft EXECUTE standaard aan iedereen
-- en de advisors zien dat terecht als blootstelling via PostgREST rpc.
-- Enkel erp_app en de auth hook houden wat ze nodig hebben.

revoke execute on all functions in schema public from public;
alter default privileges in schema public revoke execute on functions from public;

grant execute on function mag(text, text) to erp_app;
grant execute on function huidige_rollen() to erp_app;
grant execute on function huidige_medewerker_id() to erp_app;
grant execute on function volgend_offertenummer() to erp_app;
grant execute on function medewerker_keuzes() to erp_app;
grant execute on function custom_access_token_hook(jsonb) to supabase_auth_admin;
