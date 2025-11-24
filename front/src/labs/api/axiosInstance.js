import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Update if needed
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

export default api;
