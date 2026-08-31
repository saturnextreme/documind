from typing import Dict


class Session:

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.pdf_paths: list[str] = []
        self.rag = None
        self.messages = []


class SessionManager:

    def __init__(self):
        self.sessions: Dict[str, Session] = {}

    def create_session(self, session_id: str):

        session = Session(session_id)

        self.sessions[session_id] = session

        return session

    def get_session(self, session_id: str):

        if session_id not in self.sessions:
            raise KeyError(
                f"Session {session_id} not found"
            )

        return self.sessions[session_id]

    def delete_session(self, session_id: str):

        if session_id in self.sessions:
            del self.sessions[session_id]


session_manager = SessionManager()