import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-3 fade-in duration-200">
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/50">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
          !
        </div>

        <p className="flex-1 text-sm leading-5 text-slate-700">
          {message}
        </p>

        <button
          onClick={onClose}
          className="text-slate-400 transition hover:text-slate-700"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}