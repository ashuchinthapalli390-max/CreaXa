// Pure Web Crypto authentication and session helpers (0 external dependencies)

const SESSION_COOKIE_NAME = "creaxa_session";
const DEFAULT_SESSION_SECRET = "creaxa_secret_key_production_standalone_2026_super_secure_vault";

function getSessionSecret(): string {
  if (typeof process !== "undefined" && process.env?.SESSION_SECRET) {
    return process.env.SESSION_SECRET;
  }
  return DEFAULT_SESSION_SECRET;
}

function toBase64Url(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf8").toString("base64url");
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(base64url: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64url, "base64url").toString("utf8");
  }
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(base64);
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function hashPassword(password: string, salt = crypto.randomUUID()): Promise<{ salt: string; hash: string }> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 10000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hash = bytesToHex(new Uint8Array(derivedBits));
  return { salt, hash };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === expectedHash;
}

export async function createSessionToken(payload: {
  userId: string;
  email: string;
  name: string;
  role?: string;
}): Promise<string> {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const data = JSON.stringify({ ...payload, exp });
  const encodedPayload = toBase64Url(data);

  const enc = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    enc.encode(encodedPayload)
  );
  const signatureHex = bytesToHex(new Uint8Array(signatureBuffer));

  return `${encodedPayload}.${signatureHex}`;
}

export async function verifySessionToken(token: string): Promise<{
  userId: string;
  email: string;
  name: string;
  role?: string;
} | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signatureHex] = parts;

    const enc = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(getSessionSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      secretKey,
      enc.encode(encodedPayload)
    );
    const expectedSigHex = bytesToHex(new Uint8Array(expectedSigBuffer));

    if (signatureHex !== expectedSigHex) return null;

    const payload = JSON.parse(fromBase64Url(encodedPayload));
    if (typeof payload.exp === "number" && payload.exp < Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  const cookies: Record<string, string> = {};
  for (const item of header.split(";")) {
    const [k, ...v] = item.trim().split("=");
    if (k) cookies[k] = decodeURIComponent(v.join("="));
  }
  return cookies;
}

export type AuthUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
  role?: string;
};

export async function getAuthUser(req?: Request): Promise<AuthUser | null> {
  if (!req) return null;
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = parseCookies(cookieHeader);
    const sessionToken = cookies[SESSION_COOKIE_NAME];
    if (sessionToken) {
      const session = await verifySessionToken(sessionToken);
      if (session) {
        return {
          userId: session.userId,
          displayName: session.name || session.email,
          email: session.email,
          fullName: session.name || null,
          role: session.role,
        };
      }
    }
  }
  const userId = req.headers.get("oai-authenticated-user-id");
  const email = req.headers.get("oai-authenticated-user-email");
  if (userId && email) {
    const fullName = req.headers.get("oai-authenticated-user-full-name");
    return {
      userId,
      displayName: fullName ?? email,
      email,
      fullName: fullName ?? null,
    };
  }
  return null;
}

export function buildSessionCookie(token: string, maxAge = 30 * 24 * 3600): string {
  const isSecure = (typeof process !== "undefined" && process.env?.NODE_ENV === "production") ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isSecure}`;
}

export function buildClearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
