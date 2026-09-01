import AppLogo from "./AppLogo";

export default function DashboardWelcome() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">
        <AppLogo size="lg" />

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Start a conversation with your documents
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500">
          Create a new chat from the sidebar, upload your PDF documents,
          and ask questions about them using DocuMind's AI-powered
          retrieval system.
        </p>

        <div className="mx-auto mt-10 grid max-w-lg gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              01 · Create
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Start a new conversation from the sidebar.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              02 · Upload
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Add the PDF documents you want to understand.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-800">
              03 · Ask
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Chat with your documents and find answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}