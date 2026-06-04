import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';

const POSTS_TABLE = 'posts';
const HIDDEN_POSTS_TABLE = 'hidden_posts';
const PROFILES_TABLE = 'profiles';
const POST_IMAGES_BUCKET = 'post-images';
const DEFAULT_POST_PAGE_SIZE = 10;

const MISSING_SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are missing. Please configure the app before loading posts.';
const GENERIC_POST_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const EMPTY_POST_MESSAGE = 'Write something or attach an image before posting.';

function createErrorResponseFromSupabase(error, fallback = GENERIC_POST_ERROR_MESSAGE) {
  if (!error) {
    return {
      success: false,
      error: fallback,
    };
  }

  return {
    success: false,
    // keep the legacy `error` string for compatibility
    error: error.message || fallback,
    // expose code/details/hint so callers or UI can show more specific info
    errorCode: error.code ?? null,
    errorDetails: error.details ?? null,
    errorHint: error.hint ?? null,
  };
}

function ensureSupabaseClient() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: MISSING_SUPABASE_CONFIG_MESSAGE,
    };
  }

  return {
    success: true,
  };
}

function getPostBatchSize(pageSize) {
  const currentPageSize = Math.max(Number(pageSize) || DEFAULT_POST_PAGE_SIZE, 1);

  return {
    pageSize: currentPageSize,
    queryLimit: currentPageSize + 1,
  };
}

function normalizeImageFiles(imageFiles) {
  if (!imageFiles) {
    return [];
  }

  return Array.from(imageFiles).filter(Boolean);
}

function normalizePostContent(content) {
  const normalizedContent = normalizeText(content);
  return normalizedContent || null;
}

function getPostImagePath(authorId, file, index) {
  const timestamp = Date.now();
  const fallbackName = `post-image-${index + 1}`;
  const safeFileName = normalizeText(file?.name)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  return `${authorId}/${timestamp}-${index}-${safeFileName || fallbackName}`;
}

function getAuthorFallback(authorId) {
  return {
    id: authorId,
    name: 'Unknown user',
    email: '',
    position: 'Member',
    avatar_url: '',
  };
}

function mapProfileById(profiles) {
  return new Map(profiles.map((profile) => [profile.id, profile]));
}

function mapPost(post, profileById) {
  const authorId = post.author_id;

  return {
    id: post.id,
    authorId,
    content: post.content ?? '',
    imageUrls: Array.isArray(post.image_urls) ? post.image_urls : [],
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    author: profileById.get(authorId) ?? getAuthorFallback(authorId),
  };
}

async function fetchHiddenPostIds(userId) {
  const { data, error } = await supabase
    .from(HIDDEN_POSTS_TABLE)
    .select('post_id')
    .eq('user_id', userId);

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  return {
    success: true,
    postIds: data.map((hiddenPost) => hiddenPost.post_id),
  };
}

async function fetchProfilesByAuthorIds(authorIds) {
  const uniqueAuthorIds = [...new Set(authorIds)].filter(Boolean);

  if (uniqueAuthorIds.length === 0) {
    return {
      success: true,
      profiles: [],
    };
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select('id, email, name, position, avatar_url')
    .in('id', uniqueAuthorIds);

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  return {
    success: true,
    profiles: data,
  };
}

async function uploadPostImages({ authorId, imageFiles }) {
  const uploadedImageUrls = [];

  for (const [index, imageFile] of imageFiles.entries()) {
    const imagePath = getPostImagePath(authorId, imageFile, index);
    const { error } = await supabase.storage
      .from(POST_IMAGES_BUCKET)
      .upload(imagePath, imageFile);



    if (error) {
      return createErrorResponseFromSupabase(error);
    }

    const { data } = supabase.storage.from(POST_IMAGES_BUCKET).getPublicUrl(imagePath);
    uploadedImageUrls.push(data.publicUrl);

  }

  return {
    success: true,
    imageUrls: uploadedImageUrls,
  };
}

export async function fetchFeedPosts({
  userId,
  cursor = null,
  pageSize = DEFAULT_POST_PAGE_SIZE,
} = {}) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId) {
    return {
      success: false,
      error: GENERIC_POST_ERROR_MESSAGE,
    };
  }

  const hiddenPostResult = await fetchHiddenPostIds(userId);

  if (!hiddenPostResult.success) {
    return hiddenPostResult;
  }

  const { pageSize: normalizedPageSize, queryLimit } = getPostBatchSize(pageSize);
  let postsQuery = supabase
    .from(POSTS_TABLE)
    .select('id, author_id, content, image_urls, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(queryLimit);

  if (cursor) {
    postsQuery = postsQuery.lt('created_at', cursor);
  }

  if (hiddenPostResult.postIds.length > 0) {
    postsQuery = postsQuery.not('id', 'in', `(${hiddenPostResult.postIds.join(',')})`);
  }

  const { data, error } = await postsQuery;

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  const visiblePosts = data.slice(0, normalizedPageSize);
  const profileResult = await fetchProfilesByAuthorIds(
    visiblePosts.map((post) => post.author_id),
  );

  if (!profileResult.success) {
    return profileResult;
  }

  const profileById = mapProfileById(profileResult.profiles);

  return {
    success: true,
    posts: visiblePosts.map((post) => mapPost(post, profileById)),
    hasMore: data.length > normalizedPageSize,
    nextCursor: visiblePosts.at(-1)?.created_at ?? null,
  };
}

export async function createPost({ authorId, content, imageFiles = [] }) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!authorId) {
    return {
      success: false,
      error: GENERIC_POST_ERROR_MESSAGE,
    };
  }

  const normalizedContent = normalizePostContent(content);
  const normalizedImageFiles = normalizeImageFiles(imageFiles);

  if (!normalizedContent && normalizedImageFiles.length === 0) {
    return {
      success: false,
      error: EMPTY_POST_MESSAGE,
    };
  }

  const uploadResult = await uploadPostImages({
    authorId,
    imageFiles: normalizedImageFiles,
  });

  if (!uploadResult.success) {
    return uploadResult;
  }

  const { data, error } = await supabase
    .from(POSTS_TABLE)
    .insert({
      author_id: authorId,
      content: normalizedContent,
      image_urls: uploadResult.imageUrls,
    })
    .select('id, author_id, content, image_urls, created_at, updated_at')
    .single();

    console.log('INSERT DATA:', data);
    console.log('INSERT ERROR:', error);

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  const profileResult = await fetchProfilesByAuthorIds([authorId]);

  if (!profileResult.success) {
    return profileResult;
  }

  return {
    success: true,
    post: mapPost(data, mapProfileById(profileResult.profiles)),
  };
}

export async function hidePost({ userId, postId }) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId || !postId) {
    return {
      success: false,
      error: GENERIC_POST_ERROR_MESSAGE,
    };
  }

  const { error } = await supabase
    .from(HIDDEN_POSTS_TABLE)
    .upsert({ user_id: userId, post_id: postId }, { onConflict: 'user_id,post_id' });

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  return {
    success: true,
  };
}

export async function unhidePost({ userId, postId }) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId || !postId) {
    return {
      success: false,
      error: GENERIC_POST_ERROR_MESSAGE,
    };
  }

  const { error } = await supabase
    .from(HIDDEN_POSTS_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    return createErrorResponseFromSupabase(error);
  }

  return {
    success: true,
  };
}

export { DEFAULT_POST_PAGE_SIZE };
