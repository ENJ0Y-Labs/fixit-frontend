# Provider API contracts

**Status: proposed contract, not a statement of existing backend behavior.** The frontend currently has no confirmed provider API integration. Endpoint paths and payloads below are a concrete proposal for backend review; they must not be treated as live routes until the backend owner confirms the base path, authentication mechanism, field names, and status enums.

## Contract rules

- JSON is UTF-8. Object fields use camelCase. Every persisted resource has a stable opaque `id`.
- All provider routes require an authenticated provider unless a route is explicitly marked public. The backend derives the provider identity from the authenticated session/token; clients must not send a trusted `providerId` to choose whose data is read or changed.
- The backend enforces authorization, ownership, validation, state transitions, persistence, and payment rules. Hiding a control in React is not authorization.
- Dates are ISO 8601 timestamps with a timezone. Money is represented as integer kobo or decimal-string NGN only after the backend chooses and documents one representation. The current UI's number calculations assume NGN major units, so the backend must explicitly confirm the wire format before integration.
- List endpoints use a consistent pagination contract. Recommended query: `?limit=20&cursor=<opaque-cursor>`. Recommended response: `{ "items": [], "nextCursor": null }`. The backend must set a maximum page size.
- Mutations return the canonical persisted resource, not merely `{ "success": true }`. A UI must not claim a save/send/status change succeeded without a valid server confirmation.
- No real-time delivery, payout, or persisted-settings behavior should be claimed unless the corresponding backend capability is implemented and confirmed.

## Proposed endpoint map

All paths below are relative to `VITE_API_BASE_URL`.

| Capability | Method and path | Purpose |
| --- | --- | --- |
| Current provider | `GET /provider/me` | Read authenticated provider profile and capability flags |
| Update profile | `PATCH /provider/me` | Update editable profile fields |
| Provider services | `GET /provider/me/services` | List configured services |
| Add service | `POST /provider/me/services` | Add a service |
| Update/remove service | `PATCH /provider/me/services/{serviceId}`, `DELETE /provider/me/services/{serviceId}` | Change or remove a service |
| Availability | `GET /provider/me/availability`, `PUT /provider/me/availability` | Read or replace provider availability |
| Job opportunities | `GET /provider/jobs?status=available` | List jobs available to this provider |
| Job details | `GET /provider/jobs/{jobId}` | Read an authorized job summary |
| Provider bids | `GET /provider/me/bids`, `POST /provider/jobs/{jobId}/bids` | List bids and submit a bid |
| My jobs | `GET /provider/me/jobs?status={server-defined-status}` | List jobs associated with the authenticated provider |
| Job progress | `PATCH /provider/me/jobs/{jobId}/progress` | Request an allowed progress transition |
| Conversations | `GET /provider/me/conversations` | List conversations and unread counts |
| Conversation messages | `GET /provider/me/conversations/{conversationId}/messages` | List messages in a conversation |
| Send message | `POST /provider/me/conversations/{conversationId}/messages` | Persist a message and return it |
| Earnings/payment history | `GET /provider/me/earnings` | Return categorized earnings/payment records |
| Reviews | `GET /provider/me/reviews` | Return reviews and an optional defined summary |
| Settings | `GET /provider/me/settings`, `PATCH /provider/me/settings` | Read or persist supported preferences |
| Dashboard | `GET /provider/me/dashboard` | Return server-derived dashboard counts and amounts |

This map is a proposal. Do not silently substitute a similarly named route if the backend differs. Resolve discrepancies with the backend owner and update this document before implementing the API client.

## Payload shapes to agree on

These are suggested minimum fields, not a claim that the backend already returns them.

### Provider profile

```json
{
  "id": "provider-id",
  "displayName": "Example Provider",
  "phone": "+234...",
  "bio": "",
  "serviceArea": ["Port Harcourt"],
  "status": "backend-defined",
  "updatedAt": "2026-01-01T10:00:00Z"
}
```

The backend must define editable fields, verification states, and any profile completeness calculation. Never invent verification status on the client.

### Services and availability

A service should have `id`, a backend-owned category/service identifier, display name, and server-defined status. Availability should use a documented weekday/time-zone representation, including behavior for overnight windows, exceptions, and unavailable dates. Do not infer a backend enum from a UI label.

### Jobs and bids

Job responses need stable IDs, display title/description, service/location details allowed for the current provider, server-defined status, and timestamps. Bid responses need stable IDs, job ID, amount in the agreed wire format, optional message, server-defined status, and timestamps. The backend must document which transitions are allowed and return a conflict response if the job is no longer available. Job status values must come from the backend contract; the frontend must not invent them.

### Job progress

The request should specify the requested transition and any required note. The server validates that transition against the job's current state and provider permissions, then returns the canonical updated job. Agree on the exact request fields and status enum before implementation.

