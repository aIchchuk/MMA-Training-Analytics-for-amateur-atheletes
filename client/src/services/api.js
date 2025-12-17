import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error?.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const fetchAthletes = async () => {
  const { data } = await api.get('/athletes');
  return data;
};

export const createAthlete = async (payload) => {
  const { data } = await api.post('/athletes', payload);
  return data;
};

export const fetchSessions = async (athleteId, limit = 20) => {
  const { data } = await api.get('/sessions', {
    params: { athlete: athleteId, limit },
  });
  return data;
};

export const createSession = async (payload) => {
  const { data } = await api.post('/sessions', payload);
  return data;
};

export const fetchAnalytics = async (athleteId, days = 30) => {
  if (!athleteId) return null;
  const { data } = await api.get(`/analytics/${athleteId}`, { params: { days } });
  return data;
};

export default api;

