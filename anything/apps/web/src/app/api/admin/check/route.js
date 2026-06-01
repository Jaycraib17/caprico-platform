import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Hardcoded admin emails — bypasses the database flag entirely
const ADMIN_EMAILS = ["jaycraib17@gmail.com"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { isAdmin: false, error: "No session" },
        { status: 401 },
      );
    }

    const email = session.user.email?.toLowerCase();

    // Hardcoded check — no database dependency
    if (email && ADMIN_EMAILS.includes(email)) {
      return Response.json({ isAdmin: true, user: session.user });
    }

    // Fall back to DB check for other users
    const id = session.user.id;
    let rows = [];
    if (id) {
      rows =
        await sql`SELECT id, email, is_admin FROM auth_users WHERE id = ${id} LIMIT 1`;
    }
    if (!rows.length && email) {
      rows =
        await sql`SELECT id, email, is_admin FROM auth_users WHERE email = ${email} LIMIT 1`;
    }

    return Response.json({
      isAdmin: !!rows[0]?.is_admin,
      user: rows[0] ?? null,
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return Response.json(
      { isAdmin: false, error: error.message },
      { status: 500 },
    );
  }
}
