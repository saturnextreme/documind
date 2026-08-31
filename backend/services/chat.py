from database import supabase
from rag.embedder import Embedder
from rag.generate_response import GenerateResponse

from services.sessions import check_session


embedder = Embedder()
generator = GenerateResponse()


# ============================================================
# Chat
# ============================================================

def chat(session_id: str, question: str):

    # --------------------------------------------------------
    # 1. Check session
    # --------------------------------------------------------

    check_session(session_id)

    # --------------------------------------------------------
    # 2. Check knowledge base
    # --------------------------------------------------------

    chunks_response = (
        supabase
        .table("document_chunks")
        .select("id")
        .eq("session_id", session_id)
        .limit(1)
        .execute()
    )

    if not chunks_response.data:

        raise ValueError(
            "Knowledge base has not been indexed yet"
        )

    # --------------------------------------------------------
    # 3. Generate question embedding
    # --------------------------------------------------------

    query_embedding = embedder.embed(
        question
    )

    # --------------------------------------------------------
    # 4. Search similar document chunks
    # --------------------------------------------------------

    search_response = supabase.rpc(
        "match_document_chunks",
        {
            "query_embedding": query_embedding.tolist(),
            "match_session_id": session_id,
            "match_count": 5,
        },
    ).execute()

    retrieved_chunks = search_response.data

    if not retrieved_chunks:

        raise LookupError(
            "No relevant document content found"
        )

    # --------------------------------------------------------
    # 5. Build contexts
    # --------------------------------------------------------

    contexts = []

    for chunk in retrieved_chunks:

        contexts.append({
            "text": chunk["content"],
            "metadata": {
                **(chunk["metadata"] or {}),
                "page_number": chunk["page_number"],
            },
        })

    # --------------------------------------------------------
    # 6. Build prompt
    # --------------------------------------------------------

    context_text = ""

    for chunk in contexts:

        metadata = chunk["metadata"]

        context_text += (
            f"(File: {metadata.get('file_name', 'Unknown')}, "
            f"Page: {metadata.get('page_number', 'Unknown')})\n"
        )

        context_text += (
            chunk["text"]
            + "\n\n"
        )

    prompt = f"""
Answer only using the context below.

Give citations in the format:
(File: filename, Page: number)

If the answer cannot be found in the context,
say that the information is not available
in the provided documents.

Context:
{context_text}

Question:
{question}

Answer:
"""

    # --------------------------------------------------------
    # 7. Generate answer
    # --------------------------------------------------------

    result = generator.print_response(prompt)

    # --------------------------------------------------------
    # 8. Save user message
    # --------------------------------------------------------

    (
        supabase
        .table("chat_messages")
        .insert({
            "session_id": session_id,
            "role": "user",
            "content": question,
        })
        .execute()
    )

    # --------------------------------------------------------
    # 9. Save assistant message
    # --------------------------------------------------------

    (
        supabase
        .table("chat_messages")
        .insert({
            "session_id": session_id,
            "role": "assistant",
            "content": result,
        })
        .execute()
    )

    # --------------------------------------------------------
    # 10. Return answer
    # --------------------------------------------------------

    return {
        "question": question,
        "answer": result,
    }