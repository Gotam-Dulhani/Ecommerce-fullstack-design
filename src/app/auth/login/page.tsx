"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--off-white)] px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-[26px] font-black tracking-[-0.03em] text-[var(--gray-900)]">
            SHOPNEST<span className="text-[var(--amber)]">.</span>
          </Link>
        </div>
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[var(--gray-900)]">Welcome back</h1>
          <p className="mt-2 text-[15px] text-[var(--gray-400)]">Sign in to your account to continue.</p>
        </div>
        {verifyNotice && (
          <div className="rounded-xl border border-[var(--green-light)] bg-[var(--green-light)] px-4 py-3 text-[13px] text-[var(--green)]">
            Check your inbox for a verification email. After verifying, sign in here.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Email</label>
            <input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--gray-200)] bg-white px-4 py-3.5 text-[15px] text-[var(--gray-900)] placeholder:text-[var(--gray-300)] focus:border-[var(--gray-900)] focus:outline-none transition-colors" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Password</label>
            <input id="password" type="password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--gray-200)] bg-white px-4 py-3.5 text-[15px] text-[var(--gray-900)] placeholder:text-[var(--gray-300)] focus:border-[var(--gray-900)] focus:outline-none transition-colors" />
          </div>
          {error && <p className="rounded-xl bg-[var(--red-light)] px-4 py-3 text-[13px] text-[var(--red)]">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full rounded-full bg-[var(--gray-900)] py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors disabled:opacity-50">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-[14px] text-[var(--gray-400)]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[var(--gray-900)] hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[var(--off-white)]"><div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--gray-200)] border-t-[var(--gray-600)]" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
