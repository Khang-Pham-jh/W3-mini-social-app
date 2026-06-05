import { useState } from 'react';
import CommentForm from './CommentForm';
import styles from './PostInteractions.module.css';

function CommentItem({ comment, isOwner, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = async (newContent) => {
    const result = await onEdit(comment.id, newContent);
    if (result.success) {
      setIsEditing(false);
    }
    return result;
  };

  if (isEditing) {
    return (
      <div className={styles.commentItem}>
        <CommentForm
          initialValue={comment.content}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  const authorName = comment.author?.name || 'Unknown User';
  const avatarInitial = authorName.charAt(0).toUpperCase();
  const displayTime = new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentAvatar}>{avatarInitial}</div>
      <div className={styles.commentContentArea}>
        <div className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{authorName}</span>
          <span className={styles.commentTime}>{displayTime}</span>
        </div>
        <p className={styles.commentText}>{comment.content}</p>
        {isOwner ? (
          <div className={styles.commentActions}>
            <button type="button" onClick={() => setIsEditing(true)}>Edit</button>
            <button type="button" onClick={() => onDelete(comment.id)} className={styles.deleteButton}>Delete</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CommentItem;