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
    const KNOWN_MAP: Record<string, { email: string; name: string }> = {
      'OW6liwdp4ITceIP87vcmjozyo9U2': { email: 'admin@mail.com', name: 'CreaXa Administrator' },
      '7jp10RLjWMSYPDLT86v3pMgdCcK2': { email: 'creator@mail.com', name: 'CreaXa Creator' },
      'FElnevGuMnbYvsjkVpG9JDHMHM72': { email: 'bytxl@mail.com', name: 'CreaXa Studio' },
      'creator_alice': { email: 'creator_alice@sites.test', name: 'Alice Wonder' },
      'brand_acme': { email: 'brand_acme@sites.test', name: 'Acme Studios' }
    };
    const known = KNOWN_MAP[localCookie];
    const email = known ? known.email : `${localCookie}@creaxa.local`;
    const name = known ? known.name : localCookie;
    return {
      userId: localCookie,
      email,
      displayName: name,
      fullName: name,
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
