# FixIt Frontend Product Requirements Document (PRD)

**Document status:** Repository audit + product requirements  
**Product:** FixIt home-services marketplace  
**Repository:** `ENJ0Y-Labs/fixit-frontend`  
**Last reviewed:** 14 October 2026

## 1. Purpose

FixIt connects customers who need home services with service providers who can perform them. This repository is intended to contain three separate frontend applications:

- `fixit-customer/`: customer marketplace and job-management experience.
- `fixit-provider/`: provider workspace for managing services, bids, accepted jobs, customers, and earnings.
- `fixit-admin/`: internal operations workspace for platform oversight and administration.

This document distinguishes **features visible in the current repository** from **requirements for planned applications**. A screen with mock data or local React state is not considered a production-integrated feature.

## 2. Repository audit summary

| Application | Repository finding | Current status |
|---|---|---|
| Customer | `fixit-customer/` exists and contains React/Vite screens and local sample data. | UI prototype with working client-side interactions; several flows are not connected to a backend. |
| Provider | The expected `fixit-provider/` directory and app manifest were not found on the audited `main` branch. | Not present in the audited branch; requirements below describe intended scope, not shipped functionality. |
| Admin | The expected `fixit-admin/` directory and app manifest were not found on the audited `main` branch. | Not present in the audited branch; requirements below describe intended scope, not shipped functionality. |

### Current technical baseline

The customer app uses React 19, Vite, JavaScript, CSS, React hooks, ESLint, and Font Awesome. It uses local page switching in `App.jsx` rather than React Router, and local mock data for jobs, providers, conversations, and profile details. Keep the applications independent and follow the repository's `AGENTS.md` guidance.

## 3. Product goals

1. Help customers find suitable providers and request services with clear expectations.
2. Give providers a focused workflow to discover work, respond to requests, and complete accepted jobs.
3. Give administrators safe tools to oversee users, providers, jobs, disputes, categories, and platform health.
4. Keep job status, customer/provider communication, and payment state consistent across all three applications.
5. Deliver responsive, accessible interfaces suitable for Nigerian users, using Naira formatting and Nigerian contact/location conventions.
6. Clearly distinguish live server data from prototypes and never fake successful payments, verification, message delivery, or other server-side actions.

## 4. User roles

### Customer
A person looking for a service, posting a job, comparing provider responses, communicating with a provider, paying for a service, and reviewing the result.

### Provider
A service professional or business that maintains a provider profile, lists services, manages availability, discovers relevant jobs, submits bids, performs accepted jobs, communicates with customers, and tracks earnings and reviews.

### Administrator
An authorized operations user who monitors the platform, manages accounts and categories, reviews provider verification, oversees jobs, handles reports/disputes, and reviews operational analytics.

**Security requirement:** Frontend role-based navigation is for usability only. Every protected operation and resource must be authorized by the backend.

## 5. Customer application: current features

The following features were identified in the audited customer source. “Current” means represented in the UI/source; it does not imply backend integration or production readiness.

### 5.1 Home and provider discovery

**Present in current UI**
- Search providers/services by provider name, job title, service title, or category.
- Location selector with sample locations.
- Service-category cards, including Plumbing, Electrical, Cleaning, Carpentry, and Painting.
- Provider cards showing name, profession, rating/review count, distance, rate, and profile action.
- Price range filtering.
- Minimum-rating filtering.
- Maximum-distance filtering.
- Available-now filter.
- Sorting by popularity-like score, rating, or price.
- Reset filters and show more results.
- Empty result feedback when no providers match.

**Current limitations**
- Provider records and location choices are hard-coded sample data.
- Filtering is client-side and does not query a live marketplace.
- Provider favorite/save control is not backed by persistence.
- Provider profile/booking behavior must not be represented as a completed booking unless a real flow exists.

### 5.2 My Jobs

**Present in current UI**
- Job cards with title, category, status, date, location, price/budget, and provider details when available.
- Status filters for All, Active, Completed, and Cancelled.
- Search by job title, location, or provider name.
- Sorting by recent, oldest, or highest price.
- Action to post another job.
- Empty state for searches/filters with no matching jobs.

