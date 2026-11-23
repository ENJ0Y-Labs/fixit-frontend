# FixIt Frontend

Frontend workspace for **FixIt**, a Nigerian home-services marketplace that connects customers who need services with local professionals who can provide them.

This repository contains three independently runnable React applications:

- **Customer** — discover services and providers, post jobs, manage jobs, communicate with providers, view payment interfaces, and review completed work.
- **Provider** — manage a service-provider profile, services and availability, discover jobs, submit bids, manage accepted work, communicate with customers, and view earnings and reviews.
- **Admin** — oversee customers, providers, verification, jobs, support cases, service categories, marketplace analytics, and administrative preferences.

The applications share product principles and engineering rules, but each has its own Vite project and dependencies.

> **Project status:** These are frontend prototypes, not production-connected applications. Much of the visible content uses illustrative data and local React state. A screen or interaction in the UI does not imply that an action is persisted, authorized, delivered, or processed by a backend.

## Repository structure

```text
fixit-frontend/
├── AGENTS.md                 # Shared engineering rules for all frontend apps
├── prd.md                    # Product requirements and audit notes
├── fixit-customer/           # Customer marketplace
├── fixit-provider/           # Service-provider workspace
└── fixit-admin/              # Platform administration
```

Each application is run from its own directory. There is currently no root-level npm workspace or root `package.json`.

## Technology

- React 19
- Vite 8
- JavaScript (ES modules)
- CSS
- ESLint
- Vitest, jsdom, and Testing Library in all three applications
- Font Awesome in the customer interface

Do not introduce a framework, UI library, CSS framework, router, or global state library without a concrete requirement. Read [AGENTS.md](./AGENTS.md) before making repository-wide changes and the application-specific README before working inside an app.

## Applications

### 1. Customer — `fixit-customer/`

The customer-facing marketplace currently includes:

- Home page with service/provider discovery, search, filters, sorting, and category browsing
- My Jobs with status filters, search, and sorting
- Post a Job form
- Job Details and progress presentation
- Payment/checkout interface
- Provider review interface
- Conversations and message composer
- Customer account and profile preferences

**Current limitations:** provider and job records are sample data; most actions use local component state. Job creation, job cancellation, and job reads call the proposed customer API routes but are not live until a backend implements the contract. Profile edits, messaging, favorites, uploads, reviews, and payment UI remain prototype behavior and are not evidence of backend persistence or completed transactions. The customer app includes Vitest and Testing Library coverage plus a proposed API client, authentication module, and customer resource module. These are not connected to the mock-driven screens.

Run it:

```bash
cd fixit-customer
npm ci
npm run dev
```

Validate it:

```bash
npm run lint
npm run build
```

### 2. Provider — `fixit-provider/`

The provider workspace currently includes:

- Responsive provider application shell and navigation
- Dashboard with opportunities, bid, job, and earnings summaries
- Provider profile
- Services and availability
- Available-job discovery and job details
- Bid/response workflow
- Accepted-job management and progress UI
- Messages and account-related screens
- Earnings, reviews, and settings screens
- Shared HTTP transport client with normalized API errors
- Proposed authentication and provider resource modules
- Proposed API contract documentation

**Current limitations:** dashboard and screen data remain illustrative unless explicitly connected to an approved service. The API client and resource modules are frontend scaffolding for the proposed endpoint catalogue. No backend service exists yet, so they are not live integrations. Messages, earnings, reviews, and settings have unconfigured states where backend contracts or persistence are not available. No payout or payment success is simulated.

Run it:

```bash
cd fixit-provider
npm ci
npm run dev
```

Validate it:

```bash
npm run test -- --run
npm run lint
npm run build
```

Useful documentation:

- [Provider README](./fixit-provider/README.md)
- [Provider API contracts](./fixit-provider/API_CONTRACTS.md)
- [Provider job discovery contract](./fixit-provider/JOB_DISCOVERY_API.md)
- [Provider bid workflow contract](./fixit-provider/JOB_BIDS_API.md)
- [Provider accepted jobs contract](./fixit-provider/MY_JOBS_API.md)
- [Provider services and availability contract](./fixit-provider/SERVICES_AVAILABILITY_API.md)

