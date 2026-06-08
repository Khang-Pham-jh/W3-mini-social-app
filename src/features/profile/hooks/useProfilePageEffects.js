import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile, fetchUserPosts } from '../redux/profileThunks';
import { resetProfileState } from '../redux/profileSlice';

const INITIAL_PROFILE_POSTS_LIMIT = 10;

export function useProfilePageEffects(profileId) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!profileId) {
      dispatch(resetProfileState());
      return undefined;
    }

    dispatch(fetchProfile(profileId));
    dispatch(
      fetchUserPosts({
        userId: profileId,
        limit: INITIAL_PROFILE_POSTS_LIMIT,
      }),
    );

    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch, profileId]);
}
