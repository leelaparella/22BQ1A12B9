export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export function isValidShortCode(code) {
  return /^[a-zA-Z0-9]{3,10}$/.test(code);
}
