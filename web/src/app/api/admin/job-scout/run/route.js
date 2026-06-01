import { requireAdmin } from '../../../utils/adminAuth';
import { ensureJobScoutSchema, discoverJobs, saveDiscoveredJobs } from '../../../utils/jobScout';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  console.log('JOB SCOUT LIVE v1');
  const { error } = await requireAdmin(request);
  if (error) return error;
  await ensureJobScoutSchema();
  const candidates = await discoverJobs();
  const summary = await saveDiscoveredJobs(candidates);
  return Response.json({ ok: true, ...summary }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
}
