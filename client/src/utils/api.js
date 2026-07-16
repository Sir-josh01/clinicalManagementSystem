import axios from 'axios';

// 1. Grab the environment variable from Vite
const envUrl = import.meta.env.VITE_API_URL;

// 2. Print it to the browser console so we can debug it live!
console.log("DEBUG: Raw VITE_API_URL read by Vite:", envUrl);

// 3. Fallback logic: If envUrl exists, use it. Otherwise, default to localhost.
const BASE_URL = envUrl ? envUrl : 'http://localhost:5000/api';

console.log("DEBUG: Final BASE_URL being used by Axios:", BASE_URL);

// Detect if the app is currently running on your local machine
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor
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