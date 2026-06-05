import CommentForm from './CommentForm';
import CommentList from './CommentList';
import styles from './PostInteractions.module.css';

function CommentSection({
  comments,
  isLoading,
  error,
  onAdd,
  onEdit,
  onDelete,
  currentUserId,
  isSubmitting,
}) {
  return (
    <section className={styles.commentSection} aria-label="Comments">
      <div className={styles.addCommentArea}>
        <CommentForm onSubmit={onAdd} isSubmitting={isSubmitting} />
      </div>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      {isLoading ? (
        <p className={styles.loadingText}>Loading comments...</p>
      ) : (
        <CommentList comments={comments} currentUserId={currentUserId} onEdit={onEdit} onDelete={onDelete} />
      )}
    </section>
  );
}

export default CommentSection;
