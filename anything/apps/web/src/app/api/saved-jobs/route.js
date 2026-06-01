import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await sql`
      SELECT 
        sj.id as saved_id,
        sj.job_id,
        sj.created_at as saved_at,
        j.*,
        c.name as company_name,
        c.slug as company_slug,
        c.logo_url as company_logo
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE sj.user_id = ${session.user.id}
      ORDER BY sj.created_at DESC
    `;

    return Response.json({ saved_jobs: savedJobs });
  } catch (error) {
    console.error("Saved jobs error:", error);
    return Response.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { job_id } = await request.json();

    // Check premium status and limits
    const [user] = await sql`
      SELECT is_premium, saved_jobs_count, premium_expires_at
      FROM auth_users
      WHERE id = ${session.user.id}
    `;

    const isPremiumActive =
      user.is_premium &&
      (!user.premium_expires_at ||
        new Date(user.premium_expires_at) > new Date());

    if (!isPremiumActive && user.saved_jobs_count >= 5) {
      return Response.json(
        {
          error:
            "Free tier limit reached. Upgrade to Premium for unlimited saved jobs.",
          limit_reached: true,
        },
        { status: 403 },
      );
    }

    // Save job
    await sql`
      INSERT INTO saved_jobs (user_id, job_id)
      VALUES (${session.user.id}, ${job_id})
      ON CONFLICT (user_id, job_id) DO NOTHING
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
      VALUES (${session.user.id}, ${job_id}, 'save')
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Save job error:", error);
    return Response.json({ error: "Failed to save job" }, { status: 500 });
  }
}
