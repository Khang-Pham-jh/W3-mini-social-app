import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
    if (!isSidebarOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

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
  const displayPosition =
    currentProfile?.position || currentUser?.user_metadata?.position || 'Visitor';

  return (
    <>
      <header className={styles.topBar}>
        <div className={styles.brandArea}>
          <img className={styles.logo} src={jhLogo} alt="JH logo" />
          <p className={styles.brandText}>
            <strong className={styles.brandName}>W3 Mini Social App</strong>
            <span className={styles.brandNote}>Bulletin workspace</span>
          </p>
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
                Menu
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
            <hgroup>
              <h2 className={styles.sidebarTitle}>Navigation</h2>
              <p className={styles.sidebarSubtitle}>Bulletin workspace</p>
            </hgroup>
            <button className={styles.closeButton} type="button" onClick={closeSidebar}>
              X
            </button>
          </div>

          <div className={styles.sidebarProfile}>
            <span className={styles.sidebarAvatar}>{displayName.charAt(0).toUpperCase()}</span>
            <div className={styles.sidebarProfileText}>
              <h3 className={styles.sidebarProfileName}>{displayName}</h3>
              <p className={styles.sidebarProfileEmail}>{displayEmail}</p>
              <p className={styles.sidebarProfileMeta}>{displayPosition}</p>
            </div>
          </div>

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
