import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Filters
    const category = searchParams.get("category");
    const experienceLevel = searchParams.get("experience_level");
    const employmentType = searchParams.get("employment_type");
    const applicantCountry = searchParams.get("applicant_country");
    const hiringCountries = searchParams
      .get("hiring_countries")
      ?.split(",")
      .filter(Boolean);
    const search = searchParams.get("search");
    const minSalary = searchParams.get("min_salary");
    const maxSalary = searchParams.get("max_salary");
    const worldwide = searchParams.get("worldwide") === "true";

    // Build dynamic query
    let whereConditions = ["j.is_active = true"];
    let queryParams = [];
    let paramIndex = 1;

    // Category filter
    if (category) {
      whereConditions.push(`j.category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    // Experience level filter
    if (experienceLevel) {
      whereConditions.push(`j.experience_level = $${paramIndex}`);
      queryParams.push(experienceLevel);
      paramIndex++;
    }

    // Employment type filter
    if (employmentType) {
      whereConditions.push(`j.employment_type = $${paramIndex}`);
      queryParams.push(employmentType);
      paramIndex++;
    }

    // Applicant country filter (CRITICAL for geo-restrictions)
    if (applicantCountry && !worldwide) {
      whereConditions.push(
        `(j.applicant_countries_allowed = '{}' OR $${paramIndex} = ANY(j.applicant_countries_allowed))`,
      );
      queryParams.push(applicantCountry);
      paramIndex++;
    }

    // Hiring countries filter (multi-select)
    if (hiringCountries && hiringCountries.length > 0) {
      whereConditions.push(`j.hiring_countries && $${paramIndex}`);
      queryParams.push(hiringCountries);
      paramIndex++;
    }

    // Salary filter
    if (minSalary) {
      whereConditions.push(`j.salary_min >= $${paramIndex}`);
      queryParams.push(parseInt(minSalary));
      paramIndex++;
    }

    if (maxSalary) {
      whereConditions.push(`j.salary_max <= $${paramIndex}`);
      queryParams.push(parseInt(maxSalary));
      paramIndex++;
    }

    // Full-text search
    if (search) {
      whereConditions.push(
        `j.search_vector @@ plainto_tsquery('english', $${paramIndex})`,
      );
      queryParams.push(search);
      paramIndex++;
    }

    const whereClause = whereConditions.join(" AND ");

    // Main query with company join
    const query = `
      SELECT 
        j.*,
        c.name as company_name,
        c.slug as company_slug,
        c.logo_url as company_logo,
        c.remote_policy
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE ${whereClause}
      ORDER BY j.is_featured DESC, j.posted_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const jobs = await sql(query, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM jobs j
      WHERE ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Remove limit/offset
    const countResult = await sql(countQuery, countParams);
    const total = parseInt(countResult[0]?.total || 0);

    return Response.json({
      jobs,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("Jobs list error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const [user] =
      await sql`SELECT is_admin FROM auth_users WHERE id = ${session.user.id}`;
    if (!user?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      company_id,
      title,
      category,
      experience_level,
      employment_type,
      applicant_countries_allowed = [],
      hiring_countries = [],
      salary_min,
      salary_max,
      salary_currency = "USD",
      description,
      responsibilities = [],
      requirements = [],
      benefits = [],
      timezone_compatibility = [],
      apply_url,
    } = body;

    // Create dedup hash
    const crypto = require("crypto");
    const dedupString = `${company_id}${title}${apply_url}`;
    const dedup_hash = crypto
      .createHash("md5")
      .update(dedupString)
      .digest("hex");

    const [job] = await sql`
      INSERT INTO jobs (
        company_id, title, category, experience_level, employment_type,
        applicant_countries_allowed, hiring_countries,
        salary_min, salary_max, salary_currency,
        description, responsibilities, requirements, benefits,
        timezone_compatibility, apply_url, dedup_hash
      ) VALUES (
        ${company_id}, ${title}, ${category}, ${experience_level}, ${employment_type},
        ${applicant_countries_allowed}, ${hiring_countries},
        ${salary_min}, ${salary_max}, ${salary_currency},
        ${description}, ${responsibilities}, ${requirements}, ${benefits},
        ${timezone_compatibility}, ${apply_url}, ${dedup_hash}
      )
      ON CONFLICT (dedup_hash) DO UPDATE
      SET updated_at = NOW()
      RETURNING *
    `;

    return Response.json({ job });
  } catch (error) {
    console.error("Job creation error:", error);
    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}
