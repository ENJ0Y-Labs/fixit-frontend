import { apiClient } from './client.js';

/**
 * Provider resource API.
 * Paths are proposed in the repository root README and require a backend
 * implementation that follows that contract.
 */
export const providerApi = {
    getProfile: () => apiClient.get('provider/me'),
    updateProfile: (payload) => apiClient.patch('provider/me', payload),
    listServices: () => apiClient.get('provider/me/services'),
    createService: (payload) => apiClient.post('provider/me/services', payload),
    updateService: (serviceId, payload) => apiClient.patch(`provider/me/services/${encodeURIComponent(serviceId)}`, payload),
    removeService: (serviceId) => apiClient.delete(`provider/me/services/${encodeURIComponent(serviceId)}`),
    getAvailability: () => apiClient.get('provider/me/availability'),
    updateAvailability: (payload) => apiClient.put('provider/me/availability', payload),
    listOpportunities: (query) => apiClient.get('provider/jobs', { query }),
    getOpportunity: (jobId) => apiClient.get(`provider/jobs/${encodeURIComponent(jobId)}`),
    listBids: (query) => apiClient.get('provider/me/bids', { query }),
    submitBid: (jobId, payload) => apiClient.post(`provider/jobs/${encodeURIComponent(jobId)}/bids`, payload),
    listMyJobs: (query) => apiClient.get('provider/me/jobs', { query }),
    updateJobProgress: (jobId, payload) => apiClient.patch(`provider/me/jobs/${encodeURIComponent(jobId)}/progress`, payload),
    listConversations: (query) => apiClient.get('provider/me/conversations', { query }),
    listMessages: (conversationId, query) => apiClient.get(`provider/me/conversations/${encodeURIComponent(conversationId)}/messages`, { query }),
    sendMessage: (conversationId, payload) => apiClient.post(`provider/me/conversations/${encodeURIComponent(conversationId)}/messages`, payload),
    getEarnings: (query) => apiClient.get('provider/me/earnings', { query }),
    listReviews: (query) => apiClient.get('provider/me/reviews', { query }),
    getSettings: () => apiClient.get('provider/me/settings'),
    updateSettings: (payload) => apiClient.patch('provider/me/settings', payload),
    getDashboard: () => apiClient.get('provider/me/dashboard'),
    listNotifications: (query) => apiClient.get('provider/me/notifications', { query }),
};
