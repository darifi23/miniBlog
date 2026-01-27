import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
