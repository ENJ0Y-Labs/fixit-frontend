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

The admin application provides a responsive administration shell and illustrative platform overview. The Customers workspace includes a searchable directory, account-status filtering, pagination, and read-only customer details. The Providers workspace includes a searchable directory, verification/account/service filters, pagination, and read-only provider details. The Verification workspace includes a searchable review queue, status filters, document checklists, provider context, review notes, and demo-only decision controls. The Jobs workspace includes a searchable marketplace job list, status/category filters, summary counts, pagination, and a read-only job details panel. The Disputes & support workspace combines service disputes and general support requests in a searchable case inbox with type/status/priority filters, sample conversation timelines, evidence metadata, participant context, and demo-only notes/status controls.

All dashboard figures, job records, customer/provider records, document metadata, amounts, and activity details are illustrative mock data, not live platform records. The Disputes & support workspace uses illustrative case records and does not send messages, assign cases, retrieve evidence, issue refunds, or resolve real disputes. Notes and status changes exist only in browser memory. The Jobs workspace uses the established customer-facing statuses: `AWAITING_BIDS`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`. The displayed budget is a sample customer-requested amount, not a confirmed quote, agreed amount, or payment.

The following sections remain navigation placeholders:

- Categories
- Analytics
- Settings

No authentication, role enforcement, destructive admin action, persistence, or backend endpoint is implemented. Customer, provider, and job details are read-only. Verification decision controls update only in-memory demo state and reset on refresh; they do not approve providers, notify users, or persist decisions. Real job assignment, cancellation, status changes, payment information, document retrieval, secure upload/storage, reviewer audit history, verification decisions, support messaging, case assignment, dispute resolution, refund handling, and support audit history require approved backend contracts and server-side authorization. The backend must enforce all admin authorization before data integration or account/job mutations are added.

## Responsive and interaction checks

Check 320, 375, 430, 768, 1024, and 1440 pixel widths. Use keyboard navigation to verify visible focus, activate navigation with Enter/Space, and close the mobile menu with Escape. For Jobs, test search by job/customer/provider/location, status and category filters, clear filters, empty results, pagination, and the read-only detail panel. For Disputes & support, test search, case type/status/priority filters, clear filters, empty results, pagination, case timeline, evidence metadata, temporary notes, and demo-only status changes.
