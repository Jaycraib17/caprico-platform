import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const users = await sql`
      SELECT 
        id, email, first_name, last_name, 
        is_premium, is_admin, 
        saved_jobs_count, active_alerts_count,
        created_at, updated_at
      FROM auth_users
      ORDER BY created_at DESC
      LIMIT 1000
    `;

    return Response.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
