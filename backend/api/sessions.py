from fastapi import APIRouter, HTTPException, Depends

from services.sessions import (
    create_session,
    delete_session,
)
from auth.dependencies import get_current_user


router = APIRouter()


# ============================================================
# Create Session
# ============================================================

@router.post("")
async def create_session_route(
    current_user=Depends(get_current_user),
):

    try:
        return create_session(current_user["user_id"])

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
    current_user=Depends(get_current_user),
):

    try:
        return delete_session(
            session_id,
            current_user["user_id"],
        )

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


# ============================================================
# Test Authentication
# ============================================================

@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user),
):
    return current_user

