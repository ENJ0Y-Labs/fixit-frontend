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

The current implementation is a frontend prototype. Provider and job records, conversations, and profile data use sample data or local component state. Local job creation/cancellation, profile edits, and message composition do not confirm server persistence or delivery. Payment screens do not process payments. Real authentication, authorization, uploads, messaging, and persistent preferences require approved backend contracts.

## Tests

Vitest runs in jsdom with Testing Library. The starter suite covers the home screen, provider search filtering, and navigation to the Post a Job screen. Extend the suite when adding or changing customer workflows.

Check responsive layouts at 320, 375, 430, 768, 1024, and 1440 pixels. Also test keyboard navigation, form validation, empty states, and error states as those flows are implemented.
