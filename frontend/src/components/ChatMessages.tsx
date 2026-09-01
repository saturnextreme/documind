import type { RefObject } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface Props {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSuggestion: (value: string) => void;
}

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
  onSuggestion,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-5 py-8">
        {messages.length === 0 && !loading && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">
              ✦
            </div>

            <h1 className="text-2xl font-semibold">
              Ask your documents anything
            </h1>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Ask a question and DocuMind will retrieve relevant
              information from your documents.
            </p>

            <div className="mt-7 grid w-full max-w-xl gap-3 sm:grid-cols-2">
              <button
                onClick={() =>
                  onSuggestion(
                    "Summarize the main points of these documents."
                  )
                }
                className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"
              >
                <p className="text-sm font-medium">
                  Summarize my documents
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Get the main points quickly.
                </p>
              </button>

              <button
                onClick={() =>
                  onSuggestion(
                    "What are the most important findings in these documents?"
                  )
                }
                className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"
              >
                <p className="text-sm font-medium">
                  Find important information
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Discover the key findings.
                </p>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-7">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              {message.role === "user" ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-slate-900 px-4 py-3 text-sm leading-6 text-white">
                  {message.content}
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <p className="mb-1 text-xs font-semibold text-violet-600">
                    DocuMind
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {message.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-slate-400">
              DocuMind is thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}