import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { reason, details } = await request.json();

    if (!reason) {
      return Response.json({ error: "Reason is required" }, { status: 400 });
    }

    await sql`
      INSERT INTO job_reports (job_id, user_id, reason, details)
      VALUES (${id}, ${session.user.id}, ${reason}, ${details || null})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Report job error:", error);
    return Response.json({ error: "Failed to report job" }, { status: 500 });
  }
}
