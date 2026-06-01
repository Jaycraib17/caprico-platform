import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    const body = await req.json();
    const { event_type, event_data, platform, app_version } = body;

    // Validate required fields
    if (!event_type) {
      return Response.json({ error: "Missing event_type" }, { status: 400 });
    }

    // Track engagement event
    await sql`
      INSERT INTO app_engagement_metrics (
        user_id,
        event_type,
        event_data,
        platform,
        app_version
      ) VALUES (
        ${session?.user?.id || null},
        ${event_type},
        ${event_data ? JSON.stringify(event_data) : null},
        ${platform || null},
        ${app_version || null}
      )
    `;

    // Update daily summary for specific events
    const today = new Date().toISOString().split("T")[0];

    if (event_type === "job_view") {
      await sql`
        INSERT INTO analytics_daily_summary (date, job_views)
        VALUES (${today}, 1)
        ON CONFLICT (date) 
        DO UPDATE SET 
          job_views = analytics_daily_summary.job_views + 1,
          updated_at = NOW()
      `;
    } else if (event_type === "job_apply") {
      await sql`
        INSERT INTO analytics_daily_summary (date, job_applications)
        VALUES (${today}, 1)
        ON CONFLICT (date) 
        DO UPDATE SET 
          job_applications = analytics_daily_summary.job_applications + 1,
          updated_at = NOW()
      `;
    } else if (event_type === "app_open") {
      // Track daily active users
      await sql`
        INSERT INTO analytics_daily_summary (date, daily_active_users)
        VALUES (${today}, 1)
        ON CONFLICT (date) 
        DO UPDATE SET 
          daily_active_users = analytics_daily_summary.daily_active_users + 1,
          updated_at = NOW()
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error tracking engagement event:", error);
    return Response.json(
      { error: "Failed to track engagement event" },
      { status: 500 },
    );
  }
}
