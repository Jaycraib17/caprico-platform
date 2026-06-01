import sql from "@/app/api/utils/sql";

// This endpoint would be called by a cron job daily/weekly/instant
export async function POST(request) {
  try {
    // Verify this is coming from a cron job (use secret key in production)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET || "dev-secret";

    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { frequency = "daily" } = await request.json();

    // Get saved searches with alerts enabled for this frequency
    const savedSearches = await sql`
      SELECT 
        ss.*,
        u.email,
        u.first_name
      FROM saved_searches ss
      JOIN auth_users u ON ss.user_id = u.id
      WHERE ss.is_active = true
      AND ss.alert_frequency = ${frequency}
      AND (
        ss.last_notified_at IS NULL
        OR (
          ${frequency} = 'daily' AND ss.last_notified_at < NOW() - INTERVAL '1 day'
        )
        OR (
          ${frequency} = 'weekly' AND ss.last_notified_at < NOW() - INTERVAL '7 days'
        )
      )
    `;

    const results = [];

    for (const search of savedSearches) {
      try {
        // Parse filters
        const filters =
          typeof search.filters === "string"
            ? JSON.parse(search.filters)
            : search.filters;

        // Build job query based on filters
        let jobQuery = `
          SELECT j.*, c.name as company_name
          FROM jobs j
          LEFT JOIN companies c ON j.company_id = c.id
          WHERE j.is_active = true
        `;

        const conditions = [];
        const values = [];
        let paramCount = 0;

        // Apply filters
        if (filters.category) {
          paramCount++;
          conditions.push(`j.category = $${paramCount}`);
          values.push(filters.category);
        }

        if (filters.experience_level) {
          paramCount++;
          conditions.push(`j.experience_level = $${paramCount}`);
          values.push(filters.experience_level);
        }

        if (filters.employment_type) {
          paramCount++;
          conditions.push(`j.employment_type = $${paramCount}`);
          values.push(filters.employment_type);
        }

        if (filters.country) {
          paramCount++;
          conditions.push(`$${paramCount} = ANY(j.hiring_countries)`);
          values.push(filters.country);
        }

        // Only get jobs posted since last notification (or last 24 hours)
        const sinceDate =
          search.last_notified_at || new Date(Date.now() - 24 * 60 * 60 * 1000);
        paramCount++;
        conditions.push(`j.posted_at > $${paramCount}`);
        values.push(sinceDate);

        if (conditions.length > 0) {
          jobQuery += " AND " + conditions.join(" AND ");
        }

        jobQuery += ` ORDER BY j.posted_at DESC LIMIT 20`;

        const newJobs = await sql(jobQuery, values);

        if (newJobs.length > 0) {
          // Send email notification
          await sendAlertEmail(
            search.email,
            search.first_name,
            search.name,
            newJobs,
          );

          // Update last notified timestamp
          await sql`
            UPDATE saved_searches
            SET last_notified_at = NOW()
            WHERE id = ${search.id}
          `;

          results.push({
            search_id: search.id,
            email: search.email,
            jobs_found: newJobs.length,
            status: "sent",
          });
        } else {
          results.push({
            search_id: search.id,
            email: search.email,
            jobs_found: 0,
            status: "no_new_jobs",
          });
        }
      } catch (error) {
        console.error(`Error processing search ${search.id}:`, error);
        results.push({
          search_id: search.id,
          email: search.email,
          status: "error",
          error: error.message,
        });
      }
    }

    return Response.json({
      frequency,
      searches_processed: savedSearches.length,
      results,
    });
  } catch (error) {
    console.error("Send alerts error:", error);
    return Response.json({ error: "Failed to send alerts" }, { status: 500 });
  }
}

async function sendAlertEmail(email, firstName, searchName, jobs) {
  // Using Resend for email
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return;
  }

  const jobsList = jobs
    .map(
      (job) => `
    <div style="margin-bottom: 20px; padding: 15px; border-left: 3px solid #D4A5A5; background: #F9F9F9;">
      <h3 style="margin: 0 0 5px 0; color: #2D2D2D;">${job.title}</h3>
      <p style="margin: 0; color: #6B6B6B; font-size: 14px;">${job.company_name} • ${job.employment_type}</p>
      <a href="${process.env.APP_URL}/job/${job.id}" style="color: #D4A5A5; text-decoration: none; font-weight: 600;">View Job →</a>
    </div>
  `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2D2D2D; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; padding: 20px 0;">
        <h1 style="color: #D4A5A5; margin: 0;">Capri Remote</h1>
      </div>
      
      <h2>Hi ${firstName || "there"}! 👋</h2>
      
      <p>We found <strong>${jobs.length} new ${jobs.length === 1 ? "job" : "jobs"}</strong> matching your saved search "<strong>${searchName}</strong>":</p>
      
      ${jobsList}
      
      <p style="margin-top: 30px;">
        <a href="${process.env.APP_URL}" style="display: inline-block; background: #D4A5A5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">View All Jobs</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #E0E0E0; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #9B9B9B;">
        You're receiving this because you enabled job alerts for "${searchName}".
        <br>
        <a href="${process.env.APP_URL}/settings" style="color: #D4A5A5;">Manage your alerts</a>
      </p>
    </body>
    </html>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Capri Remote <alerts@capriremote.com>",
      to: email,
      subject: `${jobs.length} New ${jobs.length === 1 ? "Job" : "Jobs"} for "${searchName}"`,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}
