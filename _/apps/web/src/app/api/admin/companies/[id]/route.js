import sql from "@/app/api/utils/sql";

export async function DELETE(request, { params }) {
  try {
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
