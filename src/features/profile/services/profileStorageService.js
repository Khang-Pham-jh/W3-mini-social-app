import { isSupabaseConfigured, supabase } from '../../../libs/supabase';
import { normalizeText } from '../../../shared/utils/text';

const AVATAR_BUCKET = 'profile-avatars';
const HIGHLIGHTS_BUCKET = 'profile-highlights';

const MISSING_SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are missing. Please configure the app before continuing.';
const AVATAR_UPLOAD_ERROR_MESSAGE = 'Unable to upload avatar right now.';
const HIGHLIGHTS_UPLOAD_ERROR_MESSAGE = 'Unable to upload highlight images right now.';
const HIGHLIGHTS_REMOVE_ERROR_MESSAGE = 'Unable to remove highlight images right now.';

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

function createErrorResponse(error, fallback) {
  return {
    success: false,
    error: error?.message || fallback,
    errorCode: error?.code ?? null,
    errorDetails: error?.details ?? null,
    errorHint: error?.hint ?? null,
  };
}

function normalizeFiles(files) {
  if (!files) {
    return [];
  }

  return Array.from(files).filter(Boolean);
}

function sanitizeFileName(fileName, fallbackName) {
  return (
    normalizeText(fileName)
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || fallbackName
  );
}

function createStoragePath({ userId, folder, file, index }) {
  const timestamp = Date.now();
  const uniqueId = globalThis.crypto?.randomUUID?.() || `${timestamp}-${index}`;
  const safeFileName = sanitizeFileName(file?.name, `${folder}-${index + 1}`);

  return `${userId}/${folder}/${timestamp}-${uniqueId}-${safeFileName}`;
}

function getPublicUrl(bucketName, filePath) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}

async function uploadFiles({ bucketName, userId, files, folder, fallbackError }) {
  const normalizedFiles = normalizeFiles(files);

  if (normalizedFiles.length === 0) {
    return {
      success: true,
      data: [],
    };
  }

  const uploadedUrls = [];

  for (const [index, file] of normalizedFiles.entries()) {
    const storagePath = createStoragePath({ userId, folder, file, index });
    const { error } = await supabase.storage.from(bucketName).upload(storagePath, file);

    if (error) {
      return createErrorResponse(error, fallbackError);
    }

    uploadedUrls.push(getPublicUrl(bucketName, storagePath));
  }

  return {
    success: true,
    data: uploadedUrls,
  };
}

function getBucketAndPathFromUrl(url) {
  const normalizedUrl = normalizeText(url);

  if (!normalizedUrl) {
    return null;
  }

  const publicObjectPattern = /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/;
  const match = normalizedUrl.match(publicObjectPattern);

  if (!match) {
    return null;
  }

  const [, bucketName, encodedPath] = match;

  if (bucketName !== HIGHLIGHTS_BUCKET) {
    return null;
  }

  return {
    bucketName,
    filePath: decodeURIComponent(encodedPath),
  };
}

export async function uploadAvatar({ userId, file } = {}) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId || !file) {
    return {
      success: false,
      error: AVATAR_UPLOAD_ERROR_MESSAGE,
    };
  }

  const uploadResult = await uploadFiles({
    bucketName: AVATAR_BUCKET,
    userId,
    files: [file],
    folder: 'avatar',
    fallbackError: AVATAR_UPLOAD_ERROR_MESSAGE,
  });

  if (!uploadResult.success) {
    return uploadResult;
  }

  return {
    success: true,
    data: uploadResult.data[0] ?? null,
  };
}

export async function uploadHighlightImages({ userId, files } = {}) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  if (!userId) {
    return {
      success: false,
      error: HIGHLIGHTS_UPLOAD_ERROR_MESSAGE,
    };
  }

  return uploadFiles({
    bucketName: HIGHLIGHTS_BUCKET,
    userId,
    files,
    folder: 'highlights',
    fallbackError: HIGHLIGHTS_UPLOAD_ERROR_MESSAGE,
  });
}

export async function removeHighlightImages(urls = []) {
  const clientStatus = ensureSupabaseClient();

  if (!clientStatus.success) {
    return clientStatus;
  }

  const groupedPaths = new Map();

  urls
    .map((url) => getBucketAndPathFromUrl(url))
    .filter(Boolean)
    .forEach(({ bucketName, filePath }) => {
      const existingPaths = groupedPaths.get(bucketName) ?? [];
      existingPaths.push(filePath);
      groupedPaths.set(bucketName, existingPaths);
    });

  for (const [bucketName, filePaths] of groupedPaths.entries()) {
    if (filePaths.length === 0) {
      continue;
    }

    const { error } = await supabase.storage.from(bucketName).remove(filePaths);

    if (error) {
      return createErrorResponse(error, HIGHLIGHTS_REMOVE_ERROR_MESSAGE);
    }
  }

  return {
    success: true,
    data: null,
  };
}
