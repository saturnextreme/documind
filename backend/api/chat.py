from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.chat import chat


router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/{session_id}/chat")
async def chat_endpoint(
    session_id: str,
    request: ChatRequest,
):

    try:

        return chat(
            session_id,
            request.question,
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