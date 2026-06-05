import { supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';

const COMMENTS_TABLE = 'post_comments';
const PROFILES_TABLE = 'public_profiles';

export async function fetchComments(postId) {
  if (!postId) return { success: false, error: 'Post ID is required' };

  const { data: comments, error } = await supabase
    .from(COMMENTS_TABLE)
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) return { success: false, error: error.message || 'Failed to fetch comments' };

  // Extract unique author IDs to map their profiles
  const authorIds = [...new Set(comments.map((c) => c.author_id))];
  
  if (authorIds.length === 0) {
    return { success: true, comments: [] };
  }

  const { data: profiles, error: profilesError } = await supabase
    .from(PROFILES_TABLE)
    .select('id, name, avatar_url')
    .in('id', authorIds);

  if (profilesError) return { success: false, error: profilesError.message || 'Failed to fetch comment authors' };

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const enrichedComments = comments.map((c) => ({
    ...c,
    author: profileMap.get(c.author_id) || { id: c.author_id, name: 'Unknown User' },
  }));

  return { success: true, comments: enrichedComments };
}

export async function createComment({ postId, authorId, content }) {
  const normalizedContent = normalizeText(content);
  if (!normalizedContent) return { success: false, error: 'Comment cannot be empty' };

  const { data: comment, error } = await supabase
    .from(COMMENTS_TABLE)
    .insert({ post_id: postId, author_id: authorId, content: normalizedContent })
    .select()
    .single();

  if (error) return { success: false, error: error.message || 'Failed to create comment' };

  return { success: true, comment };
}

export async function updateComment({ commentId, authorId, content }) {
  const normalizedContent = normalizeText(content);
  if (!normalizedContent) return { success: false, error: 'Comment cannot be empty' };

  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .update({ content: normalizedContent })
    .match({ id: commentId, author_id: authorId });

  if (error) return { success: false, error: error.message || 'Failed to update comment' };

  return { success: true };
}

export async function deleteComment({ commentId, authorId }) {
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .delete()
    .match({ id: commentId, author_id: authorId });

  if (error) return { success: false, error: error.message || 'Failed to delete comment' };

  return { success: true };
}