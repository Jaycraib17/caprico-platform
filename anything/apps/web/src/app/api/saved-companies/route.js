import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedCompanies = await sql`
      SELECT 
        sc.id as saved_id,
        sc.company_id,
        sc.created_at as saved_at,
        c.*
      FROM saved_companies sc
      JOIN companies c ON sc.company_id = c.id
      WHERE sc.user_id = ${session.user.id}
      ORDER BY sc.created_at DESC
    `;

    return Response.json({ saved_companies: savedCompanies });
  } catch (error) {
    console.error("Get saved companies error:", error);
    return Response.json(
      { error: "Failed to fetch saved companies" },
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

    const { company_id } = await request.json();

    await sql`
      INSERT INTO saved_companies (user_id, company_id)
      VALUES (${session.user.id}, ${company_id})
      ON CONFLICT (user_id, company_id) DO NOTHING
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Save company error:", error);
    return Response.json({ error: "Failed to save company" }, { status: 500 });
  }
}
