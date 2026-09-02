import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Input from "../components/Input";
import Button from "../components/Button";
import AuthCard from "../components/AuthCard";
import Toast from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          {/* Logo */}
          <Link to="/login" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-md shadow-violet-200/50">
              <svg
                className="h-5 w-5 text-white"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 12h4M10 15h4"
                />
              </svg>
            </div>

            <span className="text-lg font-bold tracking-tight">
              DocuMind
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
            <a
              href="#features"
              className="transition hover:text-slate-900"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="transition hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#why-documind"
              className="transition hover:text-slate-900"
            >
              Why DocuMind
            </a>
          </nav>

          <Link
            to="/register"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <main>
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

          <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[1fr_420px] lg:items-start lg:gap-20 lg:py-24">
            
            {/* ================================================= */}
            {/* LEFT CONTENT */}
            {/* ================================================= */}

            <div className="pt-4 lg:pt-12">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                Intelligent document workspace
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your documents
                <span className="block bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  can think too.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-500">
                Upload your documents, ask questions about them, and
                turn scattered information into answers you can actually
                use.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Start using DocuMind
                </Link>

                <a
                  href="#how-it-works"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  See how it works
                </a>
              </div>

              {/* Mini stats */}
              <div className="mt-12 flex flex-wrap gap-8 border-t border-slate-100 pt-8">
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    AI
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Document intelligence
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    RAG
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Context-aware answers
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    24/7
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Your knowledge, available
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* LOGIN */}
            {/* ================================================= */}

            <div className="lg:sticky lg:top-24">
              <AuthCard>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Sign in to continue to DocuMind.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <Toast
                        message={error}
                        onClose={() => setError("")}
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    loading={loading}
                    loadingText="Logging in..."
                  >
                    Sign in
                  </Button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />

                  <span className="text-xs text-slate-400">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {googleLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.4Z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.5c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.5Z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.09.31-1.58V7.9H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.1l3.24-2.52Z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.39c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.48 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.7 5.4l3.24 2.52C7.31 8.11 9.46 6.39 12 6.39Z"
                      />
                    </svg>
                  )}

                  {googleLoading
                    ? "Signing in..."
                    : "Continue with Google"}
                </button>

                <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-violet-600 transition hover:text-violet-700"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </AuthCard>

              <p className="mt-4 text-center text-xs text-slate-400">
                Your documents stay yours.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURES */}
        {/* ========================================================= */}

        <section
          id="features"
          className="border-t border-slate-100 bg-slate-50/60"
        >
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-violet-600">
                Everything in one place
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Stop searching through documents.
              </h2>

              <p className="mt-4 leading-7 text-slate-500">
                DocuMind turns your documents into a searchable,
                conversational knowledge base.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              
              {/* Feature 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <svg
                    className="h-5 w-5"
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

                <h3 className="mt-6 text-lg font-semibold">
                  Upload documents
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Add your PDFs and documents and let DocuMind
                  process the information inside them.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg
                    className="h-5 w-5"
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
                      d="M20 11.5a8 8 0 0 1-8 8c-1.3 0-2.53-.31-3.62-.86L4 20l1.36-4.37A7.96 7.96 0 0 1 4 11.5a8 8 0 0 1 16 0Z"
                    />
                  </svg>
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Ask questions
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Ask questions in natural language instead of
                  manually searching through pages of content.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v18M3 12h18"
                    />
                    <circle cx="12" cy="12" r="8.5" />
                  </svg>
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Get intelligent answers
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Retrieve the relevant information from your
                  documents and get context-aware answers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS */}
        {/* ========================================================= */}

        <section id="how-it-works" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="text-center">
              <p className="text-sm font-semibold text-violet-600">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From document to answer in three steps.
              </h2>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-3">
              
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                  01
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Upload
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Upload the documents you want DocuMind to
                  understand.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                  02
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Ask
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Ask questions naturally, just like you would
                  talk to someone who read the documents.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                  03
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Understand
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Get answers grounded in the information
                  contained in your documents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* WHY DOCUMIND */}
        {/* ========================================================= */}

        <section
          id="why-documind"
          className="border-y border-slate-100 bg-slate-50/60"
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
            
            <div>
              <p className="text-sm font-semibold text-violet-600">
                Your intelligent workspace
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Knowledge shouldn't be trapped inside PDFs.
              </h2>

              <p className="mt-6 max-w-xl leading-7 text-slate-500">
                Whether you're working with research papers,
                reports, notes, manuals, or other documents,
                DocuMind gives you a way to interact with the
                information instead of simply storing it.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-2xl font-bold">01</p>
                <p className="mt-4 font-semibold">
                  Context-aware
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Answers are based on the information in your
                  uploaded documents.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-2xl font-bold">02</p>
                <p className="mt-4 font-semibold">
                  Conversational
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Continue asking questions instead of starting
                  from scratch every time.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-2xl font-bold">03</p>
                <p className="mt-4 font-semibold">
                  Organized
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep your document conversations organized
                  into separate sessions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-2xl font-bold">04</p>
                <p className="mt-4 font-semibold">
                  Accessible
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your knowledge becomes something you can
                  interact with whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CTA */}
        {/* ========================================================= */}

        <section className="relative overflow-hidden bg-slate-950">
          <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Your documents.
              <br />
              Your knowledge.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-slate-400">
              Start building your own intelligent document
              workspace with DocuMind.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="bg-slate-950 px-6 pb-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 DocuMind</p>

          <p>
            Your documents. Your knowledge. One intelligent
            workspace.
          </p>
        </div>
      </footer>
    </div>
  );
}