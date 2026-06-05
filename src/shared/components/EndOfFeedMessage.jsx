import styles from './EndOfFeedMessage.module.css';

function EndOfFeedMessage({ hasMore, isLoading, itemCount }) {
  if (isLoading || hasMore || itemCount === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p className={styles.text}>You're all caught up. No more posts to show.</p>
    </div>
  );
}

export default EndOfFeedMessage;