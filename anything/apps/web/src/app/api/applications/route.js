import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await sql`
      SELECT * FROM applications
      WHERE user_id = ${session.user.id}
      ORDER BY applied_at DESC
    `;

    return Response.json({ applications });
  } catch (error) {
    console.error("Get applications error:", error);
    return Response.json(
      { error: "Failed to fetch applications" },
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

    // Check premium status
    const [user] = await sql`
      SELECT is_premium, premium_expires_at FROM auth_users WHERE id = ${session.user.id}
    `;

    const isPremiumActive =
      user.is_premium &&
      (!user.premium_expires_at ||
        new Date(user.premium_expires_at) > new Date());

    if (!isPremiumActive) {
      return Response.json(
        {
          error: "Application tracker is a premium feature",
          premium_required: true,
        },
        { status: 403 },
      );
    }

    const { job_id, company_name, job_title, notes } = await request.json();

    const [application] = await sql`
      INSERT INTO applications (user_id, job_id, company_name, job_title, notes, status)
      VALUES (${session.user.id}, ${job_id}, ${company_name}, ${job_title}, ${notes || null}, 'applied')
      RETURNING *
    `;

    return Response.json({ application });
  } catch (error) {
    console.error("Create application error:", error);
    return Response.json(
      { error: "Failed to track application" },
      { status: 500 },
    );
  }
}
