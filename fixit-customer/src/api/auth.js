import { apiClient } from './client.js';

/**
 * Customer authentication endpoints from the proposed FixIt v1 contract.
 * The backend must implement these routes and its cookie/CSRF/CORS policy.
 */
export const authApi = {
    register: (payload) => apiClient.post('auth/register', payload),
    login: (credentials) => apiClient.post('auth/login', credentials),
    logout: () => apiClient.post('auth/logout'),
    getCurrentUser: () => apiClient.get('auth/me'),
    requestPasswordReset: (payload) => apiClient.post('auth/password/forgot', payload),
    resetPassword: (payload) => apiClient.post('auth/password/reset', payload),
    requestVerificationCode: (payload) => apiClient.post('auth/verification/request', payload),
    confirmVerificationCode: (payload) => apiClient.post('auth/verification/confirm', payload),
};
