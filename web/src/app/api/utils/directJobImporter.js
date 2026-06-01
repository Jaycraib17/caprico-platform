import sql from './sql';
import { ensureJobScoutSchema } from './jobScout';

export const OFFICIAL_ATS_DOMAINS = [
  'teamtailor.com',
  'greenhouse.io',
  'boards.greenhouse.io',
  'lever.co',
  'jobs.lever.co',
  'ashbyhq.com',
  'jobs.ashbyhq.com',
  'workable.com',
  'apply.workable.com',
  'smartrecruiters.com',
  'workdayjobs.com',
  'myworkdayjobs.com',
  'bamboohr.com',
  'jobvite.com',
  'recruitee.com',
  'breezy.hr',
  'icims.com',
];

export const SOURCE_BOARD_DOMAINS = [
  'remoteok.com',
  'remotive.com',
  'weworkremotely.com',
  'workingnomads.com',
  'jobicy.com',
  'jobspresso.co',
  'himalayas.app',
  'nodesk.co',
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'flexjobs.com',
  'ziprecruiter.com',
  'monster.com',
];

const NO_CACHE_HEADERS = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' };

export function jsonNoCache(body, init = {}) {
  return Response.json(body, {
    ...init,
    headers: { ...NO_CACHE_HEADERS, ...(init.headers || {}) },
  });
}

export function parseJobUrl(value) {
  try {
    const parsed = new URL(String(value || '').trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function hostMatches(hostname, domain) {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  const target = domain.toLowerCase().replace(/^www\./, '');
  return host === target || host.endsWith(`.${target}`);
}

export function detectJobSource(url) {
  const parsed = typeof url === 'string' ? parseJobUrl(url) : url;
  const hostname = parsed?.hostname?.toLowerCase()?.replace(/^www\./, '') || '';
  const officialDomain = OFFICIAL_ATS_DOMAINS.find((domain) => hostMatches(hostname, domain));
  const sourceBoardDomain = SOURCE_BOARD_DOMAINS.find((domain) => hostMatches(hostname, domain));

  if (sourceBoardDomain) {
    return {
      source_domain: hostname,
      source_type: 'source_board',
      source_name: sourceBoardDomain.replace(/\.(com|co|app|hr|io)$/i, ''),
      apply_url_type: 'source_board',
      apply_url_needs_review: true,
      warning: 'This looks like a source board or aggregator. Review the link before publishing.',
    };
  }

  if (officialDomain) {
    return {
      source_domain: hostname,
      source_type: 'official_ats',
      source_name: officialDomain.includes('teamtailor') ? 'Teamtailor' : officialDomain,
      apply_url_type: 'official_job_posting',
      apply_url_needs_review: false,
      warning: null,
    };
  }

  return {
    source_domain: hostname,
    source_type: 'company_career_page',
    source_name: hostname || 'Company career page',
    apply_url_type: 'official_job_posting',
    apply_url_needs_review: false,
    warning: null,
  };
}

export function normalizeText(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml(html = '') {
  return normalizeText(
    String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\n\s+/g, '\n')
  );
}

export function cleanJobDescription(rawDescription = '') {
  const original = String(rawDescription || '');
  const clean = stripHtml(original)
    .replace(/Apply now\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const description_preview = clean.slice(0, 360);
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < sentences.length && chunks.length < 4; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }

  return {
    description: clean,
    clean_description: clean,
    description_preview,
    description_sections: JSON.stringify(chunks.length ? chunks : clean ? [clean.slice(0, 700)] : []),
    original_description: original,
  };
}

function findMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return normalizeText(match[1]);
  }
  return '';
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed, ...(parsed['@graph'] || [])];
      const job = items.flat().find((item) => {
        const type = item?.['@type'];
        return type === 'JobPosting' || (Array.isArray(type) && type.includes('JobPosting'));
      });
      if (job) return job;
    } catch {
      // Ignore malformed embedded JSON-LD and fall back to meta extraction.
    }
  }
  return null;
}

function valueToText(value) {
  if (!value) return '';
  if (typeof value === 'string') return normalizeText(value);
  if (Array.isArray(value)) return normalizeText(value.map(valueToText).filter(Boolean).join(', '));
  if (typeof value === 'object') return normalizeText(value.name || value.addressLocality || value.addressRegion || value.addressCountry || value.value || '');
  return normalizeText(value);
}

