import { supabase } from '../../../libs/supabase';

const REACTIONS_TABLE = 'post_reactions';

export const REACTION_TYPES = {
  LIKE: 'LIKE',
  DISLIKE: 'DISLIKE',
};

export async function fetchReactions(postId) {
  if (!postId) return { success: false, error: 'Post ID is required' };

  const { data, error } = await supabase
    .from(REACTIONS_TABLE)
    .select('reaction_type, author_id')
    .eq('post_id', postId);

  if (error) {
    return { success: false, error: error.message || 'Failed to fetch reactions' };
  }

  return { success: true, reactions: data };
}

export async function toggleReaction({ postId, authorId, targetReaction, currentReaction }) {
  if (currentReaction === targetReaction) {
    // User clicked the exact same reaction, so we remove it
    const { error } = await supabase
      .from(REACTIONS_TABLE)
      .delete()
      .match({ post_id: postId, author_id: authorId });
      
    return { success: !error, error: error?.message || 'Failed to remove reaction' };
  } else {
    // User is adding a new reaction or switching (e.g. LIKE -> DISLIKE)
    const { error } = await supabase
      .from(REACTIONS_TABLE)
      .upsert(
        { post_id: postId, author_id: authorId, reaction_type: targetReaction },
        { onConflict: 'post_id,author_id' } // Enforces the constraint
      );
    return { success: !error, error: error?.message || 'Failed to update reaction' };
  }
}