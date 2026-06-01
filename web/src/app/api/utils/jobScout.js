import sql from './sql';

export const JOB_SCOUT_SOURCES = [
  'we_work_remotely',
  'remotive',
  'remote_ok',
  'working_nomads',
  'jobicy',
  'jobspresso',
  'himalayas',
  'nodesk',
  'remote_co',
  'authentic_jobs',
  'otta',
  'wellfound_remote',
  'builtin_remote',
  'company_careers',
];

const SOURCE_ALLOWLIST = new Set(JOB_SCOUT_SOURCES);

export async function ensureJobScoutSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS jobs (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      company_name TEXT NOT NULL,
      location TEXT,
      apply_url TEXT,
      source_name TEXT,
      source_url TEXT,
      source_job_id TEXT,
      summary TEXT,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      is_active BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending_review';`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_name TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_url TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_job_id TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS summary TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS clean_description TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description_preview TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description_sections TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS original_description TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT;`;
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
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_url_type TEXT;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS apply_url_needs_review BOOLEAN NOT NULL DEFAULT true;`;
  await sql`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();`;

  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_status_active ON jobs (status, is_active);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_apply_url ON jobs (apply_url);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_source_job_id ON jobs (source_job_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_scout_source_status ON jobs (source_name, status);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_scout_availability ON jobs (is_jamaica_eligible, is_caribbean_friendly, is_africa_friendly, is_worldwide);`;

  // Backward compatibility: preserve visibility for existing active rows that predate Job Scout.
  await sql`
    UPDATE jobs
    SET status = 'approved', updated_at = NOW()
    WHERE is_active = true
      AND (status IS NULL OR status = '' OR status = 'pending_review')
  `;
}

const short = (value, max = 360) => (value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const stripCdata = (value = '') => value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
const between = (value, tag) => stripCdata(value.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1] || '');

function cleanDescription(value = '') {
  const original = String(value || '');
  const clean = short(original, 4000);
  const preview = short(clean, 360);
  const sections = JSON.stringify(clean ? clean.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 5) : []);
  return { description: clean, clean_description: clean, description_preview: preview, description_sections: sections, original_description: original };
}

function classify(job) {
  const text = `${job.title || ''} ${job.location || ''} ${job.summary || ''} ${job.description || ''}`.toLowerCase();
  const has = (terms) => terms.some((term) => text.includes(term));
  const worldwide = has(['worldwide', 'work from anywhere', 'anywhere in the world', 'global team', 'remote globally']);
  const caribbean = worldwide || has(['jamaica', 'caribbean', 'latam', 'latin america', 'americas', 'est timezone']);
  const africa = worldwide || has(['africa', 'emea', 'nigeria', 'kenya', 'south africa', 'ghana']);
  const globalSouth = worldwide || has(['global south', 'developing countries', 'international applicants']);
  const usOnly = has(['us only', 'u.s. only', 'united states only', 'authorized to work in the us']);
  const ukOnly = has(['uk only', 'united kingdom only', 'based in london']);
  let remote_availability = 'Unclear / needs review';
  if (worldwide) remote_availability = 'Worldwide';
  else if (caribbean) remote_availability = 'Caribbean-friendly';
  else if (africa) remote_availability = 'Africa-friendly';
  else if (globalSouth) remote_availability = 'Global South friendly';
  else if (usOnly) remote_availability = 'US only';
  else if (ukOnly) remote_availability = 'UK only';
  else if (has(['remote'])) remote_availability = 'Remote';

  return {
    remote_availability,
    is_worldwide: worldwide,
    is_jamaica_eligible: (worldwide || caribbean || globalSouth) && !usOnly && !ukOnly,
    is_caribbean_friendly: caribbean || globalSouth,
    is_africa_friendly: africa || globalSouth,
    is_global_south_friendly: globalSouth,
    needs_location_review: !worldwide && !caribbean && !africa && !globalSouth && !usOnly && !ukOnly,
    beginner_friendly: has(['entry level', 'junior', 'beginner', 'no experience']),
    no_degree: has(['no degree', 'degree not required', 'no college']),
    ai_training: has(['ai training', 'train ai', 'llm', 'machine learning evaluator']),
    customer_support: has(['customer support', 'customer service', 'support specialist']),
    virtual_assistant: has(['virtual assistant', 'administrative assistant']),
    quality_score: Math.min(100, 50 + (job.description ? 20 : 0) + (job.apply_url ? 10 : 0) + (job.company_name ? 10 : 0)),
    freshness_score: 100,
  };
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CapriRemoteBot/1.0', Accept: 'application/json,text/plain,*/*' } });
  if (!res.ok) throw new Error(`Failed source fetch: ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'CapriRemoteBot/1.0', Accept: 'application/rss+xml,text/html,text/plain,*/*' } });
  if (!res.ok) throw new Error(`Failed source fetch: ${url}`);
  return res.text();
}

