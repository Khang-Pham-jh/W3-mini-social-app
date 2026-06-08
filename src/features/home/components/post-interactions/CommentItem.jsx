import { useState } from 'react';
import CommentForm from './CommentForm';
import styles from './PostInteractions.module.css';

function CommentItem({ comment, isOwner, currentProfile, onEdit, onDelete }) {
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

  const displayAuthor = isOwner
    ? {
        ...comment.author,
        name: currentProfile?.name || comment.author?.name,
        avatar_url: currentProfile?.avatar_url || comment.author?.avatar_url,
      }
    : comment.author;
  const authorName = displayAuthor?.name || 'Unknown User';
  const avatarInitial = authorName.charAt(0).toUpperCase();
  const avatarUrl = displayAuthor?.avatar_url;
  const displayTime = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(comment.created_at));

  return (
    <article className={styles.commentItem}>
      <div className={styles.commentAvatarWrapper}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={`${authorName}'s avatar`} className={styles.commentAvatarImage} />
        ) : (
          <span className={styles.commentAvatarFallback}>{avatarInitial}</span>
        )}
      </div>
      
      <div className={styles.commentContentArea}>
        <header className={styles.commentHeader}>
          <span className={styles.commentAuthor}>{authorName}</span>
          <time className={styles.commentTime} dateTime={comment.created_at}>{displayTime}</time>
        </header>
        
        <p className={styles.commentText}>{comment.content}</p>
        
        {isOwner ? (
          <footer className={styles.commentActions}>
            <button type="button" onClick={() => setIsEditing(true)} aria-label="Edit comment">Edit</button>
            <button type="button" onClick={() => onDelete(comment.id)} className={styles.deleteButton} aria-label="Delete comment">Delete</button>
          </footer>
        ) : null}
      </div>
    </article>
  );
}

export default CommentItem;
