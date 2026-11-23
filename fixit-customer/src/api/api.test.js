import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './client.js';
import { authApi } from './auth.js';
import { customerApi } from './customer.js';

afterEach(() => vi.restoreAllMocks());

describe('customer API modules', () => {
    it('uses the proposed shared login endpoint', async () => {
        const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { user: { id: 'c-1' } } });
        const credentials = { email: 'customer@example.test', password: 'secret' };

        await authApi.login(credentials);

        expect(spy).toHaveBeenCalledWith('auth/login', credentials);
    });

    it('lists only the authenticated customer jobs through the customer resource', async () => {
        const spy = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { items: [] } });

        await customerApi.listJobs({ status: 'open', limit: 20 });

        expect(spy).toHaveBeenCalledWith('customer/me/jobs', {
            query: { status: 'open', limit: 20 },
        });
    });

    it('encodes resource identifiers before placing them in a path', async () => {
        const spy = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: {} });

        await customerApi.getJob('job/with spaces');

        expect(spy).toHaveBeenCalledWith('customer/me/jobs/job%2Fwith%20spaces');
    });
});
