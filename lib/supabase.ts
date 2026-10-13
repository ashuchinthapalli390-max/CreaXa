import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js';

// Load .env automatically if running in Node.js
if (typeof process !== 'undefined' && typeof (process as any).loadEnvFile === 'function') {
  try {
    (process as any).loadEnvFile('.env');
  } catch {}
}

export function getSupabaseEnv(customEnv?: any) {
  const envObj = customEnv || {};
  const procEnv: Record<string, any> = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const globEnv: Record<string, any> = (typeof globalThis !== 'undefined' && (globalThis as any).env) ? (globalThis as any).env : {};

  const url =
    envObj.NEXT_PUBLIC_SUPABASE_URL ||
    envObj.SUPABASE_URL ||
    globEnv.NEXT_PUBLIC_SUPABASE_URL ||
    globEnv.SUPABASE_URL ||
    procEnv.NEXT_PUBLIC_SUPABASE_URL ||
    procEnv.SUPABASE_URL ||
    '';

  const anonKey =
    envObj.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    envObj.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    envObj.SUPABASE_ANON_KEY ||
    globEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    globEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    procEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    procEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    '';

  const serviceKey =
    envObj.SUPABASE_SERVICE_ROLE_KEY ||
    globEnv.SUPABASE_SERVICE_ROLE_KEY ||
    procEnv.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  return { url, anonKey, serviceKey };
}

// Supabase environment settings
export const SUPABASE_URL = getSupabaseEnv().url;
export const SUPABASE_ANON_KEY = getSupabaseEnv().anonKey;
export const SUPABASE_SERVICE_ROLE_KEY = getSupabaseEnv().serviceKey;

export function isSupabaseConfigured(customEnv?: any): boolean {
  const { url, anonKey, serviceKey } = getSupabaseEnv(customEnv);
  return (
    !!url &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    !!(anonKey || serviceKey)
  );
}

// Client-side or authenticated Supabase client
export function getSupabaseClient(firebaseIdToken?: string, customEnv?: any): SupabaseClient | null {
  if (!isSupabaseConfigured(customEnv)) {
    return null;
  }

  const { url, anonKey, serviceKey } = getSupabaseEnv(customEnv);
  const key = anonKey || serviceKey;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: firebaseIdToken
      ? {
          headers: {
            Authorization: `Bearer ${firebaseIdToken}`
          }
        }
      : undefined
  });
}

// Server-side admin client with service_role privileges
export function getSupabaseAdmin(customEnv?: any): SupabaseClient | null {
  if (!isSupabaseConfigured(customEnv)) {
    return null;
  }

  const { url, anonKey, serviceKey } = getSupabaseEnv(customEnv);
  const key = serviceKey || anonKey;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

// ------------------------------------------------------------------------------
// REALTIME SUBSCRIPTION HELPERS
// ------------------------------------------------------------------------------

/**
 * Subscribes to real-time events in a collaboration workspace (messages, deliverables, revisions).
 */
export function subscribeToWorkspaceEvents(
  engagementId: string,
  onEvent: (payload: any) => void
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  const channel: RealtimeChannel = client
    .channel(`workspace_${engagementId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'events',
        filter: `engagement=eq.${engagementId}`
      },
      (payload) => onEvent(payload.new)
    )
    .on('broadcast', { event: 'workspace_event' }, ({ payload }) => {
      if (payload.engagement === engagementId) onEvent(payload);
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

/**
 * Subscribes to real-time notifications for the current authenticated user.
 */
export function subscribeToUserNotifications(
  userId: string,
  onNotification: (payload: any) => void
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  const channel: RealtimeChannel = client
    .channel(`user_notifications_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `owner=eq.${userId}`
      },
      (payload) => onNotification(payload.new)
    )
    .on('broadcast', { event: 'new_notification' }, ({ payload }) => {
      if (payload.owner === userId) onNotification(payload);
    })
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

/**
 * Broadcasts a real-time event to connected workspace peers.
 */
export async function broadcastRealtimeEvent(
  channelName: string,
  eventName: string,
  payload: any,
  customEnv?: any
): Promise<void> {
  const client = getSupabaseAdmin(customEnv) || getSupabaseClient(undefined, customEnv);
  if (!client) return;

  const channel = client.channel(channelName);
  await channel.subscribe();
  await channel.send({
    type: 'broadcast',
    event: eventName,
    payload
  });
}

