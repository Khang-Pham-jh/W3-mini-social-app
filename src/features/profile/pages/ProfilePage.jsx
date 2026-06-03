import { useAuth } from '../../auth/context/AuthContext';
import { Navigate } from 'react-router-dom';
import TopBar from '../../../shared/components/TopBar';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { currentProfile, currentUser, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TopBar>
      <main className={styles.profilePage}>
        <section className={styles.profileCard}>
          <p className={styles.eyebrow}>Profile</p>
          <h1 className={styles.title}>User profile placeholder</h1>
          <p className={styles.description}>
            This page is a placeholder for the current user profile flow.
          </p>

          <div className={styles.detailsGrid}>
            <article className={styles.detailCard}>
              <p className={styles.detailLabel}>Name</p>
              <p className={styles.detailValue}>{currentProfile?.name || currentUser?.user_metadata?.name || 'Not set'}</p>
            </article>
            <article className={styles.detailCard}>
              <p className={styles.detailLabel}>Email</p>
              <p className={styles.detailValue}>{currentProfile?.email || currentUser?.email || 'Not available'}</p>
            </article>
            <article className={styles.detailCard}>
              <p className={styles.detailLabel}>Position</p>
              <p className={styles.detailValue}>{currentProfile?.position || 'Not set'}</p>
            </article>
          </div>
        </section>
      </main>
    </TopBar>
  );
}

export default ProfilePage;