import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    const body = await req.json();
    const { platform, source, method } = body;

    // Validate required fields
    if (!platform || !source || !method) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get user agent and IP
    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || "";
    const ipAddress =
      req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

    // Track download event
    await sql`
      INSERT INTO app_download_events (
        user_id,
        platform,
        source,
        method,
        user_agent,
        ip_address,
        referrer
      ) VALUES (
        ${session?.user?.id || null},
        ${platform},
        ${source},
        ${method},
        ${userAgent},
        ${ipAddress},
        ${referrer}
      )
    `;

    // Update daily summary
    const today = new Date().toISOString().split("T")[0];
    const methodColumn =
      method === "qr_code" ? "qr_code_scans" : "button_clicks";
    const platformColumn =
      platform === "ios" ? "ios_downloads" : "android_downloads";

    await sql`
      INSERT INTO analytics_daily_summary (date, total_downloads, ${sql(platformColumn)}, ${sql(methodColumn)})
      VALUES (${today}, 1, 1, 1)
      ON CONFLICT (date) 
      DO UPDATE SET 
        total_downloads = analytics_daily_summary.total_downloads + 1,
        ${sql(platformColumn)} = analytics_daily_summary.${sql(platformColumn)} + 1,
        ${sql(methodColumn)} = analytics_daily_summary.${sql(methodColumn)} + 1,
        updated_at = NOW()
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error tracking download event:", error);
    return Response.json(
      { error: "Failed to track download event" },
      { status: 500 },
    );
  }
}
