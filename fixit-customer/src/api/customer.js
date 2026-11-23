import { apiClient } from './client.js';

/**
 * Customer resource API.
 * Paths are proposed in the repository root README and require a backend
 * implementation that follows that contract.
 */
export const customerApi = {
    getProfile: () => apiClient.get('customer/me'),
    updateProfile: (payload) => apiClient.patch('customer/me', payload),
    listCategories: (query) => apiClient.get('public/categories', { query }),
    listServices: (query) => apiClient.get('public/services', { query }),
    listProviders: (query) => apiClient.get('public/providers', { query }),
    getProvider: (providerId) => apiClient.get(`public/providers/${encodeURIComponent(providerId)}`),
    listProviderReviews: (providerId, query) => apiClient.get(`public/providers/${encodeURIComponent(providerId)}/reviews`, { query }),
    listJobs: (query) => apiClient.get('customer/me/jobs', { query }),
    getJob: (jobId) => apiClient.get(`customer/me/jobs/${encodeURIComponent(jobId)}`),
    createJob: (payload) => apiClient.post('customer/me/jobs', payload),
    updateJob: (jobId, payload) => apiClient.patch(`customer/me/jobs/${encodeURIComponent(jobId)}`, payload),
    cancelJob: (jobId, payload = {}) => apiClient.post(`customer/me/jobs/${encodeURIComponent(jobId)}/cancel`, payload),
    listJobBids: (jobId, query) => apiClient.get(`customer/me/jobs/${encodeURIComponent(jobId)}/bids`, { query }),
    acceptBid: (jobId, bidId) => apiClient.post(`customer/me/jobs/${encodeURIComponent(jobId)}/bids/${encodeURIComponent(bidId)}/accept`, {}),
    listConversations: (query) => apiClient.get('customer/me/conversations', { query }),
    listMessages: (conversationId, query) => apiClient.get(`customer/me/conversations/${encodeURIComponent(conversationId)}/messages`, { query }),
    sendMessage: (conversationId, payload) => apiClient.post(`customer/me/conversations/${encodeURIComponent(conversationId)}/messages`, payload),
    listNotifications: (query) => apiClient.get('customer/me/notifications', { query }),
    markNotificationRead: (notificationId) => apiClient.patch(`customer/me/notifications/${encodeURIComponent(notificationId)}`, { read: true }),
    createReview: (jobId, payload) => apiClient.post(`customer/me/jobs/${encodeURIComponent(jobId)}/review`, payload),
    listPayments: (query) => apiClient.get('customer/me/payments', { query }),
    createPaymentIntent: (jobId, payload) => apiClient.post(`customer/me/jobs/${encodeURIComponent(jobId)}/payment-intents`, payload),
    getPayment: (paymentId) => apiClient.get(`customer/me/payments/${encodeURIComponent(paymentId)}`),
    listFavorites: () => apiClient.get('customer/me/favorites'),
    addFavorite: (providerId) => apiClient.put(`customer/me/favorites/${encodeURIComponent(providerId)}`, {}),
    removeFavorite: (providerId) => apiClient.delete(`customer/me/favorites/${encodeURIComponent(providerId)}`),
};
