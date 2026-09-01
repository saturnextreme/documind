import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createSession,
  deleteSession,
  getChatHistory,
  getSessions,
  indexDocuments,
  sendMessage,
} from "../services/api";

import Sidebar from "../components/Sidebar";
import ChatSetup from "../components/ChatSetup";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

import type { Session } from "../types/session";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");

  const [uploaded, setUploaded] = useState(false);
  const [indexed, setIndexed] = useState(false);

  const [creating, setCreating] = useState(false);
  const [indexing, setIndexing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ==========================================================
  // Load all sessions for sidebar
  // ==========================================================

  useEffect(() => {
    loadSessions();
  }, []);

  // ==========================================================
  // Load selected session whenever URL changes
  // ==========================================================

  useEffect(() => {
    if (!sessionId || sessions.length === 0) {
      return;
    }

    loadSelectedSession(sessionId);
  }, [sessionId, sessions]);

  // ==========================================================
  // Auto-scroll chat
  // ==========================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ==========================================================
  // Load sessions
  // ==========================================================

  const loadSessions = async () => {
    try {
      const data = await getSessions();

      const sessionList = Array.isArray(data)
        ? data
        : data.sessions ?? [];

      setSessions(sessionList);
    } catch {
      // Sidebar failure shouldn't break the chat.
    } finally {
      setSessionsLoading(false);
    }
  };

  // ==========================================================
  // Load selected session
  // ==========================================================

  const loadSelectedSession = async (id: string) => {
    setSessionLoading(true);

    try {
      setMessages([]);
      setQuestion("");
      setUploaded(false);
      setIndexed(false);
      setError("");

      const selectedSession = sessions.find(
        (session) => session.id === id
      );

      if (!selectedSession) {
        return;
      }

      if (selectedSession.status === "no_documents") {
        setUploaded(false);
        setIndexed(false);
        return;
      }

      if (selectedSession.status === "uploaded") {
        setUploaded(true);
        setIndexed(false);
        return;
      }

      if (selectedSession.status === "indexing") {
        setUploaded(true);
        setIndexed(false);
        setError("Documents are still being prepared.");
        return;
      }

      if (selectedSession.status === "failed") {
        setUploaded(true);
        setIndexed(false);
        setError(
          "Document preparation failed. Please try indexing again."
        );
        return;
      }

      if (selectedSession.status === "indexed") {
        const data = await getChatHistory(id);

        setMessages(
          data.map((message: Message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
            created_at: message.created_at,
          }))
        );

        setUploaded(true);
        setIndexed(true);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load conversation"
      );
    } finally {
      setSessionLoading(false);
    }
  };

  // ==========================================================
  // New chat
  // ==========================================================

  const handleNewChat = async () => {
    try {
      setCreating(true);
      setError("");

      const data = await createSession();

      const newSession: Session = {
        id: data.session_id,
        title: null,
        created_at: new Date().toISOString(),
        status: "no_documents",
      };

      setSessions((current) => [
        newSession,
        ...current,
      ]);

      // Immediately reset the current chat UI
      setMessages([]);
      setQuestion("");
      setUploaded(false);
      setIndexed(false);
      setError("");

      navigate(`/chat/${data.session_id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create conversation"
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================================
  // Delete session
  // ==========================================================

  const handleDeleteSession = async (id: string) => {
    if (deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteSession(id);

      setSessions((current) =>
        current.filter((session) => session.id !== id)
      );

      // If deleting the conversation currently open,
      // return to the dashboard.
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
      setDeleting(false);
    }
  };

  // ==========================================================
  // Upload success
  // ==========================================================

  const handleUploadSuccess = () => {
    setUploaded(true);
    setError("");

    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: "uploaded",
            }
          : session
      )
    );
  };

  // ==========================================================
  // Index documents
  // ==========================================================

  const handleIndex = async () => {
    if (!sessionId) {
      return;
    }

    try {
      setIndexing(true);
      setError("");

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                status: "indexing",
              }
            : session
        )
      );

      await indexDocuments(sessionId);

      setIndexed(true);

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                status: "indexed",
              }
            : session
        )
      );
    } catch (error) {
      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                status: "failed",
              }
            : session
        )
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to prepare documents"
      );
    } finally {
      setIndexing(false);
    }
  };

  // ==========================================================
  // Send message
  // ==========================================================

  const handleSend = async () => {
    const trimmed = question.trim();

    if (!trimmed || loading || !sessionId) {
      return;
    }

    setQuestion("");
    setError("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setLoading(true);

    try {
      const data = await sendMessage(
        sessionId,
        trimmed
      );

      // Update sidebar title on first question
      if (data.title) {
        setSessions((current) =>
          current.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  title: data.title,
                }
              : session
          )
        );
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to get an answer."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // No session ID
  // ==========================================================

  if (!sessionId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="flex h-screen bg-white text-slate-900">
      <Sidebar
        sessions={sessions}
        sessionsLoading={sessionsLoading}
        activeSessionId={sessionId}
        creatingSession={creating}
        deletingSession={deleting}
        onNewChat={handleNewChat}
        onSelectSession={(id) =>
          navigate(`/chat/${id}`)
        }
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
          <div>
            <p className="text-sm font-semibold">
              {indexed
                ? "Document Chat"
                : "New conversation"}
            </p>

            <p className="text-xs text-slate-400">
              {indexed
                ? "Ask questions about your documents"
                : "Upload documents to get started"}
            </p>
          </div>
        </header>

        {sessionLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Loading conversation...
            </div>
          </div>
        ) : !indexed ? (
          <div
            key={sessionId}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <ChatSetup
              sessionId={sessionId}
              uploaded={uploaded}
              indexing={indexing}
              error={error}
              onUploadSuccess={handleUploadSuccess}
              onIndex={handleIndex}
            />
          </div>
        ) : (
          <div
            key={sessionId}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex min-h-0 flex-1 flex-col"
          >
            <ChatMessages
              messages={messages}
              loading={loading}
              messagesEndRef={messagesEndRef}
              onSuggestion={setQuestion}
            />

            <ChatInput
              question={question}
              loading={loading}
              onChange={setQuestion}
              onSend={handleSend}
            />

            {error && (
              <div className="px-5 pb-3 text-center text-xs text-red-500">
                {error}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}