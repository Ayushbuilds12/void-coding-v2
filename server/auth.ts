import crypto from "crypto";

// ==========================================
// SESSION TOKEN SIGNING (HMAC) & PASSWORD HASHING
// ==========================================
//
// Bearer tokens are cryptographically signed so they cannot be forged by a
// client. Previously the bearer token was simply the raw userId, which allowed
// anyone to impersonate any user by guessing/knowing their id.

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) {
    return secret;
  }
  // Fall back to an ephemeral per-process secret so tokens are still
  // unforgeable. Tokens will not survive a restart until SESSION_SECRET is set.
  if (!ephemeralSecret) {
    ephemeralSecret = crypto.randomBytes(32).toString("hex");
    console.warn(
      "SESSION_SECRET is not set (or too short). Using an ephemeral secret; " +
        "all sessions will be invalidated on restart. Set SESSION_SECRET in production."
    );
  }
  return ephemeralSecret;
}

let ephemeralSecret: string | null = null;

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(payloadB64: string): string {
  return base64url(
    crypto.createHmac("sha256", getSessionSecret()).update(payloadB64).digest()
  );
}

/**
 * Issues a signed session token binding the given userId. The returned string
 * is opaque to the client and must be presented as a Bearer token.
 */
export function signSessionToken(userId: string): string {
  const payload = JSON.stringify({ uid: userId, iat: Date.now() });
  const payloadB64 = base64url(payload);
  return `${payloadB64}.${sign(payloadB64)}`;
}

/**
 * Verifies a signed session token. Returns the userId when the signature is
 * valid and the token has not expired, otherwise null.
 */
export function verifySessionToken(token: string): string | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expected = sign(payloadB64);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );
    if (!payload || typeof payload.uid !== "string") return null;
    if (typeof payload.iat !== "number" || Date.now() - payload.iat > TOKEN_TTL_MS) {
      return null;
    }
    return payload.uid;
  } catch {
    return null;
  }
}

// ==========================================
// PASSWORD HASHING (scrypt + per-password salt)
// ==========================================

const SCRYPT_KEYLEN = 64;

/**
 * Hashes a plaintext password using scrypt with a random salt.
 * Output format: scrypt$<saltHex>$<hashHex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored hash produced by hashPassword.
 * Uses a constant-time comparison to avoid timing attacks.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || typeof stored !== "string") return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  try {
    const derived = crypto.scryptSync(password, salt, expected.length);
    return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
