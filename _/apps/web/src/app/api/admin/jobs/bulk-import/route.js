import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { jobs } = body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return Response.json({ error: "No jobs provided" }, { status: 400 });
    }

    let success = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];

      try {
        // Validate required fields
        if (
          !job.company_id ||
          !job.title ||
          !job.category ||
          !job.experience_level ||
          !job.employment_type ||
          !job.apply_url
        ) {
          throw new Error("Missing required fields");
        }

        // Parse array fields (pipe-separated)
        const applicantCountries = job.applicant_countries_allowed
          ? job.applicant_countries_allowed
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        const hiringCountries = job.hiring_countries
          ? job.hiring_countries
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        const responsibilities = job.responsibilities
          ? job.responsibilities
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        const requirements = job.requirements
          ? job.requirements
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        const benefits = job.benefits
          ? job.benefits
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        const timezones = job.timezone_compatibility
          ? job.timezone_compatibility
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        // Create dedup hash
        const crypto = require("crypto");
        const dedupString = `${job.company_id}${job.title}${job.apply_url}`;
        const dedup_hash = crypto
          .createHash("md5")
          .update(dedupString)
          .digest("hex");

        // Insert job
        await sql`
          INSERT INTO jobs (
            company_id, title, category, experience_level, employment_type,
            applicant_countries_allowed, hiring_countries,
            salary_min, salary_max, salary_currency,
            description, responsibilities, requirements, benefits,
            timezone_compatibility, apply_url, dedup_hash
          ) VALUES (
            ${job.company_id}, ${job.title}, ${job.category}, ${job.experience_level}, ${job.employment_type},
            ${applicantCountries}, ${hiringCountries},
            ${job.salary_min ? parseInt(job.salary_min) : null}, 
            ${job.salary_max ? parseInt(job.salary_max) : null}, 
            ${job.salary_currency || "USD"},
            ${job.description || ""}, ${responsibilities}, ${requirements}, ${benefits},
            ${timezones}, ${job.apply_url}, ${dedup_hash}
          )
          ON CONFLICT (dedup_hash) DO NOTHING
        `;

        success++;
      } catch (error) {
        failed++;
        errors.push({
          row: i + 1,
          title: job.title || "Unknown",
          message: error.message,
        });
      }
    }

    return Response.json({
      success,
      failed,
      total: jobs.length,
      errors: errors.slice(0, 50), // Limit error reporting
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return Response.json({ error: "Failed to import jobs" }, { status: 500 });
  }
}
