import { ok, fail, withAuth } from "@/lib/api";
import { generateWebsiteSchema } from "@/lib/validation";
import { generateWebsite } from "@/lib/ai";
import { getProject, saveWebsite } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import type { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = z.infer<typeof generateWebsiteSchema>;

export const POST = withAuth<Body>(
  async ({ user, body }) => {
    const project = await getProject(user.uid, body.projectId);
    if (!project) return fail("Project not found", 404);

    const content = await generateWebsite({
      businessName: body.businessName,
      industry: body.industry,
      targetAudience: body.targetAudience,
    });
    const website = await saveWebsite(user.uid, body.projectId, content);
    await logActivity(user.uid, "generate.website", { projectId: body.projectId });
    return ok(website);
  },
  { schema: generateWebsiteSchema, rateLimit: { limit: 15, windowMs: 60_000 } }
);
