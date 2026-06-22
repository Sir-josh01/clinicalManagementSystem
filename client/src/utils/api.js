import axios from 'axios';

// Create a configured instance pointing directly to our backend server URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Intercepts every outgoing request and injects the authorization token
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