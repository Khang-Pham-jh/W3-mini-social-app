import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';
import { DEFAULT_PROFILE_STATUS } from '../constants/status';

const PROFILES_TABLE = 'profiles';
const PUBLIC_PROFILES_VIEW = 'public_profiles';
const POSTS_TABLE = 'posts';
const DEFAULT_PROFILE_POST_PAGE_SIZE = 10;

const MISSING_SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are missing. Please configure the app before continuing.';
const GENERIC_PROFILE_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const PROFILE_NOT_FOUND_MESSAGE = 'Profile not found.';
const PROFILE_UPDATE_ERROR_MESSAGE = 'Unable to save profile changes right now.';
const PROFILE_POSTS_ERROR_MESSAGE = 'Unable to load profile posts right now.';

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

function createErrorResponse(error, fallback = GENERIC_PROFILE_ERROR_MESSAGE) {
  if (!error) {
    return {
      success: false,
      error: fallback,
    };
  }

  return {
    success: false,
    error: error.message || fallback,
    errorCode: error.code ?? null,
    errorDetails: error.details ?? null,
    errorHint: error.hint ?? null,
  };
}

function mapProfileError(error, fallback) {
  if (error?.code === 'PGRST116') {
    return {
      success: true,
      data: null,
    };
  }

  return createErrorResponse(error, fallback);
}

function normalizeNullableText(value) {
  const normalizedValue = normalizeText(value);
  return normalizedValue || null;
}

function normalizeStatus(value) {
  const normalizedValue = normalizeText(value).toLowerCase();
  return normalizedValue || DEFAULT_PROFILE_STATUS;
}

function normalizeDate(value) {
  const normalizedValue = normalizeText(value);
  return normalizedValue || null;
}

function normalizeImageUrls(imageUrls) {
  if (!Array.isArray(imageUrls)) {
    return [];
  }

  return imageUrls
    .map((imageUrl) => normalizeText(imageUrl))
    .filter(Boolean);
}

function buildProfileUpdatePayload(profileData = {}) {
  const payload = {};

  if (Object.hasOwn(profileData, 'name')) {
    payload.name = normalizeNullableText(profileData.name);
  }

  if (Object.hasOwn(profileData, 'position')) {
    payload.position = normalizeNullableText(profileData.position);
  }

  if (Object.hasOwn(profileData, 'avatar_url')) {
    payload.avatar_url = normalizeNullableText(profileData.avatar_url);
  }

  if (Object.hasOwn(profileData, 'dob')) {
    payload.dob = normalizeDate(profileData.dob);
  }

  if (Object.hasOwn(profileData, 'bio')) {
    payload.bio = normalizeNullableText(profileData.bio);
  }

  if (Object.hasOwn(profileData, 'status')) {
    payload.status = normalizeStatus(profileData.status);
  }

  if (Object.hasOwn(profileData, 'highlight_images')) {
    payload.highlight_images = normalizeImageUrls(profileData.highlight_images);
  }

  return payload;
}

function getPostBatchSize(limit) {
  const pageSize = Math.max(Number(limit) || DEFAULT_PROFILE_POST_PAGE_SIZE, 1);

  return {
    pageSize,
    queryLimit: pageSize + 1,
  };
}

function getAuthorFallback(authorId) {
  return {
    id: authorId,
    name: 'Unknown user',
    position: 'Member',
    avatar_url: '',
  };
}

function mapProfileById(profiles) {
  return new Map((profiles || []).map((profile) => [profile.id, profile]));
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

async function fetchProfilesByAuthorIds(authorIds) {
  const uniqueAuthorIds = [...new Set((authorIds || []).filter(Boolean))];

  if (uniqueAuthorIds.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  const { data, error } = await supabase
    .from(PUBLIC_PROFILES_VIEW)
    .select('id, name, position, avatar_url')
    .in('id', uniqueAuthorIds);

  if (error) {
    return createErrorResponse(error, GENERIC_PROFILE_ERROR_MESSAGE);
  }

  return {
    success: true,
    data: data ?? [],
  };
}

export async function getProfile(userId) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId) {
    return {
      success: false,
      error: PROFILE_NOT_FOUND_MESSAGE,
    };
  }

  const { data, error } = await supabase
    .from(PUBLIC_PROFILES_VIEW)
    .select('id, name, position, avatar_url, dob, bio, status, highlight_images')
    .eq('id', userId)
    .single();

  if (error) {
    return mapProfileError(error, PROFILE_NOT_FOUND_MESSAGE);
  }

  return {
    success: true,
    data,
  };
}

export async function updateProfile({ userId, profileData } = {}) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId) {
    return {
      success: false,
      error: PROFILE_UPDATE_ERROR_MESSAGE,
    };
  }

  const payload = buildProfileUpdatePayload(profileData);

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .update(payload)
    .eq('id', userId)
    .select('id, name, position, avatar_url, dob, bio, status, highlight_images')
    .single();

  if (error) {
    return createErrorResponse(error, PROFILE_UPDATE_ERROR_MESSAGE);
  }

  return {
    success: true,
    data,
  };
}

export async function getUserPosts({
  userId,
  limit = DEFAULT_PROFILE_POST_PAGE_SIZE,
  cursor = null,
} = {}) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId) {
    return {
      success: false,
      error: PROFILE_POSTS_ERROR_MESSAGE,
    };
  }

  const { pageSize, queryLimit } = getPostBatchSize(limit);

  let postsQuery = supabase
    .from(POSTS_TABLE)
    .select('id, author_id, content, image_urls, created_at, updated_at')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(queryLimit);

  if (cursor) {
    postsQuery = postsQuery.lt('created_at', cursor);
  }

  const { data, error } = await postsQuery;

  if (error) {
    return createErrorResponse(error, PROFILE_POSTS_ERROR_MESSAGE);
  }

  const visiblePosts = (data ?? []).slice(0, pageSize);
  const profileResult = await fetchProfilesByAuthorIds([userId]);

  if (!profileResult.success) {
    return profileResult;
  }

  const profileById = mapProfileById(profileResult.data);

  return {
    success: true,
    data: {
      posts: visiblePosts.map((post) => mapPost(post, profileById)),
      hasMore: (data ?? []).length > pageSize,
      nextCursor: visiblePosts.at(-1)?.created_at ?? null,
    },
  };
}

export { DEFAULT_PROFILE_POST_PAGE_SIZE };
