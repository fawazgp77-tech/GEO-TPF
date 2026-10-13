export function authenticatedUser(response, expectedEmail) {
  if (!response?.user?.id) throw new Error('Sign-in could not be confirmed. Please try again.');
  if (expectedEmail && String(response.user.email || '').trim().toLowerCase() !== expectedEmail.trim().toLowerCase())
    throw new Error('The signed-in account does not match this email. Use the confirmation link for this account, then try again.');
  return response.user;
}

export function applyOtpDigits(current, index, value) {
  const digits = String(value).replace(/\D/g, '').slice(0, 6);
  const next = [...current];
  if (!digits) { next[index] = ''; return next; }
  for (let position = 0; position < digits.length && index + position < 6; position++) next[index + position] = digits[position];
  return next;
}
