import { ok, fail, withAuth } from "@/lib/api";
import { projectUpdateSchema } from "@/lib/validation";
import { getProject, updateProject, deleteProject } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import type { z } from "zod";

export const runtime = "nodejs";

export const GET = withAuth(async ({ user, params }) => {
  const project = await getProject(user.uid, params.id);
  if (!project) return fail("Project not found", 404);
  return ok(project);
});

type ProjectPatch = z.infer<typeof projectUpdateSchema>;

export const PATCH = withAuth<ProjectPatch>(
  async ({ user, body, params }) => {
    const updated = await updateProject(user.uid, params.id, body);
    if (!updated) return fail("Project not found", 404);
    await logActivity(user.uid, "project.update", { projectId: params.id });
    return ok(updated);
  },
  { schema: projectUpdateSchema, rateLimit: { limit: 60, windowMs: 60_000 } }
);

export const DELETE = withAuth(async ({ user, params }) => {
  const deleted = await deleteProject(user.uid, params.id);
  if (!deleted) return fail("Project not found", 404);
  await logActivity(user.uid, "project.delete", { projectId: params.id });
  return ok({ deleted: true });
});
