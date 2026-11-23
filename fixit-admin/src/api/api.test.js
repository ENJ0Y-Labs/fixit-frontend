import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from './client.js';
import { authApi } from './auth.js';
import { adminApi } from './admin.js';

afterEach(() => vi.restoreAllMocks());

describe('admin API modules', () => {
    it('uses the proposed shared login endpoint without exposing public admin registration', async () => {
        const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { user: { id: 'a-1' } } });

        await authApi.login({ email: 'admin@example.test', password: 'secret' });

        expect(spy).toHaveBeenCalledWith('auth/login', {
            email: 'admin@example.test',
            password: 'secret',
        });
        expect(authApi.register).toBeUndefined();
    });

    it('records verification decisions through the admin-only endpoint', async () => {
        const spy = vi.spyOn(apiClient, 'post').mockResolvedValue({ data: { id: 'verification-1' } });
        const decision = { decision: 'approved', reason: 'Documents reviewed' };

        await adminApi.decideVerification('verification-1', decision);

        expect(spy).toHaveBeenCalledWith('admin/verifications/verification-1/decision', decision);
    });

    it('encodes customer identifiers before placing them in a path', async () => {
        const spy = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: {} });

        await adminApi.getCustomer('customer/one');

        expect(spy).toHaveBeenCalledWith('admin/customers/customer%2Fone');
    });
});
