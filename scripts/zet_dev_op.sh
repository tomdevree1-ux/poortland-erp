#!/usr/bin/env bash
# Zet het Poortland ERP dev project op via de Supabase Management API.
# Gebruik: TOKEN=sbp_... REF=projectref bash scripts/zet_dev_op.sh
# Draait alle migraties, zet het erp_app wachtwoord en toont de sleutels.
set -euo pipefail

if [ -z "${TOKEN:-}" ] || [ -z "${REF:-}" ]; then
  echo "Gebruik: TOKEN=sbp_... REF=projectref bash scripts/zet_dev_op.sh"
  exit 1
fi

BASIS="https://api.supabase.com/v1/projects/$REF"
QUERY_URL="$BASIS/database/query"
MAP="$(cd "$(dirname "$0")/../supabase/migrations" && pwd)"

echo "== Wachten tot het project actief is"
for i in $(seq 1 60); do
  STATUS=$(curl -s "$BASIS" -H "Authorization: Bearer $TOKEN" | python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))')
  echo "   status: $STATUS"
  [ "$STATUS" = "ACTIVE_HEALTHY" ] && break
  sleep 10
done
[ "$STATUS" = "ACTIVE_HEALTHY" ] || { echo "Project niet actief geraakt"; exit 1; }

draai_sql_bestand() {
  python3 - "$1" <<'PY'
import json, sys
print(json.dumps({"query": open(sys.argv[1], encoding="utf-8").read()}))
PY
}

echo "== Migraties toepassen"
for f in "$MAP"/*.sql; do
  echo "   $(basename "$f")"
  ANTWOORD=$(draai_sql_bestand "$f" | curl -s -X POST "$QUERY_URL" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d @-)
  if printf '%s' "$ANTWOORD" | grep -qi '"message"'; then
    echo "   FOUT bij $(basename "$f"):"
    printf '%s\n' "$ANTWOORD" | head -c 500
    exit 1
  fi
done

echo "== Wachtwoord van erp_app zetten"
WW=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)
python3 - "$WW" <<'PY' | curl -s -X POST "$QUERY_URL" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d @- >/dev/null
import json, sys
print(json.dumps({"query": "alter role erp_app with login password '%s'" % sys.argv[1]}))
PY

echo "== Controle"
printf '%s' '{"query":"select (select count(*) from information_schema.tables where table_schema = $$public$$) as tabellen, (select count(*) from recht) as rechten, (select count(*) from statusovergang) as overgangen, (select count(*) from artikel) as artikelen"}' \
  | curl -s -X POST "$QUERY_URL" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d @-
echo

echo "== Publieke sleutels"
curl -s "$BASIS/api-keys" -H "Authorization: Bearer $TOKEN" | python3 -c '
import json, sys
for k in json.load(sys.stdin):
    naam = k.get("name", "")
    if naam in ("anon", "publishable") or str(k.get("type")) == "publishable":
        print(f"   {naam}: {k.get(\"api_key\", \"\")}")
'

echo
echo "KLAAR. Noteer dit:"
echo "   Project URL:        https://$REF.supabase.co"
echo "   erp_app wachtwoord: $WW"
echo
echo "Volgende stappen:"
echo " 1. frontend/.env: VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY invullen (zie hierboven)."
echo " 2. backend: ConnectionStrings__Poortland met Username=erp_app en dit wachtwoord (zie .env.example)."
echo " 3. Eerste beheerder aanmaken: zie de chunk in de chat."
