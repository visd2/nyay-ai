from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional


class DraftType(str, Enum):
    complaint_letter = "complaint_letter"
    legal_notice = "legal_notice"
    fir_application = "fir_application"
    consumer_complaint = "consumer_complaint"
    salary_complaint = "salary_complaint"
    harassment_complaint = "harassment_complaint"
    rent_dispute = "rent_dispute"


class DraftRequest(BaseModel):
    draft_type: DraftType
    details: dict = Field(default={})
    language: str = Field(default="hi")


class DraftResponse(BaseModel):
    draft_text: str
    draft_type: str
    relevant_laws: list[str] = []
    where_to_submit: str = ""
    tips: list[str] = []
    disclaimer: str = "यह draft एक template है। Submit करने से पहले lawyer से verify करायें।"


class RiskCheckRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)


class RiskCategory(str, Enum):
    safe = "safe"
    warning = "warning"
    danger = "danger"


class RiskCheckResponse(BaseModel):
    category: RiskCategory
    risk_level: int = Field(..., ge=0, le=10)
    issues_found: list[str] = []
    applicable_sections: list[str] = []
    safer_alternative: Optional[str] = None
    explanation: str = ""
