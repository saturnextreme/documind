from database import supabase
from rag.embedder import Embedder
from rag.generate_response import GenerateResponse

from services.sessions import check_session


embedder = Embedder()
generator = GenerateResponse()

# ============================================================
# Chat
# ============================================================

def chat(session_id: str, question: str, user_id: str):

    # --------------------------------------------------------
    # 1. Check session
    # --------------------------------------------------------

    check_session(session_id, user_id)

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
    # 3. Check if this is the first user question
    # --------------------------------------------------------

    messages_response = (
        supabase
        .table("chat_messages")
        .select("id")
        .eq("session_id", session_id)
        .eq("role", "user")
        .limit(1)
        .execute()
    )

    is_first_question = not messages_response.data

    title = None

    # --------------------------------------------------------
    # 4. Generate conversation title
    # --------------------------------------------------------

    if is_first_question:

        title_prompt = f"""
    Generate a concise title for this conversation.

    Requirements:

    * The title must contain 10 to 14 words.
    * Describe the main intent of the user's question.
    * Do not use quotation marks.
    * Do not write "Title:".
    * Return only the title.

    User's question:
    {question}
    """
        title = generator.print_response(
            title_prompt
        ).strip()

        # Save title to session
        (
            supabase
            .table("sessions")
            .update({
                "title": title
            })
            .eq("id", session_id)
            .eq("user_id", user_id)
            .execute()
        )

    # --------------------------------------------------------
    # 5. Generate question embedding
    # --------------------------------------------------------

    query_embedding = embedder.embed(
        [question]
    )[0]

    # --------------------------------------------------------
    # 6. Search similar document chunks
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
    # 7. Build contexts
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
    # 8. Build prompt
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
    # 9. Generate answer
    # --------------------------------------------------------

    result = generator.print_response(
        prompt
    )

    # --------------------------------------------------------
    # 10. Save user message
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
    # 11. Save assistant message
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
    # 12. Return answer and title
    # --------------------------------------------------------

    return {
        "question": question,
        "answer": result,
        "title": title,
    }

# ============================================================
# Get Chat History
# ============================================================


def get_chat_history(session_id: str, user_id: str):

    # --------------------------------------------------------
    # 1. Check session ownership
    # --------------------------------------------------------

    check_session(session_id, user_id)

    # --------------------------------------------------------
    # 2. Get messages
    # --------------------------------------------------------

    response = (
        supabase
        .table("chat_messages")
        .select("id, role, content, created_at")
        .eq("session_id", session_id)
        .order("created_at")
        .execute()
    )

    return response.data


# ============================================================
# Get Users all previous Sessions
# ============================================================

def get_user_sessions(user_id: str):

    # --------------------------------------------------------
    # Get user's sessions
    # --------------------------------------------------------

    sessions_response = (
        supabase
        .table("sessions")
        .select("id, title, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    sessions = sessions_response.data

    if not sessions:
        return []

    # --------------------------------------------------------
    # Get documents belonging to these sessions
    # --------------------------------------------------------

    session_ids = [session["id"] for session in sessions]

    documents_response = (
        supabase
        .table("documents")
        .select("session_id, status")
        .in_("session_id", session_ids)
        .execute()
    )

    documents = documents_response.data

    # --------------------------------------------------------
    # Group document statuses by session
    # --------------------------------------------------------

    status_by_session = {}

    for document in documents:

        session_id = document["session_id"]
        status = document["status"]

        status_by_session.setdefault(
            session_id,
            []
        ).append(status)

    # --------------------------------------------------------
    # Build final session response
    # --------------------------------------------------------

    result = []

    for session in sessions:

        session_id = session["id"]

        statuses = status_by_session.get(
            session_id,
            []
        )

        if not statuses:
            status = "no_documents"

        elif "failed" in statuses:
            status = "failed"

        elif "indexing" in statuses:
            status = "indexing"

        elif "uploaded" in statuses:
            status = "uploaded"

        elif all(
            document_status == "indexed"
            for document_status in statuses
        ):
            status = "indexed"

        else:
            status = "uploaded"

        result.append({
            "id": session_id,
            "title": session["title"],
            "created_at": session["created_at"],
            "status": status,
        })

    return result