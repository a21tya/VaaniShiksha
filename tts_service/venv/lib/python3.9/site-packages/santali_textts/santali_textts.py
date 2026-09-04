import os
import requests
from pydub import AudioSegment

# Define the path to the directory containing your audio files
AUDIO_DIR = 'audio_files'

# Define the base URL for the audio server
AUDIO_SERVER_URL = 'https://santali-tts-server.onrender.com/audio/'

# Create a mapping from Santali text segments to their corresponding audio file names
TEXT_TO_AUDIO = {
    "ᱟᱢ ᱫᱳᱦ ᱳᱠᱟ ᱨᱮᱱ ᱠᱟᱱᱟᱢ": "ᱟᱢ ᱫᱳᱦ ᱳᱠᱟ ᱨᱮᱱ ᱠᱟᱱᱟᱢ.wav",
    "ᱟᱵᱩ": "ᱟᱵᱩ.wav",
    "ᱟᱵᱩ ᱟᱜ": "ᱟᱵᱩ ᱟᱜ.wav",
    "ᱤᱰᱤ": "ᱤᱰᱤ.wav",
    "ᱟᱰᱤ ᱵᱟᱜᱤ": "ᱟᱰᱤ ᱵᱟᱜᱤ.wav",
    "ᱟᱰᱤ ᱱᱟᱯᱟᱭ": "ᱟᱰᱤ ᱱᱟᱯᱟᱭ",
    "ᱟᱞᱳᱢ ᱴᱦᱤᱨ ᱛᱟᱦᱤᱱ ᱟᱡ": "ᱟᱞᱳᱢ ᱴᱦᱤᱨ ᱛᱟᱦᱤᱱ ᱟᱡ.wav",
    "ᱟᱢᱟ ᱱᱩᱛᱩᱢ ᱪᱦᱮᱰ": "ᱟᱢᱟ ᱱᱩᱛᱩᱢ ᱪᱦᱮᱰ.wav",
    "ᱟᱢᱟ ᱩᱢᱟᱨ ᱛᱤᱱᱟᱜ ᱠᱟᱱᱟ": "ᱟᱢᱟ ᱩᱢᱟᱨ ᱛᱤᱱᱟᱜ ᱠᱟᱱᱟ.wav",
    "ᱟᱯᱮ ᱫᱚ ᱯᱮ ᱜᱚᱨᱱᱳ ᱫᱟᱨ ᱟᱡ": "ᱟᱯᱮ ᱫᱚ ᱯᱮ ᱜᱚᱨᱱᱳ ᱫᱟᱨ ᱟᱡ.wav",
    "ᱳᱱᱟ ᱠᱩ": "ᱳᱱᱟ ᱠᱩ.wav",
    "ᱟᱭᱢᱟ": "ᱟᱭᱢᱟ.wav",
    "ᱟᱭᱢᱟ ᱟᱭᱢᱟ ᱥᱟᱨᱦᱚ": "ᱟᱭᱢᱟ ᱟᱭᱢᱟ ᱥᱟᱨᱦᱚ.wav",
    "ᱵᱟᱝ": "ᱵᱟᱝ.wav",
    "ᱵᱟᱨᱛᱮ": "ᱵᱟᱨᱛᱮ.wav",
    "ᱵᱤᱱᱜ ᱵᱩᱡᱳᱣ ᱞᱮᱰᱟ": "ᱵᱤᱱᱜ ᱵᱩᱡᱳᱣ ᱞᱮᱰᱟ.wav",
    "ᱵᱤᱫᱟ ᱡᱚᱦᱟᱨ": "ᱵᱤᱫᱟ ᱡᱚᱦᱟᱨ.wav",
    "ᱪᱟᱞᱟ ᱢᱮ": "ᱪᱟᱞᱟ ᱢᱮ.wav",
    "ᱪᱟᱞᱟ": "ᱪᱟᱞᱟ.wav",
    "ᱪᱮᱰ ᱞᱮᱠᱟ ᱢᱤᱱᱟ ᱢᱟ": "ᱪᱮᱰ ᱞᱮᱠᱟ ᱢᱤᱱᱟ ᱢᱟ.wav",
    "ᱪᱮᱫ ᱦᱩᱱ ᱵᱟᱱᱜ": "ᱪᱮᱫ ᱦᱩᱱ ᱵᱟᱱᱜ.wav",
    "ᱫᱚᱱ": "ᱫᱚᱱ.wav",
    "ᱫᱟᱨ": "ᱫᱟᱨ.wav",
    "ᱦᱟᱨᱩᱵ": "ᱦᱟᱨᱩᱵ.wav",
    "ᱦᱮᱡᱳ": "ᱦᱮᱡᱳ.wav",
    "ᱦᱮᱱᱫᱤ": "ᱦᱮᱱᱫᱤ.wav",
    "ᱡᱟᱯᱮᱰ": "ᱡᱟᱯᱮᱰ.wav",
    "ᱡᱚᱢ": "ᱡᱚᱢ.wav",
    "ᱡᱳᱛᱳ": "ᱡᱳᱛᱳ.wav",
    "ᱠᱳᱢ": "ᱠᱳᱢ.wav",
    "ᱞᱟᱱᱫᱟ": "ᱞᱟᱱᱫᱟ.wav",
    "ᱟᱠᱮᱱ": "ᱟᱠᱮᱱ.wav",
    "ᱢᱟᱨᱟᱱ": "ᱢᱟᱨᱟᱱ.wav",
    "ᱢᱟᱨᱟᱱᱜ": "ᱢᱟᱨᱟᱱᱜ.wav",
    "ᱢᱩᱪᱟ": "ᱢᱩᱪᱟ.wav",
    "ᱟᱪᱦᱳᱨ": "ᱟᱪᱦᱳᱨ.wav",
    "ᱟᱫᱤ": "ᱟᱫᱤ.wav",
    "ᱟᱠᱟᱱ": "ᱟᱠᱟᱱ.wav",
    "ᱟᱨ": "ᱟᱨ.wav",
    "ᱵᱳᱡᱳ": "ᱵᱳᱡᱳ.wav",
    "ᱵᱩᱨᱩ": "ᱵᱩᱨᱩ.wav",
    "ᱪᱤᱴᱟᱱ": "ᱪᱤᱴᱟᱱ.wav",
    "ᱫᱩᱞᱟᱨᱤ": "ᱫᱩᱞᱟᱨᱤ.wav",
    "ᱜᱟᱫᱭᱟ": "ᱜᱟᱫᱭᱟ.wav",
    "ᱠᱟᱢᱤ": "ᱠᱟᱢᱤ.wav",
    "ᱠᱟᱱᱟ": "ᱠᱟᱱᱟ.wav",
    "ᱢᱤᱫᱰᱳᱣ": "ᱢᱤᱫᱰᱳᱣ.wav",
    "ᱢᱤᱫᱴᱮ": "ᱢᱤᱫᱴᱮ.wav",
    "ᱳᱠᱴᱮ": "ᱳᱠᱴᱮ.wav",
    "ᱯᱟᱱᱡᱟ": "ᱯᱟᱱᱡᱟ.wav",
    "ᱨᱟᱯᱩ": "ᱨᱟᱯᱩ.wav",
    "ᱨᱮᱟᱠ": "ᱨᱮᱟᱠ.wav",
    "ᱨᱟᱥᱠᱟ": "ᱨᱟᱥᱠᱟ.wav",
    "ᱥᱟᱠᱟᱢ": "ᱥᱟᱠᱟᱢ.wav",
    "ᱛᱟᱞᱟᱨᱮᱱ": "ᱛᱟᱞᱟᱨᱮᱱ.wav",
    "ᱛᱳᱵᱤ": "ᱛᱳᱵᱤ.wav",
    "ᱵᱦᱮᱛᱨᱮ": "ᱵᱦᱮᱛᱨᱮ.wav",
    "ᱯᱟᱥᱤ": "ᱯᱟᱥᱤ.wav"



    # Add more mappings as needed
}

