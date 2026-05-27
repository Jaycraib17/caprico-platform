import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ saved: {} });
    }

    const { job_ids } = await request.json();

    if (!job_ids || job_ids.length === 0) {
      return Response.json({ saved: {} });
    }

    const results = await sql`
      SELECT job_id
      FROM saved_jobs
      WHERE user_id = ${session.user.id} AND job_id = ANY(${job_ids})
    `;

    const saved = {};
    results.forEach((row) => {
      saved[row.job_id] = true;
    });

    return Response.json({ saved });
  } catch (error) {
    console.error("Check saved jobs error:", error);
    return Response.json({ saved: {} });
  }
}
