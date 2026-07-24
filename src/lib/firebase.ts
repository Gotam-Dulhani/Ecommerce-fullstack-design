import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

function readEnv(name: string): string {
  return process.env[name] ?? "";
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

export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Database | null = null;

function getApp(): FirebaseApp {
  if (_app) return _app;

  const firebaseConfig = {
    apiKey: readEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    databaseURL: normalizeDatabaseUrl(readEnv("NEXT_PUBLIC_FIREBASE_DATABASE_URL")),
    projectId: readEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };

  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Firebase is not configured. Add your Firebase environment variables to .env.local (local) or Vercel Settings → Environment Variables (production), then redeploy.",
    );
  }

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
