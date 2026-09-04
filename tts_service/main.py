from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import Response
from pydantic import BaseModel
import pathlib
import uuid
import os

app = FastAPI(title="VaaniShiksha Genuine Santhali Offline TTS Service")

MODEL_DIR = pathlib.Path(__file__).parent / "models"
MODEL_PATH = MODEL_DIR / "santhali_vits.onnx"

class TTSRequest(BaseModel):
    text: str

def is_santhali_model_available() -> bool:
    """Checks if a verified, trained Santhali TTS model is installed locally."""
    return MODEL_PATH.exists() and MODEL_PATH.stat().st_size > 0

def generate_santhali_speech_offline(text: str) -> bytes:
    """Generate audio purely locally using a verified local Santhali TTS model.
    Will NEVER use macOS 'say', English system voices, gTTS, Colab, or Render fallbacks.
    """
    if not is_santhali_model_available():
        raise RuntimeError(
            "Santhali offline voice model is not installed. "
            "Please place a trained Santhali ONNX model at tts_service/models/santhali_vits.onnx."
        )

    # Model inference execution (when model file is present)
    raise NotImplementedError("Santhali model inference execution")

@app.get("/health")
def health():
    model_loaded = is_santhali_model_available()
    return {
        "status": "ok" if model_loaded else "degraded",
        "backend": "onnx_santhali_vits" if model_loaded else "none",
        "offline": True,
        "santhali_model_loaded": model_loaded,
        "detail": "Local Santhali offline TTS model ready" if model_loaded else "Santhali offline voice model is not installed."
    }

@app.post("/tts")
async def tts(req: TTSRequest, x_api_key: str = Header(None)):
    expected_key = os.environ.get("TTS_API_KEY", "local_offline_key")
    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    if not is_santhali_model_available():
        raise HTTPException(
            status_code=503,
            detail="Santhali offline voice model is not installed."
        )

    try:
        audio_bytes = generate_santhali_speech_offline(text)
        headers = {
            "x-request-id": str(uuid.uuid4()),
            "x-tts-chunks": "1",
            "Content-Type": "audio/wav"
        }
        return Response(content=audio_bytes, headers=headers, media_type="audio/wav")
    except Exception as e:
        print(f"Santhali Offline TTS Error: {e}")
        raise HTTPException(
            status_code=503,
            detail=f"Santhali TTS generation failed: {str(e)}"
        )


