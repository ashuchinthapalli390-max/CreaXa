import Marketplace from '../marketplace';
import { requireAuthUser } from '../auth';

export const dynamic = 'force-dynamic';

export default async function Page({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const route = '/' + path.join('/');
  if (path[0] === 'app' || path[0] === 'onboarding' || path[0] === 'admin') {
    await requireAuthUser(route);
  }
  return <Marketplace path={route} />;
}
