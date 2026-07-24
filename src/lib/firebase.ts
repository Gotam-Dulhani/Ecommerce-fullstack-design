import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

function requiredPublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Add it to .env.local (and to Vercel env vars when deploying).`,
    );
  }
  return value;
}

function normalizeDatabaseUrl(input: string): string {
  const trimmed = input.trim();
  const withScheme =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    const normalized = url.origin;
    if (normalized !== trimmed && normalized !== withScheme) {
      console.warn(
        `[firebase] Normalized NEXT_PUBLIC_FIREBASE_DATABASE_URL from "${trimmed}" to "${normalized}" (must be root URL).`,
      );
    }
    return normalized;
  } catch {
    return trimmed;
  }
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Database | null = null;

function getApp(): FirebaseApp {
  if (_app) return _app;

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

  if (!getApps().length) {
    _app = initializeApp(firebaseConfig);
  } else {
    _app = getApps()[0]!;
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

export function getFirebaseDb(): Database {
  if (!_db) _db = getDatabase(getApp());
  return _db;
}
