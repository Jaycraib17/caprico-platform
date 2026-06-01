import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request, { params }) {
  try {
    const { id } = params;

    // Increment apply count
    await sql`UPDATE jobs SET apply_count = apply_count + 1 WHERE id = ${id}`;

    // Track user activity if authenticated
    const session = await auth();
    if (session?.user?.id) {
      await sql`
        INSERT INTO user_activity (user_id, job_id, action)
        VALUES (${session.user.id}, ${id}, 'apply')
      `;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Apply tracking error:", error);
    return Response.json({ error: "Failed to track apply" }, { status: 500 });
  }
}
