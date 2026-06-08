import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

const PROFILE_BASE_PATH = '/profile';
const PROFILE_EDIT_PATH = '/profile/edit';

export function useProfileAccess() {
  const { currentUser, isLoggedIn, isAuthLoading } = useAuth();
  const { id } = useParams();
  const { pathname } = useLocation();

  const currentUserId = currentUser?.id ?? null;
  const isAuthenticated = Boolean(isLoggedIn && currentUserId);

  return useMemo(() => {
    const isEditRoute = pathname === PROFILE_EDIT_PATH;
    const isOwnProfileRoute = pathname === PROFILE_BASE_PATH;
    const isProfileDetailsRoute =
      pathname.startsWith(`${PROFILE_BASE_PATH}/`) && !isEditRoute;

    let profileId = null;

    if (isEditRoute) {
      profileId = currentUserId;
    } else if (isProfileDetailsRoute && id) {
      profileId = id;
    } else if (isOwnProfileRoute) {
      profileId = currentUserId;
    }

    const isOwner = Boolean(profileId && currentUserId && profileId === currentUserId);
    const shouldRedirectToLogin = !isAuthLoading && !isAuthenticated;
    const shouldRedirectUnauthorized =
      !isAuthLoading && isAuthenticated && isEditRoute && !isOwner;

    return {
      profileId,
      currentUserId,
      isOwner,
      isAuthenticated,
      shouldRedirectToLogin,
      shouldRedirectUnauthorized,
    };
  }, [currentUserId, id, isAuthLoading, isAuthenticated, pathname]);
}

