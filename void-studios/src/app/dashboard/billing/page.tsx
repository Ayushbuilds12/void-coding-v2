"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/components/providers/AuthProvider";
import { PLANS, getPlan } from "@/lib/types";
import type { Invoice, Payment, PlanId, Subscription } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, Download } from "lucide-react";

interface BillingData {
  subscription: Subscription | null;
  payments: Payment[];
  invoices: Invoice[];
}

interface OrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isMock: boolean;
  plan: PlanId;
  planName: string;
  mock?: { paymentId: string; signature: string };
}

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = React.useState<BillingData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [checkoutPlan, setCheckoutPlan] = React.useState<PlanId | null>(null);

  const load = React.useCallback(async () => {
    const res = await apiFetch<BillingData>("/api/billing");
    if (res.ok && res.data) setData(res.data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const finalize = async (payload: RazorpayHandlerResponse, plan: PlanId) => {
    const verify = await apiFetch<{ subscription: Subscription }>("/api/razorpay/verify", {
      method: "POST",
      body: JSON.stringify({ ...payload, plan }),
    });
    if (verify.ok) {
      toast.success("Subscription activated!");
      await load();
      router.refresh();
    } else {
      toast.error(verify.error || "Payment verification failed");
    }
  };

  const subscribe = async (plan: PlanId) => {
    setCheckoutPlan(plan);
    try {
      const orderRes = await apiFetch<OrderResponse>("/api/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      if (!orderRes.ok || !orderRes.data) {
        toast.error(orderRes.error || "Could not start checkout");
        return;
      }
      const order = orderRes.data;

      // Mock mode: complete the verified flow without the Razorpay widget.
      if (order.isMock && order.mock) {
        await finalize(
          {
            razorpay_order_id: order.orderId,
            razorpay_payment_id: order.mock.paymentId,
            razorpay_signature: order.mock.signature,
          },
          plan
        );
        return;
      }

      const ready = await loadRazorpay();
      if (!ready) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const rzp = new (window as unknown as { Razorpay: new (o: unknown) => { open: () => void } }).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Void Studios",
        description: `${order.planName} plan subscription`,
        order_id: order.orderId,
        prefill: { name: user?.displayName || "", email: user?.email || "" },
        theme: { color: "#DC2626" },
        handler: (response: RazorpayHandlerResponse) => finalize(response, plan),
      });
      rzp.open();
    } finally {
      setCheckoutPlan(null);
    }
  };

  const currentPlan = getPlan(data?.subscription?.plan || "free");
  const activePlanId = data?.subscription?.status === "active" ? data?.subscription?.plan : "free";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your subscription and invoices.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current plan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold">{currentPlan?.name || "Free"}</div>
            {data?.subscription?.currentPeriodEnd && (
              <div className="text-sm text-muted-foreground">
                Renews {formatDate(data.subscription.currentPeriodEnd)}
              </div>
            )}
          </div>
          <Badge variant={activePlanId && activePlanId !== "free" ? "success" : "secondary"}>
            {data?.subscription?.status === "active" && activePlanId !== "free" ? "Active" : "Free tier"}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = activePlanId === plan.id;
          return (
            <Card key={plan.id} className={plan.highlighted ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {plan.name}
                  {plan.highlighted && <Badge>Popular</Badge>}
                </CardTitle>
                <div className="mt-2 flex items-end gap-1">
                  <span className="font-display text-3xl font-bold">{plan.priceLabel}</span>
                  <span className="mb-1 text-sm text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={isCurrent || checkoutPlan !== null}
                  onClick={() => subscribe(plan.id)}
                >
                  {isCurrent ? "Current plan" : checkoutPlan === plan.id ? "Processing…" : `Upgrade to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing history</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !data || data.invoices.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No invoices yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 font-medium">Invoice</th>
                    <th className="py-2 font-medium">Plan</th>
                    <th className="py-2 font-medium">Amount</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60">
                      <td className="py-3 font-mono text-xs">{inv.invoiceNumber}</td>
                      <td className="py-3">{getPlan(inv.plan)?.name || inv.plan}</td>
                      <td className="py-3">{formatCurrency(inv.amount)}</td>
                      <td className="py-3 text-muted-foreground">{formatDate(inv.createdAt)}</td>
                      <td className="py-3 text-right">
                        <a
                          href={`/api/invoices/${inv.id}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
