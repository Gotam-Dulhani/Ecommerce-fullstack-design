import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDwh5r_hT4WXXBMJX0LEh9LBcp9iXbvEAE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ecommerce-fullstack-desi-8d555.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://ecommerce-fullstack-desi-8d555-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ecommerce-fullstack-desi-8d555",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ecommerce-fullstack-desi-8d555.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "495299703892",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:495299703892:web:86db118bbd8108f5dc29c1",
};

export function isFirebaseConfigured(): boolean {
  return !!FIREBASE_CONFIG.apiKey;
}

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Database | null = null;

function getApp(): FirebaseApp {
  if (_app) return _app;

  if (!FIREBASE_CONFIG.apiKey) {
    throw new Error(
      "Firebase is not configured. Add your Firebase environment variables to .env.local (local) or Vercel Settings → Environment Variables (production), then redeploy.",
    );
  }

  const config = {
    apiKey: FIREBASE_CONFIG.apiKey,
    authDomain: FIREBASE_CONFIG.authDomain,
    databaseURL: FIREBASE_CONFIG.databaseURL,
    projectId: FIREBASE_CONFIG.projectId,
    storageBucket: FIREBASE_CONFIG.storageBucket,
    messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
    appId: FIREBASE_CONFIG.appId,
  };

  if (!getApps().length) {
    _app = initializeApp(config);
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
