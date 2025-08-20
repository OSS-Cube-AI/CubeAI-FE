const USER_ID_KEY = 'user_id';
const DEFAULT_USER_ID = 'anonymous';

export function validateUserId(id: string): boolean {
  if (!id) return false;
  if (id.length > 50) return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export function getUserId(): string {
  try {
    const url = new URL(window.location.href);
    const fromQuery = url.searchParams.get('user_id');
    if (fromQuery && validateUserId(fromQuery)) {
      localStorage.setItem(USER_ID_KEY, fromQuery);
      return fromQuery;
    }
  } catch {}

  try {
    const stored = localStorage.getItem(USER_ID_KEY);
    if (stored && validateUserId(stored)) return stored;
  } catch {}

  return DEFAULT_USER_ID;
}

export function setUserId(id: string): void {
  if (!validateUserId(id)) throw new Error('Invalid user_id');
  localStorage.setItem(USER_ID_KEY, id);
}
