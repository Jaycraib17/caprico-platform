'use client';

import React from 'react';
import { Link } from 'react-router';

const emptyForm = {
  title: '',
  company_name: '',
  official_apply_url: '',
  apply_url: '',
  description: '',
  category: '',
  employment_type: '',
  location: '',
  remote_availability: 'Unclear / needs review',
  salary_min: '',
  salary_max: '',
  currency: '',
  language: '',
  experience_level: '',
  source_name: '',
  source_url: '',
  company_website: '',
  company_careers_website: '',
  is_worldwide: false,
  is_jamaica_eligible: false,
  is_caribbean_friendly: false,
  is_africa_friendly: false,
  beginner_friendly: false,
  no_degree: false,
  ai_training: false,
  customer_support: false,
  virtual_assistant: false,
  status: 'pending_review',
  approve_immediately: false,
};

const fieldStyle = {
  width: '100%',
  border: '1px solid #f0abfc',
  borderRadius: 12,
  padding: '11px 12px',
  color: '#3b0764',
  background: '#fff',
  boxSizing: 'border-box',
};

const labelStyle = { color: '#701a75', fontWeight: 800, fontSize: 13, marginBottom: 6, display: 'block' };
const primaryButton = { background: '#d946ef', color: '#fff', border: 0, borderRadius: 999, padding: '12px 18px', fontWeight: 800, cursor: 'pointer' };
const secondaryButton = { background: '#fdf4ff', color: '#86198f', border: '1px solid #f0abfc', borderRadius: 999, padding: '12px 18px', fontWeight: 800, cursor: 'pointer', textDecoration: 'none' };

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.duplicate) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

function TextField({ label, name, value, onChange, required, type = 'text', placeholder }) {
  return (
    <label>
      <span style={labelStyle}>{label}{required ? ' *' : ''}</span>
      <input type={type} name={name} value={value || ''} placeholder={placeholder} onChange={onChange} required={required} style={fieldStyle} />
    </label>
  );
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#581c87', fontWeight: 700 }}>
      <input type="checkbox" name={name} checked={Boolean(checked)} onChange={onChange} />
      {label}
    </label>
  );
}

function StatusCard({ result, setResult, reset }) {
  if (!result) return null;
  const duplicate = result.duplicate;
  return (
    <section style={{ marginTop: 22, borderRadius: 18, padding: 18, border: duplicate ? '1px solid #fbbf24' : '1px solid #86efac', background: duplicate ? '#fffbeb' : '#f0fdf4' }}>
      <h2 style={{ marginTop: 0, color: duplicate ? '#92400e' : '#166534' }}>{duplicate ? 'This job already exists.' : 'Job added successfully.'}</h2>
      <p style={{ color: duplicate ? '#92400e' : '#166534', fontWeight: 700 }}>{result.publish_message || result.message}</p>
      {result.warnings?.length ? <p style={{ color: '#92400e' }}>Warning: {result.warnings.join(' ')}</p> : null}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
        {result.public_url ? <a href={result.public_url} style={secondaryButton}>View Public Job</a> : null}
        <button onClick={reset} style={primaryButton}>Add Another Job</button>
        <Link to="/admin/jobs" style={secondaryButton}>Back to Manage Jobs</Link>
      </div>
    </section>
  );
}

