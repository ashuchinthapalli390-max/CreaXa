// Centralized Database Engine for CreaXa
// Powers Supabase PostgreSQL as primary production database with seamless local D1 fallback.

import { isSupabaseConfigured, getSupabaseAdmin, broadcastRealtimeEvent } from './supabase';
import { env } from 'cloudflare:workers';

export interface DbResult<T = any> {
  data: T | null;
  error?: any;
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '');
  const code = String(error.code || '');
  return code === 'PGRST205' || msg.includes('not find the table') || msg.includes('does not exist');
}

export const dbService = {
  isSupabase: isSupabaseConfigured,

  // ACCOUNTS
  async getAccount(id: string) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { data, error } = await sb.from('accounts').select('*').eq('id', id).maybeSingle();
          if (!error && data) return data;
          if (error && !isTableMissingError(error)) {
            console.warn('[CreaXa DB] Supabase getAccount warning:', error.message);
          }
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase getAccount fallback to D1:', err.message);
      }
    }
    const row = await env.DB?.prepare('SELECT * FROM accounts WHERE id=?').bind(id).first<any>();
    return row ? { ...row, data: row.data ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) : {} } : null;
  },

  async upsertAccount(account: { id: string; email: string; name: string; role: string; data: any; created: number; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { error } = await sb.from('accounts').upsert({
            id: account.id,
            email: account.email,
            name: account.name,
            role: account.role,
            data: account.data,
            created: account.created,
            updated: account.updated
          });
          if (!error) {
            supabaseSucceeded = true;
          } else if (isTableMissingError(error)) {
            console.warn('[CreaXa DB] Supabase table accounts missing. Writing to local D1 fallback.');
          } else {
            console.error('[CreaXa DB] Supabase upsertAccount error:', error.message);
          }
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase upsertAccount caught error:', err.message);
      }
    }
    try {
      await env.DB?.prepare('INSERT INTO accounts (id,email,name,role,data,created,updated) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,data=excluded.data,updated=excluded.updated')
        .bind(account.id, account.email, account.name, account.role, JSON.stringify(account.data), account.created, account.updated)
        .run();
    } catch (e: any) {
      if (!supabaseSucceeded) throw e;
    }
  },

  // PROFILES
  async getProfile(idOrSlug: string, isSlug = false) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const col = isSlug ? 'slug' : 'id';
          const query = sb.from('profiles').select('*').eq(col, idOrSlug);
          if (isSlug) query.eq('published', 1);
          const { data, error } = await query.maybeSingle();
          if (!error && data) return data;
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase getProfile fallback:', err.message);
      }
    }
    const sql = isSlug ? 'SELECT * FROM profiles WHERE slug=? AND published=1' : 'SELECT * FROM profiles WHERE id=?';
    const row = await env.DB?.prepare(sql).bind(idOrSlug).first<any>();
    return row ? { ...row, data: row.data ? (typeof row.data === 'string' ? JSON.parse(row.data) : row.data) : {} } : null;
  },

  async upsertProfile(profile: { id: string; slug: string; published: number; verification: string; data: any; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { error } = await sb.from('profiles').upsert(profile);
          if (!error) supabaseSucceeded = true;
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase upsertProfile fallback:', err.message);
      }
    }
    try {
      await env.DB?.prepare('INSERT INTO profiles (id,slug,published,verification,data,updated) VALUES (?,?,?,\'self-declared\',?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,published=excluded.published,data=excluded.data,updated=excluded.updated')
        .bind(profile.id, profile.slug, profile.published, JSON.stringify(profile.data), profile.updated)
        .run();
    } catch (e: any) {
      if (!supabaseSucceeded) throw e;
    }
  },

  // PORTFOLIOS
  async getPortfoliosByOwner(owner: string) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { data, error } = await sb.from('portfolios').select('*').eq('owner', owner).order('updated', { ascending: false });
          if (!error && data && data.length > 0) return data;
        }
      } catch {}
    }
    const rows = (await env.DB?.prepare('SELECT * FROM portfolios WHERE owner=? ORDER BY updated DESC').bind(owner).all())?.results || [];
    return rows.map((r: any) => ({ ...r, data: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {} }));
  },

  async getPublishedPortfoliosByOwner(owner: string) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { data, error } = await sb.from('portfolios').select('*').eq('owner', owner).eq('published', 1).order('updated', { ascending: false });
          if (!error && data && data.length > 0) return data;
        }
      } catch {}
    }
    const rows = (await env.DB?.prepare('SELECT * FROM portfolios WHERE owner=? AND published=1 ORDER BY updated DESC').bind(owner).all())?.results || [];
    return rows.map((r: any) => ({ ...r, data: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {} }));
  },

  async upsertPortfolio(p: { id: string; owner: string; slug: string; published: number; data: any; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { error } = await sb.from('portfolios').upsert(p);
          if (!error) supabaseSucceeded = true;
        }
      } catch {}
    }
    try {
      await env.DB?.prepare('INSERT INTO portfolios (id,owner,slug,published,data,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET published=excluded.published,data=excluded.data,updated=excluded.updated')
        .bind(p.id, p.owner, p.slug, p.published, JSON.stringify(p.data), p.updated)
        .run();
    } catch (e: any) {
      if (!supabaseSucceeded) throw e;
    }
  },

  async deletePortfolio(id: string, owner: string) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          await sb.from('portfolios').delete().eq('id', id).eq('owner', owner);
        }
      } catch {}
    }
    await env.DB?.prepare('DELETE FROM portfolios WHERE id=? AND owner=?').bind(id, owner).run();
  },

  // CAMPAIGNS
  async getCampaignsByOwner(owner: string) {
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { data, error } = await sb.from('campaigns').select('*').eq('owner', owner).order('updated', { ascending: false });
          if (!error && data && data.length > 0) return data;
        }
      } catch {}
    }
    const rows = (await env.DB?.prepare('SELECT * FROM campaigns WHERE owner=? ORDER BY updated DESC').bind(owner).all())?.results || [];
    return rows.map((r: any) => ({ ...r, data: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {} }));
  },

  async upsertCampaign(c: { id: string; owner: string; status: string; data: any; created: number; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          const { error } = await sb.from('campaigns').upsert(c);
          if (!error) supabaseSucceeded = true;
        }
      } catch {}
    }
    try {
      await env.DB?.prepare('INSERT INTO campaigns (id,owner,status,data,created,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,data=excluded.data,updated=excluded.updated')
        .bind(c.id, c.owner, c.status, JSON.stringify(c.data), c.created, c.updated)
        .run();
    } catch (e: any) {
      if (!supabaseSucceeded) throw e;
    }
  },

  // NOTIFICATIONS (With Realtime Broadcast)
  async addNotification(owner: string, title: string, href: string) {
    const id = crypto.randomUUID();
    const created = Date.now();
    const notif = { id, owner, title, href, read: 0, created };

    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          await sb.from('notifications').insert(notif);
          await broadcastRealtimeEvent(`user_notifications_${owner}`, 'new_notification', notif);
        }
      } catch {}
    }
    await env.DB?.prepare('INSERT INTO notifications (id,owner,title,href,read,created) VALUES (?,?,?,?,0,?)').bind(id, owner, title, href, created).run();
  },

  // WORKSPACE EVENTS (With Realtime Broadcast)
  async addEvent(event: { id?: string; engagement: string; author: string; type: string; data: any; created?: number }) {
    const id = event.id || crypto.randomUUID();
    const created = event.created || Date.now();
    const row = { id, engagement: event.engagement, author: event.author, type: event.type, data: event.data, created };

    if (isSupabaseConfigured()) {
      try {
        const sb = getSupabaseAdmin();
        if (sb) {
          await sb.from('events').insert(row);
          await broadcastRealtimeEvent(`workspace_${event.engagement}`, 'workspace_event', row);
        }
      } catch {}
    }
    await env.DB?.prepare('INSERT INTO events (id,engagement,author,type,data,created) VALUES (?,?,?,?,?,?)')
      .bind(id, event.engagement, event.author, event.type, JSON.stringify(event.data), created)
      .run();
    return row;
  }
};
