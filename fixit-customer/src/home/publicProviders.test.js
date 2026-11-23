import { beforeEach, describe, expect, it, vi } from 'vitest';
import { customerApi } from '../api/customer.js';
import { loadPublicProvider, loadPublicProviders, normalizePublicProvider } from './publicProviders.js';

vi.mock('../api/customer.js', () => ({
    customerApi: {
        listProviders: vi.fn(),
        getProvider: vi.fn(),
    },
}));

describe('public provider data', () => {
    beforeEach(() => vi.clearAllMocks());

    it('normalizes only fields supplied by the public API', () => {
        const provider = normalizePublicProvider({
            id: 'provider-1',
            displayName: 'Ada Example',
            headline: 'Electrician',
            category: { name: 'Electrical' },
            serviceAreas: [{ city: 'Port Harcourt', area: 'GRA' }],
        });

        expect(provider).toMatchObject({
            id: 'provider-1',
            name: 'Ada Example',
            job: 'Electrician',
            category: 'ELECTRICAL',
            location: 'GRA',
            rating: null,
            review: null,
            price: null,
            available: false,
            availabilityKnown: false,
            verificationStatus: '',
            source: 'api',
        });
    });

    it('loads API-backed providers without mixing in sample records', async () => {
        customerApi.listProviders.mockResolvedValue({
            data: { items: [{ id: 'provider-2', displayName: 'Bola Example' }] },
        });

        const result = await loadPublicProviders();

        expect(result.source).toBe('api');
        expect(result.providers).toHaveLength(1);
        expect(result.providers[0].name).toBe('Bola Example');
    });

    it('uses isolated sample fixtures when the public endpoint is unavailable', async () => {
        customerApi.listProviders.mockRejectedValue(new Error('API is not configured'));

        const result = await loadPublicProviders();

        expect(result.source).toBe('sample');
        expect(result.providers.length).toBeGreaterThan(0);
        expect(result.providers.every((provider) => provider.source === 'sample')).toBe(true);
        expect(result.error).toBe('API is not configured');
    });

    it('loads a provider profile by its public ID', async () => {
        customerApi.getProvider.mockResolvedValue({
            data: { id: 'provider-3', displayName: 'Chika Example', bio: 'Repairs and installations.' },
        });

        const result = await loadPublicProvider('provider-3');

        expect(customerApi.getProvider).toHaveBeenCalledWith('provider-3');
        expect(result.source).toBe('api');
        expect(result.provider.name).toBe('Chika Example');
        expect(result.provider.description).toBe('Repairs and installations.');
    });
});
