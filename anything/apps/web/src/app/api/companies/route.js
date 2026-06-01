import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const jobStatus = searchParams.get("job_status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const showInactive = searchParams.get("show_inactive") === "true";

    let whereConditions = [showInactive ? "1=1" : "is_active = true"];
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`LOWER(name) LIKE LOWER($${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (tag) {
      whereConditions.push(`$${paramIndex} = ANY(tags)`);
      queryParams.push(tag);
      paramIndex++;
    }

    if (jobStatus) {
      whereConditions.push(`job_status = $${paramIndex}`);
      queryParams.push(jobStatus);
      paramIndex++;
    }

    const whereClause = whereConditions.join(" AND ");

    const query = `
      SELECT 
        id, name, slug, logo_url, description, website, career_website,
        remote_policy, hiring_countries, job_count, job_types, job_status,
        source_page, tags, region, is_active, created_at, updated_at
      FROM companies
      WHERE ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const companies = await sql(query, queryParams);

    const countQuery = `SELECT COUNT(*) as total FROM companies WHERE ${whereClause}`;
    const countParams = queryParams.slice(0, -2);
    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0]?.total || 0);

    return Response.json({
      companies,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Companies list error:", error);
    return Response.json(
      { error: "Failed to fetch companies", detail: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const body = await request.json();
    const {
      name,
      logo_url,
      description,
      website,
      career_website,
      remote_policy,
      hiring_countries = [],
      job_types,
      job_status,
      source_page,
      tags = [],
    } = body;

    if (!name) {
      return Response.json({ error: "Company name required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const [company] = await sql`
      INSERT INTO companies (
        name, slug, logo_url, description, website, career_website,
        remote_policy, hiring_countries, job_types, job_status,
        source_page, tags, is_active
      ) VALUES (
        ${name}, ${slug}, ${logo_url}, ${description}, ${website || career_website},
        ${career_website}, ${remote_policy}, ${hiring_countries}, ${job_types},
        ${job_status}, ${source_page}, ${tags}, true
      )
      ON CONFLICT (slug) DO UPDATE SET
        website = EXCLUDED.website,
        updated_at = NOW()
      RETURNING *
    `;

    return Response.json({ company });
  } catch (error) {
    console.error("Company creation error:", error);
    return Response.json(
      { error: "Failed to create company", detail: error.message },
      { status: 500 },
    );
  }
}
