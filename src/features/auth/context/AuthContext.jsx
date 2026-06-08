import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { loginWithPassword, logoutUser, signUpWithPassword } from '../services/authService';
import { getProfileByUserId, upsertProfileFromUser } from '../services/profileService';

export const AuthContext = createContext(null);

function getSessionUser(session) {
  return session?.user ?? null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const refreshCurrentProfile = useCallback(
    async (userId = currentUser?.id ?? null) => {
      if (!userId) {
        setCurrentProfile(null);
        return null;
      }

      const latestProfile = await getProfileByUserId(userId);
      setCurrentProfile(latestProfile);
      return latestProfile;
    },
    [currentUser?.id],
  );

  useEffect(() => {
    let isSubscribed = true;

    async function applySession(nextSession) {
      if (!isSubscribed) {
        return;
      }

      setSession(nextSession ?? null);

      const nextUser = getSessionUser(nextSession);
      setCurrentUser(nextUser);

      if (!nextUser) {
        setCurrentProfile(null);
        setIsAuthLoading(false);
        return;
      }

      const syncedProfile = await upsertProfileFromUser(nextUser);

      if (!isSubscribed) {
        return;
      }

      setCurrentProfile(syncedProfile);
      setIsAuthLoading(false);
    }

    async function initializeSession() {
      if (!isSupabaseConfigured || !supabase) {
        setIsAuthLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      await applySession(data.session ?? null);
    }

    initializeSession();

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        isSubscribed = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      await applySession(nextSession ?? null);
    });

    return () => {
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signup(formData) {
    return signUpWithPassword(formData);
  }

  async function login(formData) {
    return loginWithPassword(formData);
  }

  async function logout() {
    return logoutUser();
  }

  const value = useMemo(
    () => ({
      currentUser,
      currentProfile,
      refreshCurrentProfile,
      session,
      isLoggedIn: Boolean(session?.user),
      isAuthLoading,
      signup,
      login,
      logout,
    }),
    [currentProfile, currentUser, isAuthLoading, refreshCurrentProfile, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
