import requests
import os
from config import settings

# HuggingFace free API — no local model, no memory issue
HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
HF_TOKEN   = os.getenv("HF_TOKEN", "")  # optional for higher rate limits


def _get_headers():
    h = {"Content-Type": "application/json"}
    if HF_TOKEN:
        h["Authorization"] = f"Bearer {HF_TOKEN}"
    return h


class Embedder:
    def __init__(self):
        self._ready = False

    def load(self):
        """Warm up HuggingFace API."""
        print("📦 Using HuggingFace API for embeddings (no local model needed)")
        try:
            # Warm up call
            self.embed("test")
            print("✅ Embedding API ready")
        except Exception as e:
            print(f"⚠️  HuggingFace API warm up: {e} (will retry on first use)")
        self._ready = True

    def embed(self, text: str) -> list:
        """Embed single text via HuggingFace API."""
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: list) -> list:
        """Embed multiple texts."""
        try:
            response = requests.post(
                HF_API_URL,
                headers=_get_headers(),
                json={"inputs": texts, "options": {"wait_for_model": True}},
                timeout=30,
            )

            if response.status_code == 200:
                result = response.json()
                # HF returns list of embeddings
                if isinstance(result, list) and len(result) > 0:
                    if isinstance(result[0], list):
                        return result   # already batch
                    return [result]     # single embedding
            else:
                print(f"HF API error {response.status_code}: {response.text}")
                return self._fallback_embed(texts)

        except Exception as e:
            print(f"HF API error: {e} — using fallback")
            return self._fallback_embed(texts)

    def _fallback_embed(self, texts: list) -> list:
        """Simple hash-based fallback if API fails."""
        import hashlib
        result = []
        for text in texts:
            h = hashlib.sha256(text.encode()).digest()
            vec = [float(b - 128) / 128.0 for b in h]
            # Pad to 384 dimensions
            while len(vec) < 384:
                vec.extend(vec[:384 - len(vec)])
            result.append(vec[:384])
        return result


embedder = Embedder()
