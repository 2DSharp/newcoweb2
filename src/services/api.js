import { ApiResponse } from '../types/api';
import axios from 'axios';

// API Configuration
const API_CONFIG = {
    baseURL: process.env.BASE_API_BASEURL,
    timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
    headers: {
        'Content-Type': 'application/json',
    },
};



// Create Axios instance
const apiClient = axios.create({
    baseURL: "http://localhost:8080"
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API Services
const apiService = {
    // Auth endpoints
    auth: {
        login: async (credentials) => {
            const response = await apiClient.post(API_CONFIG.baseURL + '/auth/login', credentials);
            return response.data;
        },
        register: async (userData) => {
            const response = await apiClient.post('/seller/accounts/register', userData);
            return response.data;
        },
        verifyOtp: async (data) => {
            const response = await apiClient.post('/auth/verify-otp', data);
            return response.data;
        },
    },

    // Store endpoints
    store: {
        create: async (storeData) => {
            const response = await apiClient.post('/stores', storeData);
            return response.data;
        },
        update: async (storeId, storeData) => {
            const response = await apiClient.put(`/stores/${storeId}`, storeData);
            return response.data;
        },
        getDetails: async (storeId) => {
            const response = await apiClient.get(`/stores/${storeId}`);
            return response.data;
        },
    },

    // User profile endpoints
    profile: {
        get: async () => {
            const response = await apiClient.get('/profile');
            return response.data;
        },
        update: async (profileData) => {
            const response = await apiClient.put('/profile', profileData);
            return response.data;
        },
    },
};

export default apiService;
