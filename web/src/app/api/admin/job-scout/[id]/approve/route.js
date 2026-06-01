import { requireAdmin } from '../../../../utils/adminAuth';
import sql from '../../../../utils/sql';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(request, { params }) {
  console.log('JOB SCOUT LIVE v1');
  const { error } = await requireAdmin(request);
  if (error) return error;
  const body = await request.json().catch(() => ({}));
  const id = Number(params.id);
  const updated = await sql`
    UPDATE jobs
    SET title = COALESCE(${body.title}, title),
        company_name = COALESCE(${body.company_name}, company_name),
        location = COALESCE(${body.location}, location),
        apply_url = COALESCE(${body.apply_url}, apply_url),
        summary = COALESCE(${body.summary}, summary),
        status = 'approved',
        is_active = true,
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return Response.json({ job: updated[0] ?? null }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
}
