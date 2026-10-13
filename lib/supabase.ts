import { createClient, type SupabaseClient, type RealtimeChannel } from '@supabase/supabase-js';

// Supabase environment settings
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function isSupabaseConfigured(): boolean {
  return (
    !!SUPABASE_URL &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('placeholder') &&
    !!(SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY)
  );
}

// Client-side or authenticated Supabase client
export function getSupabaseClient(firebaseIdToken?: string): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_ROLE_KEY, {
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
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, key, {
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
  payload: any
): Promise<void> {
  const client = getSupabaseAdmin() || getSupabaseClient();
  if (!client) return;

  const channel = client.channel(channelName);
  await channel.subscribe();
  await channel.send({
    type: 'broadcast',
    event: eventName,
    payload
  });
}
