import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await sql`
      SELECT is_admin FROM auth_users WHERE id = ${session.user.id}
    `;

    if (!user[0]?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get daily summary stats
    const dailyStats = await sql`
      SELECT * FROM analytics_daily_summary
      ORDER BY date DESC
      LIMIT ${days}
    `;

    // Get total downloads by platform
    const platformStats = await sql`
      SELECT 
        platform,
        COUNT(*) as total,
        COUNT(CASE WHEN method = 'qr_code' THEN 1 END) as qr_scans,
        COUNT(CASE WHEN method = 'button' THEN 1 END) as button_clicks
      FROM app_download_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY platform
    `;

    // Get downloads by source
    const sourceStats = await sql`
      SELECT 
        source,
        COUNT(*) as total,
        platform
      FROM app_download_events
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY source, platform
      ORDER BY total DESC
    `;

    // Get top engagement events
    const engagementStats = await sql`
      SELECT 
        event_type,
        COUNT(*) as total,
        platform
      FROM app_engagement_metrics
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY event_type, platform
      ORDER BY total DESC
    `;

    // Get user retention (users who returned after first download)
    const retentionStats = await sql`
      WITH first_events AS (
        SELECT user_id, MIN(created_at) as first_event
        FROM app_engagement_metrics
        WHERE user_id IS NOT NULL
        GROUP BY user_id
      ),
      return_events AS (
        SELECT DISTINCT e.user_id
        FROM app_engagement_metrics e
        JOIN first_events f ON e.user_id = f.user_id
        WHERE e.created_at > f.first_event + INTERVAL '1 day'
      )
      SELECT 
        COUNT(DISTINCT f.user_id) as total_users,
        COUNT(DISTINCT r.user_id) as returning_users,
        ROUND(100.0 * COUNT(DISTINCT r.user_id) / NULLIF(COUNT(DISTINCT f.user_id), 0), 2) as retention_rate
      FROM first_events f
      LEFT JOIN return_events r ON f.user_id = r.user_id
    `;

    return Response.json({
      dailyStats,
      platformStats,
      sourceStats,
      engagementStats,
      retentionStats: retentionStats[0] || {},
      period_days: days,
    });
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return Response.json(
      { error: "Failed to fetch analytics stats" },
      { status: 500 },
    );
  }
}
