export const metadata = { title: "Privacy Policy — Void Studios" };

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <p>
        Void Studios (&quot;we&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy
        explains what information we collect, how we use it, and your rights.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Account information: your name, email address and authentication provider identifiers.</li>
        <li>Business inputs: project details you provide to generate websites, ads and branding.</li>
        <li>Generated content stored in your workspace.</li>
        <li>Billing information processed securely by our payment provider, Razorpay.</li>
        <li>Usage and audit logs used to secure and improve the service.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide, maintain and improve the service.</li>
        <li>To generate content using AI providers based on the inputs you submit.</li>
        <li>To process subscriptions and issue invoices.</li>
        <li>To detect, prevent and respond to security incidents and abuse.</li>
      </ul>

      <h2>Data sharing</h2>
      <p>
        We share data only with the processors required to run the service — including OpenAI
        (content generation), Google Firebase (authentication and database), and Razorpay
        (payments). We never sell your personal data.
      </p>

      <h2>Data retention & deletion</h2>
      <p>
        You may delete your account at any time from Settings, which permanently removes your
        projects, generated assets and associated records.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy requests, contact us via our <a href="/legal/contact" className="text-primary hover:underline">contact page</a>.
      </p>
    </>
  );
}
