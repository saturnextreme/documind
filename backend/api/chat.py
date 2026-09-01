from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from services.chat import chat, get_chat_history, get_user_sessions
from auth.dependencies import get_current_user


router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/{session_id}/chat")
async def chat_endpoint(
    session_id: str,
    request: ChatRequest,
    current_user=Depends(get_current_user),
):

    try:

        return chat(
            session_id,
            request.question,
            current_user["user_id"],
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except LookupError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.get("/{session_id}/chat")
async def chat_history_endpoint(
    session_id: str,
    current_user=Depends(get_current_user),
):

    try:

        return get_chat_history(
            session_id,
            current_user["user_id"],
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.get("")
async def get_sessions(
    current_user=Depends(get_current_user),
):
    return get_user_sessions(current_user["user_id"])