"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_60%_30%,rgba(34,197,94,0.4),transparent_50%),radial-gradient(circle_at_20%_70%,rgba(99,102,241,0.5),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.3),transparent_50%)] animate-gradient-shift" />
      <div className="absolute left-[20%] top-[20%] h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl animate-float-orb" />
      <div className="absolute right-[10%] top-[55%] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-float-orb-alt" />
      <div className="absolute left-[55%] bottom-[15%] h-56 w-56 rounded-full bg-sky-400/15 blur-3xl animate-float-orb-slow" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:60px_60px]" />
    </div>
  );
}

function MailCheckIcon() {
  return (
    <svg className="mx-auto h-16 w-16 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

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

  const isVerified = user?.emailVerified;

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <AuthBackground />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sm font-extrabold text-white backdrop-blur-sm">
              SN
            </span>
            <span className="text-lg font-bold text-white">ShopNest</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-extrabold leading-snug text-white xl:text-4xl">
            One last step
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              to get started
            </span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-slate-300">
            We&apos;ve sent a verification link to your email. Click it to activate your account and unlock the full ShopNest experience.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { step: "1", label: "Check inbox" },
              { step: "2", label: "Click link" },
              { step: "3", label: "Start shopping" },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">{s.step}</span>
                <p className="mt-1.5 text-xs text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
              SN
            </span>
            <span className="text-lg font-bold text-slate-900">ShopNest</span>
          </Link>

          <div className="text-center lg:text-left">
            <MailCheckIcon />
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              We sent a verification link to
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900 break-all">
              {user?.email ?? "your email"}
            </p>
          </div>

          {isVerified ? (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <div>
                <p className="text-xs font-semibold text-emerald-800">Email verified!</p>
                <p className="mt-0.5 text-xs text-emerald-700">Your account is ready. You can continue.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              <div>
                <p className="text-xs font-semibold text-amber-800">Waiting for verification</p>
                <p className="mt-0.5 text-xs text-amber-700">Click the link in your email to verify your account.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          )}

          {message && (
            <div className="flex items-start gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <p className="text-xs text-indigo-700">{message}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleIveVerified}
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Checking...
                </span>
              ) : (
                "I've verified — continue"
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              Resend verification email
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={submitting}
              className="w-full rounded-xl py-3 text-sm font-semibold text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
