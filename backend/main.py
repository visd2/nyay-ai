from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from api.chat import router as chat_router
from api.draft import router as draft_router
from api.risk import router as risk_router
from api.voice import router as voice_router
from api.health import router as health_router
from api.analytics import router as analytics_router
from core.rag_engine import rag_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Nyay AI starting up...")
    await rag_engine.initialize()
    print("✅ RAG engine ready")
    yield
    print("👋 Nyay AI shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Digital Legal Assistant for India",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(chat_router,   prefix="/api", tags=["Chat"])
app.include_router(draft_router,  prefix="/api", tags=["Draft"])
app.include_router(risk_router,   prefix="/api", tags=["Risk"])
app.include_router(voice_router,  prefix="/api", tags=["Voice"])
app.include_router(analytics_router, prefix="/api", tags=["Analytics"])


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "disclaimer": "This is a legal information tool, NOT legal advice.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
