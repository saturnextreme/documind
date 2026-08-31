from fastapi import APIRouter, HTTPException

from services.sessions import (
    create_session,
    delete_session,
)


router = APIRouter()


# ============================================================
# Create Session
# ============================================================

@router.post("")
async def create_session_route():

    try:

        return create_session()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ============================================================
# Delete Session
# ============================================================

@router.delete("/{session_id}")
async def delete_session_route(
    session_id: str,
):

    try:

        return delete_session(session_id)

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )