import axios from 'axios';

// 1. Automatically detect if we are running locally or live on Vercel
const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000/api'                          // Local Backend Port
  : 'https://clinicalmanagementsystem-2ojw.onrender.com/api'; // Your ACTUAL Live Render URL

console.log("DEBUG: Running in mode:", import.meta.env.MODE);
console.log("DEBUG: Axios is communicating with:", BASE_URL);

// 2. Create the Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor (Keeps your token handling working perfectly)
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('cms_user');
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;