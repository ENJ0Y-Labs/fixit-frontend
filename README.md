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
- Vitest and Testing Library in the provider and admin applications
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

**Current limitations:** provider and job records are sample data; most actions use local component state. Job creation, cancellation, profile edits, messaging, favorites, uploads, reviews, and payment UI are not evidence of backend persistence or completed transactions. The customer package currently provides lint and build scripts but does not define an automated test script.

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
- Proposed API contract documentation

**Current limitations:** dashboard and screen data remain illustrative unless explicitly connected to an approved service. The API client is transport infrastructure, not proof that endpoint contracts or authentication are configured. The API documents are proposals for backend review. Messages, earnings, reviews, and settings have unconfigured states where backend contracts or persistence are not available. No payout or payment success is simulated.

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

**Current limitations:** records, metrics, charts, notes, decisions, and preference changes are demo-only and held in browser state. The app does not currently provide authenticated admin access, backend authorization, persistent account/settings management, real verification decisions, support operations, refunds, or live analytics. An account-management page is not currently part of the merged application.

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

## Configuration and backend integration

The frontend team owns the presentation layer and client-side behavior. Backend services must own authentication enforcement, authorization, validation, persistence, payment processing, file storage, data integrity, and authoritative workflow transitions.

Before connecting a screen:

1. Confirm the API contract with the backend team.
2. Document the method, path, query/body, response, errors, and authentication requirements.
3. Use the approved contract rather than guessing endpoint names or response shapes.
4. Implement loading, empty, error, unauthorized/forbidden, and session-expired states where relevant.
5. Update the UI only after the server confirms a successful operation.
6. Keep mock data clearly separated from API data.

For Vite configuration, only expose public values through `VITE_*` variables. Never put database credentials, private API keys, payment secrets, signing keys, or other secrets in frontend code or Vite environment variables. Use each app's `.env.example` where provided.

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

For the provider and admin apps, run tests, lint, and a production build from the relevant application directory:

```bash
npm run test -- --run
npm run lint
npm run build
```

For the customer app, run lint and build; automated test infrastructure is not currently configured there.

Also manually check relevant screens at 320, 375, 430, 768, 1024, and 1440px. Test keyboard navigation, form validation, empty results, failure states, and the main user flow for every changed feature.

No automated test, lint, build, or browser result should be claimed unless it has actually been run.

## Product and engineering documentation

- [Shared frontend guide](./AGENTS.md)
- [Product requirements document](./prd.md)
- [Customer application](./fixit-customer/README.md)
- [Provider application](./fixit-provider/README.md)
- [Admin application](./fixit-admin/README.md)

The product requirements document describes the current three-application repository snapshot and distinguishes implemented UI from prototype limitations and backend dependencies.
