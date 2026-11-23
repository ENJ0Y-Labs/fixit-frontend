import { apiClient } from './client.js';

/**
 * Proposed authentication endpoints. Admin accounts are provisioned by an
 * authorized operator; this module intentionally has no public register call.
 */
export const authApi = {
    login: (credentials) => apiClient.post('auth/login', credentials),
    logout: () => apiClient.post('auth/logout'),
    getCurrentUser: () => apiClient.get('auth/me'),
    requestPasswordReset: (payload) => apiClient.post('auth/password/forgot', payload),
    resetPassword: (payload) => apiClient.post('auth/password/reset', payload),
    requestVerificationCode: (payload) => apiClient.post('auth/verification/request', payload),
    confirmVerificationCode: (payload) => apiClient.post('auth/verification/confirm', payload),
};
