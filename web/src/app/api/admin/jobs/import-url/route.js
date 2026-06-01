import { requireAdmin } from '../../../utils/adminAuth.js';
import { fetchJobPosting, jsonNoCache } from '../../../utils/directJobImporter.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const result = await fetchJobPosting(body.url);
  const status = result.ok || result.extracted ? 200 : 422;
  return jsonNoCache(result, { status });
}
