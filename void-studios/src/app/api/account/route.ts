import { ok, fail, withAuth, z } from "@/lib/api";
import { updateAccountSchema } from "@/lib/validation";
import { updateUser, deleteAllUserData } from "@/lib/db";
import { getAdminAuth } from "@/lib/firebase/admin";
import { logActivity } from "@/lib/audit";
import { SESSION_COOKIE } from "@/lib/config";

export const runtime = "nodejs";

type Body = z.infer<typeof updateAccountSchema>;

export const PATCH = withAuth<Body>(
  async ({ user, body }) => {
    const updated = await updateUser(user.uid, body);
    if (!updated) return fail("User not found", 404);
    await logActivity(user.uid, "account.update");
    return ok(updated);
  },
  { schema: updateAccountSchema, rateLimit: { limit: 30, windowMs: 60_000 } }
);

export const DELETE = withAuth(async ({ user }) => {
  await deleteAllUserData(user.uid);

  // Best-effort removal from Firebase Auth when the Admin SDK is available.
  const adminAuth = getAdminAuth();
  if (adminAuth) {
    try {
      await adminAuth.deleteUser(user.uid);
    } catch (e) {
      console.error("[account] failed to delete firebase auth user", e);
    }
  }

  await logActivity(user.uid, "account.delete");
  const res = ok({ deleted: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
});
