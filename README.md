# Vaani Shiksha

Hindi–Santhali primary learning resources, with a Next.js interface and local Indic Parler speech service.

## Run locally

```sh
npm install
npm run tts:setup  # one-time online dependency and model download
npm run dev:local # starts website and voice service together
```

Open http://localhost:3000. Speech always uses `127.0.0.1:8000`; old Colab/TTS URL and API-key values in `.env.local` are ignored. No tunnel or hosted speech account is used during inference. Stop both services with Ctrl+C. For the website alone, run `npm run dev`; for speech alone, `npm run tts:start`.

### One-time model access

The upstream [AI4Bharat model](https://huggingface.co/ai4bharat/indic-parler-tts) currently requires accepting its access conditions. Sign into Hugging Face and accept those conditions first. If setup reports a gated-repository error, authenticate locally with `tts_service/.venv/bin/huggingface-cli login` and rerun `npm run tts:setup`. Do not put a Hugging Face token in browser code or commit it. Setup can also use an existing `HF_TOKEN` environment variable. The token is only used to download weights.

The model and both tokenizers are stored under `tts_service/models/`, outside Git. Keep this directory to avoid downloading again. Setup requires Python and Git; choose another Python interpreter with `TTS_PYTHON=/path/to/python npm run tts:setup`. Dependencies are isolated in `tts_service/.venv`.

### Offline behavior and hardware

Speech startup uses `local_files_only=True`, `HF_HUB_OFFLINE=1`, and `TRANSFORMERS_OFFLINE=1`. It never downloads missing files silently. A successful `http://127.0.0.1:8000/health` response with `status: ready` means the model loaded, rather than merely detecting a file. CPU is the default on Mac; CUDA is used when available. This is a roughly 0.9-billion-parameter model: allow several GB of disk space and memory, and expect CPU inference to be slow. `TTS_DEVICE` can explicitly select a PyTorch device; alternative accelerators have not been validated here.

Generated audio is cached on disk and in the browser. New inference runs on the computer hosting this app, so that computer and both processes must remain on. This is not a browser-only model or an always-on cloud deployment. Short chunks limit generation length, and concurrent requests receive a retry message instead of exhausting memory. Native-speaker review of Santhali pronunciation and educational content is still required.

Saved lessons and previously saved audio can be used offline. **New AI lesson generation still uses Gemini and needs internet plus `GEMINI_API_KEY` in `.env.local`.** Making that separate model local is not part of the speech replacement.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
python3 -m unittest discover -s tts_service -p 'test_*.py'
```

The interface uses the existing classroom illustration, a responsive reference-inspired homepage, and shared cream, saffron and green navigation and page styling. Demo counts describe the bundled lessons, not invented usage metrics.
