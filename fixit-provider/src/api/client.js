const HTTP_ERROR_MESSAGES = {
    400: 'The request could not be understood. Check the information and try again.',
    401: 'Your session may have expired. Sign in again and retry.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested item could not be found.',
    409: 'This item has changed. Refresh the page and try again.',
    422: 'Some information needs to be corrected before continuing.',
    429: 'Too many requests. Wait a moment before trying again.',
};

function normalizeBaseUrl(baseUrl) {
    if (typeof baseUrl !== 'string' || !baseUrl.trim()) {
        return null;
    }

    try {
        const origin = globalThis.location?.origin || 'http://localhost';
        const parsed = new URL(baseUrl.trim(), origin);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }

        return parsed.href.replace(/\/+$/, '');
    } catch {
        return null;
    }
}

function buildRequestUrl(baseUrl, path, query) {
    if (typeof path !== 'string' || !path.trim()) {
        throw new TypeError('An API path is required.');
    }

    const normalizedPath = path.trim().replace(/^\/+/, '');
    if (
        /^[a-z][a-z\d+.-]*:/i.test(normalizedPath)
        || normalizedPath.startsWith('//')
        || normalizedPath.split('/').some((segment) => segment === '.' || segment === '..')
    ) {
        throw new TypeError('API paths must be relative paths inside the configured API base URL.');
    }

    const base = new URL(`${baseUrl}/`);
    const url = new URL(normalizedPath, base);

    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
        throw new TypeError('The API path must stay inside the configured API base URL.');
    }

    if (query && typeof query === 'object') {
        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => url.searchParams.append(key, String(item)));
            } else {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url;
}

async function readResponseBody(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType.includes('application/json') || /^[\s]*[\[{]/.test(text)) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    return text;
}

export class ApiError extends Error {
    constructor(message, {
        status = null,
        code = 'API_ERROR',
        payload = null,
        retryAfter = null,
        cause,
    } = {}) {
        super(message, cause ? { cause } : undefined);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.payload = payload;
        this.retryAfter = retryAfter;
    }
}

function messageForStatus(status) {
    if (HTTP_ERROR_MESSAGES[status]) {
        return HTTP_ERROR_MESSAGES[status];
    }

    if (status >= 500) {
        return 'The server could not complete the request. Try again later.';
    }

    return 'The request failed. Please try again.';
}

/**
 * Creates the provider app's shared HTTP client.
 *
 * This layer deliberately does not assume an API success envelope, an error
 * envelope, or an authentication scheme. Those must be confirmed with the
 * backend before resource-specific API functions are added.
 */
export function createApiClient({
    baseUrl = import.meta.env.VITE_API_BASE_URL,
    fetchImpl = globalThis.fetch,
    credentials = 'same-origin',
    headers: defaultHeaders = {},
} = {}) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

    async function request(path, options = {}) {
        if (!normalizedBaseUrl) {
            throw new ApiError(
                'Provider API is not configured. Set VITE_API_BASE_URL in fixit-provider/.env.local.',
                { code: 'API_CONFIG_ERROR' },
            );
        }

        if (typeof fetchImpl !== 'function') {
            throw new ApiError('This environment does not provide a fetch implementation.', {
                code: 'FETCH_UNAVAILABLE',
            });
        }

        const {
            query,
            headers: requestHeaders,
            body,
            credentials: requestCredentials = credentials,
            ...fetchOptions
        } = options;

        const url = buildRequestUrl(normalizedBaseUrl, path, query);
        const headers = new Headers(defaultHeaders);

        new Headers(requestHeaders).forEach((value, key) => headers.set(key, value));
        if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json');
        }

        let requestBody = body;
        if (
            body !== undefined
            && body !== null
            && typeof body !== 'string'
            && !(body instanceof FormData)
            && !(body instanceof Blob)
            && !(body instanceof ArrayBuffer)
        ) {
            requestBody = JSON.stringify(body);
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
        }

        let response;
        try {
            response = await fetchImpl(url.href, {
                ...fetchOptions,
                method: (fetchOptions.method || 'GET').toUpperCase(),
                headers,
                credentials: requestCredentials,
                ...(requestBody === undefined ? {} : { body: requestBody }),
            });
        } catch (error) {
            if (error?.name === 'AbortError') {
                throw error;
            }

            throw new ApiError(
                'Could not reach the server. Check your connection and try again.',
                { code: 'NETWORK_ERROR', cause: error },
            );
        }

        let payload;
        try {
            payload = await readResponseBody(response);
        } catch (error) {
            throw new ApiError('The server response could not be read.', {
                status: response.status,
                code: 'RESPONSE_READ_ERROR',
                cause: error,
            });
        }

        if (!response.ok) {
            throw new ApiError(messageForStatus(response.status), {
                status: response.status,
                code: 'HTTP_ERROR',
                payload,
                retryAfter: response.headers?.get?.('Retry-After') || null,
            });
        }

        return payload;
    }

    return {
        request,
        get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
        post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
        put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
        patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
        delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
    };
}

export const apiClient = createApiClient();
