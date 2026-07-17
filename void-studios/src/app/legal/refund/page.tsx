export const metadata = { title: "Refund Policy — Void Studios" };

export default function RefundPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Refund Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <p>
        We want you to be satisfied with Void Studios. This policy explains our approach to
        refunds for subscription payments.
      </p>

      <h2>Subscriptions</h2>
      <ul>
        <li>Subscriptions are billed monthly in advance.</li>
        <li>You may cancel at any time; cancellation stops future renewals.</li>
        <li>
          If you experience a billing error or a technical issue that prevents you from using the
          service, contact us within 7 days of the charge for a review.
        </li>
      </ul>

      <h2>Eligibility</h2>
      <p>
        Refund requests are assessed case by case. Charges for periods during which the service was
        used as intended are generally non-refundable.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Reach out via our <a href="/legal/contact" className="text-primary hover:underline">contact page</a> with your
        account email and invoice number. We aim to respond within 3 business days.
      </p>
    </>
  );
}
