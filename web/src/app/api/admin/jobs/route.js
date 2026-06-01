import { requireAdmin } from '../../utils/adminAuth';
import sql from '../../utils/sql';
import { ensureDirectJobSchema, jsonNoCache } from '../../utils/directJobImporter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function positiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

export async function GET(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  await ensureDirectJobSchema();
  const { searchParams } = new URL(request.url);
  const limit = positiveInt(searchParams.get('limit'), 20, 100);
  const offset = positiveInt(searchParams.get('offset'), 0, 100000);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const params = [];
  const where = [];

  if (search) {
    params.push(search, search, search);
    where.push(`(j.title ILIKE '%' || $${params.length - 2} || '%' OR j.company_name ILIKE '%' || $${params.length - 1} || '%' OR COALESCE(j.description_preview, j.summary, j.description, '') ILIKE '%' || $${params.length} || '%')`);
  }
  if (category) {
    params.push(category);
    where.push(`j.category = $${params.length}`);
  }
  if (status) {
    params.push(status);
    where.push(`j.status = $${params.length}`);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const jobs = await sql(
    `SELECT j.*,
      CASE WHEN j.apply_url_type = 'source_board' OR j.apply_url_needs_review = true THEN 'View Source' ELSE 'Apply on Company Site' END AS apply_button_label,
      CASE
        WHEN j.is_jamaica_eligible THEN '🇯🇲 Jamaica eligible'
        WHEN j.is_caribbean_friendly THEN '🌴 Caribbean-friendly'
        WHEN j.is_africa_friendly THEN '🌍 Africa-friendly'
        WHEN j.is_worldwide THEN '🌎 Worldwide'
        ELSE COALESCE(j.remote_availability, 'Remote')
      END AS availability_badge
    FROM jobs j
    ${whereClause}
    ORDER BY j.created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  const countResult = await sql(`SELECT COUNT(*)::int AS total FROM jobs j ${whereClause}`, params);
  const total = Number(countResult[0]?.total || 0);
  return jsonNoCache({ jobs, total, limit, offset, hasMore: offset + limit < total });
}
