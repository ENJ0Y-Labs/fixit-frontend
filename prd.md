# FixIt Frontend Product Requirements Document

**Product:** FixIt home-services marketplace  
**Repository:** `ENJ0Y-Labs/fixit-frontend`  
**Document status:** Current product scope and repository implementation snapshot  
**Last reviewed:** 5 November 2026

## 1. Product overview

FixIt connects customers who need home services with local service providers in Nigeria. The frontend repository contains three independently runnable React applications:

| Application | Directory | Primary users | Current implementation |
|---|---|---|---|
| Customer | `fixit-customer/` | People requesting home services | Marketplace and job-management UI prototype |
| Provider | `fixit-provider/` | Service professionals and businesses | Provider workspace UI prototype with an API transport foundation |
| Admin | `fixit-admin/` | Authorized platform operations staff | Administration workspace UI prototype |

The presence of a screen does not mean its workflow is connected to production services. Unless a section explicitly says otherwise, sample records, figures, decisions, messages, and preference changes are illustrative and remain in browser memory.

## 2. Product goals

1. Help customers discover services, request work, compare provider responses, and manage jobs.
2. Give providers a focused workspace to maintain their profiles, find work, respond to jobs, and manage accepted work.
3. Give administrators tools to oversee customers, providers, verification, jobs, support cases, categories, analytics, and settings.
4. Keep job, bid, message, review, and payment state consistent across the three applications.
5. Deliver responsive and accessible interfaces suitable for Nigerian users.
6. Never present mock UI interactions as confirmed server-side actions.

## 3. Roles and application boundaries

### Customer
Customers discover providers, post jobs, review job information, communicate with providers, view payment-related information, submit reviews, and manage their profile.

### Provider
Providers manage their public profile, services, and availability; discover relevant jobs; submit bids; manage accepted jobs; communicate with customers; and view earnings and reviews.

### Administrator
Administrators oversee platform activity, inspect customer and provider records, review provider verification, monitor jobs, handle support and disputes, manage categories, view analytics, and configure supported settings.

Each role has a separate frontend application. Do not move provider or admin workflows into the customer app for convenience.

**Security boundary:** Frontend navigation and role checks are presentation controls only. The backend must authenticate users and authorize every protected resource and action.

## 4. Current repository implementation

### 4.1 Customer application: `fixit-customer/`

**Implemented UI areas**
- Home and provider discovery, including service search, location selection, category browsing, provider cards, filtering, sorting, and empty results.
- My Jobs, including sample job cards, status filters, search, sorting, and navigation to job details.
- Post a Job, including job details, urgency, preferred date/time, location, budget, photo selection, and basic required-field validation.
- Job Details, including job information, provider context, progress display, cancellation confirmation, and links to messages/payment UI.
- Payment, including an order summary and sample payment-method selection.
- Review, including provider/job context, comment, anonymity, and photo-related UI.
- Messages, including a conversation list, search, message history, and a local composer interaction.
- Account, including profile display/edit UI and preference/settings rows.
- Shared navigation, footer, and responsive styling.

**Current limitations**
- Provider, job, conversation, and profile data are primarily hard-coded or local React state.
- Job creation, cancellation, profile edits, and outgoing messages are not server-persisted.
- Payment UI is not a payment integration. A local interaction must never be described as a completed transaction.
- Real-time messaging, message delivery, provider presence, favorites, notification delivery, and attachment storage are not established.
- Several account and home controls still require meaningful behavior or an explicit unavailable state.
- API loading, failure, authorization, and session-expiration states remain to be completed for server-backed flows.

**Testing baseline**
- Vitest, jsdom, and Testing Library are configured for component tests.
- The test suite should grow with each customer feature. Passing a small smoke suite is not proof that all customer workflows are complete.

### 4.2 Provider application: `fixit-provider/`

**Implemented UI areas**
- Provider workspace shell and responsive navigation.
- Dashboard with sample opportunity, job, and earnings summaries.
- Provider profile.
- Services and availability.
- Available-job discovery and job details.
- Bid/response workflow UI.
- Accepted-job management.
- Messages, earnings, reviews, and settings screens or explicit unconfigured states.
- API transport client and proposed API contract documentation.

**Current limitations**
- Dashboard and workflow data remain illustrative unless a screen explicitly uses an approved service.
- The API client is transport infrastructure, not evidence that backend endpoints exist.
- Provider API documents are proposals and require backend review and approval.
- Resource-specific API integration, authentication configuration, persistence, and server-authoritative workflow transitions remain incomplete.
- Messages, earnings, reviews, and settings must not imply real delivery, payouts, persisted preferences, or server data where those services are not configured.

### 4.3 Admin application: `fixit-admin/`

**Implemented UI areas**
- Administration shell and dashboard.
- Customer directory.
- Provider directory.
- Provider verification queue.
- Job oversight.
- Disputes and support workspace.
- Service category management.
- Analytics.
- Administrative settings.

**Current limitations**
- Records, dashboard figures, charts, notes, verification decisions, category changes, and settings are illustrative or temporary browser state.
- There is no production admin authentication, backend authorization, persistent admin account management, or connected operational API.
- Verification controls do not verify providers. Support controls do not send messages, assign real cases, resolve disputes, or issue refunds.
- Analytics are sample aggregates, not live marketplace reporting or revenue.
- Settings preferences reset with the page and are not persisted.
- Customer, provider, and job detail panels are read-only demo views.

**Account-page history**
- An admin account page was briefly merged in PR #26 and reverted in PR #27.
- The reverted page was a demo profile editor backed by temporary component state. It did not have an approved authentication/session contract or real account/security persistence.
- Do not reintroduce it as functional account management until the product requirements and backend contract define the supported account operations.

