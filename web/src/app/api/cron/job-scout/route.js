import { ensureJobScoutSchema, discoverJobs, saveDiscoveredJobs } from '../../utils/jobScout.js';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  console.log('JOB SCOUT LIVE v1');
  const auth = request.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!process.env.JOB_SCOUT_SECRET || token !== process.env.JOB_SCOUT_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
  }
  await ensureJobScoutSchema();
  const candidates = await discoverJobs();
  const summary = await saveDiscoveredJobs(candidates);
  return Response.json({ ok: true, ...summary }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
}
