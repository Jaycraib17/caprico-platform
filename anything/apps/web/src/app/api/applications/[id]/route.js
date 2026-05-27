import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updates = await request.json();

    const allowedFields = ["status", "notes", "follow_up_date"];
    const updateFields = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .map((key) => `${key} = $${key}`)
      .join(", ");

    if (!updateFields) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const [application] = await sql`
      UPDATE applications
      SET ${sql(updates)}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING *
    `;

    if (!application) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    return Response.json({ application });
  } catch (error) {
    console.error("Update application error:", error);
    return Response.json(
      { error: "Failed to update application" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await sql`
      DELETE FROM applications
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete application error:", error);
    return Response.json(
      { error: "Failed to delete application" },
      { status: 500 },
    );
  }
}
