"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { MailCheck, RefreshCw, LogOut, ArrowRight, Shield } from "lucide-react";

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
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-[var(--gold)]/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/3 h-80 w-80 rounded-full bg-emerald-500/5 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px] animate-[pulse_7s_ease-in-out_infinite_2s] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 text-center px-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
            <Shield className="h-9 w-9 text-[var(--gold)]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">Verify your email</h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            One last step to secure your account and start shopping.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 bg-[var(--background)]">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="lg:hidden text-center">
            <Link href="/" className="text-2xl font-black tracking-widest text-white uppercase">
              SHOPNEST<span className="text-[var(--gold)]">.</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <div className="mx-auto lg:mx-0 mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <MailCheck className="h-7 w-7 text-[var(--gold)]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Check your inbox</h1>
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
              className="group w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? "Checking..." : <>I&apos;ve verified — continue <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>}
            </button>
            <button type="button" onClick={handleResend} disabled={submitting}
              className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${submitting ? "animate-spin" : ""}`} /> Resend email
            </button>
            <button type="button" onClick={() => { void signOutUser(); router.push("/auth/login"); }} disabled={submitting}
              className="w-full py-3 text-xs font-medium text-zinc-500 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
