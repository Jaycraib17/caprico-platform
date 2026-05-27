import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Hardcoded admin emails — fallback when DB flag hasn't been set yet
const ADMIN_EMAILS = ["jaycraib17@gmail.com"];

/**
 * Returns { session, user, error, status } where:
 *  - user.isAdmin is true  → caller may proceed
 *  - error is set          → caller should return Response.json({ error }, { status })
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return { error: "Unauthorized", status: 401 };
  }

  const email = session.user.email?.toLowerCase();
  const id = session.user.id;

  // Fast-path: hardcoded admin emails always pass
  if (email && ADMIN_EMAILS.includes(email)) {
    return { session, user: { ...session.user, is_admin: true }, error: null };
  }

  // DB check
  let rows = [];
  try {
    if (id) {
      rows =
        await sql`SELECT id, email, is_admin FROM auth_users WHERE id = ${id} LIMIT 1`;
    }
    if (!rows.length && email) {
      rows =
        await sql`SELECT id, email, is_admin FROM auth_users WHERE email = ${email} LIMIT 1`;
    }
  } catch (e) {
    console.error("adminAuth DB error:", e);
  }

  if (!rows.length) {
    return { error: "User not found", status: 404 };
  }

  if (!rows[0].is_admin) {
    return { error: "Admin access required", status: 403 };
  }

  return { session, user: rows[0], error: null };
}
