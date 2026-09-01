from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

from api.sessions import router as sessions_router
from api.documents import router as documents_router
from api.chat import router as chat_router

app = FastAPI(
    title="DocuMind AI API",
    description="Backend API for the DocuMind PDF RAG application",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.ALLOWED_ORIGIN,
        "http://localhost:5173",
        "http://localhost:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    sessions_router,
    prefix="/api/sessions",
    tags=["Sessions"],
)

app.include_router(
    documents_router,
    prefix="/api/sessions",
    tags=["Documents"],
)

app.include_router(
    chat_router,
    prefix="/api/sessions",
    tags=["Chat"],
)


@app.get("/")
async def root():
    return {
        "message": "DocuMind AI API is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "ok"
    }