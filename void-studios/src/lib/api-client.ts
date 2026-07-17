"use client";
import { CSRF_COOKIE } from "@/lib/config";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  issues?: unknown;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (!["GET", "HEAD"].includes(method)) {
    const csrf = readCookie(CSRF_COOKIE);
    if (csrf) headers.set("x-csrf-token", csrf);
  }

  try {
    const res = await fetch(path, { ...options, headers, credentials: "same-origin" });
    const json = (await res.json().catch(() => ({}))) as ApiResult<T>;
    if (!res.ok) {
      return { ok: false, error: json.error || `Request failed (${res.status})`, issues: json.issues };
    }
    return json;
  } catch (e) {
    console.error("[api-client] network error", e);
    return { ok: false, error: "Network error. Please try again." };
  }
}
