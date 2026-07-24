"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Mail, Lock } from "lucide-react";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifyNotice = searchParams.get("verify");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn(email.trim(), password);
      router.push(res.requiresEmailVerification ? "/auth/verify" : "/");
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to sign in."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-widest text-white uppercase">
            SHOPNEST<span className="text-[var(--gold)]">.</span>
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to your account to continue.</p>
        </div>
        {verifyNotice && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-500">
            Check your inbox for a verification email. After verifying, sign in here.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input id="password" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[var(--gold)] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--background)]"><div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-[var(--gold)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
