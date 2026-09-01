import FileUpload from "./FileUpload";

interface Props {
  sessionId: string;
  uploaded: boolean;
  indexing: boolean;
  error: string;
  onUploadSuccess: () => void;
  onIndex: () => void;
}

export default function ChatSetup({
  sessionId,
  uploaded,
  indexing,
  error,
  onUploadSuccess,
  onIndex,
}: Props) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-violet-600">
            New conversation
          </p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Add your documents
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Upload the PDFs you want to talk about. We'll prepare
            them for AI-powered search.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <FileUpload
            sessionId={sessionId}
            onUploadSuccess={onUploadSuccess}
          />

          {uploaded && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-sm font-semibold">
                  Documents uploaded
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Build the knowledge index to start chatting.
                </p>
              </div>

              <button
                onClick={onIndex}
                disabled={indexing}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {indexing ? "Preparing..." : "Start chatting →"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-2 text-xs text-slate-400">
          <span>Upload</span>
          <span>→</span>
          <span>Process</span>
          <span>→</span>
          <span>Retrieve</span>
          <span>→</span>
          <span>Chat</span>
        </div>
      </div>
    </div>
  );
}