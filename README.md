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

Saved lessons and previously saved audio can be used offline. Online Gemini generation needs internet and `GEMINI_API_KEY`. On-device generation is now available as an experimental alternative on compatible devices; see the offline installation section below.

## Verify

```sh
npm run lint
npx tsc --noEmit
npm run build
python3 -m unittest discover -s tts_service -p 'test_*.py'
```

The interface uses the existing classroom illustration, a responsive reference-inspired homepage, and shared cream, saffron and green navigation and page styling. Demo counts describe the bundled lessons, not invented usage metrics.

## Offline installation on Android and computers

Use a production build (`npm run build && npm start`), then open **Offline setup** from the footer or `/offline`. The development server intentionally does not install the service worker. Public installations require HTTPS; localhost works for development checks.

1. Download app pages. This saves all 42 routes, including every book reader. Bundled scripts, styles and images are precached by the service worker. Offline links use full HTML navigation so they do not depend on previously requested React Server Component payloads.
2. Download the books you need, or all 31 books. PDFs are stored on each device. A failed or cancelled download keeps completed chapters and resumes when retried. Use the PDF reader's export link for an independent copy. NCERT must be reachable for the initial download unless a PDF is imported from the device.
3. Optionally download the on-device lesson model. This uses WebLLM and Qwen2.5 0.5B in a browser worker. It needs WebGPU and approximately 1 GB GPU memory; not all Android phones/browsers support it. The model is experimental, with teacher review required and unverified Santali translation quality. The app rejects malformed learning kits and invalid quiz answers. No API key or server is used for this generation path. Online Gemini remains an explicit alternate mode.
4. Speech input defaults to the browser's on-device recognition API and downloads a language pack where supported. It reports unsupported devices/languages rather than switching to online speech without the user's selection. Hindi/English pronunciation requires a locally installed system voice.
5. Santali recordings downloaded/generated/imported on the device can play offline. Listen buttons can import a teacher's recording and export it. **Generating NEW Indic Parler speech still needs the existing computer service. It does not run on Android browsers. Complete offline AI/speech on every device is not delivered by this implementation.**

Storage is per origin and per browser. Clearing site data removes offline content. The setup page requests persistent storage and shows actual cached-page/PDF counts; browsers may refuse persistence. Install from the browser menu and test in airplane mode before relying on the installation. Downloading pages alone does not download AI models or textbooks.

Validation: `npm run lint`, `npm run build`, then run the production server on port 3107 and `npm run test:offline` (requires Chrome). Browser tests disconnect networking, reload unvisited book routes, open an imported PDF offline, exercise the dictionary and query-string lesson navigation, and check the mobile layout. `npm run verify:ncert` validates official PDF endpoints independently.
