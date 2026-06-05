import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';
import { getPositionLabels } from '../constants/positions';

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
  const positionLabels = getPositionLabels(positions);

  return {
    id: user?.id,
    email: normalizeText(user?.email),
    name: normalizeText(user?.user_metadata?.name),
    position: positionLabels.join(', '),
  };
}

export async function upsertProfileFromUser(user) {
  if (!isSupabaseConfigured || !supabase || !user?.id) {
    return null;
  }

  const profilePayload = buildProfilePayload(user);
  const existingProfile = await getProfileByUserId(user.id);

  if (existingProfile) {
    const patch = {};

    if (profilePayload.email && profilePayload.email !== existingProfile.email) {
      patch.email = profilePayload.email;
    }

    if (!normalizeText(existingProfile.name) && profilePayload.name) {
      patch.name = profilePayload.name;
    }

    if (!normalizeText(existingProfile.position) && profilePayload.position) {
      patch.position = profilePayload.position;
    }

    if (Object.keys(patch).length === 0) {
      return existingProfile;
    }

    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .update(patch)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return existingProfile;
    }

    return data;
  }

  const { data, error } = await supabase
    .from(PROFILES_TABLE)
    .insert(profilePayload)
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
