from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from services.chat import chat
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