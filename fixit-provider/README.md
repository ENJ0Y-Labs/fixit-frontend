# FixIt Provider Frontend

Standalone React + Vite + JavaScript application for the FixIt service-provider workspace.

## Requirements

- Node.js compatible with the Vite version in `package-lock.json`
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

The smoke test verifies that the provider app renders its welcome heading. The production build is written to `dist/`; confirm `dist/index.html` exists after a successful build.

## Scope

This commit establishes the automated component-testing foundation. Provider workflows, API integrations, and authentication UI will be implemented in subsequent focused changes. Backend authorization remains the backend's responsibility.
