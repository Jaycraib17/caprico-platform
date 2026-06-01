import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await sql`
      DELETE FROM saved_companies
      WHERE company_id = ${id} AND user_id = ${session.user.id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Unsave company error:", error);
    return Response.json(
      { error: "Failed to unsave company" },
      { status: 500 },
    );
  }
}
