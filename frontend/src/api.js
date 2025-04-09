import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 5000, // add timeout to handle slow responses
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;