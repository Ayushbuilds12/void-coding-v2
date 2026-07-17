import Link from "next/link";
import { BlackHole } from "@/components/landing/BlackHole";
import { BlossomTree } from "@/components/landing/BlossomTree";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/types";
import { Globe, Megaphone, Palette, Check, ArrowRight, Zap, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Website Generator",
    desc: "Full homepage copy — hero, about, services, testimonials, CTA, contact and SEO meta — generated and editable.",
  },
  {
    icon: Megaphone,
    title: "Ad Generator",
    desc: "High-converting Facebook, Instagram, Google and YouTube campaigns with headlines, primary text, offers and CTAs.",
  },
  {
    icon: Palette,
    title: "Brand Generator",
    desc: "Positioning, color palette, typography, brand voice and logo concepts — a cohesive identity in seconds.",
  },
];

const steps = [
  { n: "01", title: "Business In", desc: "Tell us your business name, industry, goal and audience." },
  { n: "02", title: "Generate", desc: "Our AI crafts your website, ads and branding instantly." },
  { n: "03", title: "Customers Out", desc: "Edit, export and launch assets designed to convert." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12),_transparent_55%)]" />
        <div className="container relative grid items-center gap-10 py-16 lg:grid-cols-2">
          {/* Left: black hole */}
          <div className="order-2 flex justify-center lg:order-1">
            <BlackHole />
          </div>

          {/* Center content overlaps via ordering on small screens; text block */}
          <div className="order-1 lg:order-2">
            <Badge variant="outline" className="mb-5 gap-1.5 border-primary/40 text-primary">
              <Sparkles className="h-3 w-3" /> AI-powered growth studio
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl xl:text-6xl">
              Build Websites & Ads That{" "}
              <span className="text-gradient">Actually Grow Businesses</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Generate professional websites, advertising campaigns, and branding
              systems with AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Start Free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how">View Demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Instant generation</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure by design</span>
            </div>
          </div>
        </div>

        {/* Blossom tree accent */}
        <div className="pointer-events-none absolute -right-10 top-20 hidden opacity-80 xl:block">
          <BlossomTree />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to grow</h2>
            <p className="mt-4 text-muted-foreground">
              Three AI engines that turn a simple brief into a complete go-to-market kit.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border border-border bg-card p-7 transition-colors hover:border-primary/50">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-border/60 bg-[#050505] py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Business in, customers out</h2>
            <p className="mt-4 text-muted-foreground">A cinematic workflow that takes minutes, not weeks.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-8">
                <div className="font-display text-5xl font-bold text-primary/30">{s.n}</div>
                <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you are ready to scale.</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-card p-8 ${
                  plan.highlighted ? "border-primary shadow-xl shadow-primary/10" : "border-border"
                }`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-8">Most popular</Badge>
                )}
                <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold">{plan.priceLabel}</span>
                  <span className="mb-1 text-sm text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"}>
                  <Link href="/signup">Get {plan.name}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#120303] to-black p-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(220,38,38,0.18),_transparent_60%)]" />
            <h2 className="relative font-display text-3xl font-bold sm:text-4xl">
              Ready to grow your business?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Join businesses using Void Studios to generate cinematic websites, powerful
              ads and standout branding.
            </p>
            <Button asChild size="lg" className="relative mt-8">
              <Link href="/signup">Start Free <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
