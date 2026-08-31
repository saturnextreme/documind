import uuid

from fastapi import APIRouter

from services.session_manager import session_manager


router = APIRouter()


@router.post("")
async def create_session():

    session_id = str(uuid.uuid4())[:8]

    session_manager.create_session(session_id)

    return {
        "session_id": session_id
    }


@router.delete("/{session_id}")
async def delete_session(session_id: str):

    session_manager.delete_session(session_id)

    return {
        "message": "Session deleted",
        "session_id": session_id
    }