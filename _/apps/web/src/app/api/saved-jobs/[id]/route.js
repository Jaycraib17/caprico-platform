import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Delete saved job
    await sql`
      DELETE FROM saved_jobs
      WHERE user_id = ${session.user.id} AND job_id = ${id}
    `;

    // Update count
    await sql`
      UPDATE auth_users
      SET saved_jobs_count = (SELECT COUNT(*) FROM saved_jobs WHERE user_id = ${session.user.id})
      WHERE id = ${session.user.id}
    `;

    // Track activity
    await sql`
      INSERT INTO user_activity (user_id, job_id, action)
      VALUES (${session.user.id}, ${id}, 'unsave')
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Unsave job error:", error);
    return Response.json({ error: "Failed to unsave job" }, { status: 500 });
  }
}
