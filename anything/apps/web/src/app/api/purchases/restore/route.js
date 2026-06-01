import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all completed purchases for this user
    const purchases = await sql(
      `SELECT 
        id,
        service_id,
        service_name,
        price,
        status,
        purchased_at,
        receipt_verified
      FROM service_purchases
      WHERE user_id = $1 AND status = 'completed'
      ORDER BY purchased_at DESC`,
      [session.user.id],
    );

    return Response.json({
      restored: purchases.length,
      purchases,
    });
  } catch (error) {
    console.error("Failed to restore purchases:", error);
    return Response.json(
      { error: "Failed to restore purchases" },
      { status: 500 },
    );
  }
}
