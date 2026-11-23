# Customer Jobs API Contract

This document describes the proposed customer job endpoints consumed by the customer My Jobs and Job Details screens. The repository currently contains frontend API scaffolding only; these routes must be implemented and confirmed by the backend before live job data is available.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/customer/me/jobs?limit=50&cursor=<opaque>` | List jobs owned by the authenticated customer |
| GET | `/customer/me/jobs/{jobId}` | Read one job owned by the authenticated customer |
| POST | `/customer/me/jobs/{jobId}/cancel` | Request cancellation; server validates whether the current state permits it |

All paths are relative to the configured `VITE_API_BASE_URL`. The backend must enforce customer authentication and ownership. A frontend route or hidden control is not authorization.

## List response

Use the repository's standard list envelope:

```json
{
  "data": {
    "items": [
      {
        "id": "job_123",
        "title": "Repair kitchen tap",
        "description": "The kitchen tap is leaking.",
        "category": { "name": "Plumbing" },
        "status": "IN_PROGRESS",
        "scheduledAt": "2026-11-23T10:00:00+01:00",
        "serviceLocation": "Rumuola, Port Harcourt",
        "agreedPrice": 1200000,
        "payment": {
          "id": "payment_456",
          "status": "ESCROWED"
        },
        "provider": {
          "id": "provider_12",
          "name": "Provider name",
          "profession": "Plumber",
          "avatarUrl": "https://example.invalid/avatar.jpg",
          "ratingSummary": { "average": 4.8, "count": 12 }
        },
        "bidCount": 2,
        "availableActions": ["cancel"]
      }
    ],
    "nextCursor": null
  }
}
```

The money example is illustrative only. Before implementation, backend and frontend teams must agree whether monetary values are integer kobo or decimal-string naira and update the example accordingly.

## Single-job response

Return the canonical job resource using the same fields as a list item:

```json
{
  "data": {
    "id": "job_123",
    "title": "Repair kitchen tap",
    "status": "IN_PROGRESS",
    "availableActions": ["cancel"]
  }
}
```

The UI only enables actions explicitly returned by the backend. `availableActions` is an array of action identifiers; currently the customer screen recognizes `cancel`. Do not infer permission from a status label alone. Add a new action only after its backend behavior and authorization rules are documented.

## Fields and status values

Required for useful job presentation:

- `id`, `title`, `status`
- `category` as a string or an object with `name`
- Optional `description`, `scheduledAt`, `serviceLocation`, `fullAddress`, `urgency`
- Optional `agreedPrice` or `budget`; omit when no amount has been set
- Optional `provider` summary; omit when no provider has been assigned
- Optional `payment` summary; never imply escrow or payment success without server state
- Optional `photos` and `progressTimeline`
- `availableActions` to declare actions permitted for this resource and current state

Customer-facing status values currently understood by the UI include `AWAITING_BIDS`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`. The normalizer also accepts common aliases such as `PENDING`, `OPEN`, `ASSIGNED`, and `CANCELED`. The backend remains the source of truth and must document its canonical enum.

## Cancellation

The client sends `POST /customer/me/jobs/{jobId}/cancel`. The backend must re-check ownership and current job state, then return the canonical updated job. The UI only updates its list after the response confirms `status: "CANCELLED"`. Validation, forbidden, not-found, and conflict responses must use the shared API error envelope.

## Privacy and correctness

- Return only the signed-in customer's jobs.
- Do not return private provider/customer contact details unless a separate authorized feature explicitly needs them.
- Do not include internal moderation or security fields.
- Do not send mock/demo jobs in production responses.
- Use ISO 8601 timestamps with timezone offsets.
- Return canonical saved resources after mutations.
- The frontend displays unknown statuses as received rather than silently relabelling them.
