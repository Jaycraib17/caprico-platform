import { getToken } from '@auth/core/jwt';

export async function requireAdmin(request) {
  const jwt = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.AUTH_URL?.startsWith('https') ?? false,
  });

  if (!jwt) {
    return { error: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }) };
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((v) => v.trim().toLowerCase()).filter(Boolean);
  const isAdmin = jwt.role === 'admin' || jwt.isAdmin === true || adminEmails.includes((jwt.email ?? '').toLowerCase());

  if (!isAdmin) {
    return { error: new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }) };
  }

  return { jwt };
}
