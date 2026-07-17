import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

export function EmptyProjects() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
            <FolderKanban className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Create your first project</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Projects hold your business details. Create one to start generating
              websites, ads and branding.
            </p>
          </div>
          <Button asChild>
            <Link href="/onboarding"><Plus className="h-4 w-4" /> New project</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
