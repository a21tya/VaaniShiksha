#!/bin/bash
set -e

# Change to the directory of this script
cd "$(dirname "$0")"

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 could not be found. Please install Python 3."
    exit 1
fi

echo "Initializing Local Offline TTS Service..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Installing required dependencies..."
    ./venv/bin/pip install -r requirements.txt
else
    echo "Virtual environment found."
fi

# Verify required python dependencies
echo "Verifying Python dependencies..."
./venv/bin/python -c "import fastapi, uvicorn, pydantic; print('Python dependencies OK')" || {
    echo "Missing dependencies. Installing from requirements.txt..."
    ./venv/bin/pip install -r requirements.txt
}

# Verify local Santhali model availability
MODEL_STATUS=$(./venv/bin/python -c "from main import is_santhali_model_available; print(is_santhali_model_available())")
if [ "$MODEL_STATUS" = "True" ]; then
    echo "Local Santhali TTS model detected and ready."
else
    echo "NOTICE: Santhali voice model is not yet installed in tts_service/models/."
    echo "Service will run in offline-safe mode and return clear error responses for uncached audio generation."
fi

# Export environment variable
export TTS_API_KEY="local_offline_key"

echo "Starting Local Offline FastAPI server on http://127.0.0.1:8000..."
exec ./venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000

