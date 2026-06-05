import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../../../shared/components/PageLayout';
import PostComposer from '../components/PostComposer';
import PostFeed from '../components/PostFeed';
import {
  DEFAULT_POST_PAGE_SIZE,
  createPost,
  fetchFeedPosts,
  hidePost,
  unhidePost,
} from '../services/postService';
import { useAuth } from '../../auth/context/AuthContext';
import styles from './HomePage.module.css';

function HomePage() {
  const { currentProfile, currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const loadMoreTriggerRef = useRef(null);

  const userId = currentUser?.id;

  const loadPosts = useCallback(
    async ({ cursor = null, shouldAppend = false } = {}) => {
      if (!userId) {
        setIsInitialLoading(false);
        return;
      }

      if (shouldAppend) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      const result = await fetchFeedPosts({
        userId,
        cursor,
        pageSize: DEFAULT_POST_PAGE_SIZE,
      });

      if (!result.success) {
        setError(result.error);
      } else {
        setPosts((currentPosts) =>
          shouldAppend ? [...currentPosts, ...result.posts] : result.posts,
        );
        setHasMore(result.hasMore);
        setNextCursor(result.nextCursor);
        setError('');
      }

      setIsInitialLoading(false);
      setIsLoadingMore(false);
    },
    [userId],
  );

  useEffect(() => {
    setPosts([]);
    setHasMore(false);
    setNextCursor(null);
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const loadMoreTrigger = loadMoreTriggerRef.current;

    if (!loadMoreTrigger || !hasMore || isInitialLoading || isLoadingMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadPosts({
            cursor: nextCursor,
            shouldAppend: true,
          });
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(loadMoreTrigger);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isInitialLoading, isLoadingMore, loadPosts, nextCursor]);

  async function handleCreatePost({ content, imageFiles }) {
    if (!userId) {
      return {
        success: false,
        error: 'Please log in before creating a post.',
      };
    }

    setIsSubmitting(true);

    const result = await createPost({
      authorId: userId,
      content,
      imageFiles,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return result;
    }

    setPosts((currentPosts) => [result.post, ...currentPosts]);
    setError('');

    return result;
  }

  async function handleHidePost(postId) {
    if (!userId) {
      return;
    }

    const result = await hidePost({
      userId,
      postId,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, isHiddenLocally: true } : post
      )
    );
    setError('');
  }

  async function handleUnhidePost(postId) {
    if (!userId) {
      return;
    }

    const result = await unhidePost({
      userId,
      postId,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, isHiddenLocally: false } : post
      )
    );
    setError('');
  }

  return (
    <PageLayout>
      <main className={styles.homePage}>
        <section className={styles.feedColumn} aria-label="Bulletin feed">
          <PostComposer
            currentProfile={currentProfile}
            currentUser={currentUser}
            isSubmitting={isSubmitting}
            onCreatePost={handleCreatePost}
          />

          <PostFeed
            error={error}
            hasMore={hasMore}
            isInitialLoading={isInitialLoading}
            isLoadingMore={isLoadingMore}
            loadMoreTriggerRef={loadMoreTriggerRef}
            posts={posts}
            onHidePost={handleHidePost}
            onUnhidePost={handleUnhidePost}
            currentUser={currentUser}
            currentProfile={currentProfile}
          />
        </section>
      </main>
    </PageLayout>
  );
}

export default HomePage;
