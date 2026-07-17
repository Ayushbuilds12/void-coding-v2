export const metadata = { title: "Cookie Policy — Void Studios" };

export default function CookiesPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

      <p>This policy explains how Void Studios uses cookies and similar technologies.</p>

      <h2>Essential cookies</h2>
      <ul>
        <li><strong>Session cookie</strong> — keeps you securely signed in.</li>
        <li><strong>CSRF token cookie</strong> — protects against cross-site request forgery.</li>
      </ul>
      <p>
        These cookies are strictly necessary for the service to function and cannot be disabled
        without affecting core functionality.
      </p>

      <h2>Authentication provider cookies</h2>
      <p>
        Google Firebase Authentication may set cookies as part of the sign-in flow, including
        when you use Google or GitHub login.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Blocking essential cookies will
        prevent you from signing in.
      </p>
    </>
  );
}
