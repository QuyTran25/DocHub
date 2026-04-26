const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');

const UNAUTHORIZED_EVENT = 'dochub:unauthorized';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('dochub_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearStoredSession = () => {
  try {
    localStorage.removeItem('dochub_user');
  } catch {
    // Ignore storage errors in private mode browsers.
  }
};

const buildApiUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!API_BASE_URL) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiFetch = async (path, options = {}, config = {}) => {
  const { skipUnauthorizedHandler = false } = config;
  const headers = new Headers(options.headers || {});
  const token = getStoredUser()?.token;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
  });

  if (response.status === 401 && !skipUnauthorizedHandler) {
    clearStoredSession();
    window.dispatchEvent(
      new CustomEvent(UNAUTHORIZED_EVENT, {
        detail: {
          status: 401,
          message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        },
      }),
    );
  }

  return response;
};

export const unauthorizedEventName = UNAUTHORIZED_EVENT;
