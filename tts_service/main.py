"""Loopback-only Indic Parler service. Runtime never accesses Hugging Face."""
import io
import os
import pathlib
import threading
from contextlib import asynccontextmanager

os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

ROOT = pathlib.Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models" / "indic-parler-tts"
DESCRIPTION_DIR = ROOT / "models" / "description-tokenizer"
lock = threading.Lock()
engine = None
load_error = "Run npm run tts:setup once to download the model."


def load_engine():
    import torch
    from parler_tts import ParlerTTSForConditionalGeneration
    from transformers import AutoTokenizer
    device = os.getenv("TTS_DEVICE", "cuda:0" if torch.cuda.is_available() else "cpu")
    model = ParlerTTSForConditionalGeneration.from_pretrained(
        str(MODEL_DIR), local_files_only=True
    ).to(device).eval()
    tokenizer = AutoTokenizer.from_pretrained(str(MODEL_DIR), local_files_only=True)
    description = AutoTokenizer.from_pretrained(str(DESCRIPTION_DIR), local_files_only=True)
    return torch, model, tokenizer, description, device


@asynccontextmanager
async def lifespan(app):
    global engine, load_error
    try:
        engine = load_engine()
        load_error = ""
    except Exception as exc:
        load_error = f"Local model unavailable ({type(exc).__name__}). Run npm run tts:setup and restart."
        print(load_error, flush=True)
    yield


app = FastAPI(title="VaaniShiksha Local Indic Parler", lifespan=lifespan)


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=800)


def chunks(text, limit=160):
    # Preserve every character; cap short utterances to avoid model truncation.
    result = []
    while text:
        if len(text) <= limit:
            result.append(text)
            break
        split = max(text.rfind(mark, 0, limit) for mark in [" ", "।", "᱾", ".", "!", "?"])
        split = split + 1 if split > 0 else limit
        result.append(text[:split])
        text = text[split:]
    return result


@app.get("/health")
def health():
    return {"status": "ready" if engine else "unavailable", "offline": True,
            "model": "ai4bharat/indic-parler-tts", "detail": load_error,
            "device": engine[4] if engine else None}


@app.post("/tts")
def tts(req: TTSRequest):
    text = req.text.strip()
    if not text:
        raise HTTPException(400, "Text cannot be empty.")
    if engine is None:
        raise HTTPException(503, load_error)
    if not lock.acquire(blocking=False):
        raise HTTPException(429, "The local voice is busy. Try again after the current lesson finishes.")
    try:
        import numpy as np
        import soundfile as sf
        torch, model, tokenizer, description_tokenizer, device = engine
        description = description_tokenizer(
            "A female speaker delivers clear, slightly expressive speech at a slow pace. "
            "The recording is very clear audio, with no background noise.", return_tensors="pt"
        ).to(device)
        audio = []
        parts = chunks(text)
        with torch.inference_mode():
            for part in parts:
                prompt = tokenizer(part, return_tensors="pt").to(device)
                generated = model.generate(
                    input_ids=description.input_ids, attention_mask=description.attention_mask,
                    prompt_input_ids=prompt.input_ids, prompt_attention_mask=prompt.attention_mask,
                    max_new_tokens=2580,
                )
                audio.append(generated.detach().cpu().numpy().reshape(-1))
        output = io.BytesIO()
        sf.write(output, np.concatenate(audio), model.config.sampling_rate, format="WAV")
        return Response(output.getvalue(), media_type="audio/wav", headers={"x-tts-chunks": str(len(parts))})
    except Exception as exc:
        print(f"Inference failed: {type(exc).__name__}: {exc}", flush=True)
        raise HTTPException(503, "Local speech generation failed. Check the TTS terminal.") from exc
    finally:
        lock.release()
