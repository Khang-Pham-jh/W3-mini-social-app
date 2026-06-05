import styles from './PostInteractions.module.css';

function DislikeButton({ count, isActive, onClick, disabled }) {
  return (
    <button
      type="button"
      className={`${styles.actionButton} ${isActive ? styles.activeDislike : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={isActive ? 'Remove dislike' : 'Dislike'}
      aria-pressed={isActive}
    >
      <span className={styles.icon} aria-hidden="true">👎</span>
      <span className={styles.count}>{count > 0 ? count : ''}</span>
    </button>
  );
}

export default DislikeButton;