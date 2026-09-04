const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('lm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  let data = null;
  const text = await res.text().catch(() => '');

  if (text && text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      (res.status === 500 || res.status === 502 || res.status === 504
        ? 'Cannot connect to backend server. Please make sure the backend is running.'
        : res.status === 404
        ? 'Backend API endpoint not found (404).'
        : `Request failed with status ${res.status}`);
    throw new Error(errorMsg);
  }

  if (!data && text && text.trim().startsWith('<')) {
    throw new Error('Received HTML instead of JSON from API. Backend server may be offline or misconfigured.');
  }

  return data;
};

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  },

  async post(endpoint, body) {
    const isFormData = body instanceof FormData;
    const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async put(endpoint, body) {
    const isFormData = body instanceof FormData;
    const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(res);
  },
};