**Current limitations**
- Jobs are initialized from local sample data and managed in React state.
- No API loading, server error, authorization, or session-expiration handling is established in the audited component.

### 5.3 Post a Job

**Present in current UI**
- Job title, category, description, urgency, preferred date/time, location, budget, and photo-selection UI.
- Basic required-field validation for title, category, location, and budget.
- Local job creation and navigation to My Jobs after submission.
- Up to five selected files are retained in component state.

**Current limitations**
- Submission adds a local job; it does not confirm server-side creation.
- File type/size validation, upload progress, upload failure handling, and server storage are not established.
- Full form validation and persistence of drafts are not established.

### 5.4 Job Details

**Present in current UI**
- Job details page with job data passed from app state.
- Provider and agreed-price/budget information where available.
- Job cancellation confirmation.
- Navigation to messages and payment-related UI.

**Current limitations**
- Job data is local state.
- Cancellation updates local state only.
- Backend-controlled status transitions, ownership checks, and transition eligibility are not established.
- Photo gallery, real provider profile data, and review eligibility must be driven by actual job/API data.

### 5.5 Payment / Checkout

**Present in current UI**
- Checkout screen and order summary.
- Secure-escrow explanatory panel.
- Payment method selection UI, including sample saved-card and bank-transfer choices.
- Promo-code entry and apply control.

**Current limitations**
- The visible payment methods are sample UI, not evidence of configured payment processing.
- Add-new-payment and promo-code actions require real behavior or should be clearly marked unavailable.
- No payment success may be inferred from a button click or local state. Payment status must come from a trusted backend/payment-provider response.

### 5.6 Reviews

**Present in current UI**
- Review interface associated with a provider/job.
- Comment, anonymous-review, and photo-related UI elements.

**Current limitations**
- Interactive rating, complete validation, submission loading/error states, and backend persistence need verification/implementation.
- Reviews should be permitted only when the backend confirms the customer is eligible to review the relevant completed job.

### 5.7 Messages

**Present in current UI**
- Conversation list with sample conversations.
- Search conversations.
- Active conversation and message history.
- Message composer; Enter sends and Shift+Enter adds a line.
- Locally appended outgoing messages.
- Sample online/offline indicators and message previews.

**Current limitations**
- Conversations/messages are hard-coded sample data.
- Sending only updates local state; it does not deliver a message to another user.
- Real presence, attachment upload, report-provider actions, delivery status, and realtime/polling behavior are not established.

### 5.8 Account and preferences

**Present in current UI**
- Profile display and edit form for name, email, and phone.
- Local profile save feedback.
- Saved-address, payment-method, job-history, notifications, help/support, and security setting rows.
- Privacy, terms, and safety links/buttons.
- Profile-picture control.

**Current limitations**
- Profile edits are saved only in local component state.
- Several settings rows, the notification toggle, profile-picture control, and footer actions are visual-only or lack meaningful handlers.
- Authentication, logout, saved-address CRUD, payment-method management, security settings, and preference persistence are not established.

### 5.9 Navigation and shared experience

**Present in current UI**
- Main navigation for Home, My Jobs, Messages, and Profile.
- Post a Job shortcut.
- Footer and shared visual styling.
- Lazy-loaded secondary pages.
- Responsive CSS and accessibility attributes on many controls.

**Customer application acceptance requirements**
- Connect data to documented backend APIs when available.
- Add explicit loading, empty, error, unauthorized, and session-expired states for API-backed screens.
- Remove or implement controls that currently do nothing.
- Preserve user-entered form data after recoverable failures.
- Verify keyboard navigation, visible focus, semantic labels, alt text, and responsive layouts.
- Never describe mock/local actions as server-persisted.

## 6. Provider application: required product scope

**Audit status:** No `fixit-provider/` app was found on the audited `main` branch. All features in this section are requirements for implementation, not claims about existing code.

