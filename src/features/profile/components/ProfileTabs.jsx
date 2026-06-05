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
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" aria-label="Profile sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.POSTS}
          className={activeTab === TABS.POSTS ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab(TABS.POSTS)}
        >
          Posts
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === TABS.HIGHLIGHTS}
          className={activeTab === TABS.HIGHLIGHTS ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab(TABS.HIGHLIGHTS)}
        >
          Highlights
        </button>
      </div>

      <div className={styles.tabPanel}>
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
    </div>
  );
}

export default ProfileTabs;
