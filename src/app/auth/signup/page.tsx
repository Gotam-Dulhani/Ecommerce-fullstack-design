"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) { setError("Full name is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError("Enter a valid email."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setSubmitting(true);
    try { await signUp(email.trim(), password, fullName); router.push("/auth/verify"); }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to sign up."); }
    finally { setSubmitting(false); }
  };

  const inputClass = "w-full rounded-xl border border-[var(--gray-200)] bg-white px-4 py-3.5 text-[15px] text-[var(--gray-900)] placeholder:text-[var(--gray-300)] focus:border-[var(--gray-900)] focus:outline-none transition-colors";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--off-white)] px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="text-center">
          <Link href="/" className="text-[26px] font-black tracking-[-0.03em] text-[var(--gray-900)]">
            SHOPNEST<span className="text-[var(--amber)]">.</span>
          </Link>
        </div>
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] text-[var(--gray-900)]">Create account</h1>
          <p className="mt-2 text-[15px] text-[var(--gray-400)]">Join ShopNest and start shopping.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Full name</label>
            <input type="text" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Email</label>
            <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Password</label>
            <input type="password" required minLength={8} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--gray-600)]">Confirm password</label>
            <input type="password" required minLength={8} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
            {confirmPassword.length > 0 && (
              <p className={`mt-2 text-[12px] font-medium ${password === confirmPassword ? "text-[var(--green)]" : "text-[var(--red)]"}`}>
                {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
              </p>
            )}
          </div>
          {error && <p className="rounded-xl bg-[var(--red-light)] px-4 py-3 text-[13px] text-[var(--red)]">{error}</p>}
          <button type="submit" disabled={submitting}
            className="w-full rounded-full bg-[var(--gray-900)] py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-white hover:bg-[var(--gray-700)] transition-colors disabled:opacity-50">
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-center text-[14px] text-[var(--gray-400)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[var(--gray-900)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
