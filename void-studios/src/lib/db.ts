import "server-only";
import { getStore } from "@/lib/store";
import { shortId } from "@/lib/utils";
import type {
  AdCampaign,
  AdCreative,
  Brand,
  BrandContent,
  Invoice,
  Payment,
  PlanId,
  Project,
  Subscription,
  UserRecord,
  Website,
  WebsiteContent,
} from "@/lib/types";
import type { SessionUser } from "@/lib/auth/session";
import type { ProjectInput } from "@/lib/validation";

const store = () => getStore();
const now = () => new Date().toISOString();

/* --------------------------------- Users ---------------------------------- */

export async function ensureUser(user: SessionUser): Promise<UserRecord> {
  const existing = await store().get<UserRecord>("users", user.uid);
  if (existing) return existing;
  const record: UserRecord = {
    id: user.uid,
    email: user.email,
    name: user.name,
    photoURL: user.picture,
    createdAt: now(),
    updatedAt: now(),
  };
  await store().create("users", record);
  // Bootstrap a free subscription.
  await upsertSubscription(user.uid, "free", "active");
  return record;
}

export async function getUser(uid: string): Promise<UserRecord | null> {
  return store().get<UserRecord>("users", uid);
}

export async function updateUser(uid: string, patch: Partial<UserRecord>): Promise<UserRecord | null> {
  return store().update<UserRecord>("users", uid, { ...patch, updatedAt: now() });
}

/* -------------------------------- Projects -------------------------------- */

export async function listProjects(userId: string): Promise<Project[]> {
  const projects = await store().query<Project>("projects", [{ field: "userId", value: userId }]);
  return projects.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getProject(userId: string, id: string): Promise<Project | null> {
  const p = await store().get<Project>("projects", id);
  if (!p || p.userId !== userId) return null;
  return p;
}

export async function createProject(userId: string, input: ProjectInput): Promise<Project> {
  const project: Project = {
    id: shortId("proj"),
    userId,
    businessName: input.businessName,
    industry: input.industry,
    goal: input.goal,
    budget: input.budget,
    targetAudience: input.targetAudience,
    createdAt: now(),
    updatedAt: now(),
  };
  await store().create("projects", project);
  return project;
}

export async function updateProject(
  userId: string,
  id: string,
  patch: Partial<ProjectInput>
): Promise<Project | null> {
  const existing = await getProject(userId, id);
  if (!existing) return null;
  return store().update<Project>("projects", id, { ...patch, updatedAt: now() });
}

export async function deleteProject(userId: string, id: string): Promise<boolean> {
  const existing = await getProject(userId, id);
  if (!existing) return false;
  await store().remove("projects", id);
  // Cascade delete generated assets.
  for (const col of ["websites", "ads", "brands"] as const) {
    const items = await store().query<{ id: string; projectId: string }>(col, [
      { field: "projectId", value: id },
    ]);
    for (const item of items) await store().remove(col, item.id);
  }
  return true;
}

/* -------------------------------- Websites -------------------------------- */

export async function getWebsiteByProject(userId: string, projectId: string): Promise<Website | null> {
  const items = await store().query<Website>("websites", [
    { field: "userId", value: userId },
    { field: "projectId", value: projectId },
  ]);
  return items[0] || null;
}

export async function saveWebsite(
  userId: string,
  projectId: string,
  content: WebsiteContent
): Promise<Website> {
  const existing = await getWebsiteByProject(userId, projectId);
  if (existing) {
    return (await store().update<Website>("websites", existing.id, {
      content,
      updatedAt: now(),
    }))!;
  }
  const website: Website = {
    id: shortId("web"),
    userId,
    projectId,
    content,
    createdAt: now(),
    updatedAt: now(),
  };
  await store().create("websites", website);
  return website;
}

export async function getWebsite(userId: string, id: string): Promise<Website | null> {
  const w = await store().get<Website>("websites", id);
  if (!w || w.userId !== userId) return null;
  return w;
}

export async function updateWebsiteContent(
  userId: string,
  id: string,
  content: WebsiteContent
): Promise<Website | null> {
  const existing = await getWebsite(userId, id);
  if (!existing) return null;
  return store().update<Website>("websites", id, { content, updatedAt: now() });
}

/* ---------------------------------- Ads ----------------------------------- */

export async function getAdsByProject(userId: string, projectId: string): Promise<AdCampaign | null> {
  const items = await store().query<AdCampaign>("ads", [
    { field: "userId", value: userId },
    { field: "projectId", value: projectId },
  ]);
  return items[0] || null;
}

export async function saveAds(
  userId: string,
  projectId: string,
  ads: AdCreative[]
): Promise<AdCampaign> {
  const existing = await getAdsByProject(userId, projectId);
  if (existing) {
    return (await store().update<AdCampaign>("ads", existing.id, { ads, updatedAt: now() }))!;
  }
  const campaign: AdCampaign = {
    id: shortId("ads"),
    userId,
    projectId,
    ads,
    createdAt: now(),
    updatedAt: now(),
  };
  await store().create("ads", campaign);
  return campaign;
}

/* --------------------------------- Brands --------------------------------- */

export async function getBrandByProject(userId: string, projectId: string): Promise<Brand | null> {
  const items = await store().query<Brand>("brands", [
    { field: "userId", value: userId },
    { field: "projectId", value: projectId },
  ]);
  return items[0] || null;
}

export async function saveBrand(
  userId: string,
  projectId: string,
  content: BrandContent
): Promise<Brand> {
  const existing = await getBrandByProject(userId, projectId);
  if (existing) {
    return (await store().update<Brand>("brands", existing.id, { content, updatedAt: now() }))!;
  }
  const brand: Brand = {
    id: shortId("brand"),
    userId,
    projectId,
    content,
    createdAt: now(),
    updatedAt: now(),
  };
  await store().create("brands", brand);
  return brand;
}

/* ----------------------------- Subscriptions ------------------------------ */

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const items = await store().query<Subscription>("subscriptions", [
    { field: "userId", value: userId },
  ]);
  return items[0] || null;
}

