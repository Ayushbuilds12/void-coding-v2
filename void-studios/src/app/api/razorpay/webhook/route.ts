import { NextRequest } from "next/server";
import { ok, fail, withPublic } from "@/lib/api";
import { verifyWebhookSignature } from "@/lib/payments";
import { logActivity } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * Razorpay webhook receiver. Verifies the `x-razorpay-signature` header against
 * the raw request body using the configured webhook secret.
 */
export const POST = withPublic(async (req: NextRequest) => {
  const signature = req.headers.get("x-razorpay-signature") || "";
  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, signature)) {
    return fail("Invalid webhook signature", 400);
  }

  let event: { event?: string; payload?: Record<string, unknown> } = {};
  try {
    event = JSON.parse(rawBody);
  } catch {
    return fail("Invalid payload", 400);
  }

  // Record the verified event for audit purposes.
  await logActivity("system", `webhook.${event.event || "unknown"}`, {
    received: true,
  });

  return ok({ received: true });
});
