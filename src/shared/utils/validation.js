const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 10;

export function validateRequired(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value ?? '').trim().length > 0;
}

export function validateEmailFormat(email) {
  return EMAIL_PATTERN.test(String(email ?? '').trim());
}

export function validatePasswordLength(password) {
  const normalizedPassword = String(password ?? '');
  return (
    normalizedPassword.length >= MIN_PASSWORD_LENGTH &&
    normalizedPassword.length <= MAX_PASSWORD_LENGTH
  );
}

export function validateLoginForm(formData) {
  const errors = {};

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!validateEmailFormat(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required.';
  } else if (!validatePasswordLength(formData.password)) {
    errors.password = 'Password must be 8-10 characters.';
  }

  return errors;
}

export function validateSignupForm(formData) {
  const errors = {};

  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required.';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!validateEmailFormat(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required.';
  } else if (!validatePasswordLength(formData.password)) {
    errors.password = 'Password must be 8-10 characters.';
  }

  if (!validateRequired(formData.positions)) {
    errors.positions = 'Please select at least one position.';
  }

  return errors;
}
