import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

// NOTE:
// For NEXT_PUBLIC_* variables that are used on the client, Next.js replaces
// direct references like process.env.NEXT_PUBLIC_X at build time.
// Dynamic access (process.env[name]) does NOT work in the browser bundle.
// So we read each env var explicitly and validate it.

function requiredPublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local (and to Vercel env vars when deploying).`,
    );
  }
  return value;
}

function normalizeDatabaseUrl(input: string): string {
  // Firebase RTDB URL MUST point to the root, e.g.:
  // https://your-project-id-default-rtdb.firebaseio.com
  // (no trailing /products or other child paths)
  const trimmed = input.trim();
  const withScheme =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    const normalized = url.origin; // strips any /child/path, query, hash
    if (normalized !== trimmed && normalized !== withScheme) {
      console.warn(
        `[firebase] Normalized NEXT_PUBLIC_FIREBASE_DATABASE_URL from "${trimmed}" to "${normalized}" (must be root URL).`,
      );
    }
    return normalized;
  } catch {
    // If it's not a valid URL, return as-is and let Firebase throw a more specific error.
    return trimmed;
  }
}

// IMPORTANT:
// Replace the placeholder environment variables in your .env.local file
// with your actual Firebase project configuration values.
// Example:
// NEXT_PUBLIC_FIREBASE_API_KEY=...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
// NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
// NEXT_PUBLIC_FIREBASE_APP_ID=...

const firebaseConfig = {
  apiKey: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  ),
  authDomain: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  ),
  databaseURL: normalizeDatabaseUrl(
    requiredPublicEnv(
      "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    ),
  ),
  projectId: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ),
  storageBucket: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  ),
  messagingSenderId: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  ),
  appId: requiredPublicEnv(
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ),
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]!;
}

export const firebaseApp = app;
export const firebaseAuth: Auth = getAuth(app);

// Lazy-init to avoid crashing builds / prerenders for routes that don't use the DB.
let _db: Database | null = null;
export function getFirebaseDb(): Database {
  if (!_db) _db = getDatabase(app);
  return _db;
}


