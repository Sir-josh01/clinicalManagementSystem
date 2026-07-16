import axios from 'axios';

// Detect if the app is currently running on your local machine
// const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Automatically points to your live Render server or local fallback
// const BASE_URL = isLocalhost 
//     ? 'http://localhost:5000/api' 
//     : 'https://clinicalmanagementsystem-2ojw.onrender.com/api'; // Added /api here!

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