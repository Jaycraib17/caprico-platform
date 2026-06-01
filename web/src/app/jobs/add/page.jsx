'use client';

import React from 'react';
import { useNavigate } from 'react-router';

export default function JobsAddRedirectPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/admin/jobs/add', { replace: true });
  }, [navigate]);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#fff5fb',
        color: '#581c87',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <section>
        <h1>Redirecting to Add Job…</h1>
        <p>If you are not redirected, go to /admin/jobs/add.</p>
      </section>
    </main>
  );
}
