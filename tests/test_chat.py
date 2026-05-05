"""
Tests for /api/chat endpoint.
Run: pytest tests/ -v
"""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch

# Patch RAG engine before importing app
@pytest.fixture(autouse=True)
def mock_rag(monkeypatch):
    """Mock RAG engine so tests don't need actual LLM/DB."""
    from models.chat_schema import ChatResponse, LegalReference

    fake_response = ChatResponse(
        answer="IPC Section 406 ke under criminal breach of trust apply hota hai. Aap Labour Commissioner se complaint kar sakte hain.",
        references=[
            LegalReference(
                section="IPC Section 406",
                title="Criminal Breach of Trust",
                source="India Code",
                summary="Salary withholding falls under criminal breach of trust.",
            )
        ],
        next_steps=["Labour Commissioner se milen", "FIR file karein"],
        confidence=0.87,
    )

    async def mock_answer(*args, **kwargs):
        return fake_response

    async def mock_init(*args, **kwargs):
        pass

    monkeypatch.setattr("core.rag_engine.rag_engine.answer_legal_question", mock_answer)
    monkeypatch.setattr("core.rag_engine.rag_engine.initialize", mock_init)


@pytest.mark.asyncio
async def test_chat_returns_answer():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/chat",
            json={"message": "Salary nahi mila", "language": "hi"},
        )
    assert resp.status_code == 200
    data = resp.json()
    assert "answer" in data
    assert len(data["answer"]) > 10
    assert "references" in data


@pytest.mark.asyncio
async def test_chat_empty_message_fails():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/chat",
            json={"message": "", "language": "hi"},
        )
    assert resp.status_code == 422  # Pydantic validation error


@pytest.mark.asyncio
async def test_health_endpoint():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_chat_with_history():
    from main import app

    history = [
        {"role": "user", "content": "Kya FIR free hai?"},
        {"role": "assistant", "content": "Haan, FIR file karna bilkul free hai."},
    ]

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/chat",
            json={
                "message": "Toh kaise karein?",
                "history": history,
                "language": "hi",
            },
        )
    assert resp.status_code == 200
