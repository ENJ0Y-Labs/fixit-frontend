import { apiClient } from './client.js';

/**
 * Admin resource API.
 * Every route requires backend-side admin authorization. Client-side role
 * checks are not a security boundary.
 */
export const adminApi = {
    getDashboard: (query) => apiClient.get('admin/dashboard', { query }),
    listCustomers: (query) => apiClient.get('admin/customers', { query }),
    getCustomer: (customerId) => apiClient.get(`admin/customers/${encodeURIComponent(customerId)}`),
    updateCustomer: (customerId, payload) => apiClient.patch(`admin/customers/${encodeURIComponent(customerId)}`, payload),
    listProviders: (query) => apiClient.get('admin/providers', { query }),
    getProvider: (providerId) => apiClient.get(`admin/providers/${encodeURIComponent(providerId)}`),
    updateProvider: (providerId, payload) => apiClient.patch(`admin/providers/${encodeURIComponent(providerId)}`, payload),
    listVerifications: (query) => apiClient.get('admin/verifications', { query }),
    decideVerification: (verificationId, payload) => apiClient.post(`admin/verifications/${encodeURIComponent(verificationId)}/decision`, payload),
    listJobs: (query) => apiClient.get('admin/jobs', { query }),
    getJob: (jobId) => apiClient.get(`admin/jobs/${encodeURIComponent(jobId)}`),
    updateJob: (jobId, payload) => apiClient.patch(`admin/jobs/${encodeURIComponent(jobId)}`, payload),
    listDisputes: (query) => apiClient.get('admin/disputes', { query }),
    getDispute: (disputeId) => apiClient.get(`admin/disputes/${encodeURIComponent(disputeId)}`),
    updateDispute: (disputeId, payload) => apiClient.patch(`admin/disputes/${encodeURIComponent(disputeId)}`, payload),
    listSupportCases: (query) => apiClient.get('admin/support-cases', { query }),
    replyToSupportCase: (caseId, payload) => apiClient.post(`admin/support-cases/${encodeURIComponent(caseId)}/messages`, payload),
    listCategories: (query) => apiClient.get('admin/categories', { query }),
    createCategory: (payload) => apiClient.post('admin/categories', payload),
    updateCategory: (categoryId, payload) => apiClient.patch(`admin/categories/${encodeURIComponent(categoryId)}`, payload),
    deleteCategory: (categoryId) => apiClient.delete(`admin/categories/${encodeURIComponent(categoryId)}`),
    getAnalytics: (query) => apiClient.get('admin/analytics', { query }),
    getSettings: () => apiClient.get('admin/settings'),
    updateSettings: (payload) => apiClient.patch('admin/settings', payload),
    listAuditEvents: (query) => apiClient.get('admin/audit-events', { query }),
    refundPayment: (paymentId, payload) => apiClient.post(`admin/payments/${encodeURIComponent(paymentId)}/refund`, payload),
};
