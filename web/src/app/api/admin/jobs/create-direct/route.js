import { requireAdmin } from '../../../utils/adminAuth';
import { createDirectJob, jsonNoCache } from '../../../utils/directJobImporter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await createDirectJob(body);
  return jsonNoCache(result, { status: result.status || (result.ok ? 200 : 400) });
}
