import sys
import json
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from config import settings
from core.embedder import embedder
from core.retriever import retriever

LAWS_DIR = Path(__file__).resolve().parent.parent / "knowledge_base" / "raw_laws"


def chunk_text(text: str, chunk_size: int = 600, overlap: int = 100) -> list:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i: i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def load_all_laws() -> list:
    all_docs = []
    for json_file in LAWS_DIR.glob("*.json"):
        if json_file.stat().st_size == 0:
            print(f"  ⚠️  {json_file.name}: empty, skipping")
            continue
        print(f"📖 Loading: {json_file.name}")
        with open(json_file, encoding="utf-8") as f:
            laws = json.load(f)
        for law in laws:
            text = law.get("text", "")
            section = law.get("section", "Unknown")
            title = law.get("title", "")
            source = law.get("source", "India Code")
            url = law.get("url", "")
            chunks = chunk_text(text) if len(text.split()) > 400 else [text]
            for j, chunk in enumerate(chunks):
                all_docs.append({
                    "id": f"{section.replace(' ', '_')}_{j}_{str(uuid.uuid4())[:8]}",
                    "text": f"{section} – {title}\n\n{chunk}",
                    "section": section,
                    "title": title,
                    "source": source,
                    "url": url,
                })
    print(f"\n✅ Total chunks to index: {len(all_docs)}")
    return all_docs


def main():
    print("=" * 60)
    print("🏛️  Nyay AI – Knowledge Base Indexer")
    print("=" * 60)

    embedder.load()
    retriever.initialize()

    docs = load_all_laws()
    if not docs:
        print("❌ No law files found!")
        return

    print(f"\n🔄 Embedding {len(docs)} chunks...")
    batch_size = 50
    for i in range(0, len(docs), batch_size):
        batch = docs[i: i + batch_size]
        retriever.add_documents(batch)
        print(f"   Progress: {min(i + batch_size, len(docs))}/{len(docs)}")

    print(f"\n🎉 Done! {retriever._collection.count()} chunks indexed!")


if __name__ == "__main__":
    main()
