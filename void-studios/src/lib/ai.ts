import "server-only";
import OpenAI from "openai";
import { serverConfig } from "@/lib/config";
import type {
  AdCreative,
  AdPlatform,
  BrandContent,
  BusinessGoal,
  Industry,
  WebsiteContent,
} from "@/lib/types";

let client: OpenAI | null = null;
function getClient(): OpenAI | null {
  if (!serverConfig.openai.enabled) return null;
  if (!client) client = new OpenAI({ apiKey: serverConfig.openai.apiKey });
  return client;
}

export const aiEnabled = serverConfig.openai.enabled;

async function generateJSON<T>(system: string, user: string, fallback: T): Promise<T> {
  const openai = getClient();
  if (!openai) return fallback;
  try {
    const res = await openai.chat.completions.create({
      model: serverConfig.openai.model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const content = res.choices[0]?.message?.content;
    if (!content) return fallback;
    return JSON.parse(content) as T;
  } catch (e) {
    console.error("[ai] generation error, using fallback", e);
    return fallback;
  }
}

/* ------------------------------- Website ---------------------------------- */

export async function generateWebsite(input: {
  businessName: string;
  industry: Industry;
  targetAudience: string;
}): Promise<WebsiteContent> {
  const fallback = mockWebsite(input);
  const system =
    "You are an elite conversion copywriter and web strategist for a premium creative agency. " +
    "Return ONLY valid JSON matching the requested schema. Write persuasive, specific, on-brand copy.";
  const user = `Generate premium website homepage content as JSON for this business.
Business name: ${input.businessName}
Industry: ${input.industry}
Target audience: ${input.targetAudience}

JSON schema:
{
  "seoTitle": string,
  "seoDescription": string,
  "hero": { "headline": string, "subheadline": string, "ctaLabel": string },
  "about": { "title": string, "body": string },
  "services": { "title": string, "items": [{ "name": string, "description": string }] },
  "testimonials": [{ "author": string, "role": string, "quote": string }],
  "cta": { "headline": string, "buttonLabel": string },
  "contact": { "headline": string, "email": string, "phone": string, "address": string }
}
Provide 4 services and 3 testimonials.`;
  return generateJSON<WebsiteContent>(system, user, fallback);
}

/* --------------------------------- Ads ------------------------------------ */

export async function generateAds(input: {
  businessName: string;
  industry: Industry;
  goal: BusinessGoal;
  targetAudience: string;
  platforms: AdPlatform[];
}): Promise<AdCreative[]> {
  const fallback = input.platforms.map((p) => mockAd(p, input));
  const system =
    "You are a senior performance-marketing strategist. Return ONLY valid JSON. " +
    "Write high-converting ad copy tailored to each platform's format and audience mindset.";
  const user = `Generate advertising creatives as JSON for these platforms: ${input.platforms.join(", ")}.
Business: ${input.businessName}
Industry: ${input.industry}
Goal: ${input.goal}
Target audience: ${input.targetAudience}

JSON schema:
{ "ads": [{ "platform": string, "headline": string, "primaryText": string, "cta": string, "offer": string, "targetAudience": string }] }
Return exactly one ad object per requested platform, with "platform" set to the platform name.`;
  const result = await generateJSON<{ ads: AdCreative[] }>(system, user, { ads: fallback });
  const ads = Array.isArray(result.ads) && result.ads.length ? result.ads : fallback;
  // Guarantee coverage of all requested platforms.
  return input.platforms.map(
    (p) => ads.find((a) => a.platform === p) || mockAd(p, input)
  );
}

/* -------------------------------- Brand ----------------------------------- */

export async function generateBrand(input: {
  businessName: string;
  industry: Industry;
  targetAudience: string;
}): Promise<BrandContent> {
  const fallback = mockBrand(input);
  const system =
    "You are a world-class brand strategist and identity designer. Return ONLY valid JSON. " +
    "Deliver a cohesive, distinctive brand system.";
  const user = `Generate a brand system as JSON.
Business: ${input.businessName}
Industry: ${input.industry}
Target audience: ${input.targetAudience}

JSON schema:
{
  "positioning": string,
  "colorPalette": [{ "name": string, "hex": string, "usage": string }],
  "typography": { "heading": string, "body": string, "rationale": string },
  "brandVoice": string,
  "logoConcepts": [{ "name": string, "description": string }]
}
Provide 5 palette colors (valid hex) and 3 logo concepts.`;
  return generateJSON<BrandContent>(system, user, fallback);
}

/* ------------------------------- Mock data -------------------------------- */

function mockWebsite(input: {
  businessName: string;
  industry: Industry;
  targetAudience: string;
}): WebsiteContent {
  const n = input.businessName;
  return {
    seoTitle: `${n} — Premium ${input.industry} Experience`,
    seoDescription: `${n} delivers a standout ${input.industry.toLowerCase()} experience for ${input.targetAudience}. Discover services, testimonials and get in touch today.`,
    hero: {
      headline: `${n}: ${input.industry} done exceptionally`,
      subheadline: `Purpose-built for ${input.targetAudience}. Beautiful, fast and designed to convert visitors into loyal customers.`,
      ctaLabel: "Get Started",
    },
    about: {
      title: `About ${n}`,
      body: `${n} was founded to raise the bar for ${input.industry.toLowerCase()} businesses. We combine craft, technology and a relentless focus on ${input.targetAudience} to deliver results that matter.`,
    },
    services: {
      title: "What We Offer",
      items: [
        { name: "Signature Service", description: `Our flagship ${input.industry.toLowerCase()} offering, tailored to ${input.targetAudience}.` },
        { name: "Consultation", description: "A guided session to map your goals and craft a plan." },
        { name: "Premium Support", description: "Responsive, human support whenever you need it." },
        { name: "Growth Package", description: "Ongoing optimization to keep you ahead of the competition." },
      ],
    },
    testimonials: [
      { author: "Aarav Mehta", role: "Loyal Customer", quote: `${n} completely changed my experience. Highly recommended!` },
      { author: "Priya Sharma", role: "Business Partner", quote: "Professional, fast, and genuinely caring. Five stars." },
      { author: "Rohan Verma", role: "First-time Client", quote: "Exceeded every expectation. I'll be back for sure." },
    ],
    cta: {
      headline: `Ready to experience ${n}?`,
      buttonLabel: "Book Now",
    },
    contact: {
      headline: "Get in touch",
      email: `hello@${n.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
      phone: "+91 98765 43210",
      address: "Nehru Place, New Delhi, India",
    },
  };
}

function mockAd(
  platform: AdPlatform,
  input: { businessName: string; industry: Industry; goal: BusinessGoal; targetAudience: string }
): AdCreative {
  return {
    platform,
    headline: `${input.businessName}: ${input.goal} starts here`,
    primaryText: `Discover why ${input.targetAudience} choose ${input.businessName} for ${input.industry.toLowerCase()}. Limited-time launch offer live now on ${platform}.`,
    cta: input.goal === "More Calls" ? "Call Now" : input.goal === "More Sales" ? "Shop Now" : "Learn More",
    offer: "20% off your first order",
    targetAudience: input.targetAudience,
  };
}

function mockBrand(input: {
  businessName: string;
  industry: Industry;
  targetAudience: string;
}): BrandContent {
  return {
    positioning: `${input.businessName} is the premium choice in ${input.industry.toLowerCase()}, trusted by ${input.targetAudience} for uncompromising quality and a modern, human experience.`,
    colorPalette: [
      { name: "Void Black", hex: "#000000", usage: "Primary background" },
      { name: "Crimson Pulse", hex: "#DC2626", usage: "Primary accent / CTAs" },
      { name: "Pure White", hex: "#FFFFFF", usage: "Primary text" },
      { name: "Graphite", hex: "#111827", usage: "Cards / surfaces" },
      { name: "Ember", hex: "#F87171", usage: "Highlights" },
    ],
    typography: {
      heading: "Space Grotesk",
      body: "Inter",
      rationale: "A geometric display face paired with a highly legible body font for a modern, premium feel.",
    },
    brandVoice: `Confident, warm and precise. ${input.businessName} speaks to ${input.targetAudience} like a trusted expert — never salesy, always clear.`,
    logoConcepts: [
      { name: "The Eclipse", description: "A minimalist circular mark evoking a black hole with a crimson energy ring." },
      { name: "Monogram", description: `A refined ${input.businessName.charAt(0)}-based monogram in a bespoke geometric style.` },
      { name: "Wordmark", description: "A clean, confident wordmark with a single accented letter." },
    ],
  };
}
