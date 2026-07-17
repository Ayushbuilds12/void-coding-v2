import { ok, fail, withAuth } from "@/lib/api";
import { generateAdsSchema } from "@/lib/validation";
import { generateAds } from "@/lib/ai";
import { getProject, saveAds } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import type { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = z.infer<typeof generateAdsSchema>;

export const POST = withAuth<Body>(
  async ({ user, body }) => {
    const project = await getProject(user.uid, body.projectId);
    if (!project) return fail("Project not found", 404);

    const ads = await generateAds({
      businessName: body.businessName,
      industry: body.industry,
      goal: body.goal,
      targetAudience: body.targetAudience,
      platforms: body.platforms,
    });
    const campaign = await saveAds(user.uid, body.projectId, ads);
    await logActivity(user.uid, "generate.ads", { projectId: body.projectId });
    return ok(campaign);
  },
  { schema: generateAdsSchema, rateLimit: { limit: 15, windowMs: 60_000 } }
);
