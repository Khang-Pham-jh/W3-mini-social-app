import { useState, useEffect, useCallback } from 'react';
import { fetchComments, createComment, updateComment, deleteComment } from '../services/commentService';

export function usePostComments(postId, currentUser, currentProfile) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = currentUser?.id;
  const currentUserName = currentProfile?.name || currentUser?.user_metadata?.name || 'You';
  const currentUserAvatar = currentProfile?.avatar_url || '';

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      setIsLoading(true);
      const { success, comments: fetchedComments, error: fetchError } = await fetchComments(postId);
      
      if (isMounted) {
        if (success) {
          setComments(fetchedComments);
        } else {
          setError(fetchError);
        }
        setIsLoading(false);
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const addComment = useCallback(
    async (content) => {
      if (!currentUserId) return { success: false, error: 'Not logged in' };
      
      setIsSubmitting(true);
      setError('');

      const { success, comment, error: createError } = await createComment({ 
        postId, 
        authorId: currentUserId, 
        content 
      });

      if (success) {
        // Construct enriched comment with author details locally to avoid an extra DB fetch
        const enrichedComment = {
          ...comment,
          author: {
            id: currentUserId,
            name: currentUserName,
            avatar_url: currentUserAvatar,
          },
        };
        setComments((prev) => [...prev, enrichedComment]);
      } else {
        setError(createError);
      }
      
      setIsSubmitting(false);
      return { success, error: createError };
    }, [postId, currentUserId, currentUserName, currentUserAvatar]);

  const editComment = useCallback(
    async (commentId, newContent) => {
      if (!currentUserId) return { success: false, error: 'Not logged in' };
      setError('');

      const { success, error: updateError } = await updateComment({ 
        commentId, 
        authorId: currentUserId, 
        content: newContent 
      });

      if (success) {
        setComments((prev) => prev.map((c) => (c.id === commentId ? { ...c, content: newContent, updated_at: new Date().toISOString() } : c)));
      } else {
        setError(updateError);
      }
      
      return { success, error: updateError };
    }, [currentUserId]);

  const removeComment = useCallback(
    async (commentId) => {
      if (!currentUserId) return { success: false, error: 'Not logged in' };
      setError('');

      const { success, error: deleteError } = await deleteComment({ commentId, authorId: currentUserId });
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        setError(deleteError);
      }
      return { success, error: deleteError };
    }, [currentUserId]);

  return { comments, isLoading, isSubmitting, error, addComment, editComment, removeComment };
}