### 3. Admin — `fixit-admin/`

The administration workspace currently includes:

- Platform overview dashboard
- Customer directory
- Provider directory
- Provider verification queue
- Job oversight
- Disputes and support case workspace
- Service category management
- Marketplace analytics
- Administrative settings

**Current limitations:** records, metrics, charts, notes, decisions, and preference changes are demo-only and held in browser state. The app does not currently provide authenticated admin access, backend authorization, persistent account/settings management, real verification decisions, support operations, refunds, or live analytics. It now includes proposed API transport, authentication, and admin resource modules, but none are connected to the prototype screens. An account-management page is not currently part of the merged application.

Run it:

```bash
cd fixit-admin
npm install
npm run dev
```

Validate it:

```bash
npm run test -- --run
npm run lint
npm run build
```

See the [Admin README](./fixit-admin/README.md) for screen-level scope and manual checks.

## Backend API contract and endpoint catalogue

There is currently no backend repository or deployed API. The routes below are the **proposed FixIt v1 backend contract** that the frontend expects. They are a concrete implementation brief for the future backend, not proof that the endpoints already exist. Keep this section updated whenever the backend contract changes.

### API conventions

- Proposed API base: `http://localhost:3000/api/v1` for local development. Each app reads its public base URL from `VITE_API_BASE_URL`.
- Every route below is relative to that base URL. Example: `GET /auth/me` resolves to `http://localhost:3000/api/v1/auth/me`.
- Use JSON for request and response bodies except file uploads.
- Recommended success envelope: `{ "data": <resource-or-list> }`. Recommended error envelope: `{ "error": { "code": "VALIDATION_ERROR", "message": "Readable message", "details": {} } }`.
- Lists should return `{ "data": { "items": [], "nextCursor": null } }`; accept `limit` and opaque `cursor` query parameters. Define server-side maximum page sizes.
- Use ISO 8601 timestamps with timezone offsets. The backend must choose one money representation (integer kobo or decimal-string NGN) and document it before payment integration.
- Recommended authentication is an HttpOnly, Secure, SameSite session cookie. State-changing cookie-authenticated requests must have CSRF protection. The backend must document CORS, cookie domain, session expiry, and logout invalidation. If the backend chooses bearer tokens instead, revise the contract and client before implementation.
- Public registration supports `customer` and `provider` roles only. Admin accounts are provisioned by an authorized operator; never expose public admin registration.
- The backend must enforce authorization and resource ownership on every protected route. Frontend role checks are only for presentation.
- Mutations must return the canonical saved resource. A successful HTTP status alone must not be treated as proof of a payment, verification decision, message delivery, or workflow transition unless the response confirms it.

### Shared authentication endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a customer or provider account; body includes role and registration fields |
| `POST` | `/auth/login` | Authenticate with the agreed login identifier and password |
| `POST` | `/auth/logout` | Invalidate the current session |
| `GET` | `/auth/me` | Return the authenticated user, role, and permitted capability summary |
| `POST` | `/auth/password/forgot` | Start password recovery without revealing whether an account exists |
| `POST` | `/auth/password/reset` | Complete password reset using a short-lived reset token |
| `POST` | `/auth/verification/request` | Request an email or phone verification code |
| `POST` | `/auth/verification/confirm` | Confirm a verification code |

### Public marketplace endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/public/categories` | List active service categories |
| `GET` | `/public/services` | List searchable service types |
| `GET` | `/public/providers` | Search and filter public provider profiles |
| `GET` | `/public/providers/{providerId}` | Read a public provider profile |
| `GET` | `/public/providers/{providerId}/reviews` | Read public reviews for a provider |

