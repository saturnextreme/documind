import { useRef, useState } from "react";
import { uploadDocuments } from "../services/api";

interface FileUploadProps {
  sessionId: string;
  onUploadSuccess?: () => void;
}

export default function FileUpload({
  sessionId,
  onUploadSuccess,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const selectFiles = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length !== selectedFiles.length) {
      setError("Only PDF files are supported.");
    } else {
      setError("");
    }

    setFiles(pdfFiles);
    setMessage("");
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) {
      return;
    }

    selectFiles(Array.from(event.target.files));
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragging(false);

    if (!event.dataTransfer.files) {
      return;
    }

    selectFiles(Array.from(event.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    setFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleUpload = async () => {
    if (!sessionId) {
      setError("Session not found.");
      return;
    }

    if (files.length === 0) {
      setError("Please select at least one PDF.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const data = await uploadDocuments(sessionId, files);

      setMessage(
        `${data.files.length} document${
          data.files.length === 1 ? "" : "s"
        } uploaded successfully.`
      );

      setFiles([]);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      onUploadSuccess?.();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-violet-400 bg-violet-50"
            : "border-slate-200 bg-slate-50/50 hover:border-violet-300 hover:bg-violet-50/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition group-hover:scale-105">
          <svg
            className="h-7 w-7 text-violet-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16V4m0 0L8 8m4-4 4 4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 14v4.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5V14"
            />
          </svg>
        </div>

        <h3 className="mt-5 text-sm font-semibold text-slate-800">
          Drop your PDF files here
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          or{" "}
          <span className="font-semibold text-violet-600">
            browse files
          </span>
        </p>

        <p className="mt-3 text-xs text-slate-400">
          PDF files only • Multiple files supported
        </p>
      </div>

      {/* Selected files */}
      {files.length > 0 && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">
              Selected documents
            </p>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              {files.length}{" "}
              {files.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                  <svg
                    className="h-4 w-4 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20V3.5Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 3.5V8h4"
                    />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Uploading documents...
              </>
            ) : (
              <>
                Upload {files.length}{" "}
                {files.length === 1 ? "document" : "documents"}
                <span>→</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold">
            ✓
          </span>
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold">
            !
          </span>
          {error}
        </div>
      )}
    </div>
  );
}