### 6.1 Authentication and onboarding
- Sign in and sign out using the approved authentication contract.
- Clear loading, invalid-credentials, network-error, unauthorized, and expired-session states.
- Provider onboarding/profile completion flow.
- Display verification status and any missing requirements.
- Collect only profile/document fields approved by the backend contract.
- Show pending, approved, rejected, or action-required verification states when those statuses are supported by the API.

### 6.2 Provider dashboard
- Summary of new opportunities, bids awaiting response, accepted jobs, jobs in progress, completed jobs, and earnings.
- Action-oriented lists for jobs or requests needing attention.
- Clear distinction between estimated, agreed, pending, and paid amounts based on backend-provided definitions.
- Useful empty states for a new provider.

### 6.3 Provider profile and services
- View and edit public provider profile, biography, contact details, service area, and profile image where supported.
- Manage service categories and individual services.
- Set service descriptions and pricing/rate information where supported.
- Upload and replace profile/service images with type/size validation and upload feedback.
- Preview the public-facing profile before saving.
- Display server validation and save errors without discarding entered data.

### 6.4 Availability and service area
- View and edit working days/hours.
- Set availability or temporarily mark unavailable if supported by the backend.
- Manage service locations/radius only within the API's supported model.
- Clearly show saved versus unsaved availability changes.

### 6.5 Job discovery
- Browse available jobs relevant to provider services and service area.
- Search and filter by category, location, date, urgency, and budget where the API supports those fields.
- Job detail view with description, location, schedule, photos, customer-provided budget, and relevant requirements.
- Empty/loading/error states and pagination for large result sets.
- Do not expose private customer information before the permitted workflow stage.

### 6.6 Bids and responses
- Submit a bid/quote with price, message, and proposed schedule where supported.
- Validate required fields and reasonable values.
- Show submission progress, success, conflict, and failure responses.
- View submitted bids and their server-defined statuses.
- Edit or withdraw a bid only if the backend allows it.
- Avoid duplicate submissions and handle a job becoming unavailable while the provider is responding.

### 6.7 Accepted-job management
- View accepted/upcoming, in-progress, completed, and cancelled jobs according to backend statuses.
- View job details and customer contact/communication permitted for that job.
- Start work, update progress, and mark completion only through authorized backend transitions.
- Show confirmation for consequential status changes.
- Handle rejected transitions, stale data, cancellation, and network failure.
- Never create a new job status in the frontend without an approved API definition.

### 6.8 Customer communication
- Conversation list, search, active conversation, message history, and composer.
- Job context for each conversation.
- Sending state, retry/error feedback, empty states, and mobile-friendly layout.
- Display online/presence and delivery indicators only when supplied by the service.
- Support attachments only when an approved upload/message contract exists.

### 6.9 Earnings and payments
- Earnings summary and transaction/payment history.
- Clear labels for pending, processing, paid, failed, or disputed states only where defined by the backend/payment provider.
- Job-level amount breakdowns where provided.
- Payout details/status only if payout support is part of the approved product/API scope.
- No frontend-generated claims that funds were received or released.

### 6.10 Reviews and notifications
- View customer reviews and ratings.
- Link reviews to relevant completed jobs where supported.
- View job, bid, message, and payment notifications.
- Manage notification preferences only when persisted by the backend.
- Provide empty, loading, and failure states.

## 7. Admin application: required product scope

**Audit status:** No `fixit-admin/` app was found on the audited `main` branch. All features in this section are requirements for implementation, not claims about existing code.

### 7.1 Secure admin access
- Admin sign-in using the approved authentication contract.
- Clear unauthorized/forbidden and expired-session behavior.
- Role/permission-aware navigation, backed by server-side authorization.
- Session/logout behavior and safe handling of access failures.
- No admin secrets embedded in the frontend.

### 7.2 Operations dashboard
- Platform summary metrics such as customer count, provider count, jobs by status, verification queue, reported issues, and payment summaries where the backend provides trustworthy data.
- Time-range filters where supported.
- Recent activity and actionable queues.
- Clear definitions for each metric; do not calculate misleading business metrics from incomplete client-side data.

