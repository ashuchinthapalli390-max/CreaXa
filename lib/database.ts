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

function parseDataField(val: any): any {
  if (!val) return {};
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

export const dbService = {
  isSupabase: (workerEnv?: any) => isSupabaseConfigured(workerEnv || env),

  // ACCOUNTS
  async getAccount(id: string) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const { data, error } = await sb.from('accounts').select('*').eq('id', id).maybeSingle();
          if (!error && data) {
            return {
              ...data,
              data: parseDataField(data.data)
            };
          }
          if (error && !isTableMissingError(error)) {
            console.warn('[CreaXa DB] Supabase getAccount warning:', error.message);
          }
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase getAccount fallback to D1:', err.message);
      }
    }
    if (!env?.DB) return null;
    try {
      const row = await env.DB.prepare('SELECT * FROM accounts WHERE id=?').bind(id).first<any>();
      return row ? { ...row, data: parseDataField(row.data) } : null;
    } catch (e: any) {
      console.warn('[CreaXa DB] D1 getAccount error:', e.message);
      return null;
    }
  },

  async upsertAccount(account: { id: string; email: string; name: string; role: string; data: any; created: number; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const payload = {
            id: account.id,
            email: account.email,
            name: account.name,
            role: account.role,
            data: typeof account.data === 'string' ? parseDataField(account.data) : (account.data || {}),
            created: Number(account.created),
            updated: Number(account.updated)
          };
          const { error } = await sb.from('accounts').upsert(payload);
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
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO accounts (id,email,name,role,data,created,updated) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,data=excluded.data,updated=excluded.updated')
          .bind(account.id, account.email, account.name, account.role, typeof account.data === 'string' ? account.data : JSON.stringify(account.data || {}), account.created, account.updated)
          .run();
      } catch (e: any) {
        if (!supabaseSucceeded) throw e;
      }
    } else if (!supabaseSucceeded) {
      throw new Error('Database is unavailable: neither Supabase nor D1 could record the account.');
    }
  },

  // PROFILES
  async getProfile(idOrSlug: string, isSlug = false) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const col = isSlug ? 'slug' : 'id';
          let query = sb.from('profiles').select('*').eq(col, idOrSlug);
          if (isSlug) query = query.eq('published', 1);
          const { data, error } = await query.maybeSingle();
          if (!error && data) {
            return {
              ...data,
              data: parseDataField(data.data)
            };
          }
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase getProfile fallback:', err.message);
      }
    }
    if (!env?.DB) return null;
    try {
      const sql = isSlug ? 'SELECT * FROM profiles WHERE slug=? AND published=1' : 'SELECT * FROM profiles WHERE id=?';
      const row = await env.DB.prepare(sql).bind(idOrSlug).first<any>();
      return row ? { ...row, data: parseDataField(row.data) } : null;
    } catch {
      return null;
    }
  },

  async upsertProfile(profile: { id: string; slug: string; published: number; verification: string; data: any; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const payload = {
            id: profile.id,
            slug: profile.slug,
            published: profile.published,
            verification: profile.verification || 'self-declared',
            data: typeof profile.data === 'string' ? parseDataField(profile.data) : (profile.data || {}),
            updated: Number(profile.updated)
          };
          const { error } = await sb.from('profiles').upsert(payload);
          if (!error) supabaseSucceeded = true;
          else console.error('[CreaXa DB] Supabase upsertProfile error:', error.message);
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase upsertProfile fallback:', err.message);
      }
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO profiles (id,slug,published,verification,data,updated) VALUES (?,?,?,\'self-declared\',?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,published=excluded.published,data=excluded.data,updated=excluded.updated')
          .bind(profile.id, profile.slug, profile.published, typeof profile.data === 'string' ? profile.data : JSON.stringify(profile.data || {}), profile.updated)
          .run();
      } catch (e: any) {
        if (!supabaseSucceeded) throw e;
      }
    } else if (!supabaseSucceeded) {
      throw new Error('Database is unavailable: neither Supabase nor D1 could record the profile.');
    }
  },

  // PORTFOLIOS
  async getPortfoliosByOwner(owner: string) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const { data, error } = await sb.from('portfolios').select('*').eq('owner', owner).order('updated', { ascending: false });
          if (!error && data && data.length > 0) {
            return data.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
          }
        }
      } catch {}
    }
    if (!env?.DB) return [];
    try {
      const rows = (await env.DB.prepare('SELECT * FROM portfolios WHERE owner=? ORDER BY updated DESC').bind(owner).all())?.results || [];
      return rows.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
    } catch {
      return [];
    }
  },

  async getPublishedPortfoliosByOwner(owner: string) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const { data, error } = await sb.from('portfolios').select('*').eq('owner', owner).eq('published', 1).order('updated', { ascending: false });
          if (!error && data && data.length > 0) {
            return data.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
          }
        }
      } catch {}
    }
    if (!env?.DB) return [];
    try {
      const rows = (await env.DB.prepare('SELECT * FROM portfolios WHERE owner=? AND published=1 ORDER BY updated DESC').bind(owner).all())?.results || [];
      return rows.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
    } catch {
      return [];
    }
  },

  async upsertPortfolio(p: { id: string; owner: string; slug: string; published: number; data: any; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const payload = {
            id: p.id,
            owner: p.owner,
            slug: p.slug,
            published: p.published,
            data: typeof p.data === 'string' ? parseDataField(p.data) : (p.data || {}),
            updated: Number(p.updated)
          };
          const { error } = await sb.from('portfolios').upsert(payload);
          if (!error) supabaseSucceeded = true;
          else console.error('[CreaXa DB] Supabase upsertPortfolio error:', error.message);
        }
      } catch {}
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO portfolios (id,owner,slug,published,data,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET published=excluded.published,data=excluded.data,updated=excluded.updated')
          .bind(p.id, p.owner, p.slug, p.published, typeof p.data === 'string' ? p.data : JSON.stringify(p.data || {}), p.updated)
          .run();
      } catch (e: any) {
        if (!supabaseSucceeded) throw e;
      }
    } else if (!supabaseSucceeded) {
      throw new Error('Database is unavailable: neither Supabase nor D1 could record the portfolio.');
    }
  },

  async deletePortfolio(id: string, owner: string) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          await sb.from('portfolios').delete().eq('id', id).eq('owner', owner);
        }
      } catch {}
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('DELETE FROM portfolios WHERE id=? AND owner=?').bind(id, owner).run();
      } catch {}
    }
  },

  // CAMPAIGNS
  async getCampaignsByOwner(owner: string) {
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const { data, error } = await sb.from('campaigns').select('*').eq('owner', owner).order('updated', { ascending: false });
          if (!error && data && data.length > 0) {
            return data.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
          }
        }
      } catch {}
    }
    if (!env?.DB) return [];
    try {
      const rows = (await env.DB.prepare('SELECT * FROM campaigns WHERE owner=? ORDER BY updated DESC').bind(owner).all())?.results || [];
      return rows.map((r: any) => ({ ...r, data: parseDataField(r.data) }));
    } catch {
      return [];
    }
  },

  async upsertCampaign(c: { id: string; owner: string; status: string; data: any; created: number; updated: number }) {
    let supabaseSucceeded = false;
    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          const payload = {
            id: c.id,
            owner: c.owner,
            status: c.status,
            data: typeof c.data === 'string' ? parseDataField(c.data) : (c.data || {}),
            created: Number(c.created),
            updated: Number(c.updated)
          };
          const { error } = await sb.from('campaigns').upsert(payload);
          if (!error) supabaseSucceeded = true;
          else console.error('[CreaXa DB] Supabase upsertCampaign error:', error.message);
        }
      } catch {}
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO campaigns (id,owner,status,data,created,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,data=excluded.data,updated=excluded.updated')
          .bind(c.id, c.owner, c.status, typeof c.data === 'string' ? c.data : JSON.stringify(c.data || {}), c.created, c.updated)
          .run();
      } catch (e: any) {
        if (!supabaseSucceeded) throw e;
      }
    } else if (!supabaseSucceeded) {
      throw new Error('Database is unavailable: neither Supabase nor D1 could record the campaign.');
    }
  },

  // NOTIFICATIONS (With Realtime Broadcast)
  async addNotification(owner: string, title: string, href: string) {
    const id = crypto.randomUUID();
    const created = Date.now();
    const notif = { id, owner, title, href, read: 0, created };

    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          await sb.from('notifications').insert(notif);
          await broadcastRealtimeEvent(`user_notifications_${owner}`, 'new_notification', notif, env);
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase addNotification warning:', err.message);
      }
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO notifications (id,owner,title,href,read,created) VALUES (?,?,?,?,0,?)').bind(id, owner, title, href, created).run();
      } catch {}
    }
  },

  // WORKSPACE EVENTS (With Realtime Broadcast)
  async addEvent(event: { id?: string; engagement: string; author: string; type: string; data: any; created?: number }) {
    const id = event.id || crypto.randomUUID();
    const created = event.created || Date.now();
    const row = {
      id,
      engagement: event.engagement,
      author: event.author,
      type: event.type,
      data: typeof event.data === 'string' ? parseDataField(event.data) : (event.data || {}),
      created
    };

    if (isSupabaseConfigured(env)) {
      try {
        const sb = getSupabaseAdmin(env);
        if (sb) {
          await sb.from('events').insert(row);
          await broadcastRealtimeEvent(`workspace_${event.engagement}`, 'workspace_event', row, env);
        }
      } catch (err: any) {
        console.warn('[CreaXa DB] Supabase addEvent warning:', err.message);
      }
    }
    if (env?.DB) {
      try {
        await env.DB.prepare('INSERT INTO events (id,engagement,author,type,data,created) VALUES (?,?,?,?,?,?)')
          .bind(id, event.engagement, event.author, event.type, typeof event.data === 'string' ? event.data : JSON.stringify(event.data || {}), created)
          .run();
      } catch {}
    }
    return row;
  },

  // UNIVERSAL QUERY ENGINE (Routes to Supabase PostgreSQL when D1 is unavailable on Vercel)
  async queryAll(sql: string, ...args: any[]): Promise<any[]> {
    if (env?.DB) {
      try {
        return (await env.DB.prepare(sql).bind(...args).all()).results as any[];
      } catch (e: any) {
        console.warn('[CreaXa DB] D1 queryAll error, falling back to Supabase:', e.message);
      }
    }
    const sb = getSupabaseAdmin(env);
    if (!sb) return [];

    const norm = sql.trim().toLowerCase();

    // 1. Profiles & Creators
    if (norm.includes('from profiles')) {
      if (norm.includes('slug=?')) {
        const { data } = await sb.from('profiles').select('*').eq('slug', args[0]).eq('published', 1);
        return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
      }
      const { data } = await sb.from('profiles').select('*').eq('published', 1).order('updated', { ascending: false }).limit(200);
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 2. Portfolios
    if (norm.includes('from portfolios')) {
      if (norm.includes('join profiles') || norm.includes('profiles c')) {
        const { data: portfolios } = await sb.from('portfolios').select('*').eq('published', 1).order('updated', { ascending: false });
        if (!portfolios || !portfolios.length) return [];
        const owners = [...new Set(portfolios.map(p => p.owner))];
        const { data: profiles } = await sb.from('profiles').select('id, slug, data').in('id', owners).eq('published', 1);
        const profileMap = new Map((profiles || []).map(p => [p.id, { ...p, data: parseDataField(p.data) }]));
        
        return portfolios
          .filter(p => profileMap.has(p.owner))
          .map(p => {
            const prof = profileMap.get(p.owner);
            return {
              ...p,
              data: parseDataField(p.data),
              creator_slug: prof?.slug || '',
              creator_name: prof?.data?.name || 'Creator'
            };
          });
      }
      if (norm.includes('owner=?') && norm.includes('published=1')) {
        const { data } = await sb.from('portfolios').select('*').eq('owner', args[0]).eq('published', 1).order('updated', { ascending: false });
        return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
      }
      if (norm.includes('owner=?')) {
        const { data } = await sb.from('portfolios').select('*').eq('owner', args[0]).order('updated', { ascending: false });
        return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
      }
      const { data } = await sb.from('portfolios').select('*').order('updated', { ascending: false });
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 3. Campaigns
    if (norm.includes('from campaigns')) {
      if (norm.includes('owner=?')) {
        const { data } = await sb.from('campaigns').select('*').eq('owner', args[0]).order('updated', { ascending: false });
        return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
      }
      const { data } = await sb.from('campaigns').select('*').order('updated', { ascending: false });
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 4. Invitations
    if (norm.includes('from invitations')) {
      const id = args[0];
      const { data } = await sb.from('invitations').select('*, campaigns(data), profiles(slug, data)').or(`brand.eq.${id},creator.eq.${id}`).order('created', { ascending: false });
      return (data || []).map((r: any) => ({
        ...r,
        data: parseDataField(r.data),
        campaign_data: parseDataField(r.campaigns?.data),
        creator_slug: r.profiles?.slug || '',
        creator_data: parseDataField(r.profiles?.data)
      }));
    }

    // 5. Engagements
    if (norm.includes('from engagements')) {
      if (args.length >= 2) {
        const { data } = await sb.from('engagements').select('*').or(`brand.eq.${args[0]},creator.eq.${args[1]}`).order('updated', { ascending: false });
        return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
      }
      const { data } = await sb.from('engagements').select('*').order('updated', { ascending: false });
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 6. Events
    if (norm.includes('from events')) {
      const { data } = await sb.from('events').select('*').eq('engagement', args[0]).order('created', { ascending: true });
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 7. Notifications
    if (norm.includes('from notifications')) {
      const { data } = await sb.from('notifications').select('*').eq('owner', args[0]).order('created', { ascending: false }).limit(200);
      return data || [];
    }

    // 8. Favorites
    if (norm.includes('from favorites')) {
      const { data } = await sb.from('favorites').select('creator').eq('owner', args[0]);
      return data || [];
    }

    // 9. Evidence
    if (norm.includes('from evidence')) {
      const { data } = await sb.from('evidence').select('*').order('created', { ascending: false });
      return (data || []).map(r => ({ ...r, data: parseDataField(r.data) }));
    }

    // 10. Reviews
    if (norm.includes('from reviews')) {
      const { data } = await sb.from('reviews').select('*').eq('creator_slug', args[0]).order('created', { ascending: false });
      return data || [];
    }

    return [];
  },

  async queryOne(sql: string, ...args: any[]): Promise<any> {
    if (env?.DB) {
      try {
        return await env.DB.prepare(sql).bind(...args).first<any>();
      } catch (e: any) {
        console.warn('[CreaXa DB] D1 queryOne error, falling back to Supabase:', e.message);
      }
    }
    const sb = getSupabaseAdmin(env);
    const norm = sql.trim().toLowerCase();

    // Limits check
    if (norm.includes('from limits')) {
      return { count: 0 };
    }

    if (!sb) return null;

    // Accounts
    if (norm.includes('from accounts')) {
      const { data } = await sb.from('accounts').select('*').eq('id', args[0]).maybeSingle();
      return data ? { ...data, data: parseDataField(data.data) } : null;
    }

    // Profiles
    if (norm.includes('from profiles')) {
      if (norm.includes('count(*)')) {
        const { count } = await sb.from('profiles').select('*', { count: 'exact', head: true }).eq('published', 1);
        return { n: count || 0 };
      }
      if (norm.includes('slug=?')) {
        const { data } = await sb.from('profiles').select('*').eq('slug', args[0]).eq('published', 1).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      if (norm.includes('id=?')) {
        const { data } = await sb.from('profiles').select('*').eq('id', args[0]).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
    }

    // Portfolios
    if (norm.includes('from portfolios')) {
      if (norm.includes('count(*)')) {
        const { count } = await sb.from('portfolios').select('*', { count: 'exact', head: true }).eq('published', 1);
        return { n: count || 0 };
      }
      if (norm.includes('slug=?')) {
        const { data } = await sb.from('portfolios').select('*').eq('slug', args[0]).eq('published', 1).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      if (norm.includes('id=?') && norm.includes('owner=?')) {
        const { data } = await sb.from('portfolios').select('*').eq('id', args[0]).eq('owner', args[1]).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      if (args[0]) {
        const { data } = await sb.from('portfolios').select('*').eq('id', args[0]).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      return null;
    }

    // Campaigns
    if (norm.includes('from campaigns')) {
      if (norm.includes('id=?') && norm.includes('owner=?')) {
        const { data } = await sb.from('campaigns').select('*').eq('id', args[0]).eq('owner', args[1]).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      const { data } = await sb.from('campaigns').select('*').eq('id', args[0]).maybeSingle();
      return data ? { ...data, data: parseDataField(data.data) } : null;
    }

    // Invitations
    if (norm.includes('from invitations')) {
      if (norm.includes('brand=?') || norm.includes('creator=?')) {
        const { data } = await sb.from('invitations').select('*').eq('id', args[0]).or(`brand.eq.${args[1]},creator.eq.${args[2]}`).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      const { data } = await sb.from('invitations').select('*').eq('id', args[0]).maybeSingle();
      return data ? { ...data, data: parseDataField(data.data) } : null;
    }

    // Engagements
    if (norm.includes('from engagements')) {
      if (norm.includes('brand=?') || norm.includes('creator=?')) {
        const { data } = await sb.from('engagements').select('*').eq('id', args[0]).or(`brand.eq.${args[1]},creator.eq.${args[2]}`).maybeSingle();
        return data ? { ...data, data: parseDataField(data.data) } : null;
      }
      const { data } = await sb.from('engagements').select('*').eq('id', args[0]).maybeSingle();
      return data ? { ...data, data: parseDataField(data.data) } : null;
    }

    // Events
    if (norm.includes('from events')) {
      const { data } = await sb.from('events').select('*').eq('engagement', args[0]).order('created', { ascending: false }).limit(1).maybeSingle();
      return data ? { ...data, data: parseDataField(data.data) } : null;
    }

    // Files
    if (norm.includes('from files')) {
      if (norm.includes('mime')) {
        const { data } = await sb.from('files').select('mime').eq('id', args[0]).maybeSingle();
        return data || { mime: 'image/png' };
      }
      const { data } = await sb.from('files').select('id').eq('id', args[0]).maybeSingle();
      return data || { id: args[0] };
    }

    return null;
  },

  async execute(sql: string, ...args: any[]): Promise<{ meta: { changes: number } }> {
    if (env?.DB) {
      try {
        const res = await env.DB.prepare(sql).bind(...args).run();
        return res as any;
      } catch (e: any) {
        console.warn('[CreaXa DB] D1 execute error, falling back to Supabase:', e.message);
      }
    }
    const norm = sql.trim().toLowerCase();

    // Limits
    if (norm.includes('into limits') || norm.includes('delete from limits')) {
      return { meta: { changes: 1 } };
    }

    const sb = getSupabaseAdmin(env);
    if (!sb) return { meta: { changes: 1 } };

    // Invitations insert/update
    if (norm.startsWith('insert into invitations')) {
      await sb.from('invitations').insert({
        id: args[0],
        campaign: args[1],
        brand: args[2],
        creator: args[3],
        status: 'pending',
        data: parseDataField(args[4]),
        created: args[5]
      });
      return { meta: { changes: 1 } };
    }
    if (norm.startsWith('update invitations')) {
      const status = args[0];
      const id = args[1];
      await sb.from('invitations').update({ status }).eq('id', id);
      return { meta: { changes: 1 } };
    }

    // Engagements insert/update
    if (norm.startsWith('insert into engagements')) {
      await sb.from('engagements').insert({
        id: args[0],
        invitation: args[1],
        campaign: args[2],
        brand: args[3],
        creator: args[4],
        status: 'accepted',
        revisions: 0,
        data: parseDataField(args[5]),
        updated: args[6]
      });
      return { meta: { changes: 1 } };
    }
    if (norm.startsWith('update engagements')) {
      const nextStatus = args[0];
      const revIncrement = args[1];
      const updated = args[2];
      const id = args[3];
      const { data: current } = await sb.from('engagements').select('revisions').eq('id', id).maybeSingle();
      await sb.from('engagements').update({
        status: nextStatus,
        revisions: (current?.revisions || 0) + (revIncrement || 0),
        updated
      }).eq('id', id);
      return { meta: { changes: 1 } };
    }

    // Events insert
    if (norm.startsWith('insert into events')) {
      await sb.from('events').insert({
        id: args[0],
        engagement: args[1],
        author: args[2],
        type: args[3],
        data: parseDataField(args[4]),
        created: args[5]
      });
      return { meta: { changes: 1 } };
    }

    // Notifications update read
    if (norm.startsWith('update notifications')) {
      if (args.length >= 2) {
        await sb.from('notifications').update({ read: 1 }).eq('id', args[0]).eq('owner', args[1]);
      } else {
        await sb.from('notifications').update({ read: 1 }).eq('owner', args[0]);
      }
      return { meta: { changes: 1 } };
    }

    // Favorites
    if (norm.startsWith('delete from favorites')) {
      await sb.from('favorites').delete().eq('id', args[0]);
      return { meta: { changes: 1 } };
    }
    if (norm.startsWith('insert into favorites')) {
      await sb.from('favorites').insert({ id: args[0], owner: args[1], creator: args[2] });
      return { meta: { changes: 1 } };
    }

    return { meta: { changes: 1 } };
  },

  async batch(statements: any[]): Promise<any[]> {
    if (env?.DB) {
      try {
        return await env.DB.batch(statements);
      } catch (e: any) {
        console.warn('[CreaXa DB] D1 batch error, falling back:', e.message);
      }
    }
    const results = [];
    for (const stmt of statements) {
      if (typeof stmt?.run === 'function') {
        results.push(await stmt.run());
      }
    }
    return results;
  }
};
