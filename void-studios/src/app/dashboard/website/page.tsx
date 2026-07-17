"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { useProjects } from "@/components/dashboard/useProjects";
import { ProjectPicker } from "@/components/dashboard/ProjectPicker";
import { EmptyProjects } from "@/components/dashboard/EmptyProjects";
import type { Website, WebsiteContent } from "@/lib/types";
import { Globe, Sparkles, Save, RefreshCw } from "lucide-react";

export default function WebsiteGeneratorPage() {
  const { projects, selected, setSelected, current, loading } = useProjects();
  const [website, setWebsite] = React.useState<Website | null>(null);
  const [content, setContent] = React.useState<WebsiteContent | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (!selected) {
      setWebsite(null);
      setContent(null);
      return;
    }
    let active = true;
    setFetching(true);
    (async () => {
      const res = await apiFetch<{ website: Website | null }>(
        `/api/projects/${selected}/assets`
      );
      if (!active) return;
      if (res.ok && res.data?.website) {
        setWebsite(res.data.website);
        setContent(res.data.website.content);
      } else {
        setWebsite(null);
        setContent(null);
      }
      setFetching(false);
    })();
    return () => {
      active = false;
    };
  }, [selected]);

  const generate = async () => {
    if (!current) return;
    setGenerating(true);
    const res = await apiFetch<Website>("/api/generate/website", {
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
      setWebsite(res.data);
      setContent(res.data.content);
      toast.success("Website content generated!");
    } else {
      toast.error(res.error || "Generation failed");
    }
  };

  const save = async () => {
    if (!website || !content) return;
    setSaving(true);
    const res = await apiFetch<Website>(`/api/websites/${website.id}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (res.ok && res.data) {
      setWebsite(res.data);
      toast.success("Saved");
    } else {
      toast.error(res.error || "Save failed");
    }
  };

  if (loading) return <PageSkeleton />;
  if (projects.length === 0) return <EmptyProjects />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Header
        selected={selected}
        setSelected={setSelected}
        projects={projects}
        onGenerate={generate}
        generating={generating}
        hasContent={Boolean(content)}
      />

      {fetching ? (
        <PageSkeleton bare />
      ) : !content ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">No website yet</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Generate a full homepage — hero, about, services, testimonials, CTA,
                contact and SEO — for {current?.businessName}.
              </p>
            </div>
            <Button onClick={generate} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              {generating ? "Generating…" : "Generate website"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <WebsiteEditor content={content} setContent={setContent} onSave={save} saving={saving} />
      )}
    </div>
  );
}

function Header({
  selected,
  setSelected,
  projects,
  onGenerate,
  generating,
  hasContent,
}: {
  selected: string | null;
  setSelected: (id: string) => void;
  projects: ReturnType<typeof useProjects>["projects"];
  onGenerate: () => void;
  generating: boolean;
  hasContent: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Website Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated, fully editable homepage content.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ProjectPicker projects={projects} value={selected} onChange={setSelected} />
        {hasContent && (
          <Button variant="outline" size="sm" onClick={onGenerate} disabled={generating}>
            <RefreshCw className="h-4 w-4" /> {generating ? "…" : "Regenerate"}
          </Button>
        )}
      </div>
    </div>
  );
}

function WebsiteEditor({
  content,
  setContent,
  onSave,
  saving,
}: {
  content: WebsiteContent;
  setContent: React.Dispatch<React.SetStateAction<WebsiteContent | null>>;
  onSave: () => void;
  saving: boolean;
}) {
  const update = (patch: Partial<WebsiteContent>) =>
    setContent((c) => (c ? { ...c, ...patch } : c));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <Section title="SEO">
        <Field label="Meta title" value={content.seoTitle} onChange={(v) => update({ seoTitle: v })} />
        <Field label="Meta description" value={content.seoDescription} onChange={(v) => update({ seoDescription: v })} textarea />
      </Section>

      <Section title="Hero">
        <Field label="Headline" value={content.hero.headline} onChange={(v) => update({ hero: { ...content.hero, headline: v } })} />
        <Field label="Subheadline" value={content.hero.subheadline} onChange={(v) => update({ hero: { ...content.hero, subheadline: v } })} textarea />
        <Field label="CTA label" value={content.hero.ctaLabel} onChange={(v) => update({ hero: { ...content.hero, ctaLabel: v } })} />
      </Section>

      <Section title="About">
        <Field label="Title" value={content.about.title} onChange={(v) => update({ about: { ...content.about, title: v } })} />
        <Field label="Body" value={content.about.body} onChange={(v) => update({ about: { ...content.about, body: v } })} textarea />
      </Section>

      <Section title="Services">
        <Field label="Section title" value={content.services.title} onChange={(v) => update({ services: { ...content.services, title: v } })} />
        {content.services.items.map((item, i) => (
          <div key={i} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
            <Field
              label={`Service ${i + 1} name`}
              value={item.name}
              onChange={(v) => {
                const items = [...content.services.items];
                items[i] = { ...items[i], name: v };
                update({ services: { ...content.services, items } });
              }}
            />
            <Field
              label="Description"
              value={item.description}
              onChange={(v) => {
                const items = [...content.services.items];
                items[i] = { ...items[i], description: v };
                update({ services: { ...content.services, items } });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="Testimonials">
        {content.testimonials.map((t, i) => (
          <div key={i} className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
            <Field
              label="Author"
              value={t.author}
              onChange={(v) => {
                const testimonials = [...content.testimonials];
                testimonials[i] = { ...testimonials[i], author: v };
                update({ testimonials });
              }}
            />
            <Field
              label="Role"
              value={t.role}
              onChange={(v) => {
                const testimonials = [...content.testimonials];
                testimonials[i] = { ...testimonials[i], role: v };
                update({ testimonials });
              }}
            />
            <div className="sm:col-span-2">
              <Field
                label="Quote"
                value={t.quote}
                textarea
                onChange={(v) => {
                  const testimonials = [...content.testimonials];
                  testimonials[i] = { ...testimonials[i], quote: v };
                  update({ testimonials });
                }}
              />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Call to action">
        <Field label="Headline" value={content.cta.headline} onChange={(v) => update({ cta: { ...content.cta, headline: v } })} />
        <Field label="Button label" value={content.cta.buttonLabel} onChange={(v) => update({ cta: { ...content.cta, buttonLabel: v } })} />
      </Section>

      <Section title="Contact">
        <Field label="Headline" value={content.contact.headline} onChange={(v) => update({ contact: { ...content.contact, headline: v } })} />
        <Field label="Email" value={content.contact.email} onChange={(v) => update({ contact: { ...content.contact, email: v } })} />
        <Field label="Phone" value={content.contact.phone} onChange={(v) => update({ contact: { ...content.contact, phone: v } })} />
        <Field label="Address" value={content.contact.address} onChange={(v) => update({ contact: { ...content.contact, address: v } })} />
      </Section>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function PageSkeleton({ bare }: { bare?: boolean }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {!bare && <Skeleton className="h-10 w-64" />}
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
