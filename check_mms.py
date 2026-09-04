import urllib.request
import json
try:
    url = "https://huggingface.co/api/models?search=mms-tts-"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for model in data:
            if 'sat' in model['id'].lower() or 'sant' in model['id'].lower():
                print(model['id'])
except Exception as e:
    print(e)
