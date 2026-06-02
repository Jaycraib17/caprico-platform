import { requireAdmin } from '../../../utils/adminAuth.js';
import sql from '../../../utils/sql.js';
import { ensureJobScoutSchema } from '../../../utils/jobScout.js';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const headers = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' };

export async function GET(request) {
  console.log('JOB SCOUT LIVE v1');
  const { error } = await requireAdmin(request);
  if (error) return error;
  await ensureJobScoutSchema();

  const { searchParams } = new URL(request.url);
  const avail = searchParams.get('avail') || 'all';
  let rows;
  if (avail === 'jamaica') rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' AND is_jamaica_eligible = true ORDER BY created_at DESC LIMIT 200`;
  else if (avail === 'caribbean') rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' AND is_caribbean_friendly = true ORDER BY created_at DESC LIMIT 200`;
  else if (avail === 'africa') rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' AND is_africa_friendly = true ORDER BY created_at DESC LIMIT 200`;
  else if (avail === 'worldwide') rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' AND is_worldwide = true ORDER BY created_at DESC LIMIT 200`;
  else if (avail === 'needs_review') rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' AND needs_location_review = true ORDER BY created_at DESC LIMIT 200`;
  else rows = await sql`SELECT * FROM jobs WHERE status = 'pending_review' ORDER BY created_at DESC LIMIT 200`;

  const [counts] = await sql`
    SELECT
      COUNT(*)::int AS "all",
      COUNT(*) FILTER (WHERE is_jamaica_eligible = true)::int AS jamaica,
      COUNT(*) FILTER (WHERE is_caribbean_friendly = true)::int AS caribbean,
      COUNT(*) FILTER (WHERE is_africa_friendly = true)::int AS africa,
      COUNT(*) FILTER (WHERE is_worldwide = true)::int AS worldwide,
      COUNT(*) FILTER (WHERE needs_location_review = true)::int AS needs_review
    FROM jobs
    WHERE status = 'pending_review'
  `;

  return Response.json({ jobs: rows, availCounts: counts || {} }, { headers });
}
