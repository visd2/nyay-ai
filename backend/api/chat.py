from fastapi import APIRouter, HTTPException
from models.chat_schema import ChatRequest, ChatResponse
from core.rag_engine import rag_engine

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def legal_chat(request: ChatRequest):
    try:
        history = [
            {"role": msg.role.value, "content": msg.content}
            for msg in request.history
        ]
        response = await rag_engine.answer_legal_question(
            question=request.message,
            history=history,
            language=request.language,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")
