import "server-only";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/config";
import { verifySessionToken, type SessionUser } from "@/lib/auth/session";

/** Read the current user from the session cookie inside a Server Component. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Read the current user from a Route Handler request. */
export async function getUserFromRequest(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
