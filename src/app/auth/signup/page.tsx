"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors";

  return (
    <div className="flex min-h-screen">
      {/* Left — Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[var(--gold)]/8 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/3 h-80 w-80 rounded-full bg-[var(--gold)]/5 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute top-2/3 left-1/2 h-72 w-72 rounded-full bg-amber-600/5 blur-[90px] animate-[pulse_7s_ease-in-out_infinite_2s]" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 text-center px-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20">
            <Sparkles className="h-9 w-9 text-[var(--gold)]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">Join ShopNest</h2>
          <p className="mt-3 text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Create your account and unlock access to 148+ premium products across 8 curated categories.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free shipping over Rs. 5,000
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              14-day returns
            </div>
          </div>
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

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Create account</h1>
            <p className="mt-2 text-sm text-zinc-400">Join ShopNest and start shopping.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input type="text" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-[var(--gold)]/50 focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input type={showPassword ? "text" : "password"} required minLength={8} placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input type={showConfirm ? "text" : "password"} required minLength={8} placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`mt-2 text-xs font-medium ${password === confirmPassword ? "text-emerald-500" : "text-red-500"}`}>
                  {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
                </p>
              )}
            </div>
            {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={submitting}
              className="group w-full rounded-full bg-[var(--gold)] py-3.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[var(--gold-dim)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting ? "Creating..." : <>Create account <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-[var(--gold)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
