# FixIt Admin Frontend

Standalone React + Vite + JavaScript application for FixIt platform administration.

## Requirements

- Node.js compatible with the Vite version in this package
- npm

## Install

From this directory:

```bash
npm install
```

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

## Current scope

The admin application provides a responsive administration shell and illustrative platform overview. The Customers workspace includes a searchable directory, account-status filtering, pagination, and read-only customer details. The Providers workspace includes a searchable directory, verification/account/service filters, pagination, and read-only provider details. The Verification workspace includes a searchable review queue, status filters, document checklists, provider context, review notes, and demo-only decision controls. The Jobs workspace includes a searchable marketplace job list, status/category filters, summary counts, pagination, and a read-only job details panel. The Disputes & support workspace combines service disputes and general support requests in a searchable case inbox with type/status/priority filters, sample conversation timelines, evidence metadata, participant context, and demo-only notes/status controls. The Categories workspace provides a searchable service-category directory, active/inactive filtering, category details and example services, plus demo-only create/edit/status controls. The Analytics workspace provides selectable 7/30/90-day sample reporting, job activity trends, job status distribution, top service categories, customer/provider registration counts, and a clearly qualified estimated job-budget total. The Settings workspace provides demo-only notification and regional/display preferences, read-only environment information, and reset/apply controls. The Account workspace provides a temporary demo profile editor, read-only authentication/security availability information, and navigation to workspace settings.

All dashboard figures, job records, customer/provider records, document metadata, amounts, and activity details are illustrative mock data, not live platform records. The Disputes & support workspace uses illustrative case records and does not send messages, assign cases, retrieve evidence, issue refunds, or resolve real disputes. Notes and status changes exist only in browser memory. The Jobs workspace uses the established customer-facing statuses: `AWAITING_BIDS`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`. The displayed budget is a sample customer-requested amount, not a confirmed quote, agreed amount, or payment.

The following sections remain navigation placeholders:

- Settings

Analytics charts, period summaries, status distributions, category rankings, and estimated job-value totals are illustrative sample aggregates, not live reporting. The estimated job value sums sample customer-requested budgets and is not confirmed revenue, agreed job prices, provider earnings, or payments. The reporting-period selector changes only the displayed sample dataset. No analytics API is connected. Settings preferences exist only in component memory, reset when the page is reloaded, and are not sent to a server or persisted. The Account workspace profile fields are temporary browser state only. No authenticated admin identity is loaded, and no profile data is persisted. Password changes, session revocation, multi-factor authentication, and sign-in history are not connected. Settings environment information is read-only; no real notification delivery, role, or platform configuration management is implemented. Category records and all category management controls are illustrative. Creating, editing, or changing a category status updates browser memory only and does not affect customer discovery, provider listings, service records, or existing jobs. No authentication, role enforcement, destructive admin action, persistence, or backend endpoint is implemented. Customer, provider, and job details are read-only. Verification decision controls update only in-memory demo state and reset on refresh; they do not approve providers, notify users, or persist decisions. Real job assignment, cancellation, status changes, payment information, document retrieval, secure upload/storage, reviewer audit history, verification decisions, support messaging, case assignment, dispute resolution, refund handling, and support audit history require approved backend contracts and server-side authorization. The backend must enforce all admin authorization before data integration or account/job mutations are added.

## Responsive and interaction checks

Check 320, 375, 430, 768, 1024, and 1440 pixel widths. Use keyboard navigation to verify visible focus, activate navigation with Enter/Space, and close the mobile menu with Escape. For Jobs, test search by job/customer/provider/location, status and category filters, clear filters, empty results, pagination, and the read-only detail panel. For Disputes & support, test search, case type/status/priority filters, clear filters, empty results, pagination, case timeline, evidence metadata, temporary notes, and demo-only status changes. For Categories, test search, active/inactive filtering, empty results, pagination, details, example services, create/edit validation, duplicate-name validation, and demo-only status changes. For Analytics, switch between 7, 30, and 90 days, verify that summary totals and chart labels update, inspect the job-status and category breakdowns, and confirm estimated job value is not presented as revenue or payments. For Settings, toggle each notification preference, change time zone/date format, apply preferences, reset defaults, and verify the demo-only notice. For Account, test required display-name validation, email validation, applying and clearing the temporary profile, the Settings shortcut, and the unavailable authentication/security states.
