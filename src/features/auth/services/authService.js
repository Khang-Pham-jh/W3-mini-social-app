import { isSupabaseConfigured, supabase, supabaseAuthRedirectUrl } from '../../../libs/supabase';

const DUPLICATE_EMAIL_MESSAGE = 'An account with this email already exists.';
const INVALID_CREDENTIALS_MESSAGE = 'Email or password is incorrect.';
const GENERIC_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const MISSING_SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are missing. Please configure the app before signing in.';
const SIGNUP_UNAVAILABLE_MESSAGE = 'Sign up is currently unavailable. Please try again later.';
const TOO_MANY_ATTEMPTS_MESSAGE = 'Too many attempts. Please wait a moment and try again.';
const EMAIL_CONFIRMATION_DISABLED_MESSAGE =
  'Supabase email confirmation must be disabled for this training task before signup can create an active session.';

function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function normalizeText(value) {
  return String(value ?? '').trim();
}

function mapSignupError(error) {
  if (!error) {
    return {
      form: GENERIC_AUTH_ERROR_MESSAGE,
    };
  }

  const message = String(error.message ?? '').toLowerCase();
  const code = String(error.code ?? '').toLowerCase();

  if (
    code.includes('user_already_exists') ||
    message.includes('already registered') ||
    message.includes('already exists')
  ) {
    return {
      email: DUPLICATE_EMAIL_MESSAGE,
    };
  }

  if (message.includes('signup is disabled')) {
    return {
      form: SIGNUP_UNAVAILABLE_MESSAGE,
    };
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return {
      form: TOO_MANY_ATTEMPTS_MESSAGE,
    };
  }

  if (message.includes('database error saving new user')) {
    return {
      form: 'We could not create your account right now. Please try again later.',
    };
  }

  if (message.includes('email') && message.includes('invalid')) {
    return {
      email: 'Please enter a valid email address.',
    };
  }

  if (message.includes('password') && message.includes('at least')) {
    return {
      password: 'Password does not meet the minimum requirements.',
    };
  }

  return {
    form: GENERIC_AUTH_ERROR_MESSAGE,
  };
}

function mapLoginError(error) {
  const message = String(error?.message ?? '').toLowerCase();

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return {
      form: TOO_MANY_ATTEMPTS_MESSAGE,
    };
  }

  return {
    form: INVALID_CREDENTIALS_MESSAGE,
  };
}

export async function signUpWithPassword(formData) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      errors: {
        form: MISSING_SUPABASE_CONFIG_MESSAGE,
      },
    };
  }

  const normalizedFormData = {
    name: normalizeText(formData.name),
    email: normalizeEmail(formData.email),
    password: String(formData.password ?? ''),
    positions: Array.isArray(formData.positions)
      ? formData.positions.map((position) => normalizeText(position)).filter(Boolean)
      : [],
  };

  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedFormData.email,
      password: normalizedFormData.password,
      options: {
        emailRedirectTo: supabaseAuthRedirectUrl,
        data: {
          name: normalizedFormData.name,
          positions: normalizedFormData.positions,
        },
      },
    });

    if (error) {
      return {
        success: false,
        errors: mapSignupError(error),
      };
    }

    if (!data.session) {
      return {
        success: false,
        requiresEmailConfirmation: true,
        errors: {
          form: EMAIL_CONFIRMATION_DISABLED_MESSAGE,
        },
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch {
    return {
      success: false,
      errors: {
        form: GENERIC_AUTH_ERROR_MESSAGE,
      },
    };
  }
}

export async function loginWithPassword(formData) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      errors: {
        form: MISSING_SUPABASE_CONFIG_MESSAGE,
      },
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(formData.email),
      password: String(formData.password ?? ''),
    });

    if (error) {
      return {
        success: false,
        errors: mapLoginError(error),
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch {
    return {
      success: false,
      errors: {
        form: GENERIC_AUTH_ERROR_MESSAGE,
      },
    };
  }
}

export async function logoutUser() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      errors: {
        form: MISSING_SUPABASE_CONFIG_MESSAGE,
      },
    };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      errors: {
        form: GENERIC_AUTH_ERROR_MESSAGE,
      },
    };
  }

  return {
    success: true,
  };
}
