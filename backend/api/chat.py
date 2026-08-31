from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.session_manager import session_manager


router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/{session_id}/chat")
async def chat(
    session_id: str,
    request: ChatRequest
):

    try:
        session = session_manager.get_session(session_id)

    except KeyError:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    if session.rag is None:
        raise HTTPException(
            status_code=400,
            detail="Knowledge base has not been indexed yet"
        )

    try:

        prompt = session.rag.query(
            request.question,
            k=5
        )

        result = session.rag.generate(prompt)

        session.messages.append({
            "role": "user",
            "content": request.question
        })

        session.messages.append({
            "role": "assistant",
            "content": result
        })

        return {
            "question": request.question,
            "answer": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )