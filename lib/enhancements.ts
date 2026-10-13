import { z } from 'zod';
type Context = {
    all: (sql: string, ...args: any[]) => Promise<any[]>;
    one: (sql: string, ...args: any[]) => Promise<any>;
    db: () => D1Database;
    account: () => Promise<any>;
    requireRole: (roles: string[]) => Promise<any>;
    body: (req: Request) => Promise<any>;
    json: (data: unknown, status?: number) => Response;
    fail: (message: string, status?: number) => never | void;
    decoded: (row: any) => any;
    publicProject: (row: any) => any;
    notify: (owner: string, title: string, href: string) => Promise<void>;
};
export async function handleEnhancements(req: Request, path: string[], ctx: Context): Promise<Response | null> {
    const { all, one, db, account, requireRole, body, json, fail, decoded, publicProject, notify } = ctx;
    const route = path.join('/'), url = new URL(req.url), method = req.method;
    const now = Date.now();
    if (method === 'GET' && route === 'work') {
        const clauses = ['p.published=1', 'c.published=1'], args: any[] = [];
        for (const [key, field] of [['type', 'contentType'], ['style', 'styles'], ['tool', 'tools']] as const) {
            const value = url.searchParams.get(key);
            if (value) {
                if (field === 'contentType')
                    clauses.push("json_extract(p.data,'$.contentType')=?");
                else
                    clauses.push(`EXISTS (SELECT 1 FROM json_each(p.data,'$.${field}') j WHERE j.value=?)`);
                args.push(value.slice(0, 200));
            }
        }
        const q = (url.searchParams.get('q') || '').trim().slice(0, 200);
        if (q) {
            clauses.push("instr(lower(coalesce(json_extract(p.data,'$.title'),'')||' '||coalesce(json_extract(p.data,'$.description'),'')),lower(?))>0");
            args.push(q);
        }
        const page = Math.max(1, Math.min(10000, Math.floor(Number(url.searchParams.get('page')) || 1))), where = clauses.join(' AND '), from = ' FROM portfolios p JOIN profiles c ON c.id=p.owner WHERE ' + where;
        const [count, rows] = await Promise.all([one('SELECT count(*) AS n' + from, ...args), all("SELECT p.*,c.slug AS creator_slug,json_extract(c.data,'$.name') AS creator_name" + from + ' ORDER BY p.updated DESC,p.id LIMIT 12 OFFSET ?', ...args, (page - 1) * 12)]);
        return json({ items: rows.map(publicProject), total: count.n, page, pages: Math.ceil(count.n / 12) });
    }
    if (route === 'saved-searches') {
        const { user, a } = await account();
        if (!a)
            fail('Set up your account first.', 403);
        if (method === 'GET')
            return json((await all('SELECT * FROM saved_searches WHERE owner=? ORDER BY updated DESC', user.userId)).map(decoded));
        if (method === 'POST') {
            const b = z.object({ id: z.string().uuid().optional(), name: z.string().trim().min(2).max(80), filters: z.record(z.union([z.string().max(200), z.boolean(), z.array(z.string().max(200)).max(30)])) }).parse(await body(req));
            const allowed = new Set(['q', 'specializations', 'tools', 'contentTypes', 'styles', 'aspectRatios', 'industries', 'platforms', 'available', 'verified', 'min', 'max', 'currency', 'sort']);
            const filters = Object.fromEntries(Object.entries(b.filters).filter(([k]) => allowed.has(k)));
            if (b.id && !await one('SELECT id FROM saved_searches WHERE id=? AND owner=?', b.id, user.userId))
                fail('Saved search not found.', 404);
            if (!b.id && (await one('SELECT count(*) AS n FROM saved_searches WHERE owner=?', user.userId)).n >= 30)
                fail('You can keep up to 30 saved searches.');
            const id = b.id || crypto.randomUUID();
            await db().prepare('INSERT INTO saved_searches (id,owner,name,data,updated) VALUES (?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,data=excluded.data,updated=excluded.updated').bind(id, user.userId, b.name, JSON.stringify(filters), now).run();
            return json({ id });
        }
    }
    if (method === 'DELETE' && path[0] === 'saved-searches' && path[1]) {
        const { user } = await account();
        const r = await db().prepare('DELETE FROM saved_searches WHERE id=? AND owner=?').bind(path[1], user.userId).run();
        if (!r.meta.changes)
            fail('Saved search not found.', 404);
        return json({ deleted: true });
    }
    if (path[0] === 'tasks' && path[1]) {
        const { user } = await account();
        const engagement = await one('SELECT * FROM engagements WHERE id=? AND (brand=? OR creator=?)', path[1], user.userId, user.userId);
        if (!engagement)
            fail('Project not found.', 404);
        if (method === 'GET')
            return json(await all('SELECT t.*,a.name AS author_name FROM project_tasks t LEFT JOIN accounts a ON a.id=t.author WHERE t.engagement=? ORDER BY t.completed ASC,t.updated DESC', path[1]));
        if (method === 'POST') {
            const b = z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(3).max(200), due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')), completed: z.boolean().optional() }).parse(await body(req));
            if (b.due && (!Number.isFinite(new Date(b.due + 'T00:00:00Z').getTime()) || new Date(b.due + 'T00:00:00Z').toISOString().slice(0, 10) !== b.due))
                fail('Choose a valid due date.');
            if (b.id && !await one('SELECT id FROM project_tasks WHERE id=? AND engagement=?', b.id, path[1]))
                fail('Task not found.', 404);
            if (!b.id && ['completed', 'cancelled'].includes(engagement.status))
                fail('This project is closed.', 409);
            if (!b.id && (await one('SELECT count(*) AS n FROM project_tasks WHERE engagement=?', path[1])).n >= 200)
                fail('This project already has 200 checklist tasks.');
            const id = b.id || crypto.randomUUID();
            await db().prepare('INSERT INTO project_tasks (id,engagement,author,title,due,completed,updated) VALUES (?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,due=excluded.due,completed=excluded.completed,updated=excluded.updated').bind(id, path[1], user.userId, b.title, b.due || null, b.completed ? 1 : 0, now).run();
            return json({ id });
        }
        if (method === 'DELETE' && path[2]) {
            const task = await one('SELECT * FROM project_tasks WHERE id=? AND engagement=?', path[2], path[1]);
            if (!task)
                fail('Task not found.', 404);
            if (task.author !== user.userId)
                fail('Only the task author can delete it.', 403);
            await db().prepare('DELETE FROM project_tasks WHERE id=?').bind(task.id).run();
            return json({ deleted: true });
        }
    }
    if (method === 'POST' && route === 'review') {
        const { user } = await requireRole(['brand', 'agency']);
        const b = z.object({ engagement: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().trim().min(20).max(2000) }).parse(await body(req));
        const e = await one("SELECT * FROM engagements WHERE id=? AND brand=? AND status='completed'", b.engagement, user.userId);
        if (!e)
            fail('Reviews are available after your project is completed.', 403);
        await db().prepare('INSERT INTO reviews (id,engagement,creator,author,rating,comment,created,updated) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(engagement) DO UPDATE SET rating=excluded.rating,comment=excluded.comment,updated=excluded.updated').bind(crypto.randomUUID(), e.id, e.creator, user.userId, b.rating, b.comment, now, now).run();
        await notify(e.creator, 'Your completed project received feedback.', '/app/creator');
        return json({ saved: true });
    }
    if (method === 'GET' && path[0] === 'reviews' && path[1]) {
        const p = await one('SELECT id FROM profiles WHERE slug=? AND published=1', path[1]);
        if (!p)
            fail('Creator not found.', 404);
        const page = Math.max(1, Math.floor(Number(url.searchParams.get('page')) || 1));
        const [summary, items] = await Promise.all([one('SELECT count(*) AS total,avg(rating) AS average FROM reviews WHERE creator=?', p.id), all('SELECT r.id,r.rating,r.comment,r.created,r.updated,a.name AS reviewer_name FROM reviews r JOIN accounts a ON a.id=r.author WHERE r.creator=? ORDER BY r.updated DESC,r.id LIMIT 12 OFFSET ?', p.id, (page - 1) * 12)]);
        return json({ items, total: summary.total, average: summary.average, page, pages: Math.ceil(summary.total / 12) });
    }
    if (method === 'GET' && path[0] === 'project-review' && path[1]) {
        const { user } = await account();
        const e = await one('SELECT id FROM engagements WHERE id=? AND (brand=? OR creator=?)', path[1], user.userId, user.userId);
        if (!e)
            fail('Project not found.', 404);
        return json(await one('SELECT rating,comment,updated FROM reviews WHERE engagement=?', path[1]));
    }
    if (method === 'POST' && path[0] === 'duplicate-campaign' && path[1]) {
        const { user } = await requireRole(['brand', 'agency']);
        const c = decoded(await one('SELECT * FROM campaigns WHERE id=? AND owner=?', path[1], user.userId));
        if (!c)
            fail('Campaign not found.', 404);
        const id = crypto.randomUUID();
        const data = { ...c.data, title: (c.data.title + ' (copy)').slice(0, 200), deadline: '', assets: [], id, status: 'draft' };
        await db().prepare('INSERT INTO campaigns (id,owner,status,data,created,updated) VALUES (?,?,\'draft\',?,?,?)').bind(id, user.userId, JSON.stringify(data), now, now).run();
        return json({ id });
    }
    if (method === 'GET' && route === 'account-export') {
        const { user, a } = await account();
        if (!a)
            fail('Account not found.', 404);
        const id = user.userId;
        const [profile, portfolio, campaigns, engagements, events, searches, files, notifications, evidence, tasks, reviews] = await Promise.all([one('SELECT * FROM profiles WHERE id=?', id), all('SELECT * FROM portfolios WHERE owner=?', id), all('SELECT * FROM campaigns WHERE owner=?', id), all('SELECT * FROM engagements WHERE brand=? OR creator=?', id, id), all('SELECT * FROM events WHERE author=?', id), all('SELECT * FROM saved_searches WHERE owner=?', id), all('SELECT id,name,mime,size,created FROM files WHERE owner=?', id), all('SELECT * FROM notifications WHERE owner=?', id), all('SELECT * FROM evidence WHERE owner=?', id), all('SELECT * FROM project_tasks WHERE engagement IN (SELECT id FROM engagements WHERE brand=? OR creator=?)', id, id), all('SELECT * FROM reviews WHERE author=? OR creator=?', id, id)]);
        return json({ exportedAt: new Date().toISOString(), account: a, profile: decoded(profile), portfolio: portfolio.map(decoded), campaigns: campaigns.map(decoded), engagements: engagements.map(decoded), authoredEvents: events.map(decoded), savedSearches: searches.map(decoded), files, notifications, evidence: evidence.map(decoded), tasks, reviews });
    }
    return null;
}

