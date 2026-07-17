import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#050505]">
      <div className="container grid gap-8 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold">Void Studios</div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Cinematic websites. Powerful ads. More customers. Built with AI.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
            <li><Link href="/#pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/signup" className="hover:text-foreground">Get started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="hover:text-foreground">Terms of Service</Link></li>
            <li><Link href="/legal/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
            <li><Link href="/legal/refund" className="hover:text-foreground">Refund Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/legal/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Void Studios. All rights reserved.</span>
          <span>Made in India · Powered by AI</span>
        </div>
      </div>
    </footer>
  );
}
