import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractDomain(url) {
  if (!url) return null;
  try {
    const href = url.startsWith("http") ? url : `https://${url}`;
    return new URL(href).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTags(value) {
  if (!value && value !== 0) return [];
  if (Array.isArray(value))
    return value.map((t) => String(t).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseBoolean(value) {
  if (value === null || value === undefined || value === "") return true;
  if (typeof value === "boolean") return value;
  const s = String(value).toLowerCase().trim();
  return s === "true" || s === "1" || s === "yes" || s === "active";
}

/**
 * Map a raw CSV row to the fields we care about.
 * Supports: company_name → name, website → website,
 *           region → region, tags → tags, is_active → is_active
 */
function mapRow(row) {
  const name = (row.company_name || row.name || "").trim();
  const website = (row.website || row.career_website || "").trim() || null;
  const region = (row.region || "").trim() || null;
  const tags = parseTags(row.tags);
  const is_active = parseBoolean(row.is_active);
  return { name, website, region, tags, is_active };
}

// ─── POST /api/companies/import ───────────────────────────────────────────────
//
// Body: { companies: [...raw rows], preview?: boolean }
//
// preview=true  → dry-run, returns per-row status (new / duplicate / invalid)
// preview=false → saves new rows, returns counts
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const body = await request.json();
    const { companies: rows, preview = false } = body;

    if (!rows || !Array.isArray(rows)) {
      return Response.json({ error: "Invalid data format" }, { status: 400 });
    }

    // ── Fetch existing companies for dedup ──────────────────────────────────
    const existing = await sql`
      SELECT name, website, career_website FROM companies
    `;

    const existingNames = new Set(existing.map((c) => c.name.toLowerCase()));
    const existingDomains = new Set(
      existing
        .flatMap((c) => [c.website, c.career_website])
        .map(extractDomain)
        .filter(Boolean),
    );

    // ── Process each row ────────────────────────────────────────────────────
    const processed = rows.map((row, i) => {
      const mapped = mapRow(row);

      if (!mapped.name) {
        return {
          ...mapped,
          _status: "invalid",
          _reason: "Missing company name",
          _index: i,
        };
      }

      const nameDup = existingNames.has(mapped.name.toLowerCase());
      const domain = extractDomain(mapped.website);
      const domainDup = domain && existingDomains.has(domain);

      if (nameDup) {
        return {
          ...mapped,
          _status: "duplicate",
          _reason: `"${mapped.name}" already exists`,
          _index: i,
        };
      }
      if (domainDup) {
        return {
          ...mapped,
          _status: "duplicate",
          _reason: `Domain "${domain}" already exists`,
          _index: i,
        };
      }

      return { ...mapped, _status: "new", _reason: null, _index: i };
    });

    const newRows = processed.filter((r) => r._status === "new");
    const duplicates = processed.filter((r) => r._status === "duplicate");
    const invalid = processed.filter((r) => r._status === "invalid");

    // ── Preview mode: return analysis without saving ────────────────────────
    if (preview) {
      return Response.json({
        preview: true,
        total: rows.length,
        new: newRows.length,
        duplicates: duplicates.length,
        invalid: invalid.length,
        rows: processed.map((r) => ({
          name: r.name,
          website: r.website,
          region: r.region,
          tags: r.tags,
          is_active: r.is_active,
          status: r._status,
          reason: r._reason,
        })),
      });
    }

    // ── Actual import ───────────────────────────────────────────────────────
    const results = {
      imported: 0,
      skipped: duplicates.length + invalid.length,
      failed: 0,
      errors: [],
    };

    for (const row of newRows) {
      try {
        const slug = generateSlug(row.name);
        await sql`
          INSERT INTO companies (
            name, slug, website, career_website,
            region, tags, is_active
          ) VALUES (
            ${row.name},
            ${slug},
            ${row.website},
            ${row.website},
            ${row.region},
            ${row.tags},
            ${row.is_active}
          )
          ON CONFLICT (slug) DO UPDATE SET
            website      = EXCLUDED.website,
            career_website = EXCLUDED.career_website,
            region       = EXCLUDED.region,
            tags         = EXCLUDED.tags,
            is_active    = EXCLUDED.is_active,
            updated_at   = NOW()
        `;
        results.imported++;
      } catch (err) {
        results.failed++;
        results.errors.push(`${row.name}: ${err.message}`);
        console.error("Row import error:", err);
      }
    }

    return Response.json({ success: true, results });
  } catch (error) {
    console.error("Import error:", error);
    return Response.json({ error: "Import failed" }, { status: 500 });
  }
}
