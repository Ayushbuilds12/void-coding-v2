import { ok, fail, withAuth } from "@/lib/api";
import { generateBrandSchema } from "@/lib/validation";
import { generateBrand } from "@/lib/ai";
import { getProject, saveBrand } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import type { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = z.infer<typeof generateBrandSchema>;

export const POST = withAuth<Body>(
  async ({ user, body }) => {
    const project = await getProject(user.uid, body.projectId);
    if (!project) return fail("Project not found", 404);

    const content = await generateBrand({
      businessName: body.businessName,
      industry: body.industry,
      targetAudience: body.targetAudience,
    });
    const brand = await saveBrand(user.uid, body.projectId, content);
    await logActivity(user.uid, "generate.brand", { projectId: body.projectId });
    return ok(brand);
  },
  { schema: generateBrandSchema, rateLimit: { limit: 15, windowMs: 60_000 } }
);
