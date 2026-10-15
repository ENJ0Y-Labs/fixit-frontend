import { describe, expect, it, vi } from 'vitest';
import { ApiError, createApiClient } from './client.js';

function response({
    status = 200,
    body = { data: { id: 'example-id' } },
    contentType = 'application/json',
    headers = {},
} = {}) {
    const serializedBody = body === null
        ? ''
        : typeof body === 'string'
            ? body
            : JSON.stringify(body);

    const responseHeaders = new Map(Object.entries({
        'content-type': contentType,
        ...Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])),
    }));

    return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
            get: (name) => responseHeaders.get(name.toLowerCase()) || null,
        },
        text: vi.fn().mockResolvedValue(serializedBody),
    };
}

describe('provider API client', () => {
    it('fails clearly when the API base URL is missing', async () => {
        const fetchImpl = vi.fn();
        const client = createApiClient({ baseUrl: '', fetchImpl });

        await expect(client.get('/provider/me')).rejects.toMatchObject({
            name: 'ApiError',
            code: 'API_CONFIG_ERROR',
            status: null,
        });
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('sends GET requests to the configured API base and serializes query parameters', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response());
        const client = createApiClient({
            baseUrl: 'https://api.example.test/api/v1/',
            fetchImpl,
        });

        const result = await client.get('/provider/me/jobs', {
            query: { status: 'active', empty: '', omitted: null, tags: ['a', 'b'] },
        });

        expect(result).toEqual({ data: { id: 'example-id' } });
        expect(fetchImpl).toHaveBeenCalledOnce();

        const [url, options] = fetchImpl.mock.calls[0];
        expect(url).toBe(
            'https://api.example.test/api/v1/provider/me/jobs?status=active&tags=a&tags=b',
        );
        expect(options.method).toBe('GET');
        expect(options.credentials).toBe('same-origin');
        expect(options.headers.get('Accept')).toBe('application/json');
    });

    it('serializes object bodies as JSON and allows credentials to be configured', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response());
        const client = createApiClient({
            baseUrl: 'https://api.example.test/api/v1',
            fetchImpl,
            credentials: 'include',
        });
        const payload = { body: 'Please contact me' };

        await client.post('/provider/me/conversations/123/messages', payload);

        const [, options] = fetchImpl.mock.calls[0];
        expect(options.method).toBe('POST');
        expect(options.credentials).toBe('include');
        expect(options.headers.get('Content-Type')).toBe('application/json');
        expect(options.body).toBe(JSON.stringify(payload));
    });

    it('supports request-specific headers and credentials', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response());
        const client = createApiClient({
            baseUrl: 'https://api.example.test/api/v1',
            fetchImpl,
        });

        await client.get('provider/me', {
            headers: { 'X-Request-Id': 'test-request' },
            credentials: 'include',
        });

        const [, options] = fetchImpl.mock.calls[0];
        expect(options.headers.get('X-Request-Id')).toBe('test-request');
        expect(options.credentials).toBe('include');
    });

    it('returns null for an empty 204 response', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response({ status: 204, body: null }));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.delete('/provider/me/services/service-1')).resolves.toBeNull();
        expect(fetchImpl.mock.calls[0][1].method).toBe('DELETE');
    });

    it('turns HTTP failures into ApiError without assuming a backend error envelope', async () => {
        const payload = { error: { code: 'NOT_CONFIRMED', message: 'Backend-owned message' } };
        const fetchImpl = vi.fn().mockResolvedValue(response({ status: 401, body: payload }));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.get('/provider/me')).rejects.toMatchObject({
            name: 'ApiError',
            code: 'HTTP_ERROR',
            status: 401,
            message: 'Your session may have expired. Sign in again and retry.',
            payload,
        });
    });

    it('preserves Retry-After for rate-limit handling', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response({
            status: 429,
            body: { message: 'rate limited' },
            headers: { 'Retry-After': '30' },
        }));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.get('/provider/me/jobs')).rejects.toMatchObject({
            status: 429,
            retryAfter: '30',
        });
    });

    it('maps server errors to a safe message and preserves the response payload', async () => {
        const payload = { trace: 'server-internal-detail' };
        const fetchImpl = vi.fn().mockResolvedValue(response({ status: 503, body: payload }));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        let thrown;
        try {
            await client.get('/provider/me');
        } catch (error) {
            thrown = error;
        }

        expect(thrown).toBeInstanceOf(ApiError);
        expect(thrown.message).toBe('The server could not complete the request. Try again later.');
        expect(thrown.message).not.toContain('server-internal-detail');
        expect(thrown.payload).toEqual(payload);
    });

    it('converts network failures into a retryable, user-friendly ApiError', async () => {
        const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.get('/provider/me')).rejects.toMatchObject({
            name: 'ApiError',
            code: 'NETWORK_ERROR',
            status: null,
            message: 'Could not reach the server. Check your connection and try again.',
        });
    });

    it('does not send requests to absolute or traversal paths', async () => {
        const fetchImpl = vi.fn();
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.get('https://other.example.test/private')).rejects.toThrow(
            /relative paths/i,
        );
        await expect(client.get('../private')).rejects.toThrow(/relative paths/i);
        expect(fetchImpl).not.toHaveBeenCalled();
    });

    it('returns a non-JSON response as text instead of crashing', async () => {
        const fetchImpl = vi.fn().mockResolvedValue(response({
            body: 'Service temporarily unavailable',
            contentType: 'text/plain',
        }));
        const client = createApiClient({ baseUrl: 'https://api.example.test/api/v1', fetchImpl });

        await expect(client.get('/health')).resolves.toBe('Service temporarily unavailable');
    });
});
