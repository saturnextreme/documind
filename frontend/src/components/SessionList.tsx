import type { Session } from "../types/session";

type SessionListProps = {
  sessions: Session[];
  sessionsLoading: boolean;
  activeSessionId?: string;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
};

export default function SessionList({
  sessions,
  sessionsLoading,
  activeSessionId,
  onSelect,
  onDelete,
}: SessionListProps) {
  if (sessionsLoading) {
    return (
      <div className="mt-2 space-y-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-10 animate-pulse rounded-xl bg-slate-200/70"
          />
        ))}
      </div>
    );
  }
  if (sessions.length === 0) {
    return (
      <p className="px-3 py-3 text-xs leading-5 text-slate-400">
        No conversations yet.
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      {sessions.map((session) => {
        const active = session.id === activeSessionId;

        return (
          <div
            key={session.id}
            className={`group flex w-full items-center rounded-xl transition ${
              active
                ? "bg-slate-200"
                : "hover:bg-slate-100"
            }`}
          >
            <button
              onClick={() => onSelect(session.id)}
              className={`flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-left text-sm ${
                active
                  ? "font-medium text-slate-800"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
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
                  d="M8 10h8M8 14h5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 19.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13.5"
                />
              </svg>

              <span
                className="truncate"
                title={session.title || "New conversation"}
              >
                {session.title || "New conversation"}
              </span>
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete(session.id);
              }}
              className="mr-2 rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-slate-200 hover:text-red-500 group-hover:opacity-100"
              aria-label="Delete conversation"
              title="Delete conversation"
            >
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
                  d="M3 6h18"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 6V4h8v2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 6l-1 14H6L5 6"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 11v5M14 11v5"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}