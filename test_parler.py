import urllib.request
import json
try:
    url = "https://huggingface.co/api/models/ai4bharat/indic-parler-tts"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        print(data.get('id', 'Not Found'))
except Exception as e:
    print(e)
