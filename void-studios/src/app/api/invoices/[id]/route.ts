import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth/server";
import { listInvoices } from "@/lib/db";
import { getPlan } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export const runtime = "nodejs";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const invoices = await listInvoices(user.uid);
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) return NextResponse.json({ ok: false, error: "Invoice not found" }, { status: 404 });

  const planName = getPlan(invoice.plan)?.name || invoice.plan;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Invoice ${escapeHtml(invoice.invoiceNumber)}</title>
<style>
  body{font-family:system-ui,-apple-system,sans-serif;max-width:640px;margin:40px auto;padding:0 24px;color:#111}
  h1{color:#DC2626;margin-bottom:0}
  .muted{color:#666}
  table{width:100%;border-collapse:collapse;margin-top:24px}
  td,th{padding:10px 0;border-bottom:1px solid #eee;text-align:left}
  .total{font-size:20px;font-weight:700}
  .box{border:1px solid #eee;border-radius:12px;padding:24px;margin-top:24px}
</style></head>
<body>
  <h1>Void Studios</h1>
  <div class="muted">Cinematic Websites. Powerful Ads. More Customers.</div>
  <div class="box">
    <div><strong>Invoice:</strong> ${escapeHtml(invoice.invoiceNumber)}</div>
    <div><strong>Date:</strong> ${escapeHtml(formatDate(invoice.createdAt))}</div>
    <div><strong>Billed to:</strong> ${escapeHtml(user.name || user.email)}</div>
    <table>
      <thead><tr><th>Description</th><th>Amount</th></tr></thead>
      <tbody>
        <tr><td>${escapeHtml(planName)} plan — monthly subscription</td><td>${escapeHtml(formatCurrency(invoice.amount))}</td></tr>
      </tbody>
    </table>
    <p class="total">Total: ${escapeHtml(formatCurrency(invoice.amount))}</p>
    <p class="muted">Thank you for your business.</p>
  </div>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.html"`,
    },
  });
}
