import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function PATCH(request, { params }) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const { id } = params;
    const body = await request.json();
    const setClauses = [];
    const values = [];
    let idx = 1;

    if (body.is_active !== undefined) {
      setClauses.push(`is_active = $${idx++}`);
      values.push(body.is_active);
    }
    if (body.is_featured !== undefined) {
      setClauses.push(`is_featured = $${idx++}`);
      values.push(body.is_featured);
    }
    if (body.is_premium !== undefined) {
      setClauses.push(`is_premium = $${idx++}`);
      values.push(body.is_premium);
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const result = await sql(
      `UPDATE jobs SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING id, title, is_active`,
      values,
    );

    return Response.json({ job: result[0] });
  } catch (error) {
    console.error("Patch job error:", error);
    return Response.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const { id } = params;
    await sql`DELETE FROM jobs WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return Response.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
