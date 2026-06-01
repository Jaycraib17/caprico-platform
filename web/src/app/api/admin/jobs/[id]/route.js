import { requireAdmin } from '../../../utils/adminAuth';
import sql from '../../../utils/sql';
import { ensureDirectJobSchema, jsonNoCache } from '../../../utils/directJobImporter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await ensureDirectJobSchema();
  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  if (!Number.isFinite(id)) return jsonNoCache({ error: 'Invalid job id' }, { status: 400 });

  const nextActive = typeof body.is_active === 'boolean' ? body.is_active : null;
  const nextStatus = typeof body.status === 'string' ? body.status : null;
  const updated = await sql`
    UPDATE jobs
    SET is_active = COALESCE(${nextActive}, is_active),
        status = COALESCE(${nextStatus}, CASE WHEN ${nextActive} = true THEN 'approved' WHEN ${nextActive} = false THEN 'pending_review' ELSE status END),
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return jsonNoCache({ job: updated[0] || null });
}

export async function DELETE(request, { params }) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await ensureDirectJobSchema();
  const id = Number(params.id);
  if (!Number.isFinite(id)) return jsonNoCache({ error: 'Invalid job id' }, { status: 400 });

  const deleted = await sql`UPDATE jobs SET is_active = false, status = 'rejected', updated_at = NOW() WHERE id = ${id} RETURNING id`;
  return jsonNoCache({ ok: true, job: deleted[0] || null });
}
