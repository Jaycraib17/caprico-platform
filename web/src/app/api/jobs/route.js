import sql from '../utils/sql';
import { ensureDirectJobSchema } from '../utils/directJobImporter';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' };
const SORTS = new Set(['newest', 'featured', 'salary_high', 'jamaica_first']);

function positiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(parsed, max);
}

function truthy(value) {
  return value === 'true' || value === '1' || value === 'yes';
}

async function ensurePublicJobsSchema() {
  await ensureDirectJobSchema();
  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      logo_url TEXT,
      remote_policy TEXT,
      careers_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS id BIGSERIAL;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS name TEXT;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS slug TEXT;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS remote_policy TEXT;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS careers_url TEXT;`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;
  await sql`CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_id BIGINT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'USD';`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applicant_countries_allowed TEXT[] DEFAULT '{}';`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_countries TEXT[] DEFAULT '{}';`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS timezone_compatibility TEXT[] DEFAULT '{}';`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_public_status ON jobs (is_active, status, posted_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_public_filters ON jobs (category, employment_type, experience_level);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_public_availability ON jobs (is_jamaica_eligible, is_caribbean_friendly, is_africa_friendly, is_worldwide);`;
}

export async function GET(request) {
  console.log('JOB SCOUT LIVE v1');

  try {
    await ensurePublicJobsSchema();
    const { searchParams } = new URL(request.url);
    const limit = positiveInt(searchParams.get('limit'), 20, 100);
    const offset = positiveInt(searchParams.get('offset'), 0, 100000);
    const category = searchParams.get('category');
    const experienceLevel = searchParams.get('experience_level');
    const employmentType = searchParams.get('employment_type');
    const applicantCountry = searchParams.get('applicant_country');
    const hiringCountries = searchParams.get('hiring_countries')?.split(',').map((v) => v.trim()).filter(Boolean) || [];
    const search = searchParams.get('search') || searchParams.get('q');
    const minSalary = searchParams.get('min_salary');
    const maxSalary = searchParams.get('max_salary');
    const worldwide = truthy(searchParams.get('worldwide'));
    const jamaicaEligible = truthy(searchParams.get('jamaica_eligible'));
    const caribbeanFriendly = truthy(searchParams.get('caribbean_friendly'));
    const africaFriendly = truthy(searchParams.get('africa_friendly'));
    const beginnerFriendly = truthy(searchParams.get('beginner_friendly'));
    const noDegree = truthy(searchParams.get('no_degree'));
    const aiTraining = truthy(searchParams.get('ai_training'));
    const customerSupport = truthy(searchParams.get('customer_support'));
    const virtualAssistant = truthy(searchParams.get('virtual_assistant'));
    const sort = SORTS.has(searchParams.get('sort')) ? searchParams.get('sort') : 'jamaica_first';

    const where = ["j.is_active = true", "(j.status = 'approved' OR j.status IS NULL OR j.status = '')"];
    const params = [];
    const add = (condition, value) => {
      params.push(value);
      where.push(condition.replace('?', `$${params.length}`));
    };

    if (category) add('j.category = ?', category);
    if (experienceLevel) add('j.experience_level = ?', experienceLevel);
    if (employmentType) add('j.employment_type = ?', employmentType);
    if (applicantCountry && !worldwide) add("(COALESCE(array_length(j.applicant_countries_allowed, 1), 0) = 0 OR ? = ANY(j.applicant_countries_allowed))", applicantCountry);
    if (hiringCountries.length) add('j.hiring_countries && ?::text[]', hiringCountries);
    if (minSalary) add('j.salary_min >= ?', Number.parseInt(minSalary, 10));
    if (maxSalary) add('j.salary_max <= ?', Number.parseInt(maxSalary, 10));
    if (search) {
      params.push(search, search, search);
      where.push(`(j.title ILIKE '%' || $${params.length - 2} || '%' OR j.company_name ILIKE '%' || $${params.length - 1} || '%' OR COALESCE(j.description_preview, j.summary, j.description, '') ILIKE '%' || $${params.length} || '%')`);
    }
    if (worldwide) where.push('j.is_worldwide = true');
    if (jamaicaEligible) where.push('j.is_jamaica_eligible = true');
    if (caribbeanFriendly) where.push('j.is_caribbean_friendly = true');
    if (africaFriendly) where.push('j.is_africa_friendly = true');
    if (beginnerFriendly) where.push('j.beginner_friendly = true');
    if (noDegree) where.push('j.no_degree = true');
    if (aiTraining) where.push('j.ai_training = true');
    if (customerSupport) where.push('j.customer_support = true');
    if (virtualAssistant) where.push('j.virtual_assistant = true');

    let orderBy = 'j.is_featured DESC, j.posted_at DESC, j.created_at DESC';
    if (sort === 'newest') orderBy = 'j.posted_at DESC, j.created_at DESC';
    if (sort === 'salary_high') orderBy = 'j.salary_max DESC NULLS LAST, j.salary_min DESC NULLS LAST, j.posted_at DESC';
    if (sort === 'jamaica_first') {
      orderBy = `j.is_featured DESC,
        j.is_jamaica_eligible DESC,
        j.is_caribbean_friendly DESC,
        j.is_africa_friendly DESC,
        j.is_worldwide DESC,
        j.posted_at DESC,
        j.created_at DESC`;
    }

    const whereClause = where.join(' AND ');
    const jobsParams = [...params, limit, offset];
    const jobs = await sql(
      `SELECT
        j.*,
        COALESCE(c.name, j.company_name) AS company_name,
        c.slug AS company_slug,
        c.logo_url AS company_logo,
        c.remote_policy,
        CASE
          WHEN j.apply_url_type = 'source_board' OR j.apply_url_needs_review = true THEN 'View Source'
          ELSE 'Apply on Company Site'
        END AS apply_button_label,
        CASE
          WHEN j.is_jamaica_eligible THEN '🇯🇲 Jamaica eligible'
          WHEN j.is_caribbean_friendly THEN '🌴 Caribbean-friendly'
          WHEN j.is_africa_friendly THEN '🌍 Africa-friendly'
          WHEN j.is_worldwide THEN '🌎 Worldwide'
          ELSE COALESCE(j.remote_availability, 'Remote')
        END AS availability_badge
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      jobsParams
    );

    const countResult = await sql(`SELECT COUNT(*)::int AS total FROM jobs j WHERE ${whereClause}`, params);
    const total = Number(countResult[0]?.total || 0);

    return Response.json({ jobs, total, limit, offset, hasMore: offset + limit < total }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Jobs list error:', error);
    return Response.json({ error: 'Failed to fetch jobs' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
