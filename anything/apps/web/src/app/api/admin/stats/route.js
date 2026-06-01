import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET() {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const [jobs] = await sql`
      SELECT
        COUNT(*)                               AS total_jobs,
        COUNT(*) FILTER (WHERE is_active)      AS active_jobs
      FROM jobs
    `;

    const [companies] = await sql`
      SELECT
        COUNT(*)                               AS total_companies,
        COUNT(*) FILTER (WHERE job_count > 0)  AS hiring_companies
      FROM companies
    `;

    const [users] = await sql`
      SELECT
        COUNT(*)                               AS total_users,
        COUNT(*) FILTER (WHERE is_premium)     AS premium_users
      FROM auth_users
    `;

    const [reports] = await sql`
      SELECT COUNT(*) AS pending_reports
      FROM job_reports
      WHERE status = 'pending'
    `;

    return Response.json({
      total_jobs: parseInt(jobs.total_jobs),
      active_jobs: parseInt(jobs.active_jobs),
      total_companies: parseInt(companies.total_companies),
      hiring_companies: parseInt(companies.hiring_companies),
      total_users: parseInt(users.total_users),
      premium_users: parseInt(users.premium_users),
      pending_reports: parseInt(reports.pending_reports),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
