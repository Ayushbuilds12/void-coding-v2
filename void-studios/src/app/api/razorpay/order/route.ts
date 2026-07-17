import { ok, fail, withAuth, z } from "@/lib/api";
import { createOrderSchema } from "@/lib/validation";
import { createOrder, paymentsEnabled, mockSignature } from "@/lib/payments";
import { getPlan } from "@/lib/types";
import { addPayment } from "@/lib/db";
import { logActivity } from "@/lib/audit";
import { shortId } from "@/lib/utils";

export const runtime = "nodejs";

type Body = z.infer<typeof createOrderSchema>;

export const POST = withAuth<Body>(
  async ({ user, body }) => {
    const plan = getPlan(body.plan);
    if (!plan || plan.id === "free") return fail("Invalid plan", 400);

    const order = await createOrder(plan.price, user.uid, plan.id);
    await addPayment({
      userId: user.uid,
      orderId: order.id,
      paymentId: "",
      plan: plan.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
    });
    await logActivity(user.uid, "payment.order_created", { plan: plan.id, orderId: order.id });

    // In mock mode (no Razorpay keys) provide verifiable credentials so the
    // full checkout → verify → subscribe flow can be exercised end-to-end.
    let mock: { paymentId: string; signature: string } | undefined;
    if (order.isMock) {
      const paymentId = `pay_mock_${shortId()}`;
      mock = { paymentId, signature: mockSignature(order.id, paymentId) };
    }

    return ok({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      isMock: order.isMock,
      plan: plan.id,
      planName: plan.name,
      paymentsEnabled,
      mock,
    });
  },
  { schema: createOrderSchema, rateLimit: { limit: 20, windowMs: 60_000 } }
);
