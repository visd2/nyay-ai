"""
Quick RAG test — run after embed_and_index.py to verify everything works.
Usage: python scripts/test_rag.py
"""
import sys
import asyncio
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from core.rag_engine import rag_engine

TEST_QUESTIONS = [
    "Mera salary nahi mila 2 mahine se, kya karein?",
    "Ghar mein maar peet ho rahi hai, kya karein?",
    "Online fraud hua, FIR kaise karein?",
    "Consumer complaint kaise file karein?",
    "RTI kaise file karein?",
]


async def run_tests():
    print("=" * 60)
    print("🧪 Nyay AI – RAG Quality Test")
    print("=" * 60)

    print("\n🚀 Initializing RAG engine...")
    await rag_engine.initialize()

    for i, question in enumerate(TEST_QUESTIONS, 1):
        print(f"\n{'─' * 50}")
        print(f"Q{i}: {question}")
        print("─" * 50)

        response = await rag_engine.answer_legal_question(
            question=question,
            history=[],
            language="hi",
        )

        print(f"📊 Confidence: {response.confidence}")
        print(f"📋 References found: {len(response.references)}")
        for ref in response.references:
            print(f"   → {ref.section} ({ref.source})")
        print(f"\n💬 Answer preview:\n{response.answer[:300]}...")

    print("\n\n✅ Test complete!")


if __name__ == "__main__":
    asyncio.run(run_tests())
