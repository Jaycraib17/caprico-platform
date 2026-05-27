import sql from "@/app/api/utils/sql";
import { requireAdmin } from "@/app/api/utils/adminAuth";

export async function GET() {
  try {
    const { error, status } = await requireAdmin();
    if (error) return Response.json({ error }, { status });

    const [counts] = await sql`
      SELECT
        COUNT(*)                                      AS total,
        COUNT(*) FILTER (WHERE is_active = true)      AS active,
        COUNT(*) FILTER (WHERE is_active = false)     AS inactive,
        COUNT(*) FILTER (WHERE is_active IS NULL)     AS null_active
      FROM companies
    `;

    const sample = await sql`
      SELECT id, name, slug, is_active, website, region, tags, created_at
      FROM companies
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const columns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'companies' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    return Response.json({
      source_table: "companies",
      counts: {
        total: parseInt(counts.total),
        active: parseInt(counts.active),
        inactive: parseInt(counts.inactive),
        null_active: parseInt(counts.null_active),
      },
      columns: columns.map((c) => `${c.column_name} (${c.data_type})`),
      sample_records: sample,
    });
  } catch (error) {
    console.error("Companies debug error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
