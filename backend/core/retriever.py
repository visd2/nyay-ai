import chromadb
from chromadb.config import Settings as ChromaSettings
from config import settings
from core.embedder import embedder


class LegalRetriever:
    def __init__(self):
        self._client = None
        self._collection = None

    def initialize(self):
        print(f"🗄️  Connecting to ChromaDB...")
        self._client = chromadb.PersistentClient(
            path=settings.CHROMA_PATH,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True,
            ),
        )
        # ✅ embedding_function=None — apna embedder use karenge
        self._collection = self._client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION,
            embedding_function=None,
            metadata={"hnsw:space": "cosine"},
        )
        print(f"✅ ChromaDB ready — {self._collection.count()} chunks indexed")

    def retrieve(self, query: str, top_k: int = None) -> list:
        if not self._collection:
            self.initialize()
        k = top_k or settings.TOP_K_RESULTS
        count = self._collection.count()
        if count == 0:
            return []
        query_embedding = embedder.embed(query)
        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=min(k, count),
            include=["documents", "metadatas", "distances"],
        )
        chunks = []
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]
        for doc, meta, dist in zip(documents, metadatas, distances):
            chunks.append({
                "text":    doc,
                "section": meta.get("section", "Unknown"),
                "title":   meta.get("title", ""),
                "source":  meta.get("source", "India Code"),
                "url":     meta.get("url", ""),
                "score":   round(1 - dist, 3),
            })
        return chunks

    def add_documents(self, docs: list):
        if not self._collection:
            self.initialize()
        texts      = [d["text"] for d in docs]
        embeddings = embedder.embed_batch(texts)
        ids        = [d["id"] for d in docs]
        metadatas  = [
            {
                "section": d.get("section", ""),
                "title":   d.get("title", ""),
                "source":  d.get("source", "India Code"),
                "url":     d.get("url", ""),
            }
            for d in docs
        ]
        self._collection.upsert(
            ids=ids,
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
        )
        print(f"✅ Added {len(docs)} chunks to ChromaDB")

    @property
    def is_empty(self) -> bool:
        if not self._collection:
            return True
        return self._collection.count() == 0


retriever = LegalRetriever()