export async function upsertSubscription(
  userId: string,
  plan: PlanId,
  status: Subscription["status"],
  extra?: Partial<Subscription>
): Promise<Subscription> {
  const existing = await getSubscription(userId);
  if (existing) {
    return (await store().update<Subscription>("subscriptions", existing.id, {
      plan,
      status,
      ...extra,
      updatedAt: now(),
    }))!;
  }
  const sub: Subscription = {
    id: shortId("sub"),
    userId,
    plan,
    status,
    createdAt: now(),
    updatedAt: now(),
    ...extra,
  };
  await store().create("subscriptions", sub);
  return sub;
}

/* ------------------------- Payments & Invoices ---------------------------- */

export async function addPayment(payment: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
  const record: Payment = { ...payment, id: shortId("pay"), createdAt: now() };
  await store().create("payments", record);
  return record;
}

export async function listPayments(userId: string): Promise<Payment[]> {
  const items = await store().query<Payment>("payments", [{ field: "userId", value: userId }]);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addInvoice(invoice: Omit<Invoice, "id" | "createdAt" | "invoiceNumber">): Promise<Invoice> {
  const record: Invoice = {
    ...invoice,
    id: shortId("inv"),
    invoiceNumber: `VS-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: now(),
  };
  await store().create("invoices", record);
  return record;
}

export async function listInvoices(userId: string): Promise<Invoice[]> {
  const items = await store().query<Invoice>("invoices", [{ field: "userId", value: userId }]);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

/* ------------------------------ Account purge ----------------------------- */

export async function deleteAllUserData(userId: string): Promise<void> {
  const collections = [
    "projects",
    "websites",
    "ads",
    "brands",
    "subscriptions",
    "payments",
    "invoices",
    "activity_logs",
  ] as const;
  for (const col of collections) {
    const items = await store().query<{ id: string }>(col, [{ field: "userId", value: userId }]);
    for (const item of items) await store().remove(col, item.id);
  }
  await store().remove("users", userId);
}
