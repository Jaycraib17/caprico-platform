import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await sql`
      SELECT 
        id, email, name, image,
        applicant_country, preferred_categories, experience_level,
        employment_types, user_timezone, is_premium, premium_expires_at,
        saved_jobs_count, active_alerts_count, has_completed_onboarding
      FROM auth_users
      WHERE id = ${session.user.id}
    `;

    return Response.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return Response.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      "applicant_country",
      "preferred_categories",
      "experience_level",
      "employment_types",
      "user_timezone",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(session.user.id);

    const query = `
      UPDATE auth_users
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING 
        id, email, name, image,
        applicant_country, preferred_categories, experience_level,
        employment_types, user_timezone, is_premium, premium_expires_at,
        saved_jobs_count, active_alerts_count, has_completed_onboarding
    `;

    const [user] = await sql(query, values);

    return Response.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
