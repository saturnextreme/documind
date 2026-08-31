import os
import uuid
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from services.session_manager import session_manager
from rag_pipeline import RAGPipeline

router = APIRouter()


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/{session_id}/documents")
async def upload_documents(
    session_id: str,
    files: list[UploadFile] = File(...)
):

    try:
        session = session_manager.get_session(session_id)

    except KeyError:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    saved_files = []

    for file in files:

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"{file.filename} is not a PDF"
            )

        unique_name = (
            f"{os.path.splitext(file.filename)[0]}"
            f"-{uuid.uuid4().hex[:8]}.pdf"
        )

        file_path = os.path.join(
            UPLOAD_DIR,
            unique_name
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        session.pdf_paths.append(file_path)

        saved_files.append({
            "original_name": file.filename,
            "stored_name": unique_name,
        })

    return {
        "session_id": session_id,
        "files": saved_files,
    }

@router.post("/{session_id}/index")
async def build_index(session_id: str):

    try:
        session = session_manager.get_session(session_id)

    except KeyError:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    if not session.pdf_paths:
        raise HTTPException(
            status_code=400,
            detail="No PDF documents uploaded"
        )

    try:

        rag = RAGPipeline(
            pdf_paths=session.pdf_paths
        )

        rag.session_id = session_id

        rag.build_index()

        session.rag = rag

        return {
            "status": "complete",
            "session_id": session_id,
            "message": "Knowledge base indexed successfully"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )