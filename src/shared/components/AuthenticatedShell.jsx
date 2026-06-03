import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import jhLogo from '../../assets/JH-logo-name.png';
import styles from './AuthenticatedShell.module.css';

function AuthenticatedShell({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  async function handleLogout() {
    const result = await logout();

    if (!result.success) {
      return;
    }

    navigate('/login', { replace: true });
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <div className={styles.brandArea}>
          <img className={styles.logo} src={jhLogo} alt="JH logo" />
          <div className={styles.brandText}>
            <span className={styles.brandName}>Nexus</span>
            <span className={styles.brandNote}>Information Velocity</span>
          </div>
        </div>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? styles.navLinkActive : styles.navLink)}
          >
            Profile
          </NavLink>
        </nav>

        <div className={styles.actionsArea}>
          <button className={styles.menuButton} type="button" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <button className={styles.logoutButton} type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <aside className={isSidebarOpen ? styles.sidebarOpen : styles.sidebar} aria-label="Sidebar">
        <div className={styles.sidebarHeader}>
          <div>
            <div className={styles.sidebarTitle}>Navigation</div>
            <div className={styles.sidebarSubtitle}>Bulletin workspace</div>
          </div>
          <button className={styles.closeButton} type="button" onClick={closeSidebar}>
            ×
          </button>
        </div>

        <nav className={styles.sidebarNav} aria-label="Sidebar navigation">
          <NavLink
            to="/home"
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? styles.sidebarLinkActive : styles.sidebarLink)}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className={({ isActive }) => (isActive ? styles.sidebarLinkActive : styles.sidebarLink)}
          >
            Profile
          </NavLink>
        </nav>

        <button className={styles.sidebarAction} type="button" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <button
        className={isSidebarOpen ? styles.backdropOpen : styles.backdrop}
        type="button"
        aria-label="Close sidebar"
        onClick={closeSidebar}
      />

      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default AuthenticatedShell;