'use client';

import React from 'react';
import { Link } from 'react-router';

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
  source_url: '',
  official_apply_url: '',
  salary: '',
  tags: '',
  approve_immediately: false,
};

function Field({ label, children, required }) {
  return (
    <label style={{ display: 'grid', gap: 8, fontWeight: 700, color: '#111827' }}>
      <span>
        {label} {required ? <span style={{ color: '#e11d48' }}>*</span> : null}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #f0abfc',
  borderRadius: 14,
  padding: '13px 14px',
  fontSize: 15,
  outline: 'none',
  background: '#fff',
};

const sectionStyle = {
  maxWidth: 1040,
  margin: '0 auto',
  background: '#fff',
  border: '1px solid #f5d0fe',
  borderRadius: 28,
  padding: 28,
  boxShadow: '0 18px 45px rgba(168, 85, 247, 0.08)',
};

export default function AddJobPage() {
  const [form, setForm] = React.useState(initialForm);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
      };

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Could not save this job.');
      }

      setMessage(
        form.approve_immediately
          ? 'Job saved and approved successfully.'
          : 'Job saved successfully and marked for review.'
      );
      setForm(initialForm);
    } catch (err) {
      setError(err.message || 'Something went wrong while saving this job.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#fff5fb',
        color: '#111827',
        padding: '32px 18px',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section style={sectionStyle}>
        <Link
          to="/admin/jobs"
          style={{
            color: '#86198f',
            fontWeight: 900,
            textDecoration: 'none',
            display: 'inline-flex',
            marginBottom: 24,
          }}
        >
          ← Back to Manage Jobs
        </Link>

        <p
          style={{
            color: '#c026d3',
            fontWeight: 900,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Capri Remote Admin
        </p>

        <h1
          style={{
            fontSize: 46,
            lineHeight: 1,
            color: '#581c87',
            margin: '10px 0 8px',
          }}
        >
          Add Job
        </h1>

        <p style={{ color: '#6b7280', fontSize: 17, marginBottom: 28 }}>
          Add a remote job manually. Use official company links whenever possible.
        </p>

        {message ? (
          <div
            style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              padding: 14,
              borderRadius: 16,
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        ) : null}

        {error ? (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: 14,
              borderRadius: 16,
              marginBottom: 20,
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={submit} style={{ display: 'grid', gap: 22 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 18,
            }}
          >
            <Field label="Job title" required>
              <input
                style={inputStyle}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="Customer Support Specialist"
                required
              />
            </Field>

            <Field label="Company" required>
              <input
                style={inputStyle}
                value={form.company_name}
                onChange={(e) => update('company_name', e.target.value)}
                placeholder="Company name"
                required
              />
            </Field>

            <Field label="Category">
              <input
                style={inputStyle}
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                placeholder="Customer Service, Marketing, Tech..."
              />
            </Field>

            <Field label="Employment type">
              <select
                style={inputStyle}
                value={form.employment_type}
                onChange={(e) => update('employment_type', e.target.value)}
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </Field>

            <Field label="Experience level">
              <select
                style={inputStyle}
                value={form.experience_level}
                onChange={(e) => update('experience_level', e.target.value)}
              >
                <option value="">Select level</option>
                <option value="entry-level">Entry-level</option>
                <option value="mid-level">Mid-level</option>
                <option value="senior-level">Senior-level</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
              </select>
            </Field>

            <Field label="Location / remote availability">
              <input
                style={inputStyle}
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Worldwide, US only, Jamaica-friendly..."
              />
            </Field>

            <Field label="Remote badge">
              <select
                style={inputStyle}
                value={form.remote_availability}
                onChange={(e) => update('remote_availability', e.target.value)}
              >
                <option value="Unclear / needs review">Unclear / needs review</option>
                <option value="Worldwide">Worldwide</option>
                <option value="Jamaica-friendly">Jamaica-friendly</option>
                <option value="Caribbean-friendly">Caribbean-friendly</option>
                <option value="Africa-friendly">Africa-friendly</option>
                <option value="US only">US only</option>
                <option value="Canada only">Canada only</option>
                <option value="UK only">UK only</option>
              </select>
            </Field>

            <Field label="Salary">
              <input
                style={inputStyle}
                value={form.salary}
                onChange={(e) => update('salary', e.target.value)}
                placeholder="$20/hr, $50k-$70k, Not listed..."
              />
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              style={{
                ...inputStyle,
                minHeight: 180,
                resize: 'vertical',
                lineHeight: 1.5,
              }}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Paste the job description here..."
              required
            />
          </Field>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 18,
            }}
          >
            <Field label="Apply URL" required>
              <input
                style={inputStyle}
                value={form.apply_url}
                onChange={(e) => update('apply_url', e.target.value)}
                placeholder="https://company.com/careers/job"
                required
              />
            </Field>

            <Field label="Official apply URL">
              <input
                style={inputStyle}
                value={form.official_apply_url}
                onChange={(e) => update('official_apply_url', e.target.value)}
                placeholder="Direct company application link"
              />
            </Field>

            <Field label="Source URL">
              <input
                style={inputStyle}
                value={form.source_url}
                onChange={(e) => update('source_url', e.target.value)}
                placeholder="Where you found the job"
              />
            </Field>

            <Field label="Tags">
              <input
                style={inputStyle}
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="remote, no phone, weekend, jamaica-friendly"
              />
            </Field>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#faf5ff',
              border: '1px solid #e9d5ff',
              borderRadius: 16,
              padding: 16,
              fontWeight: 800,
              color: '#581c87',
            }}
          >
            <input
              type="checkbox"
              checked={form.approve_immediately}
              onChange={(e) => update('approve_immediately', e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            Approve immediately and show publicly
          </label>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={() => setForm(initialForm)}
              style={{
                border: '1px solid #f0abfc',
                background: '#fff',
                color: '#86198f',
                borderRadius: 999,
                padding: '13px 22px',
                fontWeight: 900,
                cursor: 'pointer',
              }}
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                border: 0,
                background: saving
                  ? '#d946ef'
                  : 'linear-gradient(135deg, #ec4899, #7e22ce)',
                color: '#fff',
                borderRadius: 999,
                padding: '14px 28px',
                fontWeight: 900,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: '0 12px 28px rgba(168, 85, 247, 0.28)',
              }}
            >
              {saving ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
