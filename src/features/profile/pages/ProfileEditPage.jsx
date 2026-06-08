import { FORM_ERROR } from 'final-form';
import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageLayout from '../../../shared/components/PageLayout';
import { useAuth } from '../../auth/context/AuthContext';
import { useProfileAccess } from '../hooks/useProfileAccess';
import { useProfileData } from '../hooks/useProfileData';
import ProfileForm from '../components/ProfileForm';
import { resetProfileState } from '../redux/profileSlice';
import { fetchProfile, updateProfile } from '../redux/profileThunks';
import {
  selectUpdateProfileError,
  selectUpdateProfileStatus,
} from '../redux/profileSelectors';
import styles from './ProfileEditPage.module.css';

function ProfileEditPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refreshCurrentProfile } = useAuth();
  const {
    profileId,
    shouldRedirectToLogin,
    shouldRedirectUnauthorized,
  } = useProfileAccess();
  const {
    profile,
    isProfileLoading,
    profileError,
    isEmptyProfile,
  } = useProfileData();
  const submitStatus = useSelector(selectUpdateProfileStatus);
  const submitError = useSelector(selectUpdateProfileError);

  useEffect(() => {
    if (!profileId) {
      dispatch(resetProfileState());
      return undefined;
    }

    dispatch(fetchProfile(profileId));

    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch, profileId]);

  if (shouldRedirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  if (shouldRedirectUnauthorized) {
    return <Navigate to="/profile" replace />;
  }

  async function handleSubmit(formPayload) {
    const action = await dispatch(
      updateProfile({
        userId: profileId,
        ...formPayload,
      }),
    );

    if (updateProfile.rejected.match(action)) {
      return {
        [FORM_ERROR]: action.payload || 'Unable to save profile changes.',
      };
    }

    await refreshCurrentProfile(profileId);
    navigate('/profile', { replace: true });
    return undefined;
  }

  const renderContent = () => {
    if (!profileId || isProfileLoading) {
      return (
        <section className={styles.statusCard}>
          <h1 className={styles.statusTitle}>Loading profile editor...</h1>
          <p className={styles.statusMessage}>Preparing your profile data.</p>
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
          <p className={styles.statusMessage}>We could not load your editable profile.</p>
        </section>
      );
    }

    return (
      <ProfileForm
        profile={profile}
        isSubmitting={submitStatus === 'loading'}
        submitError={submitError}
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <PageLayout>
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Profile</p>
            <h1 className={styles.pageTitle}>Edit Profile</h1>
          </div>
          <Link className={styles.viewProfileLink} to="/profile">
            View Profile
          </Link>
        </div>
        {renderContent()}
      </main>
    </PageLayout>
  );
}

export default ProfileEditPage;
