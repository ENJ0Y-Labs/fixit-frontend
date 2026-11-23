# FixIt Customer Frontend

Standalone React + Vite + JavaScript application for the FixIt customer marketplace.

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

## Current scope

The customer application includes home/provider discovery, search and filters, My Jobs, job posting, job details, payment UI, reviews, messages, account UI, shared navigation, and responsive styling.

The current implementation is a frontend prototype. Provider and job records, conversations, and profile data use sample data or local component state. Local job creation/cancellation, profile edits, and message composition do not confirm server persistence or delivery. Payment screens do not process payments. The customer workspace is gated by API-backed login/session restoration and includes customer registration and logout flows. My Jobs and Job Details now call the proposed `GET /customer/me/jobs`, `GET /customer/me/jobs/{jobId}`, and `POST /customer/me/jobs/{jobId}/cancel` routes. They show API loading, empty, unavailable, and error states without substituting demo jobs. The customer job endpoint and response contract is documented in [JOBS_API.md](./JOBS_API.md). Authentication and job routes follow the proposed endpoint catalogue in the [root README](../README.md#backend-api-contract-and-endpoint-catalogue). No backend is currently deployed, so these screens will show the unconfigured/error state until the backend implements the contract and the app is configured with `VITE_API_BASE_URL`. Other marketplace records and workflows remain mock-driven.

## Tests

Vitest runs in jsdom with Testing Library. The starter suite covers the home screen, provider search filtering, and navigation to the Post a Job screen. Extend the suite when adding or changing customer workflows.

Check responsive layouts at 320, 375, 430, 768, 1024, and 1440 pixels. Also test keyboard navigation, form validation, empty states, and error states as those flows are implemented.


## Public guest experience

The root route opens the public landing page. Visitors can browse the marketplace and public provider profiles without signing in; account authentication is requested only for protected customer actions. Provider discovery uses `GET /public/providers` and individual profiles use `GET /public/providers/{providerId}` when the backend is configured. Until those endpoints are available, the app uses the isolated `src/home/providers.js` fixtures and labels them as sample listings. See [Public marketplace API contract](./PUBLIC_MARKETPLACE_API.md) for the proposed response fields and privacy rules.
