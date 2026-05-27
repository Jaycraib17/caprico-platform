import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      applicant_country,
      preferred_categories,
      experience_level,
      employment_types,
      user_timezone,
    } = body;

    await sql`
      UPDATE auth_users 
      SET 
        applicant_country = ${applicant_country},
        preferred_categories = ${preferred_categories},
        experience_level = ${experience_level},
        employment_types = ${employment_types},
        user_timezone = ${user_timezone},
        has_completed_onboarding = true,
        updated_at = NOW()
      WHERE id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return Response.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
