#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
PYTHON="${TTS_PYTHON:-python3}"
"$PYTHON" -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python download_model.py
