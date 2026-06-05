import { createSlice } from '@reduxjs/toolkit';
import {
  createProfilePost,
  fetchMoreUserPosts,
  fetchProfile,
  fetchUserPosts,
  updateProfile,
} from './profileThunks';

const initialAsyncState = {
  status: 'idle',
  error: '',
};

const initialState = {
  profile: {
    data: null,
    ...initialAsyncState,
  },
  userPosts: {
    data: [],
    hasMore: false,
    nextCursor: null,
    ...initialAsyncState,
  },
  createPost: {
    ...initialAsyncState,
  },
  updateProfile: {
    ...initialAsyncState,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.profile.status = 'loading';
        state.profile.error = '';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile.status = 'succeeded';
        state.profile.data = action.payload ?? null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profile.status = 'failed';
        state.profile.error = action.payload || action.error.message || 'Unable to load profile.';
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateProfile.status = 'loading';
        state.updateProfile.error = '';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateProfile.status = 'succeeded';
        state.profile.data = action.payload ?? state.profile.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfile.status = 'failed';
        state.updateProfile.error = action.payload || action.error.message || 'Unable to update profile.';
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPosts.status = 'loading';
        state.userPosts.error = '';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts.status = 'succeeded';
        state.userPosts.data = action.payload?.posts ?? [];
        state.userPosts.hasMore = action.payload?.hasMore ?? false;
        state.userPosts.nextCursor = action.payload?.nextCursor ?? null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.userPosts.status = 'failed';
        state.userPosts.error = action.payload || action.error.message || 'Unable to load posts.';
      })
      .addCase(fetchMoreUserPosts.pending, (state) => {
        state.userPosts.status = 'loading';
        state.userPosts.error = '';
      })
      .addCase(fetchMoreUserPosts.fulfilled, (state, action) => {
        state.userPosts.status = 'succeeded';
        state.userPosts.data.push(...(action.payload?.posts ?? []));
        state.userPosts.hasMore = action.payload?.hasMore ?? false;
        state.userPosts.nextCursor = action.payload?.nextCursor ?? null;
      })
      .addCase(fetchMoreUserPosts.rejected, (state, action) => {
        state.userPosts.status = 'failed';
        state.userPosts.error = action.payload || action.error.message || 'Unable to load more posts.';
      })
      .addCase(createProfilePost.pending, (state) => {
        state.createPost.status = 'loading';
        state.createPost.error = '';
      })
      .addCase(createProfilePost.fulfilled, (state, action) => {
        state.createPost.status = 'succeeded';
        state.userPosts.data.unshift(action.payload);
      })
      .addCase(createProfilePost.rejected, (state, action) => {
        state.createPost.status = 'failed';
        state.createPost.error = action.payload || action.error.message || 'Unable to create post.';
      });
  },
});

export const { resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
