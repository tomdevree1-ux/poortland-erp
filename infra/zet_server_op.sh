#!/usr/bin/env bash
# Poortland ERP · dev server aanmaken bij Hetzner (TS-15, ADR-007 EU native).
# Gebruik: export HETZNER_TOKEN=... en dan: bash zet_server_op.sh
set -euo pipefail
cd "$(dirname "$0")"

: "${HETZNER_TOKEN:?Zet eerst: export HETZNER_TOKEN=jouw_api_token}"
SERVER_NAAM="${SERVER_NAAM:-poortland-dev}"
TYPE="${TYPE:-cx22}"
LOCATIE="${LOCATIE:-fsn1}"
API="https://api.hetzner.cloud/v1"

roep() { # methode pad [json]
  local methode="$1" pad="$2" data="${3:-}"
  if [ -n "$data" ]; then
    curl -sS -X "$methode" "$API$pad" -H "Authorization: Bearer $HETZNER_TOKEN" \
      -H "Content-Type: application/json" -d "$data"
  else
    curl -sS -X "$methode" "$API$pad" -H "Authorization: Bearer $HETZNER_TOKEN"
  fi
}
veld() { python3 -c "import json,sys; d=json.load(sys.stdin); print(eval(sys.argv[1]))" "$1"; }

echo "1/4 SSH sleutel"
if [ ! -f "$HOME/.ssh/id_ed25519.pub" ]; then
  ssh-keygen -t ed25519 -N "" -f "$HOME/.ssh/id_ed25519" >/dev/null
  echo "   nieuwe sleutel aangemaakt"
fi
PUB=$(cat "$HOME/.ssh/id_ed25519.pub")
BESTAAND=$(roep GET "/ssh_keys?name=poortland" | veld "len(d['ssh_keys'])")
if [ "$BESTAAND" = "0" ]; then
  roep POST /ssh_keys "$(python3 -c "import json;print(json.dumps({'name':'poortland','public_key':'''$PUB'''}))")" >/dev/null
  echo "   sleutel geregistreerd bij Hetzner"
else
  echo "   sleutel stond er al"
fi

echo "2/4 Firewall (22, 80, 443)"
FWID=$(roep GET "/firewalls?name=poortland" | veld "d['firewalls'][0]['id'] if d['firewalls'] else ''")
if [ -z "$FWID" ]; then
  FWID=$(roep POST /firewalls '{"name":"poortland","rules":[
    {"direction":"in","protocol":"tcp","port":"22","source_ips":["0.0.0.0/0","::/0"]},
    {"direction":"in","protocol":"tcp","port":"80","source_ips":["0.0.0.0/0","::/0"]},
    {"direction":"in","protocol":"tcp","port":"443","source_ips":["0.0.0.0/0","::/0"]}]}' | veld "d['firewall']['id']")
  echo "   firewall aangemaakt"
else
  echo "   firewall stond er al"
fi

echo "3/4 Server $SERVER_NAAM ($TYPE, $LOCATIE)"
SID=$(roep GET "/servers?name=$SERVER_NAAM" | veld "d['servers'][0]['id'] if d['servers'] else ''")
if [ -z "$SID" ]; then
  USERDATA=$(python3 -c "import json;print(json.dumps(open('cloud_init.yaml').read()))")
  SID=$(roep POST /servers "{\"name\":\"$SERVER_NAAM\",\"server_type\":\"$TYPE\",\"location\":\"$LOCATIE\",\"image\":\"ubuntu-24.04\",\"ssh_keys\":[\"poortland\"],\"firewalls\":[{\"firewall\":$FWID}],\"user_data\":$USERDATA}" | veld "d['server']['id']")
  echo "   server wordt aangemaakt"
else
  echo "   server bestond al"
fi

echo "4/4 Wachten tot hij draait"
for i in $(seq 1 30); do
  STATUS=$(roep GET "/servers/$SID" | veld "d['server']['status']")
  [ "$STATUS" = "running" ] && break
  sleep 5
done
IP=$(roep GET "/servers/$SID" | veld "d['server']['public_net']['ipv4']['ip']")
echo "SERVER_IP=$IP" > server.env
echo ""
echo "Klaar. IP: $IP (bewaard in infra/server.env)"
echo "Wacht 2 minuten (installatie op de server) en run dan: bash rol_uit.sh"