### 7.3 Customer management
- Search, filter, sort, paginate, and inspect customer records.
- View relevant account status and associated jobs/support context according to permissions.
- Perform approved account actions such as suspend/reactivate only if the backend supports them.
- Confirm high-impact actions and explain their consequences.
- Handle permission errors and stale records.

### 7.4 Provider management and verification
- Search and inspect provider records.
- View provider profile, service listings, verification state, and submitted verification materials only where authorized.
- Review verification submissions and record approve/reject/request-more-information decisions if supported by the backend.
- Require a reason or notes for consequential decisions when the product/API requires it.
- Show verification history/audit information when available.
- Never make a provider appear verified based only on local UI state.

### 7.5 Job oversight
- Search and filter jobs by status, category, date, customer, provider, and location where supported.
- Inspect job details, bid history, status history, and related records according to permission.
- Identify stalled, disputed, cancelled, or otherwise flagged jobs where backend data supports these views.
- Take only explicitly authorized administrative actions.
- Require confirmation and record a reason for destructive or consequential actions when required.

### 7.6 Disputes, reports, and support
- Queue of open disputes, reports, and support cases if supported by the backend.
- Detail view with relevant job, customer, provider, conversation, and payment references.
- Status, priority, assignment, notes, and resolution actions as defined by the support system.
- Preserve an auditable history of decisions.
- Do not expose private messages or sensitive data to staff who lack permission.

### 7.7 Categories and service taxonomy
- List, search, and manage service categories.
- Create/edit/deactivate categories only where the backend permits.
- Validate required fields and prevent accidental destructive changes.
- Reflect category changes consistently in customer and provider interfaces through the API.

### 7.8 Reports and analytics
- Job volume and status breakdowns.
- Provider/customer growth and activity.
- Completion/cancellation trends.
- Payment/earnings summaries only from authoritative backend data.
- Filters and export options only when the backend and product requirements define them.
- Show reporting time zone, currency, and metric definitions clearly.

### 7.9 Administrative settings and auditability
- View/configure approved platform settings.
- Display who performed an action and when if audit data is available.
- Confirmation dialogs for destructive actions.
- Reason fields for suspensions, verification decisions, and dispute resolutions when required.
- Do not place backend authorization, business rules, or secrets in frontend code.

## 8. Cross-application workflows

### 8.1 Customer posts a job
1. Customer completes the job form and selects any supported photos.
2. Frontend validates input and submits through the documented API.
3. Backend confirms job creation and returns the canonical job record/status.
4. Customer sees success and the newly created job.
5. Provider job discovery shows the opportunity only according to backend eligibility and matching rules.

### 8.2 Provider responds to a job
1. Provider opens an eligible job.
2. Provider submits a quote/response.
3. Backend validates eligibility and records the bid.
4. Customer can see the response in the job's bid/response area when that workflow is supported.
5. Both apps display server-defined statuses rather than independently guessing state.

### 8.3 Job acceptance and completion
1. Customer selects/accepts a provider response where supported.
2. Backend records the accepted provider and agreed terms.
3. Provider manages the accepted job through permitted status transitions.
4. Customer and provider see consistent job status.
5. Review/payment actions become available only when the backend confirms eligibility.

### 8.4 Messaging
1. An authorized user opens a conversation associated with a permitted job or relationship.
2. Messages load from the messaging service.
3. The sender sees sending, success, or failure feedback.
4. The other participant receives the message according to the actual delivery model.
5. The interface must not treat a locally appended message as delivered.

### 8.5 Payment and dispute
1. Frontend displays the authoritative order/job amount and supported payment options.
2. Payment is initiated through the approved backend/payment-provider integration.
3. Payment status is updated only from a trusted result.
4. Completion, release, refund, and dispute transitions follow approved backend rules.
5. Admin tools may inspect or act on payment/dispute records only with explicit permission.

## 9. Shared functional requirements

