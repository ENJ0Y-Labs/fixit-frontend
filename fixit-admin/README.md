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

The initial scaffold provides a responsive administration shell, workspace navigation, and a sample platform overview. Dashboard figures and activity rows are illustrative mock data and are labelled as such. They are not live customer, provider, job, or revenue records.

The following sections are navigation placeholders for subsequent feature work:

- Customers
- Providers
- Verification
- Jobs
- Disputes & support
- Categories
- Analytics
- Settings

No authentication, role enforcement, destructive admin action, persistence, or backend endpoint is implemented in this scaffold. The backend must enforce all admin authorization and provide approved API contracts before data integration begins.

Check responsive layouts at 320, 375, 768, 1024, and 1440 pixels. Use keyboard navigation to verify visible focus, activate navigation with Enter/Space, and close the mobile menu with Escape.
