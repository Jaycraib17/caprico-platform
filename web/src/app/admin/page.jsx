import { Link } from 'react-router';

export default function AdminDashboardPage() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/admin/jobs">Manage Jobs</Link>
        </li>
        <li>
          <Link to="/admin/job-scout">Job Scout</Link>
        </li>
      </ul>
    </main>
  );
}
