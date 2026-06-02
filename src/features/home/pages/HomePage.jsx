import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import styles from './HomePage.module.css';

function formatPositions(userMetadata) {
  if (Array.isArray(userMetadata?.positions) && userMetadata.positions.length > 0) {
    return userMetadata.positions.join(', ');
  }

  if (typeof userMetadata?.position === 'string' && userMetadata.position.trim()) {
    return userMetadata.position;
  }

  return 'Not set';
}

function HomePage() {
  const navigate = useNavigate();
  const { currentProfile, currentUser, logout, session } = useAuth();

  async function handleLogout() {
    const result = await logout();

    if (!result.success) {
      return;
    }

    navigate('/login', { replace: true });
  }

  return (
    <main className={styles.homePage}>
      <section className={styles.heroCard}>
        <p className={styles.eyebrow}>Authenticated Area</p>
        <h1 className={styles.title}>Welcome to W3 Mini Social App</h1>
        <p className={styles.description}>
          This placeholder home confirms that Supabase authentication succeeded and the app can
          restore the session after refresh.
        </p>

        <div className={styles.detailsGrid}>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Name</p>
            <p className={styles.detailValue}>
              {currentProfile?.name || currentUser?.user_metadata?.name || 'Not set'}
            </p>
          </article>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Email</p>
            <p className={styles.detailValue}>
              {currentProfile?.email || currentUser?.email || 'Not available'}
            </p>
          </article>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Position</p>
            <p className={styles.detailValue}>
              {currentProfile?.position || formatPositions(currentUser?.user_metadata)}
            </p>
          </article>
          <article className={styles.detailCard}>
            <p className={styles.detailLabel}>Session</p>
            <p className={styles.detailValue}>{session?.access_token ? 'Active' : 'Missing'}</p>
          </article>
        </div>

        <button className={styles.logoutButton} type="button" onClick={handleLogout}>
          Log out
        </button>
      </section>
    </main>
  );
}

export default HomePage;
