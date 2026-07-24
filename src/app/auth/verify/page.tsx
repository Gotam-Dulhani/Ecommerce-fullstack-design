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
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      await resendEmailVerification();
      setMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend.");
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
        setError("Not verified yet. Click the link in your email, then try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check.");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-bold text-gray-900">ShopNest</Link>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-7 w-7 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            We sent a verification link to
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900 break-all">
            {user?.email ?? "your email"}
          </p>
        </div>

        {isVerified ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
            Email verified! Your account is ready.
          </div>
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
            Click the link in your email to verify your account.
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
        )}
        {message && (
          <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600">{message}</p>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleIveVerified}
            disabled={submitting}
            className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Checking..." : "I've verified — continue"}
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={submitting}
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Resend verification email
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={submitting}
            className="w-full py-2.5 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
