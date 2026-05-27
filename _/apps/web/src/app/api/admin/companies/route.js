import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    // Simple admin check - in production you'd use proper auth
    const body = await request.json();
    const {
      name,
      slug,
      logo_url,
      description,
      website,
      remote_policy,
      hiring_countries = [],
    } = body;

    if (!name || !slug) {
      return Response.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const [company] = await sql`
      INSERT INTO companies (
        name, slug, logo_url, description, website, remote_policy, hiring_countries
      ) VALUES (
        ${name}, ${slug}, ${logo_url}, ${description}, ${website}, ${remote_policy}, ${hiring_countries}
      )
      RETURNING *
    `;

    return Response.json({ company });
  } catch (error) {
    console.error("Create company error:", error);
    return Response.json(
      { error: "Failed to create company" },
      { status: 500 },
    );
  }
}
