'use client';

import React from 'react';
import { Link } from 'react-router';

// Live deployed route: /jobs/add. Keep this file under web/src/app so Publish includes it.

const initialForm = {
  title: '',
  company_name: '',
  category: '',
  employment_type: '',
  experience_level: '',
  location: '',
  remote_availability: 'Unclear / needs review',
  description: '',
  apply_url: '',
  official_apply_url: '',
  source_url: '',
  salary_min: '',
  salary_max: '',
  tags: '',
  status: 'pending_review',
  approve_immediately: false,
};

const fieldStyle = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #f0abfc',
  borderRadius: 14,
  padding: '12px 13px',
  color: '#3b0764',
  background: '#fff',
};

const labelStyle = {
  display: 'block',
  color: '#701a75',
  fontWeight: 800,
  fontSize: 13,
  marginBottom: 6,
};

const primaryButton = {
  border: 0,
  borderRadius: 999,
  padding: '12px 18px',
  background: '#d946ef',
  color: '#fff',
  fontWeight: 900,
  cursor: 'pointer',
};

const secondaryLink = {
  border: '1px solid #f0abfc',
  borderRadius: 999,
  padding: '11px 16px',
  background: '#fff',
  color: '#86198f',
  fontWeight: 800,
  textDecoration: 'none',
};

function Field({ label, name, value, onChange, required, type = 'text', placeholder }) {
  return (
    <label>
      <span style={labelStyle}>
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        type={type}
        placeholder={placeholder}
        style={fieldStyle}
      />
    </label>
  );
}

export default function AddJobPage() {
  const [form, setForm] = React.useState(initialForm);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [savedJob, setSavedJob] = React.useState(null);
  const [adminState, setAdminState] = React.useState('checking');

  React.useEffect(() => {
    let alive = true;

    fetch('/api/admin/jobs?limit=1')
      .then((response) => {
        if (!alive) return;
        setAdminState(response.ok ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (alive) setAdminState('denied');
      });

    return () => {
      alive = false;
    };
  }, []);

  const update = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'apply_url' ? { source_url: prev.source_url || value } : {}),
      ...(name === 'approve_immediately'
        ? { status: checked ? 'approved' : 'pending_review' }
        : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setSavedJob(null);

    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            'Could not save job. Make sure you are signed in as an admin.'
        );
      }

      setSavedJob(data.job || null);
      setMessage(
        data.publish_message ||
          (form.status === 'approved'
            ? 'Job saved and published.'
            : 'Job saved as pending review.')
      );
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Could not save job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fff 0%, #fdf4ff 55%, #f8ecff 100%)',
        padding: 24,
      }}
    >
      <section style={{ maxWidth: 980, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Link to="/admin/jobs" style={secondaryLink}>
            ← Back to Manage Jobs
          </Link>
          <Link to="/admin/jobs/new" style={secondaryLink}>
            Import from URL instead
          </Link>
        </div>

        <header style={{ marginTop: 24, marginBottom: 22 }}>
          <p
            style={{
              color: '#c026d3',
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Capri Remote Admin
          </p>
          <h1 style={{ color: '#581c87', fontSize: 42, lineHeight: 1.05, margin: '8px 0' }}>
            Add Job
          </h1>
          <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6, maxWidth: 760 }}>
            Admin-only form for manually adding an official remote job. Submissions go through the
            protected admin API, clean the description, classify availability/apply URL signals, and
            save as pending review unless approved immediately.
          </p>
        </header>

        {adminState === 'checking' ? (
          <section
            style={{
              background: '#fdf4ff',
              border: '1px solid #f0abfc',
              color: '#86198f',
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            Checking admin access...
          </section>
        ) : null}

        {adminState === 'denied' ? (
          <section
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            This page is admin-only. Please sign in with an admin account to add jobs.
          </section>
        ) : null}

        {message ? (
          <section
            style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              color: '#166534',
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            {message} {savedJob?.id ? <span>Job ID: {savedJob.id}</span> : null}
          </section>
        ) : null}

        {error ? (
          <section
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              borderRadius: 18,
              padding: 16,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            {error}
          </section>
        ) : null}

        {adminState === 'allowed' ? (
          <form
            onSubmit={submit}
            style={{
              background: '#fff',
              border: '1px solid #f5d0fe',
              borderRadius: 24,
              boxShadow: '0 18px 45px rgba(126,34,206,.08)',
              padding: 22,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: 16,
              }}
            >
              <Field label="Job title" name="title" value={form.title} onChange={update} required />
              <Field
                label="Company"
                name="company_name"
                value={form.company_name}
                onChange={update}
                required
              />
              <Field label="Category" name="category" value={form.category} onChange={update} />
              <Field
                label="Employment type"
                name="employment_type"
                value={form.employment_type}
                onChange={update}
              />
              <Field
                label="Experience level"
                name="experience_level"
                value={form.experience_level}
                onChange={update}
              />
              <Field
                label="Location / remote availability"
                name="location"
                value={form.location}
                onChange={update}
                placeholder="Remote, Worldwide, Jamaica eligible..."
              />
              <Field
                label="Remote availability"
                name="remote_availability"
                value={form.remote_availability}
                onChange={update}
              />
              <Field
                label="Apply URL"
                name="apply_url"
                value={form.apply_url}
                onChange={update}
                required
                placeholder="https://company.com/jobs/role"
              />
              <Field
                label="Source URL optional"
                name="source_url"
                value={form.source_url}
                onChange={update}
              />
              <Field
                label="Official apply URL optional"
                name="official_apply_url"
                value={form.official_apply_url}
                onChange={update}
                placeholder="Leave blank to use Apply URL"
              />
              <Field
                label="Salary min optional"
                name="salary_min"
                value={form.salary_min}
                onChange={update}
                type="number"
              />
              <Field
                label="Salary max optional"
                name="salary_max"
                value={form.salary_max}
                onChange={update}
                type="number"
              />
              <Field
                label="Tags optional"
                name="tags"
                value={form.tags}
                onChange={update}
                placeholder="customer support, no degree, Jamaica"
              />
            </div>

            <label style={{ display: 'block', marginTop: 16 }}>
              <span style={labelStyle}>Description *</span>
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                required
                rows={9}
                style={{ ...fieldStyle, resize: 'vertical' }}
                placeholder="Paste a clean job summary, responsibilities, requirements, and location restrictions."
              />
            </label>

            <div
              style={{
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginTop: 18,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  color: '#581c87',
                  fontWeight: 800,
                }}
              >
                <input
                  type="checkbox"
                  name="approve_immediately"
                  checked={form.approve_immediately}
                  onChange={update}
                />
                Approve immediately
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{ ...primaryButton, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Saving...' : 'Save Job'}
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}
