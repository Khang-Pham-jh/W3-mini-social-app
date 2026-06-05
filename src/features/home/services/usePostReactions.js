import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchReactions, toggleReaction, REACTION_TYPES } from '../services/reactionService';

export function usePostReactions(postId, currentUserId) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref to prevent race conditions from rapid double-clicks
  const isReactingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadReactions() {
      const { success, reactions } = await fetchReactions(postId);
      
      if (success && isMounted) {
        const likesCount = reactions.filter((r) => r.reaction_type === REACTION_TYPES.LIKE).length;
        const dislikesCount = reactions.filter((r) => r.reaction_type === REACTION_TYPES.DISLIKE).length;
        const userReact = reactions.find((r) => r.author_id === currentUserId)?.reaction_type || null;

        setLikes(likesCount);
        setDislikes(dislikesCount);
        setUserReaction(userReact);
      }
      
      if (isMounted) setIsLoading(false);
    }

    loadReactions();

    return () => {
      isMounted = false;
    };
  }, [postId, currentUserId]);

  const handleReaction = useCallback(
    async (type) => {
      if (!currentUserId || isReactingRef.current) return;
      
      isReactingRef.current = true;

      // Save previous state for rollback
      const prevReaction = userReaction;
      const prevLikes = likes;
      const prevDislikes = dislikes;

      // Calculate next optimistic state
      let nextReaction = type;
      let nextLikes = likes;
      let nextDislikes = dislikes;

      if (prevReaction === type) {
        nextReaction = null;
        if (type === REACTION_TYPES.LIKE) nextLikes--;
        if (type === REACTION_TYPES.DISLIKE) nextDislikes--;
      } else {
        if (type === REACTION_TYPES.LIKE) {
          nextLikes++;
          if (prevReaction === REACTION_TYPES.DISLIKE) nextDislikes--;
        } else {
          nextDislikes++;
          if (prevReaction === REACTION_TYPES.LIKE) nextLikes--;
        }
      }

      // Optimistic UI update
      setUserReaction(nextReaction);
      setLikes(nextLikes);
      setDislikes(nextDislikes);

      const result = await toggleReaction({ postId, authorId: currentUserId, targetReaction: type, currentReaction: prevReaction });
      
      if (!result.success) {
        setUserReaction(prevReaction);
        setLikes(prevLikes);
        setDislikes(prevDislikes);
      }
      
      isReactingRef.current = false;
    }, [postId, currentUserId, userReaction, likes, dislikes]);

  return { likes, dislikes, userReaction, isLoading, handleReaction };
}