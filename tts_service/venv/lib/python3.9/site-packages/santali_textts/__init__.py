from .santali_textts import santali_audio

def main():
    # Example usage of santali_audio function
    text = "ᱟᱢ ᱫᱳᱦ ᱳᱠᱟ ᱨᱮᱱ ᱠᱟᱱᱟᱢ"
    output_filename = "output_audio.wav"
    santali_audio(text, output_filename)
