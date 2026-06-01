import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function PATCH(request, { params }) {
  const { error, status } = await requireAdmin();
  if (error) return Response.json({ error }, { status });

  try {
    const { id } = params;
    const body = await request.json();

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (body.is_premium !== undefined) {
      updates.push(`is_premium = $${paramIndex}`);
      values.push(body.is_premium);
      paramIndex++;
    }

    if (body.premium_expires_at !== undefined) {
      updates.push(`premium_expires_at = $${paramIndex}`);
      values.push(body.premium_expires_at);
      paramIndex++;
    }

    if (body.is_admin !== undefined) {
      updates.push(`is_admin = $${paramIndex}`);
      values.push(body.is_admin);
      paramIndex++;
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE auth_users
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, email, is_premium, is_admin
    `;

    const [user] = await sql(query, values);

    return Response.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
