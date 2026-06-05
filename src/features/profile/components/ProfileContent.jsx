import ProfileTabs from './ProfileTabs';
import styles from './ProfileContent.module.css';

function ProfileContent({
  profile,
  isOwner,
  posts,
  isPostsLoading,
  postsError,
  hasMore,
  nextCursor,
}) {
  return (
    <section className={styles.contentCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>{profile?.name || 'Profile'}</h2>
        <p className={styles.subtitle}>Posts and highlights live here.</p>
      </div>

      <ProfileTabs
        profile={profile}
        isOwner={isOwner}
        posts={posts}
        isPostsLoading={isPostsLoading}
        postsError={postsError}
        hasMore={hasMore}
        nextCursor={nextCursor}
      />
    </section>
  );
}

export default ProfileContent;

