import "server-only";
import { getStore } from "@/lib/store";
import { shortId } from "@/lib/utils";
import type { ActivityLog } from "@/lib/types";

/** Append an audit/activity log entry. Never throws to the caller. */
export async function logActivity(
  userId: string,
  action: string,
  meta?: Record<string, unknown>
): Promise<void> {
  try {
    const entry: ActivityLog = {
      id: shortId("log"),
      userId,
      action,
      meta,
      createdAt: new Date().toISOString(),
    };
    await getStore().create("activity_logs", entry);
  } catch (e) {
    console.error("[audit] failed to write log", e);
  }
}
