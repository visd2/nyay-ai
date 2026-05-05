from fastapi import APIRouter, UploadFile, File, HTTPException
from openai import AsyncOpenAI
from config import settings

router = APIRouter()
_openai = None

def get_openai():
    global _openai
    if _openai is None:
        _openai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _openai

@router.post("/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not settings.OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="Voice requires OPENAI_API_KEY in .env")
    try:
        audio_bytes = await file.read()
        client = get_openai()
        transcript = await client.audio.transcriptions.create(
            model="whisper-1",
            file=(file.filename, audio_bytes, file.content_type),
            language="hi",
        )
        return {"text": transcript.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
