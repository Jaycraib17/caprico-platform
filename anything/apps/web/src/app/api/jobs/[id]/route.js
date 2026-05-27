import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [job] = await sql`
      SELECT 
        j.*,
        c.name as company_name,
        c.slug as company_slug,
        c.logo_url as company_logo,
        c.description as company_description,
        c.website as company_website,
        c.remote_policy
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = ${id} AND j.is_active = true
    `;

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    // Track view
    await sql`UPDATE jobs SET view_count = view_count + 1 WHERE id = ${id}`;

    // Track user activity if authenticated
    const session = await auth();
    if (session?.user?.id) {
      await sql`
        INSERT INTO user_activity (user_id, job_id, action)
        VALUES (${session.user.id}, ${id}, 'view')
      `;
    }

    return Response.json({ job });
  } catch (error) {
    console.error("Job details error:", error);
    return Response.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] =
      await sql`SELECT is_admin FROM auth_users WHERE id = ${session.user.id}`;
    if (!user?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      "title",
      "category",
      "experience_level",
      "employment_type",
      "applicant_countries_allowed",
      "hiring_countries",
      "salary_min",
      "salary_max",
      "description",
      "responsibilities",
      "requirements",
      "benefits",
      "timezone_compatibility",
      "apply_url",
      "is_active",
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
    values.push(id);

    const query = `
      UPDATE jobs
      SET ${updateFields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const [job] = await sql(query, values);

    return Response.json({ job });
  } catch (error) {
    console.error("Job update error:", error);
    return Response.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] =
      await sql`SELECT is_admin FROM auth_users WHERE id = ${session.user.id}`;
    if (!user?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;

    await sql`DELETE FROM jobs WHERE id = ${id}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Job deletion error:", error);
    return Response.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
