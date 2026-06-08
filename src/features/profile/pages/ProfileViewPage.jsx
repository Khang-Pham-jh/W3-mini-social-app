import { Navigate } from 'react-router-dom';
import PageLayout from '../../../shared/components/PageLayout';
import ProfileContent from '../components/ProfileContent';
import ProfileInfoPanel from '../components/ProfileInfoPanel';
import { useProfileAccess } from '../hooks/useProfileAccess';
import { useProfileData } from '../hooks/useProfileData';
import { useProfilePageEffects } from '../hooks/useProfilePageEffects';
import styles from './ProfileViewPage.module.css';

function ProfileViewPage() {
  const {
    profileId,
    isOwner,
    shouldRedirectToLogin,
    shouldRedirectUnauthorized,
  } = useProfileAccess();
  const {
    profile,
    posts,
    isProfileLoading,
    isPostsLoading,
    profileError,
    postsError,
    hasMore,
    nextCursor,
    isEmptyProfile,
  } = useProfileData();

  useProfilePageEffects(profileId);

  if (shouldRedirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  if (shouldRedirectUnauthorized) {
    return <Navigate to="/profile" replace />;
  }

  const renderStateContent = () => {
    if (!profileId) {
      return (
        <section className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Profile unavailable</h1>
          <p className={styles.statusMessage}>We could not determine which profile to open.</p>
        </section>
      );
    }

    if (isProfileLoading) {
      return (
        <section className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Loading profile...</h1>
          <p className={styles.statusMessage}>Fetching profile details and recent posts.</p>
        </section>
      );
    }

    if (profileError) {
      return (
        <section className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Profile error</h1>
          <p className={styles.statusMessage}>{profileError}</p>
        </section>
      );
    }

    if (isEmptyProfile || !profile) {
      return (
        <section className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Profile not found.</h1>
          <p className={styles.statusMessage}>The requested user profile could not be found.</p>
        </section>
      );
    }

    return (
      <div className={styles.profileLayout}>
        <ProfileInfoPanel profile={profile} isOwner={isOwner} />
        <ProfileContent
          profile={profile}
          isOwner={isOwner}
          posts={posts}
          isPostsLoading={isPostsLoading}
          postsError={postsError}
          hasMore={hasMore}
          nextCursor={nextCursor}
        />
      </div>
    );
  };

  return (
    <PageLayout>
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.eyebrow}>Profile</p>
          <h1 className={styles.pageTitle}>{isOwner ? 'My Profile' : 'User Profile'}</h1>
        </div>
        {renderStateContent()}
      </main>
    </PageLayout>
  );
}

export default ProfileViewPage;

