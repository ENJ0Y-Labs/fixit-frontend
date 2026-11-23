# Customer authentication integration

The customer UI now consumes the proposed shared FixIt v1 authentication endpoints. This document records the frontend assumptions so the backend can implement and confirm them before deployment.

## Requests currently sent by the customer app

| Method | Endpoint | Request |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, phone, password, role: "customer" }` |
| POST | `/auth/login` | `{ email, password }` |
| GET | `/auth/me` | No body; restores the current session |
| POST | `/auth/logout` | No body; invalidates the current session |

The UI currently expects the login and session response to contain a user in either `{ data: { user: {...} } }` or `{ data: {...userFields} }`. The API client also supports the recommended `{ error: { message } }` and `{ message }` error message shapes.

These field names and response shapes are frontend proposals, not implemented backend guarantees. Confirm them with the backend before changing the API client or releasing the integration.

## Session and browser requirements

- Requests use `credentials: "include"` so the browser can send and receive the backend session cookie.
- The backend should issue an HttpOnly, Secure, SameSite session cookie and document its domain, lifetime, expiry behavior, and logout invalidation.
- The backend must define a CSRF token delivery and validation mechanism for cookie-authenticated state-changing requests. The frontend currently has no agreed CSRF token endpoint/header/cookie contract, so logout and future authenticated mutations must not be considered production-ready until that mechanism is defined and implemented.
- For cross-origin deployments, document exact allowed origins, credentialed CORS headers, and cookie settings. Wildcard origins cannot be used with credentialed requests.
- `VITE_API_BASE_URL` is public configuration, not a secret. Set it in `fixit-customer/.env.local`.

## Current limitations

There is no backend service yet. Login, registration, session restoration, and logout will return configuration/network errors until the API is available. Frontend route protection prevents accidental UI access but is not authorization; every protected backend route must independently enforce the customer session and resource ownership.

No local password, localStorage token, or fake authenticated session is created by this frontend.
