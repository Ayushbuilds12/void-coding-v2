import { ok, fail, withAuth, z } from "@/lib/api";
import { verifyPaymentSchema } from "@/lib/validation";
import { verifyPaymentSignature } from "@/lib/payments";
import { getPlan } from "@/lib/types";
import { addPayment, addInvoice, upsertSubscription } from "@/lib/db";
import { logActivity } from "@/lib/audit";

export const runtime = "nodejs";

type Body = z.infer<typeof verifyPaymentSchema>;

export const POST = withAuth<Body>(
  async ({ user, body }) => {
    const valid = verifyPaymentSignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature
    );
    if (!valid) {
      await logActivity(user.uid, "payment.verify_failed", {
        orderId: body.razorpay_order_id,
      });
      return fail("Payment signature verification failed", 400);
    }

    const plan = getPlan(body.plan);
    if (!plan || plan.id === "free") return fail("Invalid plan", 400);

    const payment = await addPayment({
      userId: user.uid,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      plan: plan.id,
      amount: plan.price,
      currency: "INR",
      status: "paid",
    });

    const invoice = await addInvoice({
      userId: user.uid,
      paymentId: payment.id,
      plan: plan.id,
      amount: plan.price,
      currency: "INR",
    });

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    const subscription = await upsertSubscription(user.uid, plan.id, "active", {
      razorpayOrderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      currentPeriodEnd: periodEnd.toISOString(),
    });

    await logActivity(user.uid, "payment.verified", {
      plan: plan.id,
      paymentId: body.razorpay_payment_id,
    });

    return ok({ subscription, invoice });
  },
  { schema: verifyPaymentSchema, rateLimit: { limit: 20, windowMs: 60_000 } }
);
