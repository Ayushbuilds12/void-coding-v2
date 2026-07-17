export type Industry =
  | "Restaurant"
  | "Gym"
  | "Agency"
  | "Real Estate"
  | "Doctor"
  | "Salon"
  | "Startup"
  | "Ecommerce";

export type BusinessGoal =
  | "More Leads"
  | "More Sales"
  | "More Calls"
  | "Brand Awareness";

export type PlanId = "free" | "starter" | "pro" | "agency";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  businessName: string;
  industry: Industry;
  goal: BusinessGoal;
  budget: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteContent {
  seoTitle: string;
  seoDescription: string;
  hero: { headline: string; subheadline: string; ctaLabel: string };
  about: { title: string; body: string };
  services: { title: string; items: { name: string; description: string }[] };
  testimonials: { author: string; role: string; quote: string }[];
  cta: { headline: string; buttonLabel: string };
  contact: { headline: string; email: string; phone: string; address: string };
}

export interface Website {
  id: string;
  userId: string;
  projectId: string;
  content: WebsiteContent;
  createdAt: string;
  updatedAt: string;
}

export type AdPlatform = "Facebook" | "Instagram" | "Google" | "YouTube";

export interface AdCreative {
  platform: AdPlatform;
  headline: string;
  primaryText: string;
  cta: string;
  offer: string;
  targetAudience: string;
}

export interface AdCampaign {
  id: string;
  userId: string;
  projectId: string;
  ads: AdCreative[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandContent {
  positioning: string;
  colorPalette: { name: string; hex: string; usage: string }[];
  typography: { heading: string; body: string; rationale: string };
  brandVoice: string;
  logoConcepts: { name: string; description: string }[];
}

export interface Brand {
  id: string;
  userId: string;
  projectId: string;
  content: BrandContent;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanId;
  status: "active" | "cancelled" | "none";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  currentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  plan: PlanId;
  amount: number; // paise
  currency: string;
  status: "created" | "paid" | "failed";
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  paymentId: string;
  invoiceNumber: string;
  plan: PlanId;
  amount: number; // paise
  currency: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: number; // paise, per month
  priceLabel: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99900,
    priceLabel: "₹999",
    features: [
      "10 AI website generations / mo",
      "20 ad campaign generations / mo",
      "Brand kit generator",
      "Export & edit content",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299900,
    priceLabel: "₹2,999",
    highlighted: true,
    features: [
      "Unlimited website generations",
      "Unlimited ad campaigns",
      "Full brand system generator",
      "Priority AI models",
      "Priority support",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: 999900,
    priceLabel: "₹9,999",
    features: [
      "Everything in Pro",
      "Unlimited projects & clients",
      "White-label exports",
      "Dedicated success manager",
      "API access",
    ],
  },
];

export function getPlan(id: PlanId): PlanDefinition | undefined {
  return PLANS.find((p) => p.id === id);
}
