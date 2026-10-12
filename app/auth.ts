import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifySessionToken,
  parseCookies,
} from "../lib/auth";

export * from "../lib/auth";

export type AuthUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
  role?: string;
};

const SESSION_COOKIE_NAME = "creaxa_session";

export async function getAuthUser(req?: Request): Promise<AuthUser | null> {
  let cookieHeader: string | null = null;
  let requestHeaders: Headers | null = null;

  if (req) {
    cookieHeader = req.headers.get("cookie");
  } else {
    try {
      requestHeaders = await headers();
      cookieHeader = requestHeaders.get("cookie");
    } catch {
      // In non-SSR contexts headers() might not be available
    }
  }

  // 1. Check native session cookie
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

  // 2. Compatibility check for test runner / header mocking
  const h = req ? req.headers : requestHeaders;
  if (h) {
    const userId = h.get("oai-authenticated-user-id");
    const email = h.get("oai-authenticated-user-email");
    if (userId && email) {
      const fullName = h.get("oai-authenticated-user-full-name");
      return {
        userId,
        displayName: fullName ?? email,
        email,
        fullName: fullName ?? null,
      };
    }
  }

  return null;
}

export async function requireAuthUser(returnTo = "/"): Promise<AuthUser> {
  const user = await getAuthUser();
  if (user) return user;
  redirect(`/login?return_to=${encodeURIComponent(returnTo)}`);
}

// Backwards compatibility aliases for existing imports & tests
export const getChatGPTUser = getAuthUser;
export const requireChatGPTUser = requireAuthUser;
export type ChatGPTUser = AuthUser;
