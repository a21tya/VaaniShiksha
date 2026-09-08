import unittest
from unittest.mock import patch
from fastapi import HTTPException
from pydantic import ValidationError
import main


class SpeechContractTests(unittest.TestCase):
    def test_unicode_chunking_preserves_text(self):
        text = ('ᱟᱵᱚ ᱨᱮᱱᱟᱜ ᱫᱟᱨᱮ᱾ नमस्ते! ' * 40).strip()
        parts = main.chunks(text)
        self.assertEqual(''.join(parts), text)
        self.assertTrue(all(0 < len(part) <= 160 for part in parts))

    def test_long_word_is_not_dropped(self):
        text = 'ᱟ' * 800
        self.assertEqual(''.join(main.chunks(text)), text)

    def test_missing_model_cannot_report_ready(self):
        with patch.object(main, 'engine', None):
            self.assertEqual(main.health()['status'], 'unavailable')
            with self.assertRaises(HTTPException) as failure:
                main.tts(main.TTSRequest(text='ᱟᱵᱚ'))
            self.assertEqual(failure.exception.status_code, 503)

    def test_request_limits_and_whitespace(self):
        with self.assertRaises(ValidationError):
            main.TTSRequest(text='a' * 801)
        with self.assertRaises(HTTPException) as failure:
            main.tts(main.TTSRequest(text='   '))
        self.assertEqual(failure.exception.status_code, 400)

    def test_busy_inference_rejects_parallel_work(self):
        with patch.object(main, 'engine', object()):
            main.lock.acquire()
            try:
                with self.assertRaises(HTTPException) as failure:
                    main.tts(main.TTSRequest(text='ᱟᱵᱚ'))
                self.assertEqual(failure.exception.status_code, 429)
            finally:
                main.lock.release()

if __name__ == '__main__':
    unittest.main()
