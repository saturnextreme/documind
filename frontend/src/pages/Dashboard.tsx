import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSession,
  deleteSession,
  getSessions,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import DashboardWelcome from "../components/DashboardWelcome";
import Toast from "../components/Toast";

import type { Session } from "../types/session";

export default function Dashboard() {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);
  const [deletingSession, setDeletingSession] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setError("");

      const data = await getSessions();

      const sessionList = Array.isArray(data)
        ? data
        : data.sessions ?? [];

      setSessions(sessionList);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load conversations"
      );
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      setError("");
      setCreatingSession(true);

      const data = await createSession();

      setSessions((current) => [
        {
          id: data.session_id,
          title: null,
          created_at: new Date().toISOString(),
          status: "no_documents",
        },
        ...current,
      ]);

      navigate(`/chat/${data.session_id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create conversation"
      );
    } finally {
      setCreatingSession(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (deletingSession) {
      return;
    }

    try {
      setDeletingSession(true);
      setError("");

      await deleteSession(id);

      setSessions((current) =>
        current.filter((session) => session.id !== id)
      );

      if (id === sessionId) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete conversation"
      );
    } finally {
      setDeletingSession(false);
    }
  };

  const handleSelectSession = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <Sidebar
        sessions={sessions}
        activeSessionId={sessionId}
        sessionsLoading={sessionsLoading}
        creatingSession={creatingSession}
        deletingSession={deletingSession}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-5 md:hidden">
          <div className="text-sm font-semibold">
            DocuMind
          </div>
        </header>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600">
            <Toast
              message={error}
              onClose={() => setError("")}
            />
          </div>
        )}

        <DashboardWelcome />
      </main>
    </div>
  );
}