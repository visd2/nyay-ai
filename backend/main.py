from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from api.chat import router as chat_router
from api.draft import router as draft_router
from api.risk import router as risk_router
from api.voice import router as voice_router
from api.health import router as health_router
from api.analytics import router as analytics_router


# ✅ No heavy startup — lifespan hataya
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Digital Legal Assistant for India",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nyay-ai-chi.vercel.app",
        "https://nyay-ai.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health_router,     prefix="/api", tags=["Health"])
app.include_router(chat_router,       prefix="/api", tags=["Chat"])
app.include_router(draft_router,      prefix="/api", tags=["Draft"])
app.include_router(risk_router,       prefix="/api", tags=["Risk"])
app.include_router(voice_router,      prefix="/api", tags=["Voice"])
app.include_router(analytics_router,  prefix="/api", tags=["Analytics"])


@app.get("/")
async def root():
    return {
        "app":        settings.APP_NAME,
        "version":    settings.APP_VERSION,
        "status":     "running",
        "disclaimer": "Legal information tool, NOT legal advice.",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
