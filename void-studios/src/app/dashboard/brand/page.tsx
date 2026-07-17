"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { useProjects } from "@/components/dashboard/useProjects";
import { ProjectPicker } from "@/components/dashboard/ProjectPicker";
import { EmptyProjects } from "@/components/dashboard/EmptyProjects";
import type { Brand } from "@/lib/types";
import { Palette, Sparkles, RefreshCw } from "lucide-react";

export default function BrandGeneratorPage() {
  const { projects, selected, setSelected, current, loading } = useProjects();
  const [brand, setBrand] = React.useState<Brand | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (!selected) {
      setBrand(null);
      return;
    }
    let active = true;
    setFetching(true);
    (async () => {
      const res = await apiFetch<{ brand: Brand | null }>(`/api/projects/${selected}/assets`);
      if (!active) return;
      if (res.ok && res.data?.brand) setBrand(res.data.brand);
      else setBrand(null);
      setFetching(false);
    })();
    return () => {
      active = false;
    };
  }, [selected]);

  const generate = async () => {
    if (!current) return;
    setGenerating(true);
    const res = await apiFetch<Brand>("/api/generate/brand", {
      method: "POST",
      body: JSON.stringify({
        projectId: current.id,
        businessName: current.businessName,
        industry: current.industry,
        targetAudience: current.targetAudience,
      }),
    });
    setGenerating(false);
    if (res.ok && res.data) {
      setBrand(res.data);
      toast.success("Brand kit generated!");
    } else {
      toast.error(res.error || "Generation failed");
    }
  };

  if (loading) return <PageSkeleton />;
  if (projects.length === 0) return <EmptyProjects />;

  const content = brand?.content;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Brand Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A cohesive brand identity in seconds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectPicker projects={projects} value={selected} onChange={setSelected} />
          {content && (
            <Button variant="outline" size="sm" onClick={generate} disabled={generating}>
              <RefreshCw className="h-4 w-4" /> {generating ? "…" : "Regenerate"}
            </Button>
          )}
        </div>
      </div>

      {fetching ? (
        <PageSkeleton bare />
      ) : !content ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
              <Palette className="h-7 w-7" />
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              No brand kit yet. Generate positioning, colors, typography, voice and
              logo concepts for {current?.businessName}.
            </p>
            <Button onClick={generate} disabled={generating}>
              <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate brand kit"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Brand positioning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{content.positioning}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color palette</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {content.colorPalette.map((c) => (
                <div key={c.hex + c.name} className="rounded-lg border border-border p-3">
                  <div className="h-16 w-full rounded-md border border-border" style={{ background: c.hex }} />
                  <div className="mt-2 text-sm font-medium">{c.name}</div>
                  <div className="text-xs uppercase text-muted-foreground">{c.hex}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.usage}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Typography</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Heading: </span>{content.typography.heading}</div>
                <div><span className="text-muted-foreground">Body: </span>{content.typography.body}</div>
                <p className="text-muted-foreground">{content.typography.rationale}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Brand voice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{content.brandVoice}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Logo concepts</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {content.logoConcepts.map((l) => (
                <div key={l.name} className="rounded-lg border border-border p-4">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{l.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function PageSkeleton({ bare }: { bare?: boolean }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {!bare && <Skeleton className="h-10 w-64" />}
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