function rssJobs(xml, sourceName) {
  return xml.split(/<item>|<entry>/i).slice(1).map((item) => {
    const title = between(item, 'title');
    const linkTag = between(item, 'link');
    const href = item.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1];
    const link = (href || linkTag || '').trim();
    const sourceId = between(item, 'guid') || between(item, 'id') || link;
    const description = between(item, 'description') || between(item, 'summary') || between(item, 'content:encoded');
    const companyMatch = title.match(/^([^:–—-]+)[:–—-]\s*(.+)$/);
    return {
      title: companyMatch ? companyMatch[2].trim() : title,
      company_name: companyMatch ? companyMatch[1].trim() : 'Unknown',
      location: short(item.match(/remote|worldwide|usa|emea|europe|americas/i)?.[0] || 'Remote', 80),
      apply_url: link,
      source_url: link,
      source_job_id: sourceId,
      source_name: sourceName,
      summary: short(description || title),
      ...cleanDescription(description),
    };
  });
}

async function addSource(out, sourceName, fn) {
  try {
    const jobs = await fn();
    for (const job of jobs || []) out.push({ ...job, source_name: sourceName });
  } catch (error) {
    console.warn(`Job Scout source failed: ${sourceName}`, error?.message || error);
  }
}

export async function discoverJobs() {
  const out = [];

  await addSource(out, 'remotive', async () => {
    const data = await fetchJson('https://remotive.com/api/remote-jobs');
    return (data.jobs || []).map((j) => ({ title: j.title, company_name: j.company_name, location: j.candidate_required_location || 'Remote', apply_url: j.url, source_url: j.url, source_job_id: String(j.id), summary: short(j.description || `${j.title} at ${j.company_name}`), category: j.category, ...cleanDescription(j.description || '') }));
  });

  await addSource(out, 'remote_ok', async () => {
    const data = await fetchJson('https://remoteok.com/api');
    return (Array.isArray(data) ? data.slice(1) : []).map((j) => ({ title: j.position, company_name: j.company, location: 'Remote', apply_url: j.apply_url || j.url, source_url: j.url, source_job_id: String(j.id), summary: short(j.description || `${j.position} at ${j.company}`), category: Array.isArray(j.tags) ? j.tags[0] : '', ...cleanDescription(j.description || '') }));
  });

  await addSource(out, 'working_nomads', async () => {
    const data = await fetchJson('https://www.workingnomads.com/jobsapi/job/_all.json');
    return (data || []).map((j) => ({ title: j.title, company_name: j.company_name, location: j.location_base || 'Remote', apply_url: j.url, source_url: j.url, source_job_id: String(j.id), summary: short(j.description || `${j.title} at ${j.company_name}`), category: j.category_name, ...cleanDescription(j.description || '') }));
  });

  const rssSources = [
    ['we_work_remotely', 'https://weworkremotely.com/remote-jobs.rss'],
    ['jobicy', 'https://jobicy.com/?feed=job_feed'],
    ['jobspresso', 'https://jobspresso.co/remote-work/feed/'],
    ['himalayas', 'https://himalayas.app/jobs/rss'],
    ['nodesk', 'https://nodesk.co/remote-jobs/rss/'],
    ['remote_co', 'https://remote.co/remote-jobs/feed/'],
    ['authentic_jobs', 'https://authenticjobs.com/rss/custom.php?terms=remote'],
    ['otta', 'https://app.otta.com/rss/jobs'],
    ['wellfound_remote', 'https://wellfound.com/jobs.rss'],
    ['builtin_remote', 'https://builtin.com/jobs/remote/rss'],
  ];

  for (const [sourceName, url] of rssSources) {
    await addSource(out, sourceName, async () => rssJobs(await fetchText(url), sourceName));
  }

  await addSource(out, 'company_careers', async () => {
    const companies = await sql`SELECT id, name, careers_url FROM companies WHERE careers_url IS NOT NULL`;
    return companies.map((c) => ({ title: 'Open roles (visit careers page)', company_name: c.name, location: 'Remote/Various', apply_url: c.careers_url, source_url: c.careers_url, source_job_id: `company-${c.id}-${c.careers_url}`, summary: short(`Potential openings from ${c.name} careers page.`), description: short(`Potential openings from ${c.name} careers page.`) }));
  });

  return out
    .filter((j) => j.title && j.company_name && j.apply_url && SOURCE_ALLOWLIST.has(j.source_name))
    .map((job) => ({ ...job, ...classify(job), apply_url_type: 'source_board', apply_url_needs_review: true }));
}

