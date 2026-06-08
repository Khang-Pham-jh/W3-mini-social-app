import { useState } from 'react';
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';
import { usePostReactions } from '../../services/usePostReactions';
import { usePostComments } from '../../services/usePostComments';
import styles from './PostInteractions.module.css';

function PostInteractions({ postId, currentUser, currentProfile }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const currentUserId = currentUser?.id;

  const {
    likes,
    dislikes,
    userReaction,
    isLoading: isReactionsLoading,
    handleReaction,
  } = usePostReactions(postId, currentUserId);

  const {
    comments,
    isLoading: isCommentsLoading,
    isSubmitting: isCommentSubmitting,
    error: commentsError,
    addComment,
    editComment,
    removeComment,
  } = usePostComments(postId, currentUser, currentProfile);

  return (
    <div className={styles.interactionsContainer}>
      <ReactionBar
        likes={likes}
        dislikes={dislikes}
        userReaction={userReaction}
        commentsCount={comments.length}
        onReact={handleReaction}
        onToggleComments={() => setIsCommentsOpen(!isCommentsOpen)}
        isCommentsOpen={isCommentsOpen}
        disabled={isReactionsLoading || !currentUserId}
      />

      {isCommentsOpen ? (
        <CommentSection
          comments={comments}
          isLoading={isCommentsLoading}
          error={commentsError}
          onAdd={addComment}
          onEdit={editComment}
          onDelete={removeComment}
          currentUserId={currentUserId}
          currentProfile={currentProfile}
          isSubmitting={isCommentSubmitting}
        />
      ) : null}
    </div>
  );
}

export default PostInteractions;
