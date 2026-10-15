# Provider My Jobs and progress API requirements

## Integration status

The provider frontend currently has no confirmed endpoint for assigned jobs or contract for allowed job transitions. The UI accepts injected data and an `onTransitionJob(jobId, request)` callback for integration and tests. The default screen explicitly says the API is not connected; it does not manufacture jobs or pretend status changes were saved.

The routes and fields below are proposals for backend review, not claims that the endpoints already exist.

## List provider-assigned jobs

Proposed route:

`GET /api/provider/jobs?scope=assigned&page=1&limit=20`

Authentication: provider session required.

Proposed response shape:

```json
{
  "items": [
    {
      "id": "server-job-id",
      "title": "Repair leaking kitchen sink",
      "description": "Inspect the pipe joint and repair the leak.",
      "location": "Rumuola, Port Harcourt",
      "customerReference": "customer-safe-reference",
      "agreedAmount": 24500,
      "status": "SERVER_DEFINED_STATUS",
      "statusCategory": "upcoming",
      "allowedTransitions": ["SERVER_DEFINED_TRANSITION"],
      "version": 7,
      "updatedAt": "2026-10-15T10:30:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 1
}
```

- `status` is the exact backend-owned status value. The frontend displays it without substituting a locally invented status.
- `statusCategory` is a presentation grouping field, not a job status. The proposed values are `upcoming`, `in-progress`, `completed`, and `cancelled`; backend and frontend must agree on this grouping or provide an approved mapping.
- `allowedTransitions` contains only transitions currently permitted for this provider and job. Each value is a backend-owned transition identifier. The frontend must not infer allowed actions from the current status.
- Use either a monotonically increasing `version` or an agreed concurrency token. `updatedAt` is useful for display and may be used as a concurrency token only if the backend explicitly supports it.
- Return only customer details the provider is authorized to see at the current job stage.

## Request a transition

Proposed route:

`POST /api/provider/jobs/{jobId}/transitions`

Request:

```json
{
  "transition": "SERVER_DEFINED_TRANSITION",
  "expectedVersion": 7
}
```

If the backend uses `updatedAt` instead of `version`, define the exact request field and semantics. The UI must show a confirmation step before submitting consequential transitions, especially cancellations, and must never optimistically change a job's status.

Successful response must include the updated persisted job, including its exact current `status`, `statusCategory`, `allowedTransitions`, and concurrency token. The frontend must not report success based only on a successful HTTP status if the updated job cannot be confirmed.

## Errors and concurrency

- `401`: unauthenticated or expired session.
- `403`: authenticated provider is not authorized to update this job.
- `409`: stale version, job changed, or transition conflicts with current server state. The frontend should preserve the job and ask the provider to refresh before retrying.
- `422`: transition is invalid for the current state or the request is invalid.
- `5xx` / network failure: show an error and do not optimistically change the status.
- Enforce transition rules, ownership, concurrency, and duplicate protection on the server. Client-side disabling only prevents ordinary repeat clicks and is not a security or idempotency boundary.

Before API integration, agree on the endpoint, authentication, pagination, exact status values, category mapping, transition identifiers, concurrency token, response envelope, and error shape with the backend team.
