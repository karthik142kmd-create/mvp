const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('lm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const errorMsg =
      data?.message ||
      (res.status === 500 || res.status === 502 || res.status === 504
        ? 'Cannot connect to backend server. Please make sure the backend is running on port 5000.'
        : `Request failed with status ${res.status}`);
    throw new Error(errorMsg);
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
