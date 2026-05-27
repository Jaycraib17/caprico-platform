import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function PATCH(request, { params }) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const { id } = params;
    const body = await request.json();
    const { is_active } = body;

    const [company] = await sql`
      UPDATE companies SET is_active = ${is_active}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, is_active
    `;
    return Response.json({ company });
  } catch (error) {
    console.error("Patch company error:", error);
    return Response.json(
      { error: "Failed to update company" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const { id } = params;
    await sql`DELETE FROM companies WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete company error:", error);
    return Response.json(
      { error: "Failed to delete company" },
      { status: 500 },
    );
  }
}
