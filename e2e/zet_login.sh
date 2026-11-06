#!/usr/bin/env bash
# Eenmalige setup voor de e2e-tests: vraagt het wachtwoord, controleert het
# echt tegen de loginserver en schrijft pas daarna e2e/.env weg.
# Daarna volstaat altijd gewoon: npx playwright test
set -euo pipefail
cd "$(dirname "$0")"

EMAIL="tomdevree1@gmail.com"
BASIS="https://167-233-223-227.nip.io"

SUPABASE_URL=$(grep '^VITE_SUPABASE_URL=' ../frontend/.env | cut -d= -f2-)
SUPABASE_SLEUTEL=$(grep '^VITE_SUPABASE_ANON_KEY=' ../frontend/.env | cut -d= -f2-)

read -rsp "Wachtwoord voor ${EMAIL}: " WW
echo

STATUS=$(curl -s -o /tmp/login_antwoord.json -w '%{http_code}' \
  -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${SUPABASE_SLEUTEL}" -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${WW}\"}")

if [ "$STATUS" != "200" ]; then
  echo "WACHTWOORD FOUT (HTTP ${STATUS}). Er is niets opgeslagen, probeer opnieuw."
  exit 1
fi

{
  echo "E2E_EMAIL=${EMAIL}"
  echo "E2E_WACHTWOORD=${WW}"
  echo "E2E_BASE_URL=${BASIS}"
} > .env
chmod 600 .env

echo "WACHTWOORD OK en opgeslagen in e2e/.env"
echo "Voortaan volstaat: npx playwright test"
