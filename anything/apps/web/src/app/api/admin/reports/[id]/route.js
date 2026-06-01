import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function PATCH(request, { params }) {
  const { error, status } = await requireAdmin();
  if (error) return Response.json({ error }, { status });

  try {
    const { id } = params;
    const body = await request.json();
    const { status, admin_notes } = body;

    const [report] = await sql`
      UPDATE job_reports
      SET status = ${status}, admin_notes = ${admin_notes || ""}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ report });
  } catch (error) {
    console.error("Update report error:", error);
    return Response.json({ error: "Failed to update report" }, { status: 500 });
  }
}
