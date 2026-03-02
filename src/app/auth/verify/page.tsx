"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function VerifyEmailPage() {
  const { user, resendEmailVerification, refreshUser, signOutUser } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await resendEmailVerification();
      setMessage("Verification email sent. Check your inbox (and spam).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIveVerified = async () => {
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) {
        router.push("/");
      } else {
        setError("Not verified yet. Please click the link in your email, then try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh verification status.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/auth/login");
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-up rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-lg shadow-slate-900/10 md:p-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
          Verify your email
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          We sent a verification link to{" "}
          <span className="font-semibold text-slate-900">
            {user?.email ?? "your email"}
          </span>
          .
        </p>

        {user?.emailVerified ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            Your email is verified. You can continue.
          </p>
        ) : (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Your email is not verified yet.
          </p>
        )}

        {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
        {message && <p className="mt-3 text-xs text-emerald-600">{message}</p>}

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleIveVerified}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-slate-900/30 hover:bg-slate-800 disabled:opacity-60"
          >
            I&apos;ve verified — continue
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
          >
            Resend verification email
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}


