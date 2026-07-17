import { NextRequest, NextResponse } from "next/server";
import { ok, fail, withPublic } from "@/lib/api";
import { sessionSchema } from "@/lib/validation";
import {
  verifyFirebaseIdToken,
  createSessionToken,
  SESSION_MAX_AGE,
} from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/config";
import { ensureUser } from "@/lib/db";
import { logActivity } from "@/lib/audit";

export const runtime = "nodejs";

export const POST = withPublic(
  async (req: NextRequest) => {
    const raw = await req.json().catch(() => ({}));
    const parsed = sessionSchema.safeParse(raw);
    if (!parsed.success) return fail("Missing or invalid idToken", 422);

    const user = await verifyFirebaseIdToken(parsed.data.idToken);
    if (!user) return fail("Invalid credentials", 401);

    await ensureUser(user);
    const token = await createSessionToken(user);
    await logActivity(user.uid, "auth.login");

    const res = ok({ uid: user.uid, email: user.email, name: user.name });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  },
  { rateLimit: { limit: 20, windowMs: 60_000 } }
);

export async function DELETE(): Promise<NextResponse> {
  const res = ok({ signedOut: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
