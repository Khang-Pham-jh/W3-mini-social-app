import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';
import { REACTION_TYPES } from '../../services/reactionService';
import styles from './PostInteractions.module.css';

function ReactionBar({
  likes,
  dislikes,
  userReaction,
  commentsCount,
  onReact,
  onToggleComments,
  isCommentsOpen,
  disabled,
}) {
  return (
    <div className={styles.reactionBar} role="group" aria-label="Post interactions">
      <LikeButton
        count={likes}
        isActive={userReaction === REACTION_TYPES.LIKE}
        onClick={() => onReact(REACTION_TYPES.LIKE)}
        disabled={disabled}
      />
      <DislikeButton
        count={dislikes}
        isActive={userReaction === REACTION_TYPES.DISLIKE}
        onClick={() => onReact(REACTION_TYPES.DISLIKE)}
        disabled={disabled}
      />
      <button
        type="button"
        className={`${styles.actionButton} ${isCommentsOpen ? styles.activeComment : ''}`}
        onClick={onToggleComments}
        aria-expanded={isCommentsOpen}
        aria-label={isCommentsOpen ? 'Hide comments' : 'Show comments'}
      >
        <span className={`${styles.icon} ${styles.iconChatBubble}`} aria-hidden="true" />
        <span className={styles.count}>{commentsCount > 0 ? commentsCount : ''}</span>
      </button>
    </div>
  );
}

export default ReactionBar;
