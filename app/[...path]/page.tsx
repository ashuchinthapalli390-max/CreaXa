import Marketplace from '../marketplace';
import { requireAuthUser } from '../auth';
export const dynamic = 'force-dynamic';
export default async function Page({ params, searchParams }: {
    params: Promise<{
        path: string[];
    }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) { const { path } = await params; const route = '/' + path.join('/'); if (path[0] === 'app' || path[0] === 'onboarding' || path[0] === 'admin') {
    const values = await searchParams;
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(values))
        for (const v of Array.isArray(value) ? value : value === undefined ? [] : [value])
            query.append(key, v);
    await requireAuthUser(route + (query.size ? '?' + query.toString() : ''));
} return <Marketplace path={route}/>; }

