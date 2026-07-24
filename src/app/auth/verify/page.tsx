"use client";

import Link from "next/link";
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
    setError(null); setMessage(null); setSubmitting(true);
    try { await resendEmailVerification(); setMessage("Verification email sent. Check your inbox."); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to resend."); }
    finally { setSubmitting(false); }
  };

  const handleIveVerified = async () => {
    setError(null); setMessage(null); setSubmitting(true);
    try {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) router.push("/");
      else setError("Not verified yet. Click the link in your email, then try again.");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed."); }
    finally { setSubmitting(false); }
  };

  const isVerified = user?.emailVerified;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--off-white)] px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-[26px] font-black tracking-[-0.03em] text-[var(--gray-900)]">
            SHOPNEST<span className="text-[var(--amber)]">.</span>
          </Link>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gray-100)]">
            <svg className="h-7 w-7 text-[var(--gray-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--gray-900)]">Verify your email</h1>
          <p className="mt-2 text-[14px] text-[var(--gray-400)]">We sent a verification link to</p>
          <p className="mt-1 text-[14px] font-semibold text-[var(--gray-900)] break-all">{user?.email ?? "your email"}</p>
        </div>

        {isVerified ? (
          <div className="rounded-xl border border-[var(--green-light)] bg-[var(--green-light)] px-4 py-3 text-[13px] text-[var(--green)]">
            Email verified! Your account is ready.
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
            Click the link in your email to verify your account.
          </div>
        )}

        {error && <p className="rounded-xl bg-[var(--red-light)] px-4 py-3 text-[13px] text-[var(--red)]">{error}</p>}
        {message && <p className="rounded-xl bg-[var(--gray-50)] px-4 py-3 text-[13px] text-[var(--gray-600)]">{message}</p>}

        <div className="space-y-3">
          <button type="button" onClick={handleIveVerified} disabled={submitting}
            className="w-full rounded-full bg-[var(--gray-900)] py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors disabled:opacity-50">
            {submitting ? "Checking..." : "I've verified — continue"}
          </button>
          <button type="button" onClick={handleResend} disabled={submitting}
            className="w-full rounded-full border border-[var(--gray-200)] bg-white py-3.5 text-[13px] font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)] transition-colors disabled:opacity-50">
            Resend email
          </button>
          <button type="button" onClick={() => { void signOutUser(); router.push("/auth/login"); }} disabled={submitting}
            className="w-full py-3 text-[13px] font-medium text-[var(--gray-400)] hover:text-[var(--gray-700)] transition-colors disabled:opacity-50">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
