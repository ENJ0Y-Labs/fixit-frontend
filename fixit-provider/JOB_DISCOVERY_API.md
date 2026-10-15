# Provider job discovery API requirements

The provider frontend currently uses clearly labelled demo records. No job-discovery endpoint is wired in this repository, so these records must not be presented as live customer requests.

## Proposed contract for backend review

### List open opportunities

`GET /api/provider/jobs/available?search=&category=&location=&minBudget=&maxBudget=&sort=newest&page=1&limit=10`

Authentication: required provider session.

Example response:

```json
{
  "items": [
    {
      "id": "job_123",
      "title": "Repair leaking kitchen sink",
      "category": { "id": "plumbing", "name": "Plumbing" },
      "description": "Inspect the leaking connection and quote any replacement parts.",
      "location": { "area": "Rumuola", "city": "Port Harcourt" },
      "budget": { "amount": 18000, "currency": "NGN", "type": "indicative" },
      "urgency": "WITHIN_2_DAYS",
      "estimatedDuration": "1–2 hours",
      "postedAt": "2026-10-14T12:00:00Z",
      "responseCount": 2,
      "status": "OPEN",
      "updatedAt": "2026-10-14T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

Supported query filters should be applied server-side too. The backend must enforce that only open jobs the authenticated provider is eligible to view are returned.

### Read job details

`GET /api/provider/jobs/available/{jobId}`

Authentication: required provider session. The response should contain the same permitted public job fields plus scope, materials, and relevant job requirements when available.

## Privacy and stale-record rules

- Before award/acceptance, do not return customer full name, phone, email, exact street address, private notes, or other direct identifiers.
- Only return an area/neighborhood and city until the workflow authorizes more information.
- The backend must re-check current job status and provider eligibility when details are read and when a response is submitted.
- Include `updatedAt` or a version token so the frontend can identify stale records.
- Return a documented conflict response (for example HTTP 409) if a job is no longer open when the provider tries to respond.
- Expected errors: 401 unauthenticated, 403 ineligible, 404 missing/unavailable job, 409 stale or no-longer-open job, 429 rate-limited, and 5xx server failure.
- Do not treat frontend-hidden fields or disabled buttons as authorization controls.

This is a proposed contract, not a claim that these endpoints exist. Confirm the exact route, field names, pagination semantics, and status enums with the backend team before integration.
