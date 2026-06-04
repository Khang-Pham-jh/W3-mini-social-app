import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import TopBar from '../../../shared/components/TopBar';
import { supabase } from '../../../libs/supabase';
import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { currentProfile, currentUser, isLoggedIn } = useAuth();
  const location = useLocation();

  const targetProfileId = location.state?.profileId;
  const isViewingSelf = !targetProfileId || targetProfileId === currentUser?.id;

  const [otherProfile, setOtherProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(!isViewingSelf);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOtherProfile() {
      if (isViewingSelf) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .single();

      if (error) {
        setError('Could not load user profile.');
      } else {
        setOtherProfile(data);
      }
      setIsLoading(false);
    }

    fetchOtherProfile();
  }, [targetProfileId, isViewingSelf]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const displayProfile = isViewingSelf ? currentProfile : otherProfile;
  const displayName = isViewingSelf
    ? currentProfile?.name || currentUser?.user_metadata?.name || 'Not set'
    : displayProfile?.name || 'Unknown User';
  const displayEmail = isViewingSelf
    ? currentProfile?.email || currentUser?.email || 'Not available'
    : displayProfile?.email || 'Not available';
  const displayPosition = displayProfile?.position || 'Not set';

  return (
    <TopBar>
      <main className={styles.profilePage}>
        <section className={styles.profileCard}>
          <p className={styles.eyebrow}>Profile</p>
          <h1 className={styles.title}>
            {isViewingSelf ? 'My Profile' : `${displayName}'s Profile`}
          </h1>

          {isLoading ? (
            <p>Loading profile...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <p className={styles.description}>
                {isViewingSelf
                  ? 'This is your current user profile.'
                  : `Viewing profile details for ${displayName}.`}
              </p>

              <div className={styles.detailsGrid}>
                <article className={styles.detailCard}>
                  <p className={styles.detailLabel}>Name</p>
                  <p className={styles.detailValue}>{displayName}</p>
                </article>
                <article className={styles.detailCard}>
                  <p className={styles.detailLabel}>Email</p>
                  <p className={styles.detailValue}>{displayEmail}</p>
                </article>
                <article className={styles.detailCard}>
                  <p className={styles.detailLabel}>Position</p>
                  <p className={styles.detailValue}>{displayPosition}</p>
                </article>
              </div>
            </>
          )}
        </section>
      </main>
    </TopBar>
  );
}

export default ProfilePage;