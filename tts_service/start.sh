#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -x .venv/bin/python ]; then
  echo 'Run npm run tts:setup once before starting local speech.'
  exit 1
fi
export HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
exec .venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
