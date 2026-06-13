export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function required(value) {
  return Boolean(String(value || '').trim());
}

export function minLength(value, length) {
  return String(value || '').length >= length;
}
