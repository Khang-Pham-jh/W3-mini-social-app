import { useState } from 'react';
import styles from './PostInteractions.module.css';

function CommentForm({ initialValue = '', onSubmit, isSubmitting, onCancel, placeholder = 'Write a comment...' }) {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim() || isSubmitting) return;

    const { success } = await onSubmit(content);
    if (success && !initialValue) {
      setContent(''); 
    }
  };

  return (
    <form className={styles.commentForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        disabled={isSubmitting}
        rows={2}
        aria-label="Comment content"
      />
      <div className={styles.formActions}>
        {onCancel && (
          <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.submitButton} disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;