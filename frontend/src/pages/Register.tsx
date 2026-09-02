import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Input from "../components/Input";
import Button from "../components/Button";
import AuthCard from "../components/AuthCard";
import Toast from "../components/Toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Registration successful. Check your email to verify your account."
      );
    }

    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-12 text-slate-900">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-200/50 transition hover:scale-105">
              <svg
                className="h-6 w-6 text-white"
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
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start turning your documents into knowledge.
          </p>
        </div>

        {/* Register Card */}
        <AuthCard>
          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <p className="mt-2 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <Toast
                  message={error}
                  onClose={() => setError("")}
                />
              </div>
            )}

            {/* Success */}
            {message && (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4"
                  />

                  <circle cx="12" cy="12" r="9" />
                </svg>

                <span>{message}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              loadingText="Creating account..."
            >
              Create account
            </Button>
          </form>

          {/* Login */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-600 transition hover:text-violet-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </AuthCard>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 transition hover:text-slate-600"
          >
            ← Back to DocuMind
          </Link>
        </div>
      </div>
    </div>
  );
}