function extractSalary(job) {
  const salary = job?.baseSalary;
  const value = salary?.value || salary;
  if (!value || typeof value !== 'object') return {};
  return {
    salary_min: value.minValue || value.value || '',
    salary_max: value.maxValue || value.value || '',
    currency: salary.currency || value.currency || '',
  };
}

function classifyImportedJob(fields) {
  const text = `${fields.title || ''} ${fields.location || ''} ${fields.description || ''} ${fields.remote_availability || ''}`.toLowerCase();
  const has = (terms) => terms.some((term) => text.includes(term));
  const worldwide = has(['worldwide', 'work from anywhere', 'anywhere in the world', 'global team', 'globally remote']);
  const caribbean = worldwide || has(['jamaica', 'caribbean', 'latin america', 'latam', 'americas', 'est timezone']);
  const africa = worldwide || has(['africa', 'emea', 'nigeria', 'kenya', 'south africa', 'ghana']);
  const globalSouth = worldwide || has(['global south', 'developing countries', 'international applicants']);
  const usOnly = has(['us only', 'u.s. only', 'united states only', 'authorized to work in the us', 'authorized to work in the u.s.']);
  const ukOnly = has(['uk only', 'united kingdom only', 'based in london']);

  let remote_availability = fields.remote_availability || 'Unclear / needs review';
  if (worldwide) remote_availability = 'Worldwide';
  else if (caribbean) remote_availability = 'Caribbean-friendly';
  else if (africa) remote_availability = 'Africa-friendly';
  else if (globalSouth) remote_availability = 'Global South friendly';
  else if (usOnly) remote_availability = 'US only';
  else if (ukOnly) remote_availability = 'UK only';
  else if (has(['remote'])) remote_availability = 'Remote';

  return {
    remote_availability,
    is_worldwide: Boolean(fields.is_worldwide || worldwide),
    is_jamaica_eligible: Boolean(fields.is_jamaica_eligible || (worldwide || caribbean || globalSouth) && !usOnly && !ukOnly),
    is_caribbean_friendly: Boolean(fields.is_caribbean_friendly || caribbean || globalSouth),
    is_africa_friendly: Boolean(fields.is_africa_friendly || africa || globalSouth),
    is_global_south_friendly: Boolean(globalSouth),
    needs_location_review: !worldwide && !caribbean && !africa && !globalSouth && !usOnly && !ukOnly,
    language: fields.language || (has(['spanish']) ? 'Spanish' : has(['english']) ? 'English' : ''),
    beginner_friendly: Boolean(fields.beginner_friendly || has(['entry level', 'junior', 'beginner', 'no experience'])),
    no_degree: Boolean(fields.no_degree || has(['no degree', 'degree not required', 'no college'])),
    ai_training: Boolean(fields.ai_training || has(['ai training', 'train ai', 'llm', 'machine learning evaluator'])),
    customer_support: Boolean(fields.customer_support || has(['customer support', 'customer service', 'support specialist'])),
    virtual_assistant: Boolean(fields.virtual_assistant || has(['virtual assistant', 'administrative assistant'])),
    quality_score: fields.quality_score || Math.min(100, 50 + (fields.description ? 20 : 0) + (fields.salary_min || fields.salary_max ? 10 : 0) + (fields.location ? 10 : 0)),
    freshness_score: fields.freshness_score || 100,
  };
}

export async function ensureDirectJobSchema() {
  await ensureJobScoutSchema();
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS official_apply_url TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_url_type TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_url_needs_review BOOLEAN NOT NULL DEFAULT true;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min NUMERIC;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max NUMERIC;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS currency TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS language TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_website TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_careers_website TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS clean_description TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description_preview TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description_sections TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS original_description TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS remote_availability TEXT DEFAULT 'Unclear / needs review';`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS country_restriction TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_worldwide BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_jamaica_eligible BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_caribbean_friendly BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_africa_friendly BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_global_south_friendly BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS needs_location_review BOOLEAN NOT NULL DEFAULT true;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS beginner_friendly BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS no_degree BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_training BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS customer_support BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS virtual_assistant BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS quality_score INTEGER;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS freshness_score INTEGER;`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_official_apply_url ON jobs (official_apply_url);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_source_url ON jobs (source_url);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_direct_company_title ON jobs (LOWER(company_name), LOWER(title));`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_apply_url_type ON jobs (apply_url_type);`;
}

