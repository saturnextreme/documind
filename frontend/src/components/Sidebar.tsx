import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import AppLogo from "./AppLogo";
import SessionList from "./SessionList";
import type { Session } from "../types/session";

type SidebarProps = {
  sessions: Session[];
  sessionsLoading: boolean;
  activeSessionId?: string;
  creatingSession: boolean;
  deletingSession: boolean;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
};

export default function Sidebar({
  sessions,
  sessionsLoading,
  activeSessionId,
  creatingSession,
  deletingSession,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);

      await supabase.auth.signOut();

      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50 md:flex">
      {/* Brand */}
      <div className="flex h-16 items-center px-5">
        <div className="flex items-center gap-3">
          <AppLogo />

          <span className="text-lg font-bold tracking-tight text-slate-900">
            DocuMind
          </span>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3">
        <button
          onClick={onNewChat}
          disabled={creatingSession || deletingSession || loggingOut}
          className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {creatingSession ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          )}

          {creatingSession ? "Creating..." : "New chat"}
        </button>
      </div>

      {/* Conversations */}
      <div className="mt-6 flex-1 overflow-y-auto px-3">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Conversations
        </p>

        <SessionList
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          activeSessionId={activeSessionId}
          onSelect={onSelectSession}
          onDelete={onDeleteSession}
        />
      </div>

      {/* Account */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            {email
              ? email.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-700">
              {email || "User"}
            </p>

            <p className="text-xs text-slate-400">
              DocuMind account
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loggingOut ? (
            <span className="ml-0.5 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 17l5-5-5-5"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H3"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 19V5a2 2 0 0 0-2-2h-5"
              />
            </svg>
          )}

          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}