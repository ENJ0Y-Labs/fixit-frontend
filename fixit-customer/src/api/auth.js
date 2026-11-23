import { apiClient } from './client.js';

/**
 * Proposed authentication endpoints. The backend must implement and confirm
 * these routes and the session/CSRF contract before the UI calls them.
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
