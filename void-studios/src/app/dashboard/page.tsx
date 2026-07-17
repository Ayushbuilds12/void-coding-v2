import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/server";
import { listProjects, getSubscription } from "@/lib/db";
import { getStore } from "@/lib/store";
import { getPlan } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { aiEnabled } from "@/lib/ai";
import { paymentsEnabled } from "@/lib/payments";
import { usingFirestore } from "@/lib/store";
import {
  Globe,
  Megaphone,
  Palette,
  FolderKanban,
  ArrowRight,
  Plus,
} from "lucide-react";

export default async function OverviewPage() {
  const user = (await getCurrentUser())!;
  const [projects, subscription] = await Promise.all([
    listProjects(user.uid),
    getSubscription(user.uid),
  ]);

  const [websites, ads, brands] = await Promise.all([
    getStore().query("websites", [{ field: "userId", value: user.uid }]),
    getStore().query("ads", [{ field: "userId", value: user.uid }]),
    getStore().query("brands", [{ field: "userId", value: user.uid }]),
  ]);

  const plan = getPlan(subscription?.plan || "free");

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, href: "/dashboard/projects" },
    { label: "Websites", value: websites.length, icon: Globe, href: "/dashboard/website" },
    { label: "Ad campaigns", value: ads.length, icon: Megaphone, href: "/dashboard/ads" },
    { label: "Brand kits", value: brands.length, icon: Palette, href: "/dashboard/brand" },
  ];

  const generators = [
    { title: "Website Generator", desc: "Generate a full homepage.", icon: Globe, href: "/dashboard/website" },
    { title: "Ad Generator", desc: "Create multi-platform ads.", icon: Megaphone, href: "/dashboard/ads" },
    { title: "Brand Generator", desc: "Build a brand identity.", icon: Palette, href: "/dashboard/brand" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your Void Studios workspace.
          </p>
        </div>
        <Button asChild>
          <Link href="/onboarding"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>

      {!usingFirestore && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Running in local development datastore. Add a Firebase service account to persist to Firestore.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-colors hover:border-primary/50">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
                <s.icon className="h-8 w-8 text-primary/60" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {generators.map((g) => (
          <Card key={g.title}>
            <CardHeader>
              <div className="mb-2 grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <g.icon className="h-5 w-5" />
              </div>
              <CardTitle>{g.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{g.desc}</p>
              <Button asChild variant="outline" size="sm">
                <Link href={g.href}>Open <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <StatusRow label="AI generation" active={aiEnabled} activeLabel="OpenAI connected" inactiveLabel="Demo mode" />
          <StatusRow label="Payments" active={paymentsEnabled} activeLabel="Razorpay live" inactiveLabel="Sandbox mode" />
          <StatusRow label="Database" active={usingFirestore} activeLabel="Firestore" inactiveLabel="Local store" />
          <div className="sm:col-span-3">
            <Badge variant="outline">Plan: {plan?.name || "Free"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusRow({
  label,
  active,
  activeLabel,
  inactiveLabel,
}: {
  label: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={active ? "success" : "warning"}>{active ? activeLabel : inactiveLabel}</Badge>
    </div>
  );
}
