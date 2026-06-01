import { requireAdmin } from '../../../../utils/adminAuth';
import sql from '../../../../utils/sql';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(request, { params }) {
  console.log('JOB SCOUT LIVE v1');
  const { error } = await requireAdmin(request);
  if (error) return error;
  const id = Number(params.id);
  const updated = await sql`UPDATE jobs SET status = 'rejected', is_active = false, updated_at = NOW() WHERE id = ${id} RETURNING id,status`;
  return Response.json({ job: updated[0] ?? null }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
}
