import Razorpay from "razorpay";
import crypto from "crypto";

let rzpInstance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payments will run in high-fidelity mock mode.");
    return null;
  }

  if (!rzpInstance) {
    rzpInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return rzpInstance;
}

/**
 * Creates a subscription or order for Pro tier
 */
export async function createRazorpayOrderOrSubscription(userId: string, plan: "pro" | "free"): Promise<any> {
  const rzp = getRazorpayInstance();
  if (!rzp) {
    // Return high-fidelity mock checkout data
    const rzpOrderId = `rzp_mock_${Math.random().toString(36).substring(2, 11)}`;
    return {
      isMock: true,
      id: rzpOrderId,
      amount: plan === "pro" ? 49900 : 0, // 499 INR in paise
      currency: "INR",
      plan,
      status: "created"
    };
  }

  try {
    // Create a real standard order for subscription or single payment (499 INR)
    const options = {
      amount: 49900, // 499 INR in paise
      currency: "INR",
      receipt: `receipt_void_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan,
        projectName: "Void Coding"
      }
    };

    const order = await rzp.orders.create(options);
    return {
      isMock: false,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      status: order.status
    };
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    throw error;
  }
}

/**
 * Verifies Razorpay Webhook signature
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return true; // Mock mode auto-passes

  try {
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    return generated_signature === signature;
  } catch (e) {
    console.error("Signature verification error:", e);
    return false;
  }
}
