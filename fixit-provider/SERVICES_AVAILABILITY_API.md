# Provider services and availability API contract

**Status:** frontend planning document only. No matching backend endpoint has been confirmed or called by this application. The UI currently keeps edits in component state and explicitly labels its confirmation as demo-only.

Before connecting the UI, backend and frontend owners must agree on the final paths, response envelopes, and permitted service catalogue.

## Services

The frontend needs to:

- Read the provider's service listings and permitted service catalogue.
- Create a listing, update its description and pricing, and remove a listing only when backend rules permit it.
- Distinguish a missing price from an invalid price. A supplied price must be a positive NGN amount.
- Preserve edits when a request fails, and show a field-level or page-level error without claiming success.

Proposed operation shapes, not existing endpoints:

| Operation | Proposed method/path | Expected behavior |
| --- | --- | --- |
| Read listings and catalogue | GET /api/provider/services | Return permitted catalogue options and this provider's listings |
| Add a listing | POST /api/provider/services | Validate catalogue membership and listing limits server-side |
| Update a listing | PATCH /api/provider/services/{serviceId} | Update only fields the provider is allowed to change |
| Remove a listing | DELETE /api/provider/services/{serviceId} | Reject removal if a backend rule prevents it |

A service listing needs an identifier, catalogue service identifier, display name, description, pricing mode (from, fixed, or quote), and optional positive integer price in NGN. The backend remains authoritative for catalogue membership, ownership, pricing rules, and removal permissions.

## Availability

The frontend needs to read and update a provider's availability flag and weekly schedule.

Proposed operation shapes, not existing endpoints:

| Operation | Proposed method/path | Expected behavior |
| --- | --- | --- |
| Read availability | GET /api/provider/availability | Return availability flag and weekly schedule |
| Replace availability | PUT /api/provider/availability | Validate and replace the provider's availability settings |

Each weekly schedule entry should identify a weekday, whether the provider works that day, and local start/end times in HH:mm format. The backend must define the timezone policy, validate end times, and reject unsupported overnight schedules if that is the agreed product rule. Turning availability off must not silently erase the saved weekly hours unless product rules explicitly require that behavior.

## Shared requirements

- Require an authenticated provider session and enforce provider ownership on the server.
- Return consistent validation errors that can be mapped to individual fields.
- Define responses for unauthenticated/expired sessions, forbidden operations, conflicts, validation failures, rate limits, and server errors.
- The UI must retain unsaved values after recoverable request failures and display success only after the server confirms persistence.
- Agree on catalogue identifiers and permitted service limits before replacing the current illustrative local catalogue.
- Do not treat client-side validation or disabled controls as authorization or data-integrity protection.
