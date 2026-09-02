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

  // Remember sidebar state between route changes and refreshes
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("documind-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
    };

    loadUser();
  }, []);

  // Save sidebar state whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "documind-sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

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
    <aside
      className={`relative flex h-screen shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-200 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand */}
      <div
        className={`relative flex h-16 items-center ${
          collapsed ? "justify-center px-2" : "px-5"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <AppLogo />

          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-slate-900">
              DocuMind
            </span>
          )}
        </div>

        {/* Collapse / Expand button */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 ${
            collapsed
              ? "right-[-14px] bg-slate-100 shadow-sm ring-1 ring-slate-200"
              : "right-3"
          }`}
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {collapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 5l-7 7 7 7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* New chat */}
      <div className={collapsed ? "px-2" : "px-3"}>
        <button
          onClick={onNewChat}
          disabled={
            creatingSession ||
            deletingSession ||
            loggingOut
          }
          title={collapsed ? "New chat" : undefined}
          className={`flex w-full items-center rounded-xl bg-white text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${
            collapsed
              ? "justify-center px-2 py-2.5"
              : "gap-3 px-3 py-2.5"
          }`}
        >
          {creatingSession ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          ) : (
            <svg
              className="h-4 w-4 shrink-0"
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

          {!collapsed &&
            (creatingSession
              ? "Creating..."
              : "New chat")}
        </button>
      </div>

      {/* Conversations */}
      <div
        className={`mt-6 flex-1 overflow-y-auto ${
          collapsed ? "px-2" : "px-3"
        }`}
      >
        {!collapsed && (
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Conversations
          </p>
        )}

        <SessionList
          sessions={sessions}
          sessionsLoading={sessionsLoading}
          activeSessionId={activeSessionId}
          onSelect={onSelectSession}
          onDelete={onDeleteSession}
        />
      </div>

      {/* Account */}
      <div
        className={`border-t border-slate-200 ${
          collapsed ? "p-2" : "p-3"
        }`}
      >
        <div
          className={`flex items-center rounded-xl py-2 ${
            collapsed
              ? "justify-center px-0"
              : "gap-3 px-2"
          }`}
          title={collapsed ? email || "User" : undefined}
        >
          {/* Avatar */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
            {email
              ? email.charAt(0).toUpperCase()
              : "U"}
          </div>

          {/* User information */}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700">
                {email || "User"}
              </p>

              <p className="text-xs text-slate-400">
                DocuMind account
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Log out" : undefined}
          className={`mt-1 flex w-full items-center rounded-xl py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 ${
            collapsed
              ? "justify-center px-2"
              : "gap-3 px-2"
          }`}
        >
          {loggingOut ? (
            <span className="ml-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          ) : (
            <svg
              className="h-4 w-4 shrink-0"
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

          {!collapsed &&
            (loggingOut
              ? "Logging out..."
              : "Log out")}
        </button>
      </div>
    </aside>
  );
}