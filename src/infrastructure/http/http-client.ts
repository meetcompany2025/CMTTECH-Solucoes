/**
 * HTTP Client - Axios instance with interceptors for authentication
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from '../storage/token-storage';

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    console.error('VITE_API_BASE_URL is not defined in environment variables');
}

/**
 * Create axios instance with base configuration
 */
export const httpClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - Add authorization token to requests
 */
httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = TokenStorage.getAccessToken();

        // Add auth token for all requests except public endpoints
        const isPublicEndpoint = (
            config.url?.includes('/categories/') || 
            config.url?.includes('/products/') ||
            config.url?.includes('/auth/auth') ||
            config.url?.includes('/auth/register')
        );
        
        if (token && config.headers && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors and token refresh
 */
httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear tokens and redirect to auth
            TokenStorage.clearTokens();

            // Dispatch custom event for auth context to handle
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        return Promise.reject(error);
    }
);

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Transform axios error to ApiError
 */
export function transformAxiosError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;

        if (axiosError.response) {
            // Server responded with error
            const message = axiosError.response.data?.detail
                || axiosError.response.data?.message
                || axiosError.message;

            return new ApiError(
                axiosError.response.status,
                message,
                axiosError.response.data
            );
        } else if (axiosError.request) {
            // Request made but no response
            return new ApiError(0, 'No response from server. Please check your connection.');
        }
    }

    // Generic error
    return error instanceof Error ? error : new Error('An unknown error occurred');
}
