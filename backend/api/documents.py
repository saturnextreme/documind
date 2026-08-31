from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)

from services.documents import (
    upload_documents,
    index_documents,
)


router = APIRouter()


# ============================================================
# Upload Documents
# ============================================================

@router.post("/{session_id}/documents")
async def upload_documents_route(
    session_id: str,
    files: list[UploadFile] = File(...),
):

    try:

        saved_files = await upload_documents(
            session_id,
            files,
        )

        return {
            "session_id": session_id,
            "files": saved_files,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except RuntimeError as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ============================================================
# Build Index
# ============================================================

@router.post("/{session_id}/index")
async def build_index(session_id: str):

    try:

        return index_documents(session_id)

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Indexing failed: {str(e)}",
        )