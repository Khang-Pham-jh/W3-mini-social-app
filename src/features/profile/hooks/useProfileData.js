import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectHasMoreUserPosts,
  selectNextUserPostsCursor,
  selectProfileError,
  selectProfileStatus,
  selectUserPosts,
  selectUserPostsError,
  selectUserPostsStatus,
  selectViewedProfile,
} from '../redux/profileSelectors';

export function useProfileData() {
  const profile = useSelector(selectViewedProfile);
  const profileStatus = useSelector(selectProfileStatus);
  const profileError = useSelector(selectProfileError);
  const posts = useSelector(selectUserPosts);
  const postsStatus = useSelector(selectUserPostsStatus);
  const postsError = useSelector(selectUserPostsError);
  const hasMore = useSelector(selectHasMoreUserPosts);
  const nextCursor = useSelector(selectNextUserPostsCursor);

  return useMemo(
    () => ({
      profile,
      posts,
      isProfileLoading: profileStatus === 'idle' || profileStatus === 'loading',
      isPostsLoading: postsStatus === 'idle' || postsStatus === 'loading',
      profileError: profileError || '',
      postsError: postsError || '',
      hasMore,
      nextCursor,
      isEmptyProfile: profileStatus === 'succeeded' && !profile,
      isEmptyPosts: postsStatus === 'succeeded' && posts.length === 0,
    }),
    [
      hasMore,
      nextCursor,
      posts,
      postsError,
      postsStatus,
      profile,
      profileError,
      profileStatus,
    ],
  );
}

