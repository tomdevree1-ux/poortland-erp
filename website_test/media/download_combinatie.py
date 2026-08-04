#!/usr/bin/env python3
# Downloadt de galerijfoto's van https://poortland.be/combinatie-staal-hout/
# rechtstreeks naar de bestaande map media/combinatie. Het doelpad staat vast,
# dus je mag dit script draaien waar je wil; er wordt geen nieuwe map gemaakt.
# De losse foto naast de tekst wordt overgeslagen (enkel gelinkte foto's met een
# modelnaam tellen mee). Bestandsnaam = modelnaam; dubbels krijgen (2), (3)...
import re, os, sys, urllib.request

PAGE = "https://poortland.be/combinatie-staal-hout/"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

html = fetch(PAGE).decode("utf-8", "replace")

paren = []
for a in re.finditer(r'<a\b[^>]*?href="([^"?]+/wp-content/uploads/[^"?]+\.(?:jpe?g|png|bmp))"[^>]*>(.*?)</a>', html, re.S | re.I):
    binnen = a.group(2)
    alt = re.search(r'alt="([^"]*)"', binnen)
    label = (alt.group(1) if alt else "").strip()
    if not label:
        continue  # geen modelnaam: hoort niet bij de galerij
    paren.append((a.group(1), label))

print("Gevonden galerijfoto's:", len(paren))
if not paren:
    print("Niets gevonden; meld dit even."); sys.exit(1)

# Vast doelpad: de bestaande map media/combinatie naast dit script.
doelmap = os.path.join(os.path.dirname(os.path.abspath(__file__)), "combinatie")
os.makedirs(doelmap, exist_ok=True)
gebruikt = {}
for url, label in paren:
    ext = os.path.splitext(url.split("?")[0])[1] or ".jpg"
    naam = " ".join(label.split()).strip()
    n = gebruikt.get(naam.lower(), 0) + 1
    gebruikt[naam.lower()] = n
    if n > 1:
        naam = "%s (%d)" % (naam, n)
    try:
        with open(os.path.join(doelmap, naam + ext), "wb") as fh:
            fh.write(fetch(url))
        print("  ", naam + ext)
    except Exception as e:
        print("  FOUT", url, e)
print("Klaar. Map:", doelmap)
