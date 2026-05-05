from fastapi import APIRouter, HTTPException
from models.draft_schema import DraftRequest, DraftResponse
from core.rag_engine import rag_engine

router = APIRouter()

@router.post("/draft", response_model=DraftResponse)
async def generate_draft(request: DraftRequest):
    try:
        return await rag_engine.generate_legal_draft(
            draft_type=request.draft_type.value,
            details=request.details,
            language=request.language,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/draft/types")
async def get_draft_types():
    return {
        "types": [
            {"id": "complaint_letter",     "label": "General Complaint Letter",   "label_hi": "शिकायत पत्र"},
            {"id": "legal_notice",         "label": "Legal Notice",               "label_hi": "कानूनी नोटिस"},
            {"id": "fir_application",      "label": "FIR Application",            "label_hi": "FIR आवेदन"},
            {"id": "consumer_complaint",   "label": "Consumer Complaint",         "label_hi": "उपभोक्ता शिकायत"},
            {"id": "salary_complaint",     "label": "Salary Complaint",           "label_hi": "वेतन शिकायत"},
            {"id": "harassment_complaint", "label": "Harassment Complaint",       "label_hi": "उत्पीड़न शिकायत"},
            {"id": "rent_dispute",         "label": "Rent Dispute Application",   "label_hi": "किराया विवाद"},
        ]
    }
