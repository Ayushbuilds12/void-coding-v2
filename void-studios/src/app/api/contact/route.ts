import { NextRequest } from "next/server";
import { ok, fail, withPublic } from "@/lib/api";
import { contactSchema } from "@/lib/validation";
import { logActivity } from "@/lib/audit";

export const runtime = "nodejs";

export const POST = withPublic(
  async (req: NextRequest) => {
    const raw = await req.json().catch(() => ({}));
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return fail("Validation failed", 422, { issues: parsed.error.flatten() });
    }
    await logActivity("system", "contact.message", {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return ok({ received: true });
  },
  { rateLimit: { limit: 5, windowMs: 60_000 } }
);
