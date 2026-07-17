import { ok, withAuth } from "@/lib/api";
import { getSubscription, listPayments, listInvoices } from "@/lib/db";

export const runtime = "nodejs";

export const GET = withAuth(async ({ user }) => {
  const [subscription, payments, invoices] = await Promise.all([
    getSubscription(user.uid),
    listPayments(user.uid),
    listInvoices(user.uid),
  ]);
  return ok({ subscription, payments, invoices });
});
