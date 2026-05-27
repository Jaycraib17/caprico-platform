import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] = await sql(`SELECT is_admin FROM auth_users WHERE id = $1`, [
      session.user.id,
    ]);

    if (!user?.is_admin) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const purchases = await sql(
      `SELECT 
        sp.*,
        au.email as customer_email,
        au.first_name,
        au.last_name
      FROM service_purchases sp
      JOIN auth_users au ON sp.user_id = au.id
      ORDER BY sp.purchased_at DESC`,
    );

    return Response.json({ purchases });
  } catch (error) {
    console.error("Failed to fetch admin purchases:", error);
    return Response.json(
      { error: "Failed to fetch purchases" },
      { status: 500 },
    );
  }
}
