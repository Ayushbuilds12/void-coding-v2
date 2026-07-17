import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";
import { getUserFromRequest } from "@/lib/auth/server";
import type { SessionUser } from "@/lib/auth/session";
import { rateLimit } from "@/lib/rate-limit";
import { CSRF_COOKIE } from "@/lib/config";

export function ok<T>(data: T, init?: number): NextResponse {
  return NextResponse.json({ ok: true, data }, { status: init ?? 200 });
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "local";
}

/**
 * Enforce CSRF via the double-submit-cookie pattern for state-changing requests.
 * The middleware issues a `vs_csrf` cookie; the client echoes it in `x-csrf-token`.
 */
function csrfValid(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;
  const cookie = req.cookies.get(CSRF_COOKIE)?.value;
  const header = req.headers.get("x-csrf-token");
  return Boolean(cookie && header && cookie === header);
}

interface HandlerCtx<TBody> {
  req: NextRequest;
  user: SessionUser;
  body: TBody;
  params: Record<string, string>;
}

interface RouteOptions<TBody> {
  schema?: ZodSchema<TBody>;
  rateLimit?: { limit: number; windowMs?: number };
  requireCsrf?: boolean;
}

type NextRouteParams = { params: Promise<Record<string, string>> };

/**
 * Wrap an authenticated API route handler with session auth, CSRF protection,
 * rate limiting, input validation and uniform error handling.
 */
export function withAuth<TBody = unknown>(
  handler: (ctx: HandlerCtx<TBody>) => Promise<NextResponse>,
  options: RouteOptions<TBody> = {}
) {
  return async (req: NextRequest, routeCtx: NextRouteParams): Promise<NextResponse> => {
    try {
      const user = await getUserFromRequest(req);
      if (!user) return fail("Unauthorized", 401);

      if (options.requireCsrf !== false && !csrfValid(req)) {
        return fail("Invalid CSRF token", 403);
      }

      if (options.rateLimit) {
        const key = `${user.uid}:${new URL(req.url).pathname}`;
        const rl = rateLimit(key, options.rateLimit.limit, options.rateLimit.windowMs);
        if (!rl.allowed) return fail("Rate limit exceeded. Try again shortly.", 429);
      }

      let body = {} as TBody;
      if (options.schema) {
        let raw: unknown = {};
        try {
          raw = await req.json();
        } catch {
          raw = {};
        }
        const parsed = options.schema.safeParse(raw);
        if (!parsed.success) {
          return fail("Validation failed", 422, {
            issues: parsed.error.flatten(),
          });
        }
        body = parsed.data;
      }

      const params = routeCtx?.params ? await routeCtx.params : ({} as Record<string, string>);
      return await handler({ req, user, body, params });
    } catch (e) {
      console.error("[api] unhandled error", e);
      return fail("Internal server error", 500);
    }
  };
}

/** Public (unauthenticated) route wrapper with rate limiting + error handling. */
export function withPublic(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: { rateLimit?: { limit: number; windowMs?: number } } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      if (options.rateLimit) {
        const key = `${clientIp(req)}:${new URL(req.url).pathname}`;
        const rl = rateLimit(key, options.rateLimit.limit, options.rateLimit.windowMs);
        if (!rl.allowed) return fail("Rate limit exceeded. Try again shortly.", 429);
      }
      return await handler(req);
    } catch (e) {
      console.error("[api] unhandled error", e);
      return fail("Internal server error", 500);
    }
  };
}

export { z };
