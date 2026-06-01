import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET(request) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let users;
    if (search) {
      users = await sql(
        `SELECT
           id, email, first_name, last_name,
           is_premium, is_admin,
           saved_jobs_count, active_alerts_count,
           premium_expires_at, subscription_status,
           created_at, updated_at
         FROM auth_users
         WHERE
           LOWER(email) LIKE LOWER($1)
           OR LOWER(first_name) LIKE LOWER($1)
           OR LOWER(last_name) LIKE LOWER($1)
         ORDER BY created_at DESC
         LIMIT 500`,
        [`%${search}%`],
      );
    } else {
      users = await sql`
        SELECT
          id, email, first_name, last_name,
          is_premium, is_admin,
          saved_jobs_count, active_alerts_count,
          premium_expires_at, subscription_status,
          created_at, updated_at
        FROM auth_users
        ORDER BY created_at DESC
        LIMIT 1000
      `;
    }

    const [counts] = await sql`
      SELECT
        COUNT(*)                              AS total,
        COUNT(*) FILTER (WHERE is_premium)    AS premium,
        COUNT(*) FILTER (WHERE is_admin)      AS admins
      FROM auth_users
    `;

    return Response.json({
      users,
      summary: {
        total: parseInt(counts.total),
        premium: parseInt(counts.premium),
        admins: parseInt(counts.admins),
        free: parseInt(counts.total) - parseInt(counts.premium),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