### Messages

Suggested conversation fields: `id`, customer display name where permitted, job reference/title where permitted, `lastMessage`, `updatedAt`, and server-derived `unreadCount`.

Suggested message fields: `id`, `conversationId`, `senderRole`, `body`, and `createdAt`. Sending accepts a non-empty trimmed `body`; the response must include the persisted message's stable ID and canonical body. The server enforces participant access, message length, rate limits, and content policy. A 2xx response without a valid persisted message is not sufficient for a success notice.

### Earnings and payments

Each record needs `id`, `reference`, optional job ID/title, amount, an explicit classification (`estimated`, `agreed`, or `paid`), server-defined payment status, and timestamp. The backend must define whether amounts are gross/net, whether the wire amount is kobo or naira, and how fees, refunds, partial payments, and reversals are represented. Never calculate paid earnings from agreed amounts.

Payout setup, bank-account management, withdrawals, and payout status require a separately reviewed payment-provider contract. Until it exists, these operations remain unavailable and must not be simulated.

### Reviews

A review should include `id`, permitted customer display name, job reference/title, rating with an agreed range, optional comment, and timestamp. If a summary is returned, document how its average and count are calculated. An empty list must not be replaced by a made-up rating.

### Settings

Return persisted notification preferences and the server-supported locale list. Updates return the canonical saved settings. The UI must keep edits marked unsaved if the request fails or the server does not return valid persisted settings. Defaults shown before the first successful read are local draft values, not account settings.

### Dashboard

Return counts and financial categories as separately typed values. Suggested categories are opportunity count, bids awaiting response, accepted jobs, work in progress, completed jobs, and estimated/agreed/paid amounts. Define the exact counting rules, time window, currency wire format, and whether each value is present. The dashboard must not label mock/sample data as live account data.

## Common response and error contract

Recommended success shape for single-resource responses:

```json
{ "data": { "id": "resource-id" } }
```

Recommended error shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A human-readable explanation",
    "details": {}
  }
}
```

Agree on whether the API uses this wrapper or direct resource objects before writing the API client. Do not support two response formats by guessing.

| HTTP status | Meaning | Frontend behavior |
| --- | --- | --- |
| `400` / `422` | Invalid request or field validation | Show field-level or actionable validation feedback |
| `401` | Missing, invalid, or expired authentication | Show sign-in/session-expired state; do not retry mutations blindly |
| `403` | Authenticated but not allowed | Show access-denied state |
| `404` | Resource does not exist or is intentionally concealed | Show unavailable/not-found state |
| `409` | Conflict, stale state, or invalid transition | Refresh the affected resource and explain the conflict |
| `429` | Rate limit | Respect any `Retry-After` header |
| `5xx` or network failure | Server/network problem | Preserve unsent drafts and edits; show retry guidance |

## Authentication and browser security

The backend owner must explicitly choose the authentication model before implementation.

- If using an HttpOnly cookie session, the client will normally need `credentials: "include"`, a precise CORS allowlist, and appropriate CSRF protection for state-changing requests.
- If using bearer tokens, document where tokens are obtained, refreshed, and stored safely. Never put private keys or long-lived secrets in Vite variables or source control.
- Never assume that a frontend route or hidden control protects a resource. The backend authorizes every request.
- Cross-origin cookies, CORS, CSRF, session expiry, and refresh behavior must be tested against the actual deployed backend.

## Environment configuration

The provider app uses Vite. Only variables prefixed with `VITE_` are exposed to browser code and must be treated as public configuration.

1. Copy `.env.example` to `.env.local` in `fixit-provider/`.
2. Set `VITE_API_BASE_URL` to the backend API base URL approved by the backend team. The value in the example is a local placeholder, not a confirmed server address.
3. Restart `npm run dev` after changing environment variables.
4. Keep `.env.local` out of version control. Commit only safe examples with no credentials.
5. Validate the URL and fail clearly when it is missing or malformed once the API client is implemented. Do not silently fall back to production or to mock data.

## Backend approval checklist

Before integration starts, record decisions for:

- [ ] API origin and version prefix
- [ ] Authentication/session model, CORS, CSRF, and expiry behavior
- [ ] Canonical success/error envelope
- [ ] Pagination and filtering conventions
- [ ] Exact field names and nullable fields for every resource
- [ ] Job/bid/payment status enums and permitted transitions
- [ ] Money wire format and gross/net/refund semantics
- [ ] Payout capability and payment-provider ownership
- [ ] Settings persistence and supported locales
- [ ] Rate limits, retry behavior, and idempotency for mutations
- [ ] Contract tests or a staging environment with representative responses

The UI phase is not server integration. Implement the API layer only after these decisions are confirmed.
