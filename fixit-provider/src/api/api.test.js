import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './client.js';
import { authApi } from './auth.js';
import { providerApi } from './provider.js';

afterEach(() => vi.restoreAllMocks());

describe('provider API modules', () => {
    it('uses the proposed shared login endpoint', async () => {
        const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { user: { id: 'p-1' } } });
        const credentials = { email: 'provider@example.test', password: 'secret' };

        await authApi.login(credentials);

        expect(spy).toHaveBeenCalledWith('auth/login', credentials);
    });

    it('submits bids through the provider job resource', async () => {
        const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { id: 'bid-1' } });
        const bid = { amount: 15000, message: 'I can do this job.' };

        await providerApi.submitBid('job-1', bid);

        expect(spy).toHaveBeenCalledWith('provider/jobs/job-1/bids', bid);
    });

    it('encodes service identifiers before placing them in a path', async () => {
        const spy = vi.spyOn(apiClient, 'delete').mockResolvedValue(null);

        await providerApi.removeService('service/one');

        expect(spy).toHaveBeenCalledWith('provider/me/services/service%2Fone');
    });
});
