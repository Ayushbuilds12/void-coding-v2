"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { useProjects } from "@/components/dashboard/useProjects";
import { ProjectPicker } from "@/components/dashboard/ProjectPicker";
import { EmptyProjects } from "@/components/dashboard/EmptyProjects";
import { cn } from "@/lib/utils";
import type { AdCampaign, AdPlatform } from "@/lib/types";
import { Megaphone, Sparkles, RefreshCw, Copy } from "lucide-react";

const PLATFORMS: AdPlatform[] = ["Facebook", "Instagram", "Google", "YouTube"];

export default function AdGeneratorPage() {
  const { projects, selected, setSelected, current, loading } = useProjects();
  const [campaign, setCampaign] = React.useState<AdCampaign | null>(null);
  const [platforms, setPlatforms] = React.useState<AdPlatform[]>(PLATFORMS);
  const [generating, setGenerating] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (!selected) {
      setCampaign(null);
      return;
    }
    let active = true;
    setFetching(true);
    (async () => {
      const res = await apiFetch<{ ads: AdCampaign | null }>(`/api/projects/${selected}/assets`);
      if (!active) return;
      if (res.ok && res.data?.ads) setCampaign(res.data.ads);
      else setCampaign(null);
      setFetching(false);
    })();
    return () => {
      active = false;
    };
  }, [selected]);

  const togglePlatform = (p: AdPlatform) =>
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  const generate = async () => {
    if (!current) return;
    if (platforms.length === 0) {
      toast.error("Select at least one platform");
      return;
    }
    setGenerating(true);
    const res = await apiFetch<AdCampaign>("/api/generate/ads", {
      method: "POST",
      body: JSON.stringify({
        projectId: current.id,
        businessName: current.businessName,
        industry: current.industry,
        goal: current.goal,
        targetAudience: current.targetAudience,
        platforms,
      }),
    });
    setGenerating(false);
    if (res.ok && res.data) {
      setCampaign(res.data);
      toast.success("Ad campaign generated!");
    } else {
      toast.error(res.error || "Generation failed");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied to clipboard"));
  };

  if (loading) return <PageSkeleton />;
  if (projects.length === 0) return <EmptyProjects />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Ad Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-platform ad creatives that convert.
          </p>
        </div>
        <ProjectPicker projects={projects} value={selected} onChange={setSelected} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm transition-colors",
                  platforms.includes(p)
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <Button className="mt-5" onClick={generate} disabled={generating}>
            {campaign ? <RefreshCw className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {generating ? "Generating…" : campaign ? "Regenerate ads" : "Generate ads"}
          </Button>
        </CardContent>
      </Card>

      {fetching ? (
        <PageSkeleton bare />
      ) : !campaign ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
              <Megaphone className="h-7 w-7" />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              No ad campaign yet. Pick platforms and generate high-converting ads for{" "}
              {current?.businessName}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaign.ads.map((ad, i) => (
            <Card key={`${ad.platform}-${i}`}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <Badge>{ad.platform}</Badge>
                <button
                  onClick={() =>
                    copy(`${ad.headline}\n\n${ad.primaryText}\n\nOffer: ${ad.offer}\nCTA: ${ad.cta}`)
                  }
                  className="text-muted-foreground hover:text-foreground"
                  title="Copy ad"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Detail label="Headline" value={ad.headline} />
                <Detail label="Primary text" value={ad.primaryText} />
                <div className="grid grid-cols-2 gap-3">
                  <Detail label="CTA" value={ad.cta} />
                  <Detail label="Offer" value={ad.offer} />
                </div>
                <Detail label="Target audience" value={ad.targetAudience} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-foreground">{value}</div>
    </div>
  );
}

function PageSkeleton({ bare }: { bare?: boolean }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {!bare && <Skeleton className="h-10 w-64" />}
      <Skeleton className="h-32 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-52 w-full" />
      </div>
    </div>
  );
}