### Customer application endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` / `PATCH` | `/customer/me` | Read or update the signed-in customer's profile |
| `GET` / `POST` | `/customer/me/jobs` | List the customer's jobs or create a job request |
| `GET` / `PATCH` | `/customer/me/jobs/{jobId}` | Read or update an owned job while edits are allowed |
| `POST` | `/customer/me/jobs/{jobId}/cancel` | Request cancellation of an owned job |
| `GET` | `/customer/me/jobs/{jobId}/bids` | List bids received for an owned job |
| `POST` | `/customer/me/jobs/{jobId}/bids/{bidId}/accept` | Accept a valid bid; server validates availability and state |
| `GET` | `/customer/me/conversations` | List the customer's conversations |
| `GET` / `POST` | `/customer/me/conversations/{conversationId}/messages` | Read messages or send a message in an authorized conversation |
| `GET` | `/customer/me/notifications` | List notifications |
| `PATCH` | `/customer/me/notifications/{notificationId}` | Update notification read state |
| `POST` | `/customer/me/jobs/{jobId}/review` | Submit a review when the job is eligible |
| `GET` | `/customer/me/payments` | List the customer's payment records |
| `POST` | `/customer/me/jobs/{jobId}/payment-intents` | Create a payment intent through the configured payment provider |
| `GET` | `/customer/me/payments/{paymentId}` | Read payment status from the server |
| `GET` | `/customer/me/favorites` | List favorite providers |
| `PUT` / `DELETE` | `/customer/me/favorites/{providerId}` | Add or remove a favorite provider |

### Provider application endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` / `PATCH` | `/provider/me` | Read or update the authenticated provider profile |
| `GET` / `POST` | `/provider/me/services` | List or add provider services |
| `PATCH` / `DELETE` | `/provider/me/services/{serviceId}` | Update or remove an owned service |
| `GET` / `PUT` | `/provider/me/availability` | Read or replace provider availability |
| `GET` | `/provider/jobs` | Discover jobs available to the authenticated provider |
| `GET` | `/provider/jobs/{jobId}` | Read an available or assigned job the provider may access |
| `GET` | `/provider/me/bids` | List the provider's submitted bids |
| `POST` | `/provider/jobs/{jobId}/bids` | Submit a bid for an eligible job |
| `GET` | `/provider/me/jobs` | List jobs assigned to the authenticated provider |
| `PATCH` | `/provider/me/jobs/{jobId}/progress` | Request a permitted job progress transition |
| `GET` | `/provider/me/conversations` | List provider conversations |
| `GET` / `POST` | `/provider/me/conversations/{conversationId}/messages` | Read or send conversation messages |
| `GET` | `/provider/me/earnings` | Read server-calculated earnings and payment history |
| `GET` | `/provider/me/reviews` | Read provider reviews and rating summary |
| `GET` / `PATCH` | `/provider/me/settings` | Read or update supported provider preferences |
| `GET` | `/provider/me/dashboard` | Read server-derived dashboard summaries |
| `GET` | `/provider/me/notifications` | List provider notifications |

### Admin application endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/admin/dashboard` | Read platform overview metrics |
| `GET` | `/admin/customers` | Search and paginate customer accounts |
| `GET` / `PATCH` | `/admin/customers/{customerId}` | Read or update permitted customer account fields |
| `GET` | `/admin/providers` | Search and paginate provider accounts |
| `GET` / `PATCH` | `/admin/providers/{providerId}` | Read or update permitted provider account fields |
| `GET` | `/admin/verifications` | List pending and historical provider verification cases |
| `POST` | `/admin/verifications/{verificationId}/decision` | Record an authorized verification decision and reason |
| `GET` | `/admin/jobs` | Search and paginate all jobs |
| `GET` / `PATCH` | `/admin/jobs/{jobId}` | Read or perform permitted administrative job actions |
| `GET` | `/admin/disputes` | List and filter disputes |
| `GET` / `PATCH` | `/admin/disputes/{disputeId}` | Read or update a dispute and its resolution state |
| `GET` | `/admin/support-cases` | List customer/provider support cases |
| `POST` | `/admin/support-cases/{caseId}/messages` | Add an auditable support response |
| `GET` / `POST` | `/admin/categories` | List or create service categories |
| `PATCH` / `DELETE` | `/admin/categories/{categoryId}` | Update or deactivate/delete a category |
| `GET` | `/admin/analytics` | Read date-filtered marketplace analytics |
| `GET` / `PATCH` | `/admin/settings` | Read or update supported platform settings |
| `GET` | `/admin/audit-events` | Search immutable administrative audit events |