def download_audio(filename):
    """Download an audio file from the server and return the path to the downloaded file."""
    response = requests.get(AUDIO_SERVER_URL + filename)
    if response.status_code == 200:
        temp_filename = os.path.join('temp_audio', filename)
        os.makedirs(os.path.dirname(temp_filename), exist_ok=True)
        with open(temp_filename, 'wb') as f:
            f.write(response.content)
        return temp_filename
    else:
        print(f"Error: Audio file '{filename}' not found on server.")
        return None

def santali_audio(text, output_filename):
    audio_segments = []
    temp_files = []  # List to store temporary file paths
    
    # Split the text by spaces to handle multiple words
    segments = text.split(' ')
    
    for segment in segments:
        if segment in TEXT_TO_AUDIO:
            audio_file = TEXT_TO_AUDIO[segment]
            temp_audio_path = download_audio(audio_file)
            if temp_audio_path and os.path.isfile(temp_audio_path):
                segment_audio = AudioSegment.from_wav(temp_audio_path)
                audio_segments.append(segment_audio)
                temp_files.append(temp_audio_path)  # Store the temporary file path
            else:
                print(f"Error: Audio file for segment '{segment}' not found or could not be downloaded.")
        else:
            print(f"Warning: No audio file mapping for segment '{segment}'")
    
    # Combine all segments into one audio file
    if audio_segments:
        combined = AudioSegment.empty()
        for segment in audio_segments:
            combined += segment
        
        # Export the combined audio to a file
        combined.export(output_filename, format='wav')
        
        # Clean up temporary files
        for temp_file in temp_files:
            if os.path.exists(temp_file):  # Check if file exists before attempting to delete
                try:
                    os.remove(temp_file)
                except Exception as e:
                    print(f"Error while deleting temporary file '{temp_file}': {e}")
        
        print(f"Audio saved as '{output_filename}'")
    else:
        print("No valid audio segments found.")
