# FixIt Provider Frontend

Standalone React + Vite + JavaScript application for the FixIt service-provider workspace.

## Requirements

- Node.js compatible with the Vite version in `package-lock.json`
- npm

## Install

From this directory:

```bash
npm ci
```

## Environment configuration

1. Copy `.env.example` to `.env.local` in `fixit-provider/`.
2. Set `VITE_API_BASE_URL` to the API base URL approved by the backend team. The example points to a local placeholder and is not a confirmed backend address.
3. Restart the Vite development server after changing environment variables.

Vite exposes `VITE_*` variables to browser code. Never put API secrets, passwords, signing keys, or payment credentials in these variables. Local `.env` files are ignored by Git; commit only safe examples.

See [API_CONTRACTS.md](./API_CONTRACTS.md) for the proposed provider API routes, payload requirements, errors, authentication decisions, and backend approval checklist. **The contract is a proposal, not proof that these endpoints exist.** Confirm it with the backend team before adding resource-specific requests.

## API transport foundation

The shared transport client lives in `src/api/client.js`. It provides `get`, `post`, `put`, `patch`, `delete`, and a lower-level `request` method. It builds URLs under `VITE_API_BASE_URL`, serializes object request bodies as JSON, parses response bodies when possible, and throws `ApiError` for configuration, network, and HTTP failures.

```js
import { apiClient, ApiError } from './api/client.js';

try {
    const result = await apiClient.get('your/confirmed/relative/path', {
        query: { limit: 20 },
    });
    // Handle the response using the backend-confirmed response contract.
} catch (error) {
    if (error instanceof ApiError) {
        // Inspect error.code, error.status, and error.retryAfter as needed.
        // Do not display error.payload directly to users.
    }
}
```

The relative path above is a placeholder, not a live endpoint. The client intentionally does not assume a success/error JSON envelope or an authentication scheme. Configure `credentials` only after the backend confirms whether cookie credentials are required. Resource-specific API functions and screen integration remain blocked on backend contract approval.

## Development

```bash
npm run dev
```

## Validate

```bash
npm run test -- --run
npm run lint
npm run build
```

## Current foundation

The application includes a responsive provider shell and a lightweight design system: CSS tokens, typography, buttons, form controls, cards, status badges, dialog styling, visible keyboard focus, and a desktop sidebar that becomes a dismissible mobile navigation drawer. The dashboard content is illustrative mock data and is not connected to an API.

The Messages, Earnings, Reviews, and Settings screens remain unconfigured until approved backend contracts and persistence are connected. Payouts are not simulated, and account settings are not described as saved unless a server confirms persistence.

The component tests cover the dashboard render, active navigation, mobile menu open/close behavior, and the documented screen states. Check responsive layouts manually at 320, 375, 768, 1024, and 1440 pixels. Use Tab and Shift+Tab to check focus visibility, Enter/Space to activate controls, and Escape to close the mobile menu.

Backend authorization, persistence, validation, and payment integrity remain the backend's responsibility.
