#!/usr/bin/env bash
# Dunne wrapper: alle logica zit in zet_server_op.py (werkt ook op oude bash).
set -e
cd "$(dirname "$0")"
exec python3 zet_server_op.py
