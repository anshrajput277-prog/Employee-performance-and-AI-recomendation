import axios from 'axios';

// Base Axios instance pointing at backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token from localStorage to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
