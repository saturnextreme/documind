import { useRef } from "react";

interface Props {
  question: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  question,
  loading,
  onChange,
  onSend,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;

    onChange(textarea.value);

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      160
    )}px`;
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white px-5 pb-5 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="relative rounded-2xl border border-slate-200 shadow-sm focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            placeholder="Ask anything about your documents..."
            className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-4 py-4 pr-14 text-sm outline-none placeholder:text-slate-400"
          />

          <button
            onClick={onSend}
            disabled={!question.trim() || loading}
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-30"
          >
            {loading ? "…" : "→"}
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}