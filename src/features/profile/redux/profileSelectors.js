export const selectProfileState = (state) => state.profile;

export const selectViewedProfile = (state) => selectProfileState(state).profile.data;
export const selectProfileStatus = (state) => selectProfileState(state).profile.status;
export const selectProfileError = (state) => selectProfileState(state).profile.error;

export const selectUserPosts = (state) => selectProfileState(state).userPosts.data;
export const selectUserPostsStatus = (state) => selectProfileState(state).userPosts.status;
export const selectUserPostsError = (state) => selectProfileState(state).userPosts.error;
export const selectHasMoreUserPosts = (state) => selectProfileState(state).userPosts.hasMore;
export const selectNextUserPostsCursor = (state) => selectProfileState(state).userPosts.nextCursor;

export const selectUpdateProfileStatus = (state) => selectProfileState(state).updateProfile.status;
export const selectUpdateProfileError = (state) => selectProfileState(state).updateProfile.error;
