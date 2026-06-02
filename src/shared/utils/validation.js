const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateRequired(value) {
  return String(value ?? '').trim().length > 0;
}

export function validateEmailFormat(email) {
  return EMAIL_PATTERN.test(String(email ?? '').trim());
}

export function validatePasswordLength(password, minLength = MIN_PASSWORD_LENGTH) {
  return String(password ?? '').length >= minLength;
}

export function createLoginErrors() {
  return {
    email: '',
    password: '',
    form: '',
  };
}

export function createSignupErrors() {
  return {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    form: '',
  };
}

export function validateLoginForm(formData) {
  const errors = createLoginErrors();

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!validateEmailFormat(formData.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required.';
  } else if (!validatePasswordLength(formData.password)) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return {
    isValid: Object.values(errors).every((value) => value === ''),
    errors,
  };
}

export function validateSignupForm(formData) {
  const errors = createSignupErrors();

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
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!validateRequired(formData.confirmPassword)) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!validateRequired(formData.position)) {
    errors.position = 'Please select a position.';
  }

  return {
    isValid: Object.values(errors).every((value) => value === ''),
    errors,
  };
}
