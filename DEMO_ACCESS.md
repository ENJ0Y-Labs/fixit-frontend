# FixIt local demo access

The `demo` branch includes a local-only account for previewing the customer, provider, and admin interfaces without a running backend.

## Demo credentials

- Email: `demo@fixit.local`
- Password: `FixitDemo123!`

Use the same credentials in each app. Each workspace stores its demo session separately in the browser.

## Start the applications

Open three terminals from the repository root.

Customer:
```bash
cd fixit-customer
npm install
npm run dev
```
Open http://localhost:5173

Provider:
```bash
cd fixit-provider
npm install
npm run dev
```
Open http://localhost:5174

Admin:
```bash
cd fixit-admin
npm install
npm run dev
```
Open http://localhost:5175

If dependencies are already installed, skip `npm install`.

## What this demo does

- Customer demo login opens the authenticated customer workspace.
- Provider demo login opens the provider dashboard and workspace navigation.
- Admin demo login opens the administration console and its available sections.
- Demo sessions persist in the current browser until you log out or clear that app's site data.
- The apps use the existing illustrative/mock UI data. Demo login does not create backend users or persist changes to a server.

## Important security boundary

Demo authentication is enabled only by Vite development builds. Production builds do not accept these credentials and continue using the configured backend authentication flow. The demo account is a frontend preview convenience, not real authentication or authorization. Never use this account to protect production data.

To reset access, use the app's Log out control or clear the corresponding localhost site's local storage.