## 5. Cross-application workflows

### Customer job request
1. Customer completes the job form.
2. Frontend performs user-friendly validation and submits using an approved API contract.
3. Backend validates and creates the canonical job record.
4. Customer sees success only after the backend confirms creation.
5. Provider discovery receives eligible jobs according to backend rules.

### Provider response
1. Provider opens an eligible job.
2. Provider submits a bid or response.
3. Backend validates eligibility and records the response.
4. Customer sees the response from the authoritative job/bid service.
5. Both applications display backend-defined statuses.

### Job acceptance and completion
1. Customer accepts a provider response where supported.
2. Backend records the accepted provider and agreed terms.
3. Provider performs only permitted job-status transitions.
4. Customer and provider receive consistent status information.
5. Payment and review actions become available only when backend state confirms eligibility.

### Messaging
1. An authorized user opens an allowed conversation.
2. Messages load from the messaging service.
3. The sender sees sending, success, or failure feedback.
4. Delivery indicators reflect the actual service response.
5. A locally appended message is never described as delivered.

### Payment and disputes
1. Frontend displays authoritative job/payment information.
2. Payment is initiated through the approved backend/payment-provider integration.
3. Payment state is updated only from a trusted result.
4. Completion, release, refund, and dispute transitions follow backend rules.
5. Admin access to payment/dispute records is permission-controlled by the backend.

## 6. Shared functional requirements

- **Responsive design:** Support 320, 375, 430, 768, 1024, 1280, and 1440 pixel widths.
- **Accessibility:** Use semantic HTML, labelled inputs, keyboard-accessible controls, visible focus, adequate contrast, useful alt text, and accessible error messages.
- **Forms:** Provide clear validation, submission/loading state, disabled duplicate submission where appropriate, success/error feedback, and preserve input after recoverable failures.
- **Data states:** API-driven views must account for loading, populated, empty, failed, unauthorized/forbidden, and expired-session states where relevant.
- **Localization:** Use Nigerian examples, Naira (`₦`), and `en-NG` formatting where appropriate.
- **Security:** Do not expose secrets in client bundles. Frontend checks do not replace backend authorization.
- **Consistency:** Use consistent job, bid, payment, review, and verification terminology across the applications.
- **Trust:** Clearly identify mock data. Never invent completed payments, successful verification, delivered messages, persisted settings, or server-confirmed status changes.

## 7. Backend integration requirements

The backend is the source of truth for authentication, authorization, persistence, validation, job rules, bids, status transitions, payments, verification, messaging, reviews, and data integrity.

Before integrating a feature, backend and frontend owners must agree on:
- HTTP method and endpoint.
- Authentication and role requirements.
- Query parameters and request body.
- Successful response shape.
- Validation, conflict, and server-error responses.
- Unauthorized/forbidden behavior.
- Pagination and sorting conventions.
- Upload constraints and response shape where applicable.

The provider API documents are proposals, not proof of implemented endpoints. The customer and admin applications must follow the same approval process. Do not invent endpoints or response shapes. If the contract is unavailable, record the dependency and keep the UI clearly marked as a prototype.

## 8. Non-functional and engineering requirements

- Keep all three applications independently runnable.
- Avoid unnecessary cross-app coupling and premature shared packages.
- Follow the shared rules in `AGENTS.md`.
- Prefer existing design tokens and CSS conventions.
- Do not introduce frameworks or state-management libraries without a demonstrated need.
- Do not expose stack traces or internal server details in user-facing errors.
- Confirm destructive or financially consequential actions.
- Keep mock data separate from API data.
- Add tests for important interactions and regression-prone logic.
- Run tests, ESLint, and production builds for all three apps in CI.

## 9. Priorities

### P0: Integration foundation and trust
- Confirm backend API contracts and authentication/session behavior.
- Remove or clearly label inert and demo-only controls.
- Add loading, empty, error, and permission states to API-backed screens.
- Ensure payment, messaging, verification, and job status are never faked.
- Maintain reliable automated validation for all three apps.

### P1: Core marketplace workflows
- Customer discovery and job posting.
- Provider onboarding, profile, services, and availability.
- Provider job discovery and bids.
- Customer bid review/selection where supported.
- Shared job details and status.
- Authorized customer/provider messaging.

### P2: Fulfilment and operations
- Job progress and completion.
- Payment integration and authoritative payment history.
- Reviews after eligible completed jobs.
- Admin customer/provider/job operations.
- Provider verification and support/dispute workflows.

### P3: Optimization
- Live analytics and exports.
- Advanced search, filters, and pagination.
- Persisted preferences and notifications.
- Measured performance improvements.

## 10. Definition of done

A feature is complete only when:
1. It belongs to the correct application and role.
2. It follows approved product behavior and backend contracts, or is explicitly labelled as a prototype.
3. It handles the happy path and validation failures.
4. It handles relevant loading, empty, error, and permission states.
5. It does not claim server persistence or actions that have not been confirmed.
6. It is keyboard-accessible and responsive at relevant widths.
7. Relevant automated and manual tests pass.
8. ESLint and the production build pass.
9. No secrets, undocumented API assumptions, or unrelated changes are introduced.

## 11. Repository references

- [Shared engineering guide](./AGENTS.md)
- [Customer application](./fixit-customer/README.md)
- [Customer Phase 1 audit](./fixit-customer/PHASE1_AUDIT.md)
- [Provider application](./fixit-provider/README.md)
- [Provider API proposals](./fixit-provider/API_CONTRACTS.md)
- [Admin application](./fixit-admin/README.md)
- [Repository overview](./README.md)
