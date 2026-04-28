const AUTH_BYPASS_PATHS = ['/api/auth/login', '/api/auth/register'];
const UNAUTHORIZED_EVENT = 'dochub:unauthorized';

function getStoredToken() {
  try {
    const raw = localStorage.getItem('dochub_user');
    if (!raw) {
      return null;
    }

    const user = JSON.parse(raw);
    return user?.token || null;
  } catch {
    return null;
  }
}

function shouldBypassUnauthorized(url) {
  return AUTH_BYPASS_PATHS.some((path) => url.includes(path));
}

export async function apiFetch(input, init = {}) {
  const url = typeof input === 'string' ? input : input?.url || '';
  const headers = new Headers(init.headers || {});
  const token = getStoredToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401 && !shouldBypassUnauthorized(url)) {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }

  return response;
}

export { UNAUTHORIZED_EVENT };
