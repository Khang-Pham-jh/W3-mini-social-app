import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import jhLogo from '../../assets/JH-logo.png';
import ModeSwitch from './ModeSwitch';
import { AUTH_MODES } from '../constants/auth.js';
import styles from './TopBar.module.css';

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProfile, currentUser, isLoggedIn, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const authMode = location.pathname === '/signup' ? AUTH_MODES.SIGNUP : AUTH_MODES.LOGIN;

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

  const displayName = currentProfile?.name || currentUser?.user_metadata?.name || 'Guest';
  const displayEmail = currentProfile?.email || currentUser?.email || 'Not signed in';
  const displayPosition = currentProfile?.position || currentUser?.user_metadata?.position || 'Visitor';

  return (
    <>
      <header className={styles.topBar}>
        <div className={styles.brandArea}>
          <img className={styles.logo} src={jhLogo} alt="JH logo" />
          <div className={styles.brandText}>
            <div className={styles.brandName}>W3 Mini Social App</div>
            <div className={styles.brandNote}>Bulletin workspace</div>
          </div>
        </div>

        {isLoggedIn ? (
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
        ) : null}

        <div className={styles.actionsArea}>
          {isLoggedIn ? (
            <>
              <button
                className={styles.menuButton}
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                ☰
              </button>
              <button className={styles.logoutButton} type="button" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <ModeSwitch
              mode={authMode}
              onSwitchMode={(nextMode) =>
                navigate(nextMode === AUTH_MODES.SIGNUP ? '/signup' : '/login')
              }
            />
          )}
        </div>
      </header>

      {isLoggedIn ? (
        <aside
          className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
          aria-label="Sidebar"
        >
          <div className={styles.sidebarHeader}>
            <div>
              <div className={styles.sidebarTitle}>Navigation</div>
              <div className={styles.sidebarSubtitle}>Bulletin workspace</div>
            </div>
            <button className={styles.closeButton} type="button" onClick={closeSidebar} aria-label="Close sidebar">
              ×
            </button>
          </div>

          <Link to="/profile" onClick={closeSidebar} className={styles.sidebarProfile}>
            <div className={styles.sidebarAvatar}>{displayName.charAt(0).toUpperCase()}</div>
            <div className={styles.sidebarProfileText}>
              <div className={styles.sidebarProfileName}>{displayName}</div>
              <div className={styles.sidebarProfileEmail}>{displayEmail}</div>
              <div className={styles.sidebarProfileMeta}>{displayPosition}</div>
            </div>
          </Link>

          <nav className={styles.sidebarNav} aria-label="Sidebar navigation">
            <NavLink
              to="/home"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? styles.sidebarLinkActive : styles.sidebarLink
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/profile"
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? styles.sidebarLinkActive : styles.sidebarLink
              }
            >
              Profile
            </NavLink>
          </nav>

          <button className={styles.sidebarAction} type="button" onClick={handleLogout}>
            Log out
          </button>
        </aside>
      ) : null}

      {isLoggedIn ? (
        <button
          className={isSidebarOpen ? styles.backdropOpen : styles.backdrop}
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      ) : null}
    </>
  );
}

export default TopBar;
