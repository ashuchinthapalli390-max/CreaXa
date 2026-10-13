import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseCookies, verifyFirebaseIdToken, type AuthenticatedUser } from "../lib/auth-edge";

export type AuthUser = AuthenticatedUser;

export async function getAuthUser(): Promise<AuthUser | null> {
  const requestHeaders = await headers();

  // 1. Check Authorization header
  const authHeader = requestHeaders.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const verified = await verifyFirebaseIdToken(authHeader.slice(7).trim());
    if (verified) return verified;
  }

  // 2. Check session cookies
  const cookieHeader = requestHeaders.get("cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies["__session"] || cookies["firebase_token"];
  if (token) {
    const verified = await verifyFirebaseIdToken(token);
    if (verified) return verified;
  }

  // 3. Fallback for testing / dev multi-identity cookie or dev server injected header
  const localCookie = cookies["__sites_local_auth"];
  if (localCookie) {
    return {
      userId: localCookie,
      email: `${localCookie}@creaxa.local`,
      displayName: localCookie,
      fullName: localCookie,
      provider: "local_dev"
    };
  }

  const legacyUserId = requestHeaders.get("oai-authenticated-user-id") || requestHeaders.get("x-user-id");
  if (legacyUserId) {
    const email = requestHeaders.get("oai-authenticated-user-email") || `${legacyUserId}@creaxa.local`;
    const name = requestHeaders.get("oai-authenticated-user-full-name") || legacyUserId;
    return {
      userId: legacyUserId,
      email,
      displayName: name,
      fullName: name,
      provider: "local_dev"
    };
  }

  return null;
}

export async function requireAuthUser(returnTo: string): Promise<AuthUser> {
  const user = await getAuthUser();
  if (user) return user;

  redirect(`/login?return_to=${encodeURIComponent(returnTo)}`);
}

// Backward-compatible aliases for legacy imports
export const getChatGPTUser = getAuthUser;
export const requireChatGPTUser = requireAuthUser;
