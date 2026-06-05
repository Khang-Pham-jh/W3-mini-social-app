import styles from './PostInteractions.module.css';

function LikeButton({ count, isActive, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`${styles.actionButton} ${isActive ? styles.activeLike : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={isActive ? 'Remove like' : 'Like'}
      aria-pressed={isActive}
    >
      <span className={styles.icon} aria-hidden="true">👍</span>
      <span className={styles.count}>{count > 0 ? count : ''}</span>
    </button>
  );
}

export default LikeButton;