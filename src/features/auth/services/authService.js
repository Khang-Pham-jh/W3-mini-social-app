import { isSupabaseConfigured, supabase, supabaseAuthRedirectUrl } from '../../../libs/supabase';
import { normalizeEmail, normalizeText } from '../../../shared/utils/text';

const DUPLICATE_EMAIL_MESSAGE = 'An account with this email already exists.';
const INVALID_CREDENTIALS_MESSAGE = 'Email or password is incorrect.';
const GENERIC_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';
const MISSING_SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are missing. Please configure the app before signing in.';
const SIGNUP_UNAVAILABLE_MESSAGE = 'Sign up is currently unavailable. Please try again later.';
const TOO_MANY_ATTEMPTS_MESSAGE = 'Too many attempts. Please wait a moment and try again.';
const EMAIL_CONFIRMATION_DISABLED_MESSAGE =
  'Supabase email confirmation must be disabled for this training task before signup can create an active session.';

function getErrorCode(error) {
  return String(error?.code ?? '').toLowerCase();
}

function mapSignupError(error) {
  if (!error) {
    return {
      form: GENERIC_AUTH_ERROR_MESSAGE,
    };
  }

  const code = getErrorCode(error);

  if (code === 'user_already_exists') {
    return {
      email: DUPLICATE_EMAIL_MESSAGE,
    };
  }

  if (code === 'signup_disabled' || code === 'email_provider_disabled') {
    return {
      form: SIGNUP_UNAVAILABLE_MESSAGE,
    };
  }

  if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') {
    return {
      form: TOO_MANY_ATTEMPTS_MESSAGE,
    };
  }

  if (code === 'email_address_invalid') {
    return {
      email: 'Please enter a valid email address.',
    };
  }

  if (code === 'weak_password') {
    return {
      password: 'Password does not meet the minimum requirements.',
    };
  }

  if (code === 'unexpected_failure') {
    return {
      form: 'We could not create your account right now. Please try again later.',
    };
  }

  return {
    form: GENERIC_AUTH_ERROR_MESSAGE,
  };
}

function mapLoginError(error) {
  const code = getErrorCode(error);

  if (code === 'invalid_credentials') {
    return {
      form: INVALID_CREDENTIALS_MESSAGE,
    };
  }

  if (code === 'email_not_confirmed') {
    return {
      form: 'Please confirm your email before logging in.',
    };
  }

  if (code === 'over_request_rate_limit') {
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
