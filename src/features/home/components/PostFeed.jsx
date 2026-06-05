import styles from './PostFeed.module.css';
import PostCard from './PostCard';

function PostFeed({
  error,
  hasMore,
  isInitialLoading,
  isLoadingMore,
  loadMoreTriggerRef,
  posts,
  onHidePost,
  onUnhidePost,
}) {
  if (isInitialLoading) {
    return <p className={styles.statusText}>Loading posts...</p>;
  }

  return (
    <div className={styles.feed}>
      {error ? <p className={styles.errorText}>{error}</p> : null}

      {posts.length === 0 ? (
        <p className={styles.statusText}>No posts yet.</p>
      ) : (
        posts.map((post) =>
          post.isHiddenLocally ? (
            <div className={styles.hiddenPlaceholder} key={`hidden-${post.id}`}>
              <span>Post hidden.</span>
              <button className={styles.undoButton} type="button" onClick={() => onUnhidePost(post.id)}>
                Undo
              </button>
            </div>
          ) : (
            <PostCard key={post.id} post={post} onHidePost={onHidePost} />
          )
        )
      )}

      <div className={styles.loadMoreTrigger} ref={loadMoreTriggerRef}>
        {isLoadingMore ? 'Loading more posts...' : null}
        {!isLoadingMore && hasMore ? ' ' : null}
      </div>
    </div>
  );
}

export default PostFeed;
