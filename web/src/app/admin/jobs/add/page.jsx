'use client';

export default function AddJobPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#fff5fb',
        color: '#581c87',
        padding: 32,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          background: 'white',
          border: '1px solid #f5d0fe',
          borderRadius: 24,
          padding: 28,
        }}
      >
        <a
          href="/admin/jobs"
          style={{
            color: '#86198f',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          ← Back to Manage Jobs
        </a>

        <p
          style={{
            color: '#c026d3',
            fontWeight: 900,
            marginTop: 24,
            textTransform: 'uppercase',
          }}
        >
          Capri Remote Admin
        </p>

        <h1 style={{ fontSize: 42, margin: '8px 0' }}>Add Job</h1>

        <p style={{ color: '#6b7280', fontSize: 18 }}>
          Test page loaded successfully. The admin Add Job route is working.
        </p>
      </section>
    </main>
  );
}
