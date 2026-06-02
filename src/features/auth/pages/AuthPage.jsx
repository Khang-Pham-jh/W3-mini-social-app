import { Link, Outlet } from 'react-router-dom';

export default function AuthPage() {
  return (
    <main>
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign up</Link>
      </div>

      <Outlet />
    </main>
  );
}