- **Navigation:** Each application has clear role-appropriate navigation and active-page indication.
- **Responsive UI:** Test widths of 320, 375, 430, 768, 1024, 1280, and 1440 pixels.
- **Accessibility:** Semantic HTML, labelled inputs, keyboard-accessible controls, visible focus, contrast, useful alt text, and accessible validation/error messages.
- **Forms:** Required-field indicators, validation, submission state, disabled duplicate submission, success/error feedback, and preservation of input on recoverable errors.
- **Data states:** API-driven views cover loading, populated, empty, failed, forbidden/unauthorized, and session-expired states where applicable.
- **Localization:** Use `₦`, `en-NG` number/currency formatting, and appropriate Nigerian phone/location examples.
- **Security:** No secrets in client bundles; no frontend-only authorization; no sensitive data in logs; no unsafe trust of client-supplied values.
- **Performance:** Lazy-load suitable screens, use stable keys, paginate large lists, debounce expensive searches where appropriate, and optimize images.
- **Consistency:** Shared terminology for jobs, bids, status, payments, and verification across all apps.

## 10. API and integration requirements

The backend is the source of truth for authentication, authorization, persistence, job rules, bids, status transitions, payments, verification, messages, and reviews.

Before integrating a feature, document the approved contract:
- HTTP method and endpoint.
- Authentication and role requirements.
- Query parameters and request body.
- Successful response shape.
- Validation and conflict responses.
- Unauthorized/forbidden behavior.
- Pagination and sorting conventions.
- Upload constraints and response shape where applicable.

Do not invent undocumented endpoints or silently substitute local state for server persistence. If the backend contract is not available, record the dependency and keep any prototype clearly labelled as mock data.

## 11. Non-functional requirements

- Maintain separate, independently runnable applications.
- Keep components focused and avoid unnecessary cross-app coupling.
- Prefer existing design tokens and CSS conventions.
- Do not introduce frameworks or state-management libraries without a demonstrated need.
- Provide useful error feedback without exposing stack traces or internal server details.
- Confirm destructive or financially consequential actions.
- Preserve auditability for admin actions where backend support exists.
- Avoid fake data in production-facing summaries; clearly label demo content.

## 12. Prioritization

### P0 — Foundation and trust
- Confirm app boundaries and shared visual language.
- Establish authentication/session UI states and backend contracts.
- Replace misleading mock success with explicit prototype labels or real integration.
- Fix inert controls and critical validation.
- Add loading, empty, error, forbidden, and responsive states.
- Ensure payment and job status are never faked.

### P1 — Core marketplace
- Customer discovery and job posting.
- Provider onboarding/profile/services.
- Provider job discovery and bids.
- Customer bid review/selection where supported.
- Shared job status and job details.
- Messaging tied to authorized customer/provider relationships.

### P2 — Fulfilment and operations
- Job progress/completion workflows.
- Payment integration and authoritative payment history.
- Reviews after eligible completed jobs.
- Admin customer/provider/job management.
- Provider verification and support/dispute queues.

### P3 — Optimization
- Analytics and exports.
- Advanced filters and saved preferences.
- Notification preference management.
- Improved search, pagination, and measured performance optimizations.

## 13. Acceptance criteria

A feature is complete only when:
1. It implements the approved behavior for the correct application and role.
2. It uses the documented backend contract, or clearly identifies itself as a prototype.
3. It handles the happy path and validation failures.
4. It handles loading, empty, error, and permission states where applicable.
5. It does not claim persistence, payment, delivery, verification, or status changes that the server has not confirmed.
6. It is keyboard-accessible and responsive on supported screen sizes.
7. Relevant tests/manual checks pass.
8. ESLint and the production build pass for the changed application.
9. No unrelated files or undocumented API assumptions are introduced.

## 14. Audit caveats

- This document reflects source files successfully inspected on the repository's `main` branch at the review date.
- The customer features listed as present are UI/source-level features; many use mock data or local React state.
- The provider and admin requirements are derived from the repository's root `AGENTS.md` product boundaries and are not evidence that those applications already exist.
- Re-scan the repository before treating this document as a definitive release inventory.
