/**
 * Central runtime configuration + feature flags.
 *
 * Every external integration (Firebase, OpenAI, Razorpay) degrades gracefully
 * to a deterministic mock/sandbox mode when its credentials are absent, so the
 * app is fully runnable in development before secrets are wired in.
 */

function readServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  try {
    // Support both raw JSON and base64-encoded JSON.
    const jsonStr = raw.trim().startsWith("{")
      ? raw
      : Buffer.from(raw, "base64").toString("utf-8");
    return JSON.parse(jsonStr) as Record<string, unknown>;
  } catch {
    console.warn("[config] FIREBASE_SERVICE_ACCOUNT is set but could not be parsed as JSON.");
    return null;
  }
}

const serviceAccount = readServiceAccount();

export const serverConfig = {
  firebase: {
    serviceAccount,
    projectId:
      (serviceAccount?.project_id as string | undefined) ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      undefined,
    /** When false, Firestore/Auth fall back to a local JSON datastore. */
    adminEnabled: Boolean(serviceAccount),
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    enabled: Boolean(process.env.OPENAI_API_KEY),
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    enabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  },
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export { SESSION_COOKIE, CSRF_COOKIE } from "@/lib/constants";
