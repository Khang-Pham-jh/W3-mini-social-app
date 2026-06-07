import { useState } from 'react';
import HighlightSlider from './HighlightSlider';
import UserPostsFeed from './UserPostsFeed';
import styles from './ProfileTabs.module.css';

const TABS = {
  POSTS: 'posts',
  HIGHLIGHTS: 'highlights',
};

function ProfileTabs({
  profile,
  isOwner,
  posts,
  isPostsLoading,
  postsError,
  hasMore,
  nextCursor,
}) {
  const [activeTab, setActiveTab] = useState(TABS.POSTS);

  return (
    <section className={styles.tabs} aria-label="Profile activity">
      <div className={styles.tabList} role="tablist" aria-label="Profile sections">
        <button
          id="profile-posts-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.POSTS}
          aria-controls="profile-posts-panel"
          className={activeTab === TABS.POSTS ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab(TABS.POSTS)}
        >
          Posts
        </button>
        <button
          id="profile-highlights-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.HIGHLIGHTS}
          aria-controls="profile-highlights-panel"
          className={activeTab === TABS.HIGHLIGHTS ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab(TABS.HIGHLIGHTS)}
        >
          Highlights
        </button>
      </div>

      <div
        id={activeTab === TABS.POSTS ? 'profile-posts-panel' : 'profile-highlights-panel'}
        className={styles.tabPanel}
        role="tabpanel"
        aria-labelledby={activeTab === TABS.POSTS ? 'profile-posts-tab' : 'profile-highlights-tab'}
      >
        {activeTab === TABS.POSTS ? (
          <UserPostsFeed
            profile={profile}
            isOwner={isOwner}
            posts={posts}
            isPostsLoading={isPostsLoading}
            postsError={postsError}
            hasMore={hasMore}
            nextCursor={nextCursor}
          />
        ) : (
          <HighlightSlider images={profile?.highlight_images} />
        )}
      </div>
    </section>
  );
}

export default ProfileTabs;
