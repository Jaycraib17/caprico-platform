import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET(request) {
  const { error, status } = await requireAdmin();
  if (error) return Response.json({ error }, { status });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    const reports = await sql`
      SELECT 
        jr.*,
        j.title as job_title,
        c.name as company_name
      FROM job_reports jr
      LEFT JOIN jobs j ON jr.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE jr.status = ${status}
      ORDER BY jr.created_at DESC
      LIMIT 100
    `;

    return Response.json({ reports });
  } catch (error) {
    console.error("Get reports error:", error);
    return Response.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
