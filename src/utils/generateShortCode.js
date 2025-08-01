export function generateShortCode(existingCodes) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = [...Array(6)].map(() => charset[Math.floor(Math.random() * charset.length)]).join('');
  } while (existingCodes.has(code));
  return code;
}
