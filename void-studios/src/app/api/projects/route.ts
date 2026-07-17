import { ok, withAuth } from "@/lib/api";
import { projectSchema, type ProjectInput } from "@/lib/validation";
import { listProjects, createProject } from "@/lib/db";
import { logActivity } from "@/lib/audit";

export const runtime = "nodejs";

export const GET = withAuth(async ({ user }) => {
  const projects = await listProjects(user.uid);
  return ok(projects);
});

export const POST = withAuth<ProjectInput>(
  async ({ user, body }) => {
    const project = await createProject(user.uid, body);
    await logActivity(user.uid, "project.create", { projectId: project.id });
    return ok(project, 201);
  },
  { schema: projectSchema, rateLimit: { limit: 30, windowMs: 60_000 } }
);
