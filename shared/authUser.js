export function toAppUser(user) {
  return user && { id: user.id, email: user.email, name: user.user_metadata?.name || user.email?.split('@')[0] || 'User' };
}

export function isTransientAuthError(error) {
  return error?.name === 'AuthRetryableFetchError' || error?.status === 0 || error?.status === 408 || error?.status === 429 || error?.status >= 500;
}
