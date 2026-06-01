'use client';

import React from 'react';
import { Link } from 'react-router';

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '11px 16px',
  fontWeight: 700,
  textDecoration: 'none',
  border: '1px solid #f0abfc',
};
const fieldStyle = { border: '1px solid #f0abfc', borderRadius: 12, padding: '10px 12px', minWidth: 180 };

async function api(path, options = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

function Badge({ children, tone = 'purple' }) {
  const colors = {
    purple: ['#f3e8ff', '#6b21a8'],
    green: ['#dcfce7', '#166534'],
    amber: ['#fef3c7', '#92400e'],
    red: ['#fee2e2', '#991b1b'],
  };
  const [background, color] = colors[tone] || colors.purple;
  return <span style={{ background, color, borderRadius: 999, padding: '5px 9px', fontSize: 12, fontWeight: 800 }}>{children}</span>;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = React.useState([]);
  const [meta, setMeta] = React.useState({ total: 0, limit: 20, offset: 0, hasMore: false });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [filters, setFilters] = React.useState({ search: '', category: '', status: '', sort: 'jamaica_first' });

  const loadJobs = React.useCallback(async (offset = 0) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '20', offset: String(offset) });
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.status) params.set('status', filters.status);
      const data = await api(`/api/admin/jobs?${params.toString()}`);
      setJobs(data.jobs || []);
      setMeta({ total: data.total || 0, limit: data.limit || 20, offset: data.offset || offset, hasMore: Boolean(data.hasMore) });
    } catch (err) {
      setError(err.message || 'Could not load jobs.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => { loadJobs(0); }, [loadJobs]);

  const toggleJobActive = async (job) => {
    await api(`/api/admin/jobs/${job.id}`, { method: 'PATCH', body: JSON.stringify({ is_active: !job.is_active }) });
    await loadJobs(meta.offset);
  };

  const rejectJob = async (job) => {
    if (!confirm(`Reject/deactivate ${job.title}?`)) return;
    await api(`/api/admin/jobs/${job.id}`, { method: 'DELETE' });
    await loadJobs(meta.offset);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #fdf4ff 55%, #f8ecff 100%)', padding: 24 }}>
      <section style={{ maxWidth: 1220, margin: '0 auto' }}>
        <Link to="/admin" style={{ color: '#a21caf', fontWeight: 700, textDecoration: 'none' }}>← Back to Dashboard</Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginTop: 18 }}>
          <div>
            <p style={{ color: '#c026d3', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>Capri Remote Admin</p>
            <h1 style={{ color: '#581c87', fontSize: 38, lineHeight: 1.1, margin: '8px 0' }}>Manage Jobs</h1>
            <p style={{ color: '#6b7280', fontSize: 16, margin: 0 }}>Review, repair, import, de-duplicate, and publish remote jobs safely.</p>
          </div>
          <Badge>{meta.total} public approved jobs</Badge>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }} aria-label="Job admin tools">
          <Link to="/admin/jobs/new" style={{ ...buttonStyle, background: '#d946ef', color: '#fff', borderColor: '#d946ef' }}>➕ Add Direct Job</Link>
          <Link to="/admin/jobs/new" style={{ ...buttonStyle, background: '#7e22ce', color: '#fff', borderColor: '#7e22ce' }}>🔗 Import Job URL</Link>
          <Link to="/admin/job-scout" style={{ ...buttonStyle, background: '#fff', color: '#86198f' }}>🛰️ Job Scout</Link>
          <a href="/admin/jobs/fix-apply-links" style={{ ...buttonStyle, background: '#fff', color: '#6b21a8' }}>🔧 Fix Apply Links</a>
          <a href="/admin/jobs/duplicates" style={{ ...buttonStyle, background: '#fff', color: '#6b21a8' }}>👯 Manage Duplicates</a>
          <a href="/admin/jobs/data-tools" style={{ ...buttonStyle, background: '#fff', color: '#6b21a8' }}>🧰 Data Tools</a>
          <a href="/admin/jobs/apply-link-review" style={{ ...buttonStyle, background: '#fff', color: '#6b21a8' }}>✅ Apply Link Review</a>
        </nav>

        <section style={{ marginTop: 24, background: '#fff', border: '1px solid #f5d0fe', borderRadius: 22, padding: 18, boxShadow: '0 18px 45px rgba(126,34,206,.08)' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input style={{ ...fieldStyle, flex: '1 1 240px' }} value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} placeholder="Search title, company, description" />
            <input style={fieldStyle} value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} placeholder="Category" />
            <select style={fieldStyle} value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
              <option value="">All visible statuses</option>
              <option value="approved">Approved</option>
              <option value="pending_review">Pending review</option>
              <option value="rejected">Rejected</option>
            </select>
            <select style={fieldStyle} value={filters.sort} onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}>
              <option value="jamaica_first">Jamaica → Caribbean → Africa → Worldwide</option>
              <option value="newest">Newest</option>
              <option value="featured">Featured</option>
              <option value="salary_high">Salary high</option>
            </select>
            <button onClick={() => loadJobs(0)} style={{ ...buttonStyle, background: '#fdf4ff', color: '#a21caf', cursor: 'pointer' }}>Apply filters</button>
          </div>
        </section>

        {error ? <p style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 12, padding: 12 }}>{error}</p> : null}
        {loading ? <p style={{ padding: 24, color: '#6b21a8', fontWeight: 800 }}>Loading jobs...</p> : null}

        <section style={{ marginTop: 18, display: 'grid', gap: 12 }}>
          {jobs.map((job) => (
            <article key={job.id} style={{ background: '#fff', border: '1px solid #f5d0fe', borderRadius: 18, padding: 16, display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ color: '#581c87', margin: 0, fontSize: 20 }}>{job.title}</h2>
                  <p style={{ color: '#4b5563', margin: '4px 0 0' }}>{job.company_name} • {job.location || 'Remote'} • {job.employment_type || 'Role'}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge tone={job.is_active ? 'green' : 'amber'}>{job.is_active ? 'Active' : 'Inactive'}</Badge>
                  <Badge tone={job.status === 'approved' ? 'green' : job.status === 'rejected' ? 'red' : 'amber'}>{job.status || 'legacy'}</Badge>
                  <Badge>{job.availability_badge || job.remote_availability || 'Remote'}</Badge>
                  {job.apply_url_type ? <Badge tone={job.apply_url_type === 'source_board' ? 'amber' : 'green'}>{job.apply_button_label || job.apply_url_type}</Badge> : null}
                </div>
              </div>
              <p style={{ color: '#6b7280', margin: 0 }}>{job.description_preview || job.summary || ''}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {job.apply_url ? <a href={job.apply_url} target="_blank" rel="noreferrer" style={{ ...buttonStyle, background: '#fdf4ff', color: '#a21caf' }}>{job.apply_button_label || 'Apply on Company Site'}</a> : null}
                <button onClick={() => toggleJobActive(job)} style={{ ...buttonStyle, background: '#fff', color: '#2563eb', cursor: 'pointer' }}>{job.is_active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => rejectJob(job)} style={{ ...buttonStyle, background: '#fff', color: '#dc2626', cursor: 'pointer' }}>Reject</button>
              </div>
            </article>
          ))}
          {!loading && !jobs.length ? <p style={{ color: '#6b21a8', fontWeight: 800 }}>No jobs matched these filters.</p> : null}
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <button disabled={meta.offset <= 0 || loading} onClick={() => loadJobs(Math.max(0, meta.offset - meta.limit))} style={{ ...buttonStyle, background: '#fff', color: '#6b21a8', opacity: meta.offset <= 0 ? 0.5 : 1 }}>← Previous</button>
          <span style={{ color: '#6b21a8', fontWeight: 800 }}>Showing {meta.offset + 1}-{Math.min(meta.offset + jobs.length, meta.total)} of {meta.total}</span>
          <button disabled={!meta.hasMore || loading} onClick={() => loadJobs(meta.offset + meta.limit)} style={{ ...buttonStyle, background: '#fff', color: '#6b21a8', opacity: !meta.hasMore ? 0.5 : 1 }}>Next →</button>
        </div>
      </section>
    </main>
  );
}
