import { createAsyncThunk } from '@reduxjs/toolkit';
import { createPost } from '../../home/services/postService';
import {
  getProfile,
  getUserPosts,
  updateProfile as updateProfileRecord,
} from '../services/profileService';
import {
  removeHighlightImages,
  uploadAvatar,
  uploadHighlightImages,
} from '../services/profileStorageService';

function rejectServiceError(result, rejectWithValue, fallbackMessage) {
  return rejectWithValue(result?.error || fallbackMessage);
}

function normalizeUrlList(urls) {
  if (!Array.isArray(urls)) {
    return [];
  }

  return [...new Set(urls.filter(Boolean))];
}

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue('A user id is required.');
    }

    const result = await getProfile(userId);

    if (!result.success) {
      return rejectServiceError(result, rejectWithValue, 'Unable to load profile.');
    }

    return result.data;
  },
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    {
      userId,
      profileData,
      avatarFile = null,
      removedHighlightUrls = [],
      existingHighlightUrls = [],
      newHighlightFiles = [],
    } = {},
    { rejectWithValue },
  ) => {
    if (!userId || !profileData) {
      return rejectWithValue('Profile payload is required.');
    }

    const normalizedExistingHighlightUrls = normalizeUrlList(existingHighlightUrls);
    const normalizedRemovedHighlightUrls = normalizeUrlList(removedHighlightUrls);
    const normalizedNewHighlightFiles = Array.from(newHighlightFiles || []).filter(Boolean);

    if (normalizedRemovedHighlightUrls.length > 0) {
      const removeResult = await removeHighlightImages(normalizedRemovedHighlightUrls);

      if (!removeResult.success) {
        return rejectServiceError(removeResult, rejectWithValue, 'Unable to remove old highlight images.');
      }
    }

    let nextAvatarUrl = profileData.avatar_url ?? null;

    if (avatarFile) {
      const avatarUploadResult = await uploadAvatar({ userId, file: avatarFile });

      if (!avatarUploadResult.success) {
        return rejectServiceError(avatarUploadResult, rejectWithValue, 'Unable to upload avatar.');
      }

      nextAvatarUrl = avatarUploadResult.data;
    }

    let uploadedHighlightUrls = [];

    if (normalizedNewHighlightFiles.length > 0) {
      const highlightsUploadResult = await uploadHighlightImages({
        userId,
        files: normalizedNewHighlightFiles,
      });

      if (!highlightsUploadResult.success) {
        return rejectServiceError(highlightsUploadResult, rejectWithValue, 'Unable to upload highlight images.');
      }

      uploadedHighlightUrls = highlightsUploadResult.data ?? [];
    }

    const updateResult = await updateProfileRecord({
      userId,
      profileData: {
        ...profileData,
        avatar_url: nextAvatarUrl,
        highlight_images: [...normalizedExistingHighlightUrls, ...uploadedHighlightUrls],
      },
    });

    if (!updateResult.success) {
      return rejectServiceError(updateResult, rejectWithValue, 'Unable to update profile.');
    }

    return updateResult.data;
  },
);

export const fetchUserPosts = createAsyncThunk(
  'profile/fetchUserPosts',
  async ({ userId, limit = 10, cursor = null } = {}, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue('A user id is required.');
    }

    const result = await getUserPosts({ userId, limit, cursor });

    if (!result.success) {
      return rejectServiceError(result, rejectWithValue, 'Unable to load posts.');
    }

    return result.data;
  },
);

export const fetchMoreUserPosts = createAsyncThunk(
  'profile/fetchMoreUserPosts',
  async ({ userId, limit = 10, cursor = null } = {}, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue('A user id is required.');
    }

    const result = await getUserPosts({ userId, limit, cursor });

    if (!result.success) {
      return rejectServiceError(result, rejectWithValue, 'Unable to load more posts.');
    }

    return result.data;
  },
);

export const createProfilePost = createAsyncThunk(
  'profile/createProfilePost',
  async ({ authorId, content, imageFiles = [] } = {}, { rejectWithValue }) => {
    if (!authorId) {
      return rejectWithValue('An author id is required.');
    }

    const result = await createPost({ authorId, content, imageFiles });

    if (!result.success) {
      return rejectServiceError(result, rejectWithValue, 'Unable to create post.');
    }

    return result.post;
  },
);
