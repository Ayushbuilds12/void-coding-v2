"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import type { Project } from "@/lib/types";

export function useProjects() {
  const params = useSearchParams();
  const initial = params.get("project");
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selected, setSelected] = React.useState<string | null>(initial);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const res = await apiFetch<Project[]>("/api/projects");
      if (!active) return;
      if (res.ok && res.data) {
        setProjects(res.data);
        setSelected((cur) => cur || res.data![0]?.id || null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const current = projects.find((p) => p.id === selected) || null;
  return { projects, selected, setSelected, current, loading };
}
