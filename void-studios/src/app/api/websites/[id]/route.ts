import { ok, fail, withAuth, z } from "@/lib/api";
import { getWebsite, updateWebsiteContent } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import type { WebsiteContent } from "@/lib/types";

export const runtime = "nodejs";

const patchSchema = z.object({ content: z.record(z.string(), z.unknown()) });
type Body = z.infer<typeof patchSchema>;

export const GET = withAuth(async ({ user, params }) => {
  const website = await getWebsite(user.uid, params.id);
  if (!website) return fail("Website not found", 404);
  return ok(website);
});

export const PATCH = withAuth<Body>(
  async ({ user, body, params }) => {
    const updated = await updateWebsiteContent(
      user.uid,
      params.id,
      body.content as unknown as WebsiteContent
    );
    if (!updated) return fail("Website not found", 404);
    await logActivity(user.uid, "website.update", { websiteId: params.id });
    return ok(updated);
  },
  { schema: patchSchema, rateLimit: { limit: 60, windowMs: 60_000 } }
);
