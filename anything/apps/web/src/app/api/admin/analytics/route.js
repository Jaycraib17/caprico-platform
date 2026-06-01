import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET(request) {
  const { error, status } = await requireAdmin();
  if (error) return Response.json({ error }, { status });

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Job views over time
    const viewsOverTime = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views
      FROM user_activity
      WHERE action = 'view'
      AND created_at >= NOW() - (INTERVAL '1 day' * ${days})
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Jobs by category
    const jobsByCategory = await sql`
      SELECT category as name, COUNT(*) as count
      FROM jobs
      WHERE is_active = true
      GROUP BY category
      ORDER BY count DESC
    `;

    // Jobs by experience level
    const jobsByExperience = await sql`
      SELECT experience_level as level, COUNT(*) as count
      FROM jobs
      WHERE is_active = true
      GROUP BY experience_level
      ORDER BY count DESC
    `;

    // Top companies
    const topCompanies = await sql`
      SELECT name, job_count
      FROM companies
      WHERE job_count > 0
      ORDER BY job_count DESC
      LIMIT 10
    `;

    // User growth
    const userGrowth = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as signups,
        COUNT(*) FILTER (WHERE is_premium = true) as premium
      FROM auth_users
      WHERE created_at >= NOW() - (INTERVAL '1 day' * ${days})
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return Response.json({
      viewsOverTime: viewsOverTime.map((row) => ({
        date: new Date(row.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: parseInt(row.views),
      })),
      jobsByCategory: jobsByCategory.map((row) => ({
        name: row.name,
        count: parseInt(row.count),
      })),
      jobsByExperience: jobsByExperience.map((row) => ({
        level: row.level,
        count: parseInt(row.count),
      })),
      topCompanies: topCompanies.map((row) => ({
        name: row.name,
        job_count: parseInt(row.job_count),
      })),
      userGrowth: userGrowth.map((row) => ({
        date: new Date(row.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        signups: parseInt(row.signups),
        premium: parseInt(row.premium),
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
