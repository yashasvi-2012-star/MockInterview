const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const AUTH_TOKEN_KEY = 'prepify_token';

function getErrorMessage(error) {
  const detail = error?.detail || error?.message;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const location = Array.isArray(item.loc) ? item.loc.filter((part) => part !== 'body').join('.') : '';
        return [location, item.msg].filter(Boolean).join(': ');
      })
      .filter(Boolean)
      .join(' ');
  }

  if (typeof detail === 'string') {
    return detail;
  }

  return 'Something went wrong';
}

async function request(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isFormData = options.body instanceof FormData;
  const { headers: optionHeaders, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...optionHeaders,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const requestError = new Error(getErrorMessage(error));
    requestError.status = response.status;
    throw requestError;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json().catch(() => null);
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  postForm: (path, formData, options) => request(path, { ...options, method: 'POST', body: formData }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