export async function saveDiscoveredJobs(candidates) {
  let inserted = 0;
  let duplicates = 0;

  for (const job of candidates) {
    const dup = await sql`
      SELECT id FROM jobs
      WHERE
        (apply_url IS NOT NULL AND apply_url = ${job.apply_url})
        OR (source_job_id IS NOT NULL AND source_job_id = ${job.source_job_id})
        OR (LOWER(company_name) = LOWER(${job.company_name}) AND LOWER(title) = LOWER(${job.title}) AND COALESCE(location,'') = COALESCE(${job.location},''))
      LIMIT 1
    `;

    if (dup.length) {
      duplicates += 1;
      continue;
    }

    await sql`
      INSERT INTO jobs (
        title, company_name, location, apply_url, source_name, source_url, source_job_id,
        summary, description, clean_description, description_preview, description_sections, original_description,
        category, employment_type, status, is_active, remote_availability, is_worldwide,
        is_jamaica_eligible, is_caribbean_friendly, is_africa_friendly, is_global_south_friendly,
        needs_location_review, beginner_friendly, no_degree, ai_training, customer_support,
        virtual_assistant, quality_score, freshness_score, apply_url_type, apply_url_needs_review
      ) VALUES (
        ${job.title}, ${job.company_name}, ${job.location}, ${job.apply_url}, ${job.source_name}, ${job.source_url}, ${job.source_job_id},
        ${job.summary}, ${job.description || job.summary}, ${job.clean_description || job.summary}, ${job.description_preview || job.summary}, ${job.description_sections || '[]'}, ${job.original_description || ''},
        ${job.category || null}, ${job.employment_type || null}, 'pending_review', false, ${job.remote_availability}, ${Boolean(job.is_worldwide)},
        ${Boolean(job.is_jamaica_eligible)}, ${Boolean(job.is_caribbean_friendly)}, ${Boolean(job.is_africa_friendly)}, ${Boolean(job.is_global_south_friendly)},
        ${Boolean(job.needs_location_review)}, ${Boolean(job.beginner_friendly)}, ${Boolean(job.no_degree)}, ${Boolean(job.ai_training)}, ${Boolean(job.customer_support)},
        ${Boolean(job.virtual_assistant)}, ${Number(job.quality_score) || null}, ${Number(job.freshness_score) || null}, ${job.apply_url_type || 'source_board'}, ${job.apply_url_needs_review !== false}
      )
    `;
    inserted += 1;
  }

  return { inserted, duplicates, scanned: candidates.length, sources: JOB_SCOUT_SOURCES.length };
}
