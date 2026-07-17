import { z } from "zod";

export const INDUSTRIES = [
  "Restaurant",
  "Gym",
  "Agency",
  "Real Estate",
  "Doctor",
  "Salon",
  "Startup",
  "Ecommerce",
] as const;

export const GOALS = [
  "More Leads",
  "More Sales",
  "More Calls",
  "Brand Awareness",
] as const;

export const AD_PLATFORMS = ["Facebook", "Instagram", "Google", "YouTube"] as const;

export const projectSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required").max(120),
  industry: z.enum(INDUSTRIES),
  goal: z.enum(GOALS),
  budget: z.string().trim().min(1, "Budget is required").max(60),
  targetAudience: z.string().trim().min(1, "Target audience is required").max(400),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectSchema.partial();

export const generateWebsiteSchema = z.object({
  projectId: z.string().min(1),
  businessName: z.string().trim().min(1).max(120),
  industry: z.enum(INDUSTRIES),
  targetAudience: z.string().trim().min(1).max(400),
});

export const generateAdsSchema = z.object({
  projectId: z.string().min(1),
  businessName: z.string().trim().min(1).max(120),
  industry: z.enum(INDUSTRIES),
  goal: z.enum(GOALS),
  targetAudience: z.string().trim().min(1).max(400),
  platforms: z.array(z.enum(AD_PLATFORMS)).min(1).max(4),
});

export const generateBrandSchema = z.object({
  projectId: z.string().min(1),
  businessName: z.string().trim().min(1).max(120),
  industry: z.enum(INDUSTRIES),
  targetAudience: z.string().trim().min(1).max(400),
});

export const saveWebsiteSchema = z.object({
  websiteId: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
});

export const updateAccountSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required"),
  message: z.string().trim().min(10, "Please add a few more details").max(2000),
});

export const createOrderSchema = z.object({
  plan: z.enum(["starter", "pro", "agency"]),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  plan: z.enum(["starter", "pro", "agency"]),
});

export const sessionSchema = z.object({
  idToken: z.string().min(10),
});
