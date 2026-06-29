import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
  updateSettings: (data) => api.put('/auth/settings', data),
  deleteAccount: () => api.delete('/auth/account'),
};

export const notesApi = {
  getAll: (params) => api.get('/notes', { params }),
  getOne: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  toggleArchive: (id) => api.put(`/notes/${id}/archive`),
  toggleFavorite: (id) => api.put(`/notes/${id}/favorite`),
  togglePin: (id) => api.put(`/notes/${id}/pin`),
  getStats: () => api.get('/notes/stats'),
};

export default api;
