import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { getAdminAuth } from "@/lib/firebase/admin";
import { serverConfig } from "@/lib/config";

export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  picture?: string;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    // Deterministic dev-only fallback so local sessions survive reloads.
    "void-studios-dev-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

/** Decode a JWT payload without verifying its signature (dev/mock mode only). */
function decodeUnverified(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Verify a Firebase ID token and return the authenticated user.
 * Uses the Admin SDK when available; otherwise falls back to an unverified
 * decode for local development (clearly gated behind the missing-admin flag).
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<SessionUser | null> {
  const adminAuth = getAdminAuth();
  if (adminAuth) {
    try {
      const decoded = await adminAuth.verifyIdToken(idToken, true);
      return {
        uid: decoded.uid,
        email: decoded.email || "",
        name: decoded.name || decoded.email?.split("@")[0] || "User",
        picture: decoded.picture,
      };
    } catch (e) {
      console.error("[auth] verifyIdToken failed", e);
      return null;
    }
  }

  if (!serverConfig.firebase.adminEnabled) {
    const payload = decodeUnverified(idToken);
    if (!payload) return null;
    const uid = (payload.user_id || payload.sub || payload.uid) as string | undefined;
    if (!uid) return null;
    return {
      uid,
      email: (payload.email as string) || "",
      name:
        (payload.name as string) ||
        (payload.email as string)?.split("@")[0] ||
        "User",
      picture: payload.picture as string | undefined,
    };
  }

  return null;
}

/** Create a signed, HttpOnly session token for the given user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecret());
}

/** Verify our own session token. */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      uid: payload.uid as string,
      email: payload.email as string,
      name: payload.name as string,
      picture: payload.picture as string | undefined,
    };
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
