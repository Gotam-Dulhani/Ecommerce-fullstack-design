"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { MailCheck } from "lucide-react";

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-widest text-white uppercase">
            SHOPNEST<span className="text-[var(--gold)]">.</span>
          </Link>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <MailCheck className="h-7 w-7 text-[var(--gold)]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Verify your email</h1>
          <p className="mt-2 text-sm text-zinc-400">We sent a verification link to</p>
          <p className="mt-1 text-sm font-semibold text-white break-all">{user?.email ?? "your email"}</p>
        </div>

        {isVerified ? (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-500">
            Email verified! Your account is ready.
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3 text-xs text-[var(--gold)]">
            Click the link in your email to verify your account.
          </div>
        )}

        {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
        {message && <p className="rounded-lg bg-white/5 px-4 py-3 text-xs text-zinc-400">{message}</p>}

        <div className="space-y-3">
          <button type="button" onClick={handleIveVerified} disabled={submitting}
            className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50">
            {submitting ? "Checking..." : "I've verified — continue"}
          </button>
          <button type="button" onClick={handleResend} disabled={submitting}
            className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors disabled:opacity-50">
            Resend email
          </button>
          <button type="button" onClick={() => { void signOutUser(); router.push("/auth/login"); }} disabled={submitting}
            className="w-full py-3 text-xs font-medium text-zinc-500 hover:text-white transition-colors disabled:opacity-50">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
