# Provider bids API requirements

## Current integration state

The provider frontend does not have a confirmed bid endpoint or backend status enum. The quote form accepts an injected `onSubmitBid(jobId, payload)` callback for integration and automated testing. Without that callback, it explicitly reports that no bid was sent. It must not simulate persistence or claim success.

The API below is a proposal for backend review, not a claim that these routes exist.

## Submit a bid

Proposed route:

`POST /api/provider/jobs/available/{jobId}/bids`

Authentication: required provider session.

Request body:

```json
{
  "price": 24500,
  "currency": "NGN",
  "message": "I will inspect the pipe joint and include standard fittings.",
  "proposedSchedule": "2026-10-20T10:30"
}
```

`proposedSchedule` is optional. The backend should define the accepted date/time format and timezone rules before production integration.

Successful response must return the persisted bid and the actual server-defined status. For example, the response shape should include:

```json
{
  "bid": {
    "id": "server-generated-id",
    "jobId": "job_123",
    "price": 24500,
    "currency": "NGN",
    "message": "I will inspect the pipe joint and include standard fittings.",
    "proposedSchedule": "2026-10-20T10:30",
    "status": "SERVER_DEFINED_STATUS",
    "createdAt": "2026-10-15T10:30:00Z"
  }
}
```

The status value above is a placeholder, not a proposed enum. The frontend must render the status supplied by the server and must not infer it from HTTP success alone.

## List the provider's submitted bids

Proposed route:

`GET /api/provider/bids?page=1&limit=10`

Return persisted bid records with `id`, `jobId`, `price`, `currency`, `message`, optional `proposedSchedule`, server-defined `status`, and `createdAt`. Use documented pagination fields. The frontend must not treat local form state as the provider's submitted-bid history.

## Validation and concurrency

- Reject missing messages and non-positive/non-finite prices on the server, even though the UI validates them first.
- Verify the authenticated provider may bid on the specified job.
- Re-check that the job is still available at submission time.
- Return `409 Conflict` when the job is no longer available or a documented business conflict prevents submission. The frontend then tells the provider to refresh available jobs.
- Return documented validation errors (suggested `422`), authentication/authorization errors (`401`/`403`), rate limiting (`429`), and server failures (`5xx`).
- Support an idempotency key or another server-side duplicate-protection mechanism. The frontend disables repeat submission while a request is pending, but client-side locking alone cannot prevent duplicates after retries, refreshes, or concurrent requests.
- A successful HTTP status without a persisted bid identifier and server-defined status is not sufficient for the UI to show a confirmed bid.
- Never return customer direct identifiers or exact street address unless the job workflow explicitly authorizes access.

Before connecting a real API client, the frontend and backend teams must agree on exact routes, authentication/session behavior, response envelope, validation error shape, status values, schedule format, pagination, and idempotency semantics.
