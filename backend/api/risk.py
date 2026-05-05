from fastapi import APIRouter, HTTPException
from models.draft_schema import RiskCheckRequest, RiskCheckResponse
from core.rag_engine import rag_engine

router = APIRouter()

@router.post("/risk", response_model=RiskCheckResponse)
async def check_risk(request: RiskCheckRequest):
    try:
        return await rag_engine.analyze_risk(request.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
