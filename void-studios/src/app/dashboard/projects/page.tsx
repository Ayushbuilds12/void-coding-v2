"use client";
import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { Plus, Search, Pencil, Trash2, Globe, Megaphone, Palette } from "lucide-react";

const PAGE_SIZE = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleting, setDeleting] = React.useState<Project | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await apiFetch<Project[]>("/api/projects");
    if (res.ok && res.data) setProjects(res.data);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = projects.filter((p) =>
    [p.businessName, p.industry, p.goal].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    const res = await apiFetch<Project>(`/api/projects/${editing.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        businessName: editing.businessName,
        budget: editing.budget,
        targetAudience: editing.targetAudience,
      }),
    });
    setBusy(false);
    if (res.ok) {
      toast.success("Project updated");
      setEditing(null);
      load();
    } else {
      toast.error(res.error || "Update failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const res = await apiFetch(`/api/projects/${deleting.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      toast.success("Project deleted");
      setDeleting(null);
      load();
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your businesses and generated assets.</p>
        </div>
        <Button asChild>
          <Link href="/onboarding"><Plus className="h-4 w-4" /> New project</Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search projects…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            {search ? "No projects match your search." : "No projects yet. Create your first one."}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {current.map((p) => (
              <Card key={p.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{p.businessName}</h3>
                    <Badge variant="secondary">{p.industry}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.targetAudience}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{p.goal}</Badge>
                    <Badge variant="outline">{p.budget}</Badge>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">Updated {formatDate(p.updatedAt)}</div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/website?project=${p.id}`}><Globe className="h-3.5 w-3.5" /> Website</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/ads?project=${p.id}`}><Megaphone className="h-3.5 w-3.5" /> Ads</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/brand?project=${p.id}`}><Palette className="h-3.5 w-3.5" /> Brand</Link>
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditing({ ...p })}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary"
                      onClick={() => setDeleting(p)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Business name</Label>
                <Input
                  value={editing.businessName}
                  onChange={(e) => setEditing({ ...editing, businessName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <Input value={editing.budget} onChange={(e) => setEditing({ ...editing, budget: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Target audience</Label>
                <Textarea
                  value={editing.targetAudience}
                  onChange={(e) => setEditing({ ...editing, targetAudience: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete <strong>{deleting?.businessName}</strong> and all its
            generated websites, ads and branding. This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
