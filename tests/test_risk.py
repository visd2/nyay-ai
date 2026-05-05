"""Tests for /api/risk endpoint."""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock


@pytest.fixture(autouse=True)
def mock_rag(monkeypatch):
    from models.draft_schema import RiskCheckResponse, RiskCategory

    async def mock_analyze(text):
        if "barbaad" in text or "maar" in text:
            return RiskCheckResponse(
                category=RiskCategory.danger,
                risk_level=8,
                issues_found=["Criminal intimidation detected"],
                applicable_sections=["IPC Section 503", "IPC Section 506"],
                safer_alternative="Please resolve this matter legally.",
                explanation="This text contains threatening language.",
            )
        return RiskCheckResponse(
            category=RiskCategory.safe,
            risk_level=1,
            issues_found=[],
            applicable_sections=[],
            explanation="Text appears legally safe.",
        )

    async def mock_init(*args, **kwargs):
        pass

    monkeypatch.setattr("core.rag_engine.rag_engine.analyze_risk", mock_analyze)
    monkeypatch.setattr("core.rag_engine.rag_engine.initialize", mock_init)


@pytest.mark.asyncio
async def test_risk_detects_threat():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/risk",
            json={"text": "Main tumhe barbaad kar dunga"},
        )
    assert resp.status_code == 200
    data = resp.json()
    assert data["category"] in ("warning", "danger")
    assert data["risk_level"] >= 5


@pytest.mark.asyncio
async def test_risk_safe_text():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/risk",
            json={"text": "Mujhe aapki service se problem hai, refund chahiye."},
        )
    assert resp.status_code == 200
    data = resp.json()
    assert data["category"] == "safe"


@pytest.mark.asyncio
async def test_risk_empty_text_fails():
    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post("/api/risk", json={"text": ""})
    assert resp.status_code == 422
