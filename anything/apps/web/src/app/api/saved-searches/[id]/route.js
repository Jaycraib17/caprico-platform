import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, filters, alert_frequency } = body;

    // Check if alert is being enabled
    if (alert_frequency && alert_frequency !== "off") {
      const [user] = await sql`
        SELECT is_premium, active_alerts_count, premium_expires_at
        FROM auth_users
        WHERE id = ${session.user.id}
      `;

      const isPremiumActive =
        user.is_premium &&
        (!user.premium_expires_at ||
          new Date(user.premium_expires_at) > new Date());

      // Check if this search already has alerts
      const [currentSearch] = await sql`
        SELECT alert_frequency
        FROM saved_searches
        WHERE id = ${id} AND user_id = ${session.user.id}
      `;

      const currentlyHasAlerts =
        currentSearch?.alert_frequency &&
        currentSearch.alert_frequency !== "off";

      if (
        !isPremiumActive &&
        !currentlyHasAlerts &&
        user.active_alerts_count >= 3
      ) {
        return Response.json(
          {
            error:
              "Free tier limit reached. Upgrade to Premium for unlimited alerts.",
            limit_reached: true,
          },
          { status: 403 },
        );
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (filters !== undefined) {
      updates.push(`filters = $${paramIndex++}`);
      values.push(JSON.stringify(filters));
    }
    if (alert_frequency !== undefined) {
      updates.push(`alert_frequency = $${paramIndex++}`);
      values.push(alert_frequency);
    }

    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add user_id and id to values
    values.push(session.user.id);
    values.push(id);

    const updateQuery = `
      UPDATE saved_searches
      SET ${updates.join(", ")}
      WHERE user_id = $${paramIndex++} AND id = $${paramIndex++}
      RETURNING *
    `;

    const result = await sql(updateQuery, values);

    if (result.length === 0) {
      return Response.json({ error: "Search not found" }, { status: 404 });
    }

    // Update alert count
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

    return Response.json({ saved_search: result[0] });
  } catch (error) {
    console.error("Update search error:", error);
    return Response.json({ error: "Failed to update search" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete saved search
    await sql`
      DELETE FROM saved_searches
      WHERE user_id = ${session.user.id} AND id = ${id}
    `;

    // Update alert count
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

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete search error:", error);
    return Response.json({ error: "Failed to delete search" }, { status: 500 });
  }
}
