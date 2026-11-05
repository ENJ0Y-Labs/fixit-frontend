# FixIt Admin Frontend

Standalone React + Vite + JavaScript application for FixIt platform administration.

## Requirements

- Node.js 22 or a version supported by the Vite release in this project
- npm

## Install

From this directory:

```bash
npm ci
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

## Current implementation

The admin application currently includes:

- **Dashboard:** illustrative platform overview and sample activity.
- **Customers:** searchable customer directory, account-status filtering, pagination, and read-only details.
- **Providers:** searchable provider directory, verification/account/service filters, pagination, and read-only details.
- **Verification:** searchable review queue, status filters, document checklists, provider context, review notes, and demo-only decision controls.
- **Jobs:** searchable marketplace job list, status/category filters, summary counts, pagination, and a read-only details panel.
- **Disputes & Support:** searchable case inbox, type/status/priority filters, sample timelines, evidence metadata, participant context, and demo-only notes/status controls.
- **Categories:** searchable service-category directory, active/inactive filtering, details, example services, and demo-only create/edit/status controls.
- **Analytics:** selectable 7/30/90-day sample reporting, job activity trends, status distribution, top categories, registration counts, and an estimated sample job-budget total.
- **Settings:** demo-only notification and regional/display preferences, read-only demo account/environment information, and reset/apply controls.

There are no navigation placeholders in the current Settings workspace. Settings is implemented as a UI prototype, not as persistent platform configuration.

## Prototype boundaries

All dashboard figures, job/customer/provider records, document metadata, amounts, activity details, notes, decisions, and preference changes are illustrative or held in temporary browser state. They are not live platform records.

- Dashboard and analytics figures are sample aggregates, not live reporting.
- Estimated job value is based on sample customer-requested budgets. It is not confirmed revenue, agreed job prices, provider earnings, or payments.
- Customer, provider, and job details are read-only demo views.
- Verification decisions do not approve providers, notify users, or persist.
- Support controls do not send messages, assign real cases, retrieve private evidence, resolve disputes, or issue refunds.
- Category controls do not change customer discovery, provider listings, or existing jobs.
- Settings preferences reset on reload and are not sent to a server.
- No production admin authentication, backend authorization, persistence, or operational API is connected.

The admin account-management page previously merged in PR #26 was reverted in PR #27. It was a temporary profile editor without an approved authentication/session contract or persistent account/security behavior. It is intentionally not listed as an available workspace. Revisit it only after product and backend owners define the supported account operations.

The backend must enforce all admin permissions. Frontend visibility or disabled controls are not security boundaries.

## Responsive and interaction checks

Check 320, 375, 430, 768, 1024, and 1440 pixel widths. Use keyboard navigation to verify visible focus, activate controls with Enter/Space, and verify dialogs and mobile navigation can be operated without a mouse.

For each workspace, verify search/filter behavior, empty results, pagination where present, and clear labels for demo-only actions. For Analytics, switch between 7, 30, and 90 days and confirm estimated job value is not described as revenue or payments. For Settings, change and reset the sample preferences and confirm the page explains that changes are temporary.
