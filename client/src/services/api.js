const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${options.method || 'GET'} ${url}]:`, err);
    throw err;
  }
}

export const api = {
  // AI Assistant Chatbot
  assistant: {
    chat: (message) =>
      fetchJson(`${API_BASE}/assistant/chat`, {
        method: 'POST',
        body: JSON.stringify({ message })
      })
  },

  // AI Specialty Navigation
  ai: {
    classify: (prompt) =>
      fetchJson(`${API_BASE}/ai/specialty`, {
        method: 'POST',
        body: JSON.stringify({ prompt })
      })
  },

  // Doctors & Search
  doctors: {
    search: (params = {}) => {
      const query = new URLSearchParams();
      if (params.specialty) query.append('specialty', params.specialty);
      if (params.lat) query.append('lat', params.lat);
      if (params.lng) query.append('lng', params.lng);
      if (params.priority) query.append('priority', params.priority);
      if (params.maxFee) query.append('maxFee', params.maxFee);
      if (params.maxDistance) query.append('maxDistance', params.maxDistance);
      if (params.onlyOpen) query.append('onlyOpen', params.onlyOpen);
      if (params.minRating) query.append('minRating', params.minRating);

      return fetchJson(`${API_BASE}/doctors/search?${query.toString()}`);
    },
    getAll: (specialty) => {
      const query = specialty ? `?specialty=${encodeURIComponent(specialty)}` : '';
      return fetchJson(`${API_BASE}/doctors${query}`);
    },
    getById: (id) => fetchJson(`${API_BASE}/doctors/${id}`),
    updateStatus: (id, status, is_accepting) =>
      fetchJson(`${API_BASE}/doctors/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, is_accepting })
      }),
    updateProfile: (id, data) =>
      fetchJson(`${API_BASE}/doctors/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
  },

  // Digital Queue
  queue: {
    join: (data) =>
      fetchJson(`${API_BASE}/queue/join`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getDoctorQueue: (doctorId) => fetchJson(`${API_BASE}/queue/${doctorId}`),
    getPatientQueue: (patientId) => fetchJson(`${API_BASE}/queue/patient/${patientId}`),
    callNext: (doctorId) =>
      fetchJson(`${API_BASE}/queue/call-next`, {
        method: 'POST',
        body: JSON.stringify({ doctorId })
      }),
    complete: (doctorId) =>
      fetchJson(`${API_BASE}/queue/complete`, {
        method: 'POST',
        body: JSON.stringify({ doctorId })
      }),
    skip: (data) =>
      fetchJson(`${API_BASE}/queue/skip`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    leave: (data) =>
      fetchJson(`${API_BASE}/queue/leave`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    resetDemo: () =>
      fetchJson(`${API_BASE}/queue/reset`, {
        method: 'POST'
      })
  },

  // Authentication
  auth: {
    login: (data) =>
      fetchJson(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    register: (data) =>
      fetchJson(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
  }
};
