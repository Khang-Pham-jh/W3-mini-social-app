import CommentItem from './CommentItem';
import styles from './PostInteractions.module.css';

function CommentList({ comments, currentUserId, onEdit, onDelete }) {
  if (!comments || comments.length === 0) {
    return <p className={styles.emptyState}>No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={Boolean(currentUserId && comment.author_id === currentUserId)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default CommentList;