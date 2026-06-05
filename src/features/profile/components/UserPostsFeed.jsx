import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../auth/context/AuthContext';
import PostCard from '../../home/components/PostCard';
import PostComposer from '../../home/components/PostComposer';
import { createProfilePost, fetchMoreUserPosts } from '../redux/profileThunks';
import styles from './UserPostsFeed.module.css';

function UserPostsFeed({
  profile,
  isOwner,
  posts,
  isPostsLoading,
  postsError,
  hasMore,
  nextCursor,
}) {
  const dispatch = useDispatch();
  const { currentUser, currentProfile } = useAuth();
  const loadMoreTriggerRef = useRef(null);

  useEffect(() => {
    const triggerNode = loadMoreTriggerRef.current;

    if (!triggerNode || !profile?.id || !hasMore || isPostsLoading || postsError) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(
            fetchMoreUserPosts({
              userId: profile.id,
              limit: 10,
              cursor: nextCursor,
            }),
          );
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(triggerNode);

    return () => {
      observer.disconnect();
    };
  }, [dispatch, hasMore, isPostsLoading, nextCursor, postsError, profile?.id]);

  async function handleCreatePost({ content, imageFiles }) {
    const result = await dispatch(
      createProfilePost({
        authorId: profile?.id,
        content,
        imageFiles,
      }),
    );

    return {
      success: createProfilePost.fulfilled.match(result),
      error: createProfilePost.rejected.match(result) ? result.payload : null,
    };
  }

  const isInitialLoading = isPostsLoading && posts.length === 0;
  const isLoadingMore = isPostsLoading && posts.length > 0;

  return (
    <div className={styles.feed}>
      {isOwner ? (
        <div className={styles.composerWrap}>
          <PostComposer
            currentProfile={currentProfile}
            currentUser={currentUser}
            onCreatePost={handleCreatePost}
          />
        </div>
      ) : null}

      {isInitialLoading ? <p className={styles.statusText}>Loading posts...</p> : null}
      {!isInitialLoading && postsError ? <p className={styles.errorText}>{postsError}</p> : null}
      {!isInitialLoading && !postsError && posts.length === 0 ? (
        <p className={styles.statusText}>No posts yet.</p>
      ) : null}

      {posts.length > 0 ? (
        <div className={styles.postsList}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              currentProfile={currentProfile}
            />
          ))}
        </div>
      ) : null}

      {hasMore || isLoadingMore ? (
        <div className={styles.loadMoreTrigger} ref={loadMoreTriggerRef}>
          {isLoadingMore ? 'Loading more posts...' : 'Scroll to load more'}
        </div>
      ) : null}

      {!hasMore && !isLoadingMore && posts.length > 0 ? (
        <div className={styles.endOfFeed}>You&apos;re all caught up. No more posts to show.</div>
      ) : null}
    </div>
  );
}

export default UserPostsFeed;
