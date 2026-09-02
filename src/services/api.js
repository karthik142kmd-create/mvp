const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('lm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Request Failed');
    return data;
  },

  async post(endpoint, body) {
    const isFormData = body instanceof FormData;
    const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Request Failed');
    return data;
  },

  async put(endpoint, body) {
    const isFormData = body instanceof FormData;
    const headers = isFormData ? getAuthHeaders() : { 'Content-Type': 'application/json', ...getAuthHeaders() };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Request Failed');
    return data;
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Request Failed');
    return data;
  },
};
