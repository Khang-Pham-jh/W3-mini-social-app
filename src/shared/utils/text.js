export function normalizeText(value) {
  return String(value ?? '').trim();
}

export function normalizeEmail(email) {
  return normalizeText(email).toLowerCase();
}
