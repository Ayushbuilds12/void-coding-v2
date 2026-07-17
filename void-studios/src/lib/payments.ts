import "server-only";
import crypto from "crypto";
import Razorpay from "razorpay";
import { serverConfig } from "@/lib/config";
import { shortId } from "@/lib/utils";

let instance: Razorpay | null = null;
function getInstance(): Razorpay | null {
  if (!serverConfig.razorpay.enabled) return null;
  if (!instance) {
    instance = new Razorpay({
      key_id: serverConfig.razorpay.keyId,
      key_secret: serverConfig.razorpay.keySecret,
    });
  }
  return instance;
}

export const paymentsEnabled = serverConfig.razorpay.enabled;
export const razorpayKeyId = serverConfig.razorpay.keyId;

export interface CreatedOrder {
  id: string;
  amount: number;
  currency: string;
  isMock: boolean;
  keyId: string;
}

export async function createOrder(
  amount: number,
  userId: string,
  plan: string
): Promise<CreatedOrder> {
  const rzp = getInstance();
  if (!rzp) {
    // Deterministic mock order so the checkout flow is fully exercisable.
    return {
      id: `order_mock_${shortId()}`,
      amount,
      currency: "INR",
      isMock: true,
      keyId: "rzp_test_mock",
    };
  }
  const order = await rzp.orders.create({
    amount,
    currency: "INR",
    receipt: `vs_${userId}_${Date.now()}`,
    notes: { userId, plan, product: "Void Studios" },
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    isMock: false,
    keyId: serverConfig.razorpay.keyId,
  };
}

/** Verify the checkout signature returned by Razorpay Checkout. */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!serverConfig.razorpay.keySecret) {
    // Mock mode: accept the mock signature format only.
    return signature === mockSignature(orderId, paymentId);
  }
  const expected = crypto
    .createHmac("sha256", serverConfig.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return timingSafeEqual(expected, signature);
}

/** Verify an incoming Razorpay webhook signature. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!serverConfig.razorpay.webhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", serverConfig.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqual(expected, signature);
}

export function mockSignature(orderId: string, paymentId: string): string {
  // Stable pseudo-signature used only when Razorpay keys are absent.
  return crypto
    .createHash("sha256")
    .update(`mock|${orderId}|${paymentId}`)
    .digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
