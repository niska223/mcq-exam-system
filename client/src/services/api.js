import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: (userId) => api.get(`/auth/profile/${userId}`),
};

// Exam API calls
export const examAPI = {
  getAllExams: () => api.get('/exams'),
  getExamById: (examId) => api.get(`/exams/${examId}`),
};

// Result API calls
export const resultAPI = {
  submitResult: (resultData) => api.post('/results/submit', resultData),
  getResultById: (resultId) => api.get(`/results/${resultId}`),
  getUserResults: (userId) => api.get(`/results/user/${userId}`),
};

export default api;
