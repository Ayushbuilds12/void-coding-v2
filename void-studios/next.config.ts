import type { NextConfig } from "next";
import path from "path";

/**
 * Firebase web (client) config.
 *
 * Source order:
 *  1. FIREBASE_WEBAPP_CONFIG env var (JSON blob provided as a secret)
 *  2. Existing project config committed to the repo (dev default)
 *
 * The resolved values are exposed to the browser as NEXT_PUBLIC_FIREBASE_*.
 */
const DEFAULT_WEBAPP_CONFIG = {
  apiKey: "AIzaSyC_0DqctqukHGEnSRrR7PJsBAQug4rzW_k",
  authDomain: "trusty-client-c5jvd.firebaseapp.com",
  projectId: "trusty-client-c5jvd",
  storageBucket: "trusty-client-c5jvd.firebasestorage.app",
  messagingSenderId: "162969967161",
  appId: "1:162969967161:web:f5f3d6a614388cfc300be8",
  measurementId: "",
};

function resolveWebappConfig(): Record<string, string> {
  const raw = process.env.FIREBASE_WEBAPP_CONFIG?.trim();
  if (raw) {
    try {
      const json = raw.startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf-8");
      const parsed = JSON.parse(json);
      return { ...DEFAULT_WEBAPP_CONFIG, ...parsed };
    } catch {
      console.warn("[next.config] FIREBASE_WEBAPP_CONFIG could not be parsed; using default config.");
    }
  }
  return DEFAULT_WEBAPP_CONFIG;
}

const fb = resolveWebappConfig();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: fb.apiKey || "",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: fb.authDomain || "",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: fb.projectId || "",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: fb.storageBucket || "",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: fb.messagingSenderId || "",
    NEXT_PUBLIC_FIREBASE_APP_ID: fb.appId || "",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  eslint: {
    // Lint is run explicitly in CI via `npm run lint`.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
