import { handleMockGet, handleMockPost } from './mockStore';

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
    const err = new Error(errorMsg);
    err.status = res.status;
    throw err;
  }

  if (!data && text && text.trim().startsWith('<')) {
    const err = new Error('Received HTML instead of JSON from API.');
    err.status = 404;
    throw err;
  }

  return data;
};

export const api = {
  async get(endpoint) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      return await handleResponse(res);
    } catch (err) {
      const mock = await handleMockGet(endpoint);
      if (mock !== null) return mock;
      throw err;
    }
  },

  async post(endpoint, body) {
    try {
      const isFormData = body instanceof FormData;
      const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });
      return await handleResponse(res);
    } catch (err) {
      const mock = await handleMockPost(endpoint, body);
      if (mock !== null) return mock;
      throw err;
    }
  },

  async put(endpoint, body) {
    try {
      const isFormData = body instanceof FormData;
      const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'PUT',
        headers,
        body: isFormData ? body : JSON.stringify(body),
      });
      return await handleResponse(res);
    } catch (err) {
      if (endpoint.includes('/notifications/') && endpoint.includes('/read')) {
        return { message: 'Notification marked as read.' };
      }
      throw err;
    }
  },

  async delete(endpoint) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      return await handleResponse(res);
    } catch (err) {
      throw err;
    }
  },
};
