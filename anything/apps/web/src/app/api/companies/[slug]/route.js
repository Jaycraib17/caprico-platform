import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const [company] = await sql`
      SELECT *
      FROM companies
      WHERE slug = ${slug}
    `;

    if (!company) {
      return Response.json({ error: "Company not found" }, { status: 404 });
    }

    const jobs = await sql`
      SELECT *
      FROM jobs
      WHERE company_id = ${company.id} AND is_active = true
      ORDER BY posted_at DESC
    `;

    return Response.json({ company, jobs });
  } catch (error) {
    console.error("Company details error:", error);
    return Response.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}
