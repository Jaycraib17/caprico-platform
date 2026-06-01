'use client';
import React from 'react';
import { Link } from 'react-router';

async function api(path, options = {}) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || JSON.stringify(data));
  return data;
}

const buttonStyle = { border: 0, borderRadius: 999, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' };
const inputStyle = { width: '100%', border: '1px solid #f0abfc', borderRadius: 10, padding: 9, boxSizing: 'border-box' };

function AvailBadge({ job }) {
  const label = job.is_jamaica_eligible ? '🇯🇲 Jamaica eligible' : job.is_caribbean_friendly ? '🌴 Caribbean-friendly' : job.is_africa_friendly ? '🌍 Africa-friendly' : job.is_worldwide ? '🌎 Worldwide' : job.remote_availability || 'Needs review';
  return <span style={{ background: job.needs_location_review ? '#fef3c7' : '#f3e8ff', color: job.needs_location_review ? '#92400e' : '#6b21a8', borderRadius: 999, padding: '5px 9px', fontSize: 12, fontWeight: 800 }}>{label}</span>;
}

export default function JobScoutAdminPage() {
  const [jobs, setJobs] = React.useState([]);
  const [summary, setSummary] = React.useState(null);
  const [counts, setCounts] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState({});
  const [avail, setAvail] = React.useState('all');
  const [error, setError] = React.useState('');

  const loadPending = React.useCallback(async () => {
    setError('');
    try {
      const data = await api(`/api/admin/job-scout/pending${avail !== 'all' ? `?avail=${avail}` : ''}`);
      setJobs(data.jobs || []);
      setCounts(data.availCounts || {});
    } catch (err) {
      setError(err.message || 'Could not load pending jobs.');
    }
  }, [avail]);

  React.useEffect(() => { loadPending(); }, [loadPending]);

  const runScan = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/api/admin/job-scout/run', { method: 'POST' });
      setSummary(data);
      await loadPending();
    } catch (err) {
      setError(err.message || 'Scan failed. Existing page stayed available.');
    } finally { setLoading(false); }
  };

  const approve = async (job) => {
    const payload = editing[job.id] || {};
    await api(`/api/admin/job-scout/${job.id}/approve`, { method: 'PATCH', body: JSON.stringify(payload) });
    await loadPending();
  };

  const reject = async (job) => {
    await api(`/api/admin/job-scout/${job.id}/reject`, { method: 'PATCH' });
    await loadPending();
  };

  return (
    <main style={{ padding: 24, background: 'linear-gradient(180deg, #fff 0%, #f8ecff 100%)', minHeight: '100vh' }}>
      <section style={{ maxWidth: 1120, margin: '0 auto' }}>
        <Link to="/admin/jobs" style={{ color: '#a21caf', fontWeight: 800, textDecoration: 'none' }}>← Back to Manage Jobs</Link>
        <h1 style={{ color: '#8e24aa', fontSize: 38, marginBottom: 6 }}>Capri Remote Job Scout</h1>
        <p style={{ color: '#6b7280' }}>Scan approved sources, save discoveries as pending review, then approve only after checking title, location, source, and apply link.</p>
        <button onClick={runScan} disabled={loading} style={{ ...buttonStyle, background: '#d946ef', color: '#fff' }}>{loading ? 'Scanning 14 sources...' : 'Run Scan'}</button>
        {summary && <p style={{ marginTop: 12, color: '#581c87', fontWeight: 800 }}>Scan summary: scanned {summary.scanned}, inserted {summary.inserted}, duplicates {summary.duplicates}, sources {summary.sources || 14}</p>}
        {error ? <p style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 12, padding: 12 }}>{error}</p> : null}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
          {['all', 'jamaica', 'caribbean', 'africa', 'worldwide', 'needs_review'].map((key) => (
            <button key={key} onClick={() => setAvail(key)} style={{ ...buttonStyle, background: avail === key ? '#7e22ce' : '#fff', color: avail === key ? '#fff' : '#6b21a8', border: '1px solid #d8b4fe' }}>
              {key.replace('_', ' ')} {counts[key] ? `(${counts[key]})` : ''}
            </button>
          ))}
        </div>

        <h2 style={{ marginTop: 22, color: '#6b21a8' }}>Pending Review</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {jobs.map((job) => (
            <article key={job.id} style={{ background: '#fff', border: '1px solid #f0abfc', borderRadius: 16, padding: 14, boxShadow: '0 12px 32px rgba(126,34,206,.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <AvailBadge job={job} />
                {job.needs_location_review ? <strong style={{ color: '#92400e' }}>Needs review</strong> : null}
              </div>
              <input defaultValue={job.title} onChange={(e) => setEditing((p) => ({ ...p, [job.id]: { ...(p[job.id] || {}), title: e.target.value } }))} style={{ ...inputStyle, fontWeight: 800 }} />
              <input defaultValue={job.company_name} onChange={(e) => setEditing((p) => ({ ...p, [job.id]: { ...(p[job.id] || {}), company_name: e.target.value } }))} style={{ ...inputStyle, marginTop: 8 }} />
              <input defaultValue={job.location} onChange={(e) => setEditing((p) => ({ ...p, [job.id]: { ...(p[job.id] || {}), location: e.target.value } }))} style={{ ...inputStyle, marginTop: 8 }} />
              <textarea defaultValue={job.summary || job.description_preview} onChange={(e) => setEditing((p) => ({ ...p, [job.id]: { ...(p[job.id] || {}), summary: e.target.value } }))} style={{ ...inputStyle, minHeight: 82, marginTop: 8 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={job.source_url || job.apply_url} target="_blank" rel="noreferrer" style={{ color: '#a21caf', fontWeight: 800 }}>View source</a>
                <button onClick={() => approve(job)} style={{ ...buttonStyle, background: '#7e22ce', color: '#fff' }}>Approve</button>
                <button onClick={() => reject(job)} style={{ ...buttonStyle, background: '#f3e8ff', color: '#6b21a8', border: '1px solid #d8b4fe' }}>Reject</button>
              </div>
            </article>
          ))}
          {!jobs.length ? <p style={{ color: '#6b21a8', fontWeight: 800 }}>No pending jobs for this filter.</p> : null}
        </div>
      </section>
    </main>
  );
}
