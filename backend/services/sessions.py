from database import supabase


# ============================================================
# Check Session
# ============================================================

def check_session(session_id: str):

    response = (
        supabase
        .table("sessions")
        .select("id")
        .eq("id", session_id)
        .maybe_single()
        .execute()
    )

    if not response.data:
        raise ValueError("Session not found")


# ============================================================
# Create Session
# ============================================================

def create_session():

    response = (
        supabase
        .table("sessions")
        .insert({})
        .execute()
    )

    if not response.data:
        raise RuntimeError(
            "Failed to create session"
        )

    session = response.data[0]

    return {
        "session_id": session["id"]
    }


# ============================================================
# Delete Session
# ============================================================

def delete_session(session_id: str):

    response = (
        supabase
        .table("sessions")
        .delete()
        .eq("id", session_id)
        .execute()
    )

    if not response.data:
        raise ValueError(
            "Session not found"
        )

    return {
        "message": "Session deleted",
        "session_id": session_id
    }
