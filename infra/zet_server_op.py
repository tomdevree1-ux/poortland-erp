#!/usr/bin/env python3
# Poortland ERP · dev server aanmaken bij Hetzner (TS-15, ADR-007 EU native).
# Idempotent: bestaande sleutel, firewall of server wordt hergebruikt.
import json, os, pathlib, subprocess, sys, time, urllib.request, urllib.error

TOKEN = os.environ.get("HETZNER_TOKEN")
if not TOKEN:
    sys.exit("Zet eerst: export HETZNER_TOKEN=jouw_api_token")
NAAM = os.environ.get("SERVER_NAAM", "poortland-dev")
TYPE = os.environ.get("TYPE", "cx22")
LOCATIE = os.environ.get("LOCATIE", "fsn1")
API = "https://api.hetzner.cloud/v1"
MAP = pathlib.Path(__file__).resolve().parent


def roep(methode, pad, data=None):
    verzoek = urllib.request.Request(
        API + pad, method=methode,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        data=json.dumps(data).encode() if data is not None else None)
    try:
        with urllib.request.urlopen(verzoek, timeout=30) as antwoord:
            return json.load(antwoord)
    except urllib.error.HTTPError as fout:
        detail = fout.read().decode()[:300]
        raise SystemExit(f"Hetzner API fout op {methode} {pad}: {fout.code} {detail}")


print("1/4 SSH sleutel")
pub_pad = pathlib.Path.home() / ".ssh" / "id_ed25519.pub"
if not pub_pad.exists():
    subprocess.run(["ssh-keygen", "-t", "ed25519", "-N", "", "-f", str(pub_pad)[:-4]], check=True)
    print("   nieuwe sleutel aangemaakt")
pub = pub_pad.read_text().strip()
sleutels = roep("GET", "/ssh_keys?name=poortland")["ssh_keys"]
if sleutels:
    print("   sleutel stond al bij Hetzner")
else:
    try:
        roep("POST", "/ssh_keys", {"name": "poortland", "public_key": pub})
        print("   sleutel geregistreerd bij Hetzner")
    except SystemExit as fout:
        if "uniqueness" in str(fout):
            print("   sleutel bestond al onder een andere naam, prima")
        else:
            raise

print("2/4 Firewall (22, 80, 443)")
firewalls = roep("GET", "/firewalls?name=poortland")["firewalls"]
if firewalls:
    fw_id = firewalls[0]["id"]
    print("   firewall stond er al")
else:
    regels = [{"direction": "in", "protocol": "tcp", "port": poort,
               "source_ips": ["0.0.0.0/0", "::/0"]} for poort in ("22", "80", "443")]
    fw_id = roep("POST", "/firewalls", {"name": "poortland", "rules": regels})["firewall"]["id"]
    print("   firewall aangemaakt")

print(f"3/4 Server {NAAM} ({TYPE}, {LOCATIE})")
servers = roep("GET", f"/servers?name={NAAM}")["servers"]
if servers:
    server_id = servers[0]["id"]
    print("   server bestond al")
else:
    cloud_init = (MAP / "cloud_init.yaml").read_text()
    server_id = roep("POST", "/servers", {
        "name": NAAM, "server_type": TYPE, "location": LOCATIE,
        "image": "ubuntu-24.04", "ssh_keys": ["poortland"],
        "firewalls": [{"firewall": fw_id}], "user_data": cloud_init,
    })["server"]["id"]
    print("   server wordt aangemaakt")

print("4/4 Wachten tot hij draait")
ip = None
for _ in range(40):
    server = roep("GET", f"/servers/{server_id}")["server"]
    if server["status"] == "running":
        ip = server["public_net"]["ipv4"]["ip"]
        break
    time.sleep(5)
if not ip:
    sys.exit("Server kwam niet op tijd online, kijk in de Hetzner console.")
(MAP / "server.env").write_text(f"SERVER_IP={ip}\n")
print(f"\nKlaar. IP: {ip} (bewaard in infra/server.env)")
print("Wacht 2 minuten (Docker installeert op de server) en run dan: bash rol_uit.sh")
