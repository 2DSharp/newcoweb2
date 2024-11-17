import { ApiResponse } from '../types/api';
import axios from 'axios';
import {AuthService} from "@/services/authService";

// API Configuration
const API_CONFIG = {
    baseURL: process.env.BASE_API_BASEURL,
    timeout: parseInt(process.env.VITE_API_TIMEOUT || '30000'),
    headers: {
        'Content-Type': 'application/json',
    },
};



// Create Axios instance
const authenticatedApiClient = axios.create({
    baseURL: "http://localhost:8080"
});

const unauthenticatedApiClient = axios.create({
    baseURL: "http://localhost:8080"
});


// Request Interceptor
authenticatedApiClient.interceptors.request.use(
    (config) => {
        if (!localStorage.getItem('auth_data')) {
            return config;
        }

        const token = JSON.parse(localStorage.getItem('auth_data')).accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;

        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor with token refresh
authenticatedApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const authService = AuthService.getInstance();
                const refreshSuccess = await authService.refreshTokens();

                if (refreshSuccess) {
                    // Update the authorization header with new token
                    const newToken = authService.getAuthData()?.accessToken;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Retry the original request with new token
                    return authenticatedApiClient(originalRequest);
                } else {
                    // If refresh failed, clear auth and redirect to login
                    authService.clearAuth();

                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                // If refresh throws an error, clear auth and redirect to login
                const authService = AuthService.getInstance();
                authService.clearAuth();
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
// API Services
const apiService = {

    cms: {
        getStateList: async () => {
            const response = await unauthenticatedApiClient.get('/public/cms/states');
            return response.data;
        }
    },

    // Auth endpoints
    auth: {
        login: async (credentials) => {
            const response = await unauthenticatedApiClient.post('/auth/login', credentials);
            return response.data;
        },

        refreshToken: async (credentials) => {
            const response = await unauthenticatedApiClient.post( '/identity/refresh-token', credentials);
            return response.data;
        },
        register: async (userData) => {
            const response = await unauthenticatedApiClient.post('/seller/accounts/register', userData);
            return response.data;
        },
        verifyOtp: async (data) => {
            const response = await unauthenticatedApiClient.post('/seller/accounts/verify-contact', data);
            return response.data;
        },
    },

    // Store endpoints
    store: {
        create: async (storeData) => {
            const response = await authenticatedApiClient.post('/seller/store/', storeData);
            return response.data;
        },
        update: async (storeId, storeData) => {
            const response = await authenticatedApiClient.put(`/stores/${storeId}`, storeData);
            return response.data;
        },
        getDetails: async (storeId) => {
            const response = await authenticatedApiClient.get(`/stores/${storeId}`);
            return response.data;
        },
    },

    // User profile endpoints
    profile: {
        get: async () => {
            const response = await authenticatedApiClient.get('/profile');
            return response.data;
        },
        update: async (profileData) => {
            const response = await authenticatedApiClient.put('/profile', profileData);
            return response.data;
        },
    },
};

export default apiService;