### Cross-cutting capabilities to add when required

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/notifications` | Optional shared notification feed if the backend does not use role-scoped notification routes |
| `POST` | `/uploads` | Upload a permitted image/document using a documented multipart and storage policy |
| `GET` | `/uploads/{uploadId}` | Read authorized upload metadata or a time-limited download URL |
| `POST` | `/admin/payments/{paymentId}/refund` | Admin-authorized refund request, only after payment-provider rules are defined |

### Required backend response and error rules

Recommended single-resource response:

```json
{
  "data": {
    "id": "resource-id"
  }
}
```

Recommended paginated response:

```json
{
  "data": {
    "items": [],
    "nextCursor": null
  }
}
```

Recommended error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A human-readable explanation",
    "details": {}
  }
}
```

Use consistent HTTP semantics: `400/422` validation, `401` unauthenticated/session expired, `403` forbidden, `404` unavailable resource, `409` stale state/conflict, `429` rate limited with optional `Retry-After`, and `5xx` server failure. The frontend transport normalizes errors but preserves the original response payload for controlled handling.

### Frontend API foundation

Each app now has an independent `src/api/` directory:

- `client.js`: configurable fetch transport, safe relative URL handling, JSON serialization/parsing, credentials configuration, network/HTTP error normalization.
- `auth.js`: proposed shared authentication request functions.
- App resource module: `customer.js`, `provider.js`, or `admin.js`.
- `index.js`: public exports for the app's API layer.
- `client.test.js`: transport tests in the customer and admin apps; provider transport tests remain in place.

Configure each app by copying its `.env.example` to `.env.local` and setting `VITE_API_BASE_URL`. The example is a local placeholder. Never put private credentials or secrets in Vite variables.

**Important:** These API modules are integration-ready client scaffolding, not a live backend connection. Do not wire mock UI to them or describe actions as persisted until a backend implements this contract and the relevant endpoint tests pass. Backend implementation must confirm route names, fields, enums, authorization rules, response envelopes, cookie/CSRF/CORS behavior, pagination, and money format. Update this catalogue before changing the client to match a different server contract.

## Development standards

- Keep the three applications independent; avoid premature shared packages and cross-app coupling.
- Preserve existing design tokens and established UI patterns.
- Support responsive layouts from 320px through desktop widths.
- Use semantic HTML, labelled controls, keyboard-accessible interactions, and visible focus states.
- Provide useful loading, empty, success, and error feedback.
- Format currency in Nigerian naira (`₦`) and use Nigerian examples where appropriate.
- Do not present demo records as real users, jobs, earnings, payments, verification outcomes, or messages.
- Frontend role checks are not security controls. The backend must authorize every protected operation.
- Make focused changes and use descriptive commit messages.

## Testing expectations

Run tests, lint, and a production build from each application directory:

```bash
npm run test -- --run
npm run lint
npm run build
```

Also manually check relevant screens at 320, 375, 430, 768, 1024, and 1440px. Test keyboard navigation, form validation, empty results, failure states, and the main user flow for every changed feature.

No automated test, lint, build, or browser result should be claimed unless it has actually been run.

## Product and engineering documentation

- [Shared frontend guide](./AGENTS.md)
- [Product requirements document](./prd.md)
- [Customer application](./fixit-customer/README.md)
- [Provider application](./fixit-provider/README.md)
- [Admin application](./fixit-admin/README.md)

The product requirements document describes the current three-application repository snapshot and distinguishes implemented UI from prototype limitations and backend dependencies.

## Shared design system

All three applications import `shared/fixit-design-system.css`. It defines the common FixIt visual foundation: typography, colour and status tokens, spacing, radii, shadows, focus treatment, primary/secondary action styling, and desktop workspace dimensions.

Customer, provider, and admin screens retain separate navigation, workflows, and feature components. The shared stylesheet is intentionally limited to presentation consistency; it does not merge application state or introduce backend behavior. Keep mobile navigation patterns app-specific where their interaction models differ, and update the shared tokens before introducing new global visual values.
