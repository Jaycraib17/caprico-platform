import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedSearches = await sql`
      SELECT *
      FROM saved_searches
      WHERE user_id = ${session.user.id}
      ORDER BY created_at DESC
    `;

    return Response.json({ saved_searches: savedSearches });
  } catch (error) {
    console.error("Saved searches error:", error);
    return Response.json(
      { error: "Failed to fetch saved searches" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, filters, alert_frequency } = await request.json();

    // Check premium status and limits
    const [user] = await sql`
      SELECT is_premium, active_alerts_count, premium_expires_at
      FROM auth_users
      WHERE id = ${session.user.id}
    `;

    const isPremiumActive =
      user.is_premium &&
      (!user.premium_expires_at ||
        new Date(user.premium_expires_at) > new Date());

    const hasAlerts = alert_frequency && alert_frequency !== "off";

    if (hasAlerts && !isPremiumActive && user.active_alerts_count >= 3) {
      return Response.json(
        {
          error:
            "Free tier limit reached. Upgrade to Premium for unlimited alerts.",
          limit_reached: true,
        },
        { status: 403 },
      );
    }

    // Create saved search
    const [savedSearch] = await sql`
      INSERT INTO saved_searches (user_id, name, filters, alert_frequency)
      VALUES (
        ${session.user.id}, 
        ${name}, 
        ${JSON.stringify(filters)}, 
        ${alert_frequency || "off"}
      )
      RETURNING *
    `;

    // Update alert count if needed
    if (hasAlerts) {
      await sql`
        UPDATE auth_users
        SET active_alerts_count = (
          SELECT COUNT(*) 
          FROM saved_searches 
          WHERE user_id = ${session.user.id} 
          AND alert_frequency != 'off' 
          AND is_active = true
        )
        WHERE id = ${session.user.id}
      `;
    }

    return Response.json({ saved_search: savedSearch });
  } catch (error) {
    console.error("Save search error:", error);
    return Response.json({ error: "Failed to save search" }, { status: 500 });
  }
}
