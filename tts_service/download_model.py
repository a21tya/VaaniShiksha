"""One-time online setup; authentication is needed only for this download."""
import json
from pathlib import Path
from huggingface_hub import snapshot_download
from huggingface_hub.errors import GatedRepoError
from transformers import AutoTokenizer

root = Path(__file__).resolve().parent / "models"
model_dir = root / "indic-parler-tts"
try:
    snapshot_download("ai4bharat/indic-parler-tts", local_dir=str(model_dir),
                      ignore_patterns=["*.bin", "*.pt", "*.md", ".gitattributes"])
except GatedRepoError:
    raise SystemExit(
        "Model access is required. Accept access conditions at "
        "https://huggingface.co/ai4bharat/indic-parler-tts, then run "
        "tts_service/.venv/bin/huggingface-cli login from the project root "
        "and retry npm run tts:setup. No token is needed at runtime."
    )
config = json.loads((model_dir / "config.json").read_text())
name = config["text_encoder"]["_name_or_path"]
AutoTokenizer.from_pretrained(name).save_pretrained(root / "description-tokenizer")
print("Model and both tokenizers saved locally. You can now disconnect from the internet.")
