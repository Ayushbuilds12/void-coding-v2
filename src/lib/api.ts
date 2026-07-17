// Shared HTTP helper for authenticated API requests.
//
// Centralizes the `Authorization: Bearer <token>` header, JSON body
// serialization and the `Content-Type: application/json` header that were
// previously duplicated across every component that talked to the backend
// (and to the Google APIs from the workspace view).

export interface ApiRequestOptions {
  /** Bearer token; when provided an `Authorization` header is attached. */
  token?: string | null;
  /** HTTP method. Defaults to `POST` when a body is present, otherwise `GET`. */
  method?: string;
  /** Extra headers merged on top of the defaults. */
  headers?: Record<string, string>;
  /**
   * JSON-serializable payload. Automatically stringified and sent with a
   * `Content-Type: application/json` header (unless one is supplied).
   */
  json?: unknown;
  /** Raw body for non-JSON payloads; set your own `Content-Type` via `headers`. */
  body?: BodyInit;
  /** Optional abort signal forwarded to `fetch`. */
  signal?: AbortSignal;
}

/**
 * Thin wrapper around `fetch` that returns the raw `Response`, so callers keep
 * full control over `res.ok`/`res.json()` handling.
 */
export function apiFetch(url: string, options: ApiRequestOptions = {}): Promise<Response> {
  const { token, method, headers, json, body, signal } = options;

  const finalHeaders: Record<string, string> = { ...headers };
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let finalBody: BodyInit | undefined = body;
  if (json !== undefined) {
    if (finalHeaders['Content-Type'] === undefined) {
      finalHeaders['Content-Type'] = 'application/json';
    }
    finalBody = JSON.stringify(json);
  }

  return fetch(url, {
    method: method ?? (finalBody !== undefined ? 'POST' : 'GET'),
    headers: finalHeaders,
    ...(finalBody !== undefined ? { body: finalBody } : {}),
    ...(signal ? { signal } : {}),
  });
}