export default function NewJobPage() {
  const [mode, setMode] = React.useState('import');
  const [url, setUrl] = React.useState('');
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [warnings, setWarnings] = React.useState([]);
  const [result, setResult] = React.useState(null);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'official_apply_url' ? { apply_url: value, source_url: prev.source_url || value } : {}),
      ...(name === 'approve_immediately' ? { status: checked ? 'approved' : 'pending_review' } : {}),
    }));
  };

  const importUrl = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setWarnings([]);
    setResult(null);
    try {
      const data = await api('/api/admin/jobs/import-url', { method: 'POST', body: JSON.stringify({ url }) });
      const extracted = data.extracted || {};
      setForm((prev) => ({
        ...prev,
        ...extracted,
        official_apply_url: extracted.official_apply_url || url,
        apply_url: extracted.apply_url || url,
        source_url: extracted.source_url || url,
        status: 'pending_review',
        approve_immediately: false,
      }));
      setWarnings(data.warnings || []);
      setMessage(data.ok ? 'Imported details. Review the preview fields before saving.' : data.error || 'Fill in the details manually.');
      setMode('manual');
    } catch (error) {
      setForm((prev) => ({ ...prev, official_apply_url: url, apply_url: url, source_url: url }));
      setMessage(error.message || 'Import failed. Fill in the details manually.');
      setMode('manual');
    } finally {
      setLoading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setResult(null);
    try {
      const data = await api('/api/admin/jobs/create-direct', { method: 'POST', body: JSON.stringify(form) });
      setResult(data);
      if (!data.duplicate && data.ok) setWarnings(data.warnings || []);
    } catch (error) {
      setMessage(error.message || 'Could not save job.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(emptyForm);
    setUrl('');
    setMessage('');
    setWarnings([]);
    setResult(null);
    setMode('import');
  };

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #fdf4ff 55%, #f8ecff 100%)', padding: 24 }}>
      <section style={{ maxWidth: 1080, margin: '0 auto' }}>
        <Link to="/admin/jobs" style={{ color: '#a21caf', fontWeight: 800, textDecoration: 'none' }}>← Back to Manage Jobs</Link>
        <header style={{ marginTop: 18 }}>
          <p style={{ color: '#c026d3', fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>Capri Remote Admin</p>
          <h1 style={{ color: '#581c87', fontSize: 38, lineHeight: 1.1, margin: '8px 0' }}>Add Direct Job</h1>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Import an official job posting URL or manually add a role you found on an ATS/company careers page.</p>
        </header>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '22px 0' }}>
          <button onClick={() => setMode('import')} style={mode === 'import' ? primaryButton : secondaryButton}>🔗 Paste URL Import</button>
          <button onClick={() => setMode('manual')} style={mode === 'manual' ? primaryButton : secondaryButton}>➕ Manual Add Job</button>
        </div>

        {mode === 'import' ? (
          <form onSubmit={importUrl} style={{ background: '#fff', border: '1px solid #f5d0fe', borderRadius: 22, padding: 22, boxShadow: '0 18px 45px rgba(126,34,206,.08)' }}>
            <label>
              <span style={labelStyle}>Official ATS or company job URL</span>
              <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://tusclasesparticulares.teamtailor.com/jobs/7767395-english-teacher-for-children-remote" style={fieldStyle} />
            </label>
            <button disabled={loading || !url} style={{ ...primaryButton, marginTop: 14 }}>{loading ? 'Importing...' : 'Import Job Details'}</button>
          </form>
        ) : null}

        {message ? <p style={{ background: '#fefce8', color: '#854d0e', border: '1px solid #fde68a', borderRadius: 14, padding: 12, fontWeight: 700 }}>{message}</p> : null}
        {warnings.length ? <p style={{ background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa', borderRadius: 14, padding: 12 }}>Warnings: {warnings.join(' ')}</p> : null}

        {mode === 'manual' ? (
          <form onSubmit={save} style={{ background: '#fff', border: '1px solid #f5d0fe', borderRadius: 22, padding: 22, boxShadow: '0 18px 45px rgba(126,34,206,.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
              <TextField label="Job title" name="title" value={form.title} onChange={update} required />
              <TextField label="Company name" name="company_name" value={form.company_name} onChange={update} required />
              <TextField label="Official apply URL" name="official_apply_url" value={form.official_apply_url} onChange={update} required />
              <TextField label="Source URL" name="source_url" value={form.source_url} onChange={update} />
              <TextField label="Category" name="category" value={form.category} onChange={update} />
              <TextField label="Employment type" name="employment_type" value={form.employment_type} onChange={update} />
              <TextField label="Location" name="location" value={form.location} onChange={update} />
              <TextField label="Remote availability" name="remote_availability" value={form.remote_availability} onChange={update} />
              <TextField label="Salary min" name="salary_min" value={form.salary_min} onChange={update} type="number" />
              <TextField label="Salary max" name="salary_max" value={form.salary_max} onChange={update} type="number" />
              <TextField label="Currency" name="currency" value={form.currency} onChange={update} />
              <TextField label="Language" name="language" value={form.language} onChange={update} />
              <TextField label="Experience level" name="experience_level" value={form.experience_level} onChange={update} />
              <TextField label="Source name" name="source_name" value={form.source_name} onChange={update} />
              <TextField label="Company website" name="company_website" value={form.company_website} onChange={update} />
              <TextField label="Company careers website" name="company_careers_website" value={form.company_careers_website} onChange={update} />
            </div>

            <label style={{ display: 'block', marginTop: 14 }}>
              <span style={labelStyle}>Description or short summary *</span>
              <textarea name="description" value={form.description || ''} onChange={update} required rows={8} style={{ ...fieldStyle, resize: 'vertical' }} />
            </label>

            <fieldset style={{ border: '1px solid #f5d0fe', borderRadius: 16, padding: 14, marginTop: 16 }}>
              <legend style={{ color: '#701a75', fontWeight: 900 }}>Signals</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
                <Checkbox label="Is worldwide" name="is_worldwide" checked={form.is_worldwide} onChange={update} />
                <Checkbox label="Jamaica eligible" name="is_jamaica_eligible" checked={form.is_jamaica_eligible} onChange={update} />
                <Checkbox label="Caribbean friendly" name="is_caribbean_friendly" checked={form.is_caribbean_friendly} onChange={update} />
                <Checkbox label="Africa friendly" name="is_africa_friendly" checked={form.is_africa_friendly} onChange={update} />
                <Checkbox label="Beginner friendly" name="beginner_friendly" checked={form.beginner_friendly} onChange={update} />
                <Checkbox label="No degree" name="no_degree" checked={form.no_degree} onChange={update} />
                <Checkbox label="AI training" name="ai_training" checked={form.ai_training} onChange={update} />
                <Checkbox label="Customer support" name="customer_support" checked={form.customer_support} onChange={update} />
                <Checkbox label="Virtual assistant" name="virtual_assistant" checked={form.virtual_assistant} onChange={update} />
              </div>
            </fieldset>

            <fieldset style={{ border: '1px solid #f5d0fe', borderRadius: 16, padding: 14, marginTop: 16 }}>
              <legend style={{ color: '#701a75', fontWeight: 900 }}>Publishing status</legend>
              <label style={{ color: '#581c87', fontWeight: 800 }}>
                <select name="status" value={form.status} onChange={update} style={{ ...fieldStyle, maxWidth: 260, marginRight: 12 }}>
                  <option value="pending_review">pending_review</option>
                  <option value="approved">approved</option>
                </select>
              </label>
              <Checkbox label="Approve immediately" name="approve_immediately" checked={form.approve_immediately} onChange={update} />
            </fieldset>

            <button disabled={loading} style={{ ...primaryButton, marginTop: 18 }}>{loading ? 'Saving...' : 'Save Job'}</button>
          </form>
        ) : null}

        <StatusCard result={result} setResult={setResult} reset={reset} />
      </section>
    </main>
  );
}
