import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search");

    let query = `
      SELECT *
      FROM companies
      WHERE job_count > 0
    `;

    const params = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND LOWER(name) LIKE LOWER($${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY job_count DESC, name ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const companies = await sql(query, params);

    const [{ total }] =
      await sql`SELECT COUNT(*) as total FROM companies WHERE job_count > 0`;

    return Response.json({
      companies,
      total: parseInt(total),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Companies list error:", error);
    return Response.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}
