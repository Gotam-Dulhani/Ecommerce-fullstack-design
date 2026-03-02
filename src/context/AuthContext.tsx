"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ requiresEmailVerification: boolean }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ requiresEmailVerification: boolean }>;
  resendEmailVerification: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  signOutUser: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ requiresEmailVerification: boolean }> => {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      if (!cred.user.emailVerified) {
        // Do NOT sign the user out here — keep them signed in and route them to a verify screen.
        // Only send verification emails on explicit user action to avoid rate limits.
        return { requiresEmailVerification: true };
      }
      return { requiresEmailVerification: false };
    } catch (err) {
      throw new Error(getFirebaseAuthErrorMessage(err, "signIn"));
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<{ requiresEmailVerification: boolean }> => {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (displayName?.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      // Send email verification so only real inboxes can complete signup.
      await sendEmailVerification(cred.user);
      return { requiresEmailVerification: true };
    } catch (err) {
      throw new Error(getFirebaseAuthErrorMessage(err, "signUp"));
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    if (!firebaseAuth.currentUser) return null;
    await reload(firebaseAuth.currentUser);
    // Ensure the ID token is refreshed so RTDB rules see updated claims
    // like auth.token.email_verified after the user verifies their email.
    await firebaseAuth.currentUser.getIdToken(true);
    // reload() doesn't trigger onAuthStateChanged; update state manually.
    setUser(firebaseAuth.currentUser);
    return firebaseAuth.currentUser;
  };

  const resendEmailVerification = async () => {
    const current = firebaseAuth.currentUser;
    if (!current) {
      throw new Error("Please sign in first, then resend the verification email.");
    }
    if (current.emailVerified) {
      return;
    }

    // Simple cooldown to avoid auth/too-many-requests
    const key = `verifyEmail:lastSentAt:${current.uid}`;
    const lastSentAt = Number(localStorage.getItem(key) ?? "0");
    const now = Date.now();
    const cooldownMs = 60_000; // 1 minute
    const remainingMs = cooldownMs - (now - lastSentAt);
    if (remainingMs > 0) {
      const seconds = Math.ceil(remainingMs / 1000);
      throw new Error(`Please wait ${seconds}s before resending the verification email.`);
    }

    await sendEmailVerification(current);
    localStorage.setItem(key, String(now));
  };

  const signOutUser = async () => {
    await signOut(firebaseAuth);
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin =
    !!user && !!adminEmail && user.email === adminEmail && user.emailVerified;

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signUp,
    resendEmailVerification,
    refreshUser,
    signOutUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function getFirebaseAuthErrorMessage(
  err: unknown,
  action: "signIn" | "signUp",
): string {
  // Firebase auth errors typically look like:
  // { code: "auth/email-already-in-use", message: "...", ... }
  const code =
    typeof err === "object" && err && "code" in err ? String((err as any).code) : "";

  if (code === "auth/operation-not-allowed") {
    return 'Email/Password sign-in is disabled in Firebase. Enable it in Firebase Console → Authentication → Sign-in method → "Email/Password".';
  }
  if (code === "auth/email-already-in-use") {
    return "That email is already in use. Try signing in instead.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Use at least 8 characters.";
  }
  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "Incorrect email or password.";
  }
  if (code === "auth/user-not-found") {
    return "No account found with that email.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please wait a bit and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Check your internet connection and try again.";
  }
  if (code === "auth/configuration-not-found") {
    return (
      "Firebase Auth isn’t fully configured for this web app. In Firebase Console: " +
      'Authentication → Sign-in method: enable "Email/Password"; ' +
      "Authentication → Settings → Authorized domains: ensure localhost is added; " +
      "Project settings → General → Your apps: confirm you’re using the config from the same Web app."
    );
  }

  // If we threw our own Error (e.g. email not verified), keep that message.
  if (err instanceof Error && err.message) return err.message;

  return action === "signUp"
    ? "Failed to sign up. Please try again."
    : "Failed to sign in. Please try again.";
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}


