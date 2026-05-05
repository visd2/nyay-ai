from sentence_transformers import SentenceTransformer
from config import settings


class Embedder:
    def __init__(self):
        self._model = None

    def load(self):
        print(f"📦 Loading embedding model...")
        self._model = SentenceTransformer(settings.EMBED_MODEL)
        print("✅ Embedding model loaded")

    def embed(self, text: str) -> list:
        if not self._model:
            self.load()
        return self._model.encode(text, normalize_embeddings=True).tolist()

    def embed_batch(self, texts: list) -> list:
        if not self._model:
            self.load()
        return self._model.encode(texts, normalize_embeddings=True, batch_size=32).tolist()


embedder = Embedder()
