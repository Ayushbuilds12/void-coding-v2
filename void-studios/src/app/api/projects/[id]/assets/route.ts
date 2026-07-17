import { ok, fail, withAuth } from "@/lib/api";
import {
  getProject,
  getWebsiteByProject,
  getAdsByProject,
  getBrandByProject,
} from "@/lib/db";

export const runtime = "nodejs";

export const GET = withAuth(async ({ user, params }) => {
  const project = await getProject(user.uid, params.id);
  if (!project) return fail("Project not found", 404);

  const [website, ads, brand] = await Promise.all([
    getWebsiteByProject(user.uid, params.id),
    getAdsByProject(user.uid, params.id),
    getBrandByProject(user.uid, params.id),
  ]);

  return ok({ project, website, ads, brand });
});
