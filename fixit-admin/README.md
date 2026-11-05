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

The admin application provides a responsive administration shell and a sample platform overview. The Customers workspace includes a searchable directory, account-status filtering, pagination, and a read-only customer details panel. The Providers workspace includes a searchable directory, verification/account/service filters, pagination, and a read-only provider details panel. The Verification workspace includes a searchable review queue, status filters, document checklists, provider context, review notes, and demo-only decision controls. Dashboard figures and customer/provider records are illustrative mock data, not live platform records.

The following sections remain navigation placeholders:

- Jobs
- Disputes & support
- Categories
- Analytics
- Settings

No authentication, role enforcement, destructive admin action, persistence, or backend endpoint is implemented. Customer and provider profiles are read-only; account suspension/restoration and profile edits require approved admin API contracts and backend authorization. Verification cases and document references are illustrative. Decision controls update only in-memory demo state and reset on refresh; they do not approve providers, notify users, or persist decisions. Real document retrieval, secure upload/storage, reviewer audit history, and verification decisions require an approved backend contract and server-side authorization. The backend must enforce all admin authorization and provide approved API contracts before data integration or account mutations are added.

Check responsive layouts at 320, 375, 430, 768, 1024, and 1440 pixels. Use keyboard navigation to verify visible focus, activate navigation with Enter/Space, and close the mobile menu with Escape.