export async function fetchJobPosting(url) {
  const parsed = parseJobUrl(url);
  if (!parsed) {
    return { ok: false, error: 'Please enter a valid http(s) job URL.' };
  }

  const detected = detectJobSource(parsed);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'CapriRemoteImporter/1.0 (+https://capriremote.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    const html = await res.text();
    const job = extractJsonLd(html) || {};
    const salary = extractSalary(job);
    const title = valueToText(job.title) || findMeta(html, 'og:title') || findMeta(html, 'twitter:title') || normalizeText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
    const company_name = valueToText(job.hiringOrganization) || findMeta(html, 'og:site_name') || detected.source_domain.split('.')[0];
    const location = valueToText(job.jobLocation) || valueToText(job.applicantLocationRequirements) || valueToText(job.jobLocationType) || 'Remote';
    const rawDescription = job.description || findMeta(html, 'description') || findMeta(html, 'og:description') || '';
    const cleaned = cleanJobDescription(rawDescription);
    const extracted = {
      title: normalizeText(title.replace(/\s+[|\-–—]\s+.+$/, '')),
      company_name,
      location,
      remote_availability: location.toLowerCase().includes('remote') ? 'Remote' : '',
      employment_type: valueToText(job.employmentType),
      category: valueToText(job.industry || job.occupationalCategory),
      ...salary,
      description: cleaned.clean_description,
      clean_description: cleaned.clean_description,
      description_preview: cleaned.description_preview,
      description_sections: cleaned.description_sections,
      original_description: cleaned.original_description,
      official_apply_url: parsed.toString(),
      apply_url: parsed.toString(),
      source_url: parsed.toString(),
      source_domain: detected.source_domain,
      source_name: detected.source_name,
      source_type: detected.source_type,
      apply_url_type: detected.apply_url_type,
      apply_url_needs_review: detected.apply_url_needs_review,
      warning: detected.warning,
    };

    const classified = classifyImportedJob(extracted);
    return { ok: true, extracted: { ...extracted, ...classified }, warnings: detected.warning ? [detected.warning] : [] };
  } catch (error) {
    return {
      ok: false,
      error: 'Could not automatically extract this page. You can still fill in the details manually.',
      extracted: {
        official_apply_url: parsed.toString(),
        apply_url: parsed.toString(),
        source_url: parsed.toString(),
        source_domain: detected.source_domain,
        source_name: detected.source_name,
        source_type: detected.source_type,
        apply_url_type: detected.apply_url_type,
        apply_url_needs_review: detected.apply_url_needs_review,
        warning: detected.warning,
      },
      warnings: [error?.message || 'Fetch failed'].concat(detected.warning ? [detected.warning] : []),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeIdentity(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function createDirectJob(input) {
  await ensureDirectJobSchema();

  const title = normalizeText(input.title);
  const companyName = normalizeText(input.company_name);
  const officialApplyUrl = normalizeText(input.official_apply_url || input.apply_url);
  const sourceUrl = normalizeText(input.source_url || officialApplyUrl);
  const summary = normalizeText(input.summary || input.description_preview || input.description).slice(0, 500);
  const parsedApplyUrl = parseJobUrl(officialApplyUrl);
  const parsedSourceUrl = parseJobUrl(sourceUrl);

  if (!title || !companyName || !parsedApplyUrl || !summary) {
    return { ok: false, status: 400, error: 'Job title, company name, official apply URL, and description/summary are required.' };
  }

  const detected = detectJobSource(parsedApplyUrl);
  const requestedStatus = input.approve_immediately ? 'approved' : input.status === 'approved' ? 'approved' : 'pending_review';
  const isActive = requestedStatus === 'approved';
  const cleaned = cleanJobDescription(input.description || input.clean_description || summary);
  const classified = classifyImportedJob({ ...input, ...cleaned });
  const normalizedCompany = normalizeIdentity(companyName);
  const normalizedTitle = normalizeIdentity(title);

  const duplicate = await sql`
    SELECT id, title, company_name, status, is_active
    FROM jobs
    WHERE
      (${officialApplyUrl} <> '' AND official_apply_url IS NOT NULL AND official_apply_url = ${officialApplyUrl})
      OR (${officialApplyUrl} <> '' AND apply_url IS NOT NULL AND apply_url = ${officialApplyUrl})
      OR (${sourceUrl} <> '' AND source_url IS NOT NULL AND source_url = ${sourceUrl})
      OR (BTRIM(LOWER(REGEXP_REPLACE(company_name, '[^a-zA-Z0-9]+', ' ', 'g'))) = ${normalizedCompany}
          AND BTRIM(LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', ' ', 'g'))) = ${normalizedTitle})
    LIMIT 1
  `;

  if (duplicate.length) {
    return {
      ok: false,
      duplicate: true,
      status: 409,
      message: 'This job already exists.',
      existing_job: duplicate[0],
      admin_url: `/admin/jobs?job=${duplicate[0].id}`,
      public_url: duplicate[0].is_active ? `/jobs/${duplicate[0].id}` : null,
    };
  }

  const applyUrlType = detected.apply_url_type;
  const applyUrlNeedsReview = detected.apply_url_needs_review;
  const inserted = await sql`
    INSERT INTO jobs (
      title, company_name, category, employment_type, location,
      apply_url, official_apply_url, source_name, source_url, summary, description,
      status, is_active, apply_url_type, apply_url_needs_review,
      salary_min, salary_max, currency, language, experience_level,
      company_website, company_careers_website,
      clean_description, description_preview, description_sections, original_description,
      remote_availability, country_restriction, is_worldwide, is_jamaica_eligible,
      is_caribbean_friendly, is_africa_friendly, is_global_south_friendly, needs_location_review,
      beginner_friendly, no_degree, ai_training, customer_support, virtual_assistant,
      quality_score, freshness_score, created_at, updated_at
    ) VALUES (
      ${title}, ${companyName}, ${normalizeText(input.category)}, ${normalizeText(input.employment_type)}, ${normalizeText(input.location || 'Remote')},
      ${parsedApplyUrl.toString()}, ${parsedApplyUrl.toString()}, ${normalizeText(input.source_name || detected.source_name)}, ${parsedSourceUrl?.toString() || parsedApplyUrl.toString()}, ${summary}, ${cleaned.description},
      ${requestedStatus}, ${isActive}, ${applyUrlType}, ${applyUrlNeedsReview},
      ${toNumberOrNull(input.salary_min)}, ${toNumberOrNull(input.salary_max)}, ${normalizeText(input.currency)}, ${normalizeText(classified.language)}, ${normalizeText(input.experience_level)},
      ${normalizeText(input.company_website)}, ${normalizeText(input.company_careers_website)},
      ${cleaned.clean_description}, ${cleaned.description_preview}, ${cleaned.description_sections}, ${cleaned.original_description},
      ${normalizeText(classified.remote_availability)}, ${normalizeText(input.country_restriction)}, ${Boolean(classified.is_worldwide)}, ${Boolean(classified.is_jamaica_eligible)},
      ${Boolean(classified.is_caribbean_friendly)}, ${Boolean(classified.is_africa_friendly)}, ${Boolean(classified.is_global_south_friendly)}, ${Boolean(classified.needs_location_review)},
      ${Boolean(classified.beginner_friendly)}, ${Boolean(classified.no_degree)}, ${Boolean(classified.ai_training)}, ${Boolean(classified.customer_support)}, ${Boolean(classified.virtual_assistant)},
      ${Number(classified.quality_score) || null}, ${Number(classified.freshness_score) || null}, NOW(), NOW()
    )
    RETURNING *
  `;

  return {
    ok: true,
    job: inserted[0],
    message: 'Job added successfully.',
    publish_message: requestedStatus === 'approved' ? 'Published live.' : 'Saved as pending review.',
    warnings: detected.warning ? [detected.warning] : [],
    public_url: requestedStatus === 'approved' ? `/jobs/${inserted[0].id}` : null,
    admin_url: `/admin/jobs?job=${inserted[0].id}`,
  };
}
