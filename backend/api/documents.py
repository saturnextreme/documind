from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

from services.documents import (
    upload_documents,
    index_documents,
)

from services.sessions import check_session
from auth.dependencies import get_current_user


router = APIRouter()


# ============================================================
# Upload Documents
# ============================================================

@router.post("/{session_id}/documents")
async def upload_documents_route(
    session_id: str,
    files: list[UploadFile] = File(...),
    current_user=Depends(get_current_user),
):

    try:

        # Verify session belongs to logged-in user
        check_session(
            session_id,
            current_user["user_id"],
        )

        saved_files = await upload_documents(
            session_id,
            files,
            current_user["user_id"],
        )

        return {
            "session_id": session_id,
            "files": saved_files,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
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
async def build_index(
    session_id: str,
    current_user=Depends(get_current_user),
):

    try:

        # Verify session belongs to logged-in user
        check_session(
            session_id,
            current_user["user_id"],
        )

        return index_documents(session_id, current_user["user_id"])

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Indexing failed: {str(e)}",
        )