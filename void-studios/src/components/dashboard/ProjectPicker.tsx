"use client";
import * as React from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectPicker({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  if (projects.length === 0) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/onboarding"><Plus className="h-4 w-4" /> New project</Link>
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Select value={value ?? undefined} onValueChange={onChange}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.businessName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild size="icon" variant="outline" title="New project">
        <Link href="/onboarding"><Plus className="h-4 w-4" /></Link>
      </Button>
    </div>
  );
}
