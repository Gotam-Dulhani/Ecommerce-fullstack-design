import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "SET (starts with " + process.env.NEXT_PUBLIC_FIREBASE_API_KEY.slice(0, 6) + "...)" : "MISSING",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "SET" : "MISSING",
    databaseUrl: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? "SET" : "MISSING",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "SET" : "MISSING",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "SET" : "MISSING",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "SET" : "MISSING",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "SET" : "MISSING",
  });
}
