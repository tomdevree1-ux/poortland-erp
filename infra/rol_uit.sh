#!/usr/bin/env bash
# Poortland ERP · code uitrollen naar de dev server.
# Gebruik: bash rol_uit.sh   (na zet_server_op.sh; DOMEIN optioneel via export)
set -euo pipefail
cd "$(dirname "$0")"

if [ ! -f server.env ]; then
  echo "Run eerst zet_server_op.sh (server.env ontbreekt)"
  exit 1
fi
source server.env
IP_STREEPJES=$(echo $SERVER_IP | tr . -)
DOMEIN="${DOMEIN:-$IP_STREEPJES.nip.io}"
DOEL="root@$SERVER_IP"

echo "1/4 Omgevingsbestand opbouwen uit je lokale instellingen"
python3 - "$DOMEIN" <<'PY'
import json, sys
domein = sys.argv[1]
site_domein = f"www.{domein}"  # marketingsite (testwebsite) naast de beheerapp
d = json.load(open("../backend/Poortland.Api/appsettings.Development.json"))
fe = dict(regel.strip().split("=", 1) for regel in open("../frontend/.env") if "=" in regel)
regels = [
    f"ConnectionStrings__Poortland={d['ConnectionStrings']['Poortland']}",
    f"Supabase__Url={d['Supabase']['Url']}",
    f"Supabase__ServiceKey={d['Supabase'].get('ServiceKey','')}",
    "Email__Modus=console",
    "ASPNETCORE_ENVIRONMENT=Production",
    f"Cors__Origins__0=https://{domein}",
    f"Cors__Origins__1=https://{site_domein}",
    f"Frontend__Origin=https://{domein}",
    f"Site__Origin=https://{site_domein}",
]
extra = d.get("Cors", {}).get("Origins", [])
for i, o in enumerate(x for x in extra if not x.startswith("http://localhost")):
    regels.append(f"Cors__Origins__{i+2}={o}")
open(".env.deploy", "w").write("\n".join(regels) + "\n")
# De testomgeving mag nooit in zoekmachines; op het echte domein valt deze
# variabele weg en geldt de standaard "all" uit de Caddyfile.
robots = "noindex, nofollow" if "nip.io" in domein else "all"
open(".env.build", "w").write(
    # De waarde bevat een spatie, dus tussen aanhalingstekens: anders leest
    # source .env.build enkel "noindex," en probeert het "nofollow" als commando.
    f'DOMEIN={domein}\nSITE_DOMEIN={site_domein}\nROBOTS_TAG="{robots}"\n'
    f"VITE_SUPABASE_URL={fe['VITE_SUPABASE_URL']}\nVITE_SUPABASE_ANON_KEY={fe['VITE_SUPABASE_ANON_KEY']}\n")
print(f"   beheerapp: https://{domein}")
print(f"   testsite : https://{site_domein}")
PY

echo "2/4 Wachten tot de server bereikbaar is en code overzetten"
KLAAR=""
for i in $(seq 1 36); do
  if ssh -o StrictHostKeyChecking=accept-new -o ConnectTimeout=5 "$DOEL" true 2>/dev/null; then
    KLAAR=ja
    break
  fi
  echo "   nog niet bereikbaar, poging $i van 36"
  sleep 5
done
if [ -z "$KLAAR" ]; then
  echo "Server na 3 minuten niet bereikbaar over SSH. Kijk in de Hetzner console en probeer opnieuw."
  exit 1
fi
ssh "$DOEL" "mkdir -p /opt/poortland"
rsync -az --delete \
  --exclude node_modules --exclude dist --exclude bin --exclude obj --exclude .git \
  ../ "$DOEL:/opt/poortland/"

echo "3/4 Bouwen en starten op de server (eerste keer duurt enkele minuten)"
ssh "$DOEL" "cd /opt/poortland/infra && set -a && source .env.build && set +a && docker compose up -d --build"

echo "4/4 Gezondheidscheck"
sleep 8
if curl -skm 10 "https://$DOMEIN/gezond" | grep -q gezond; then
  echo ""
  echo "LIVE beheerapp: https://$DOMEIN"
  echo "LIVE testsite : https://www.$DOMEIN   (dit adres geef je de klant)"
  echo "Leadendpoint voor de website: https://$DOMEIN/api/v1/leads/webformulier"
  echo ""
  echo "Let op: het TLS certificaat voor www.$DOMEIN kan de eerste keer 1 minuut duren."
  echo ""
  echo "Nog 2 dashboardstappen in Supabase (Authentication, URL Configuration):"
  echo "  Site URL: https://$DOMEIN"
  echo "  Additional Redirect URLs: http://localhost:5173 erbij houden voor lokaal werk"
else
  echo "Nog niet bereikbaar. Certificaat kan 1 minuut duren, probeer: curl https://$DOMEIN/gezond"
fi
