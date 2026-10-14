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

## Current foundation

The application includes a responsive provider shell and a lightweight design system: CSS tokens, typography, buttons, form controls, cards, status badges, dialog styling, visible keyboard focus, and a desktop sidebar that becomes a dismissible mobile navigation drawer. The dashboard content is illustrative mock data and is not connected to an API.

The component tests cover the dashboard render, active navigation, and mobile menu open/close behavior. Check responsive layouts manually at 320, 375, 768, 1024, and 1440 pixels. Use Tab and Shift+Tab to check focus visibility, Enter/Space to activate controls, and Escape to close the mobile menu.

Provider workflows, API integrations, and authentication UI will be implemented in subsequent focused changes. Backend authorization remains the backend's responsibility.
