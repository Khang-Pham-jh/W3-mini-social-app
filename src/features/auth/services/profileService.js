import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';

const PROFILES_TABLE = 'profiles';

function extractPositions(positionsValue) {
  if (Array.isArray(positionsValue)) {
    return positionsValue.map((position) => normalizeText(position)).filter(Boolean);
  }

  const singlePosition = normalizeText(positionsValue);
  return singlePosition ? [singlePosition] : [];
}

function buildProfilePayload(user) {
  const positions = extractPositions(user?.user_metadata?.positions ?? user?.user_metadata?.position);

  return {
    id: user?.id,
    email: normalizeText(user?.email),
    name: normalizeText(user?.user_metadata?.name),
    position: positions.join(', '),
    avatar_url: null,
  };
}

export async function upsertProfileFromUser(user) {
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return null;
  }

  const profilePayload = buildProfilePayload(user);

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .upsert(profilePayload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getProfileByUserId(userId) {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}
