import axios from 'axios';

const API = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically inject JWT tokens into headers
API.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');
        const token = userToken || adminToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers.token = token; // Legacy support for headers.token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
