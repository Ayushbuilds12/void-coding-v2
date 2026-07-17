"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { INDUSTRIES, GOALS } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Sparkles, ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Project } from "@/lib/types";

const STEPS = ["Business", "Industry", "Goal", "Budget", "Audience"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState({
    businessName: "",
    industry: "" as (typeof INDUSTRIES)[number] | "",
    goal: "" as (typeof GOALS)[number] | "",
    budget: "",
    targetAudience: "",
  });

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const canNext = () => {
    switch (step) {
      case 0: return form.businessName.trim().length > 0;
      case 1: return form.industry !== "";
      case 2: return form.goal !== "";
      case 3: return form.budget.trim().length > 0;
      case 4: return form.targetAudience.trim().length > 0;
      default: return false;
    }
  };

  const next = () => {
    if (!canNext()) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else submit();
  };

  const submit = async () => {
    setSubmitting(true);
    const res = await apiFetch<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (res.ok && res.data) {
      toast.success("Project created!");
      router.push(`/dashboard/website?project=${res.data.id}`);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to create project");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(220,38,38,0.12),_transparent_55%)]" />
      <div className="relative w-full max-w-xl">
        <div className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          Create your project
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                    i < step && "bg-primary text-primary-foreground",
                    i === step && "border-2 border-primary text-primary",
                    i > step && "border border-border text-muted-foreground"
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden text-[11px] text-muted-foreground sm:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-1 h-px flex-1", i < step ? "bg-primary" : "bg-border")} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          {step === 0 && (
            <div className="space-y-3">
              <Label htmlFor="bn">What&apos;s your business name?</Label>
              <Input
                id="bn"
                autoFocus
                value={form.businessName}
                onChange={(e) => set({ businessName: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="e.g. Sakura Sushi Bar"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <Label>Which industry are you in?</Label>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => set({ industry: ind })}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm transition-colors",
                      form.industry === ind
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label>What&apos;s your primary goal?</Label>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => set({ goal: g })}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm transition-colors",
                      form.goal === g
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <Label htmlFor="budget">What&apos;s your monthly marketing budget?</Label>
              <Input
                id="budget"
                autoFocus
                value={form.budget}
                onChange={(e) => set({ budget: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="e.g. ₹50,000 / month"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <Label htmlFor="aud">Describe your target audience</Label>
              <Textarea
                id="aud"
                autoFocus
                value={form.targetAudience}
                onChange={(e) => set({ targetAudience: e.target.value })}
                placeholder="e.g. Young professionals aged 25-40 in Delhi who love authentic Japanese cuisine"
                rows={4}
              />
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={next} disabled={!canNext() || submitting}>
              {step === STEPS.length - 1 ? (submitting ? "Creating…" : "Create project") : "Continue"}
              {step < STEPS.length - 1 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
