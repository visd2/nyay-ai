from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: list[ChatMessage] = Field(default=[])
    language: str = Field(default="hi")


class LegalReference(BaseModel):
    section: str
    title: str
    source: str
    url: Optional[str] = None
    summary: str


class ChatResponse(BaseModel):
    answer: str
    references: list[LegalReference] = []
    next_steps: list[str] = []
    disclaimer: str = "यह legal information है, legal advice नहीं। गंभीर मामलों में वकील से मिलें।"
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
