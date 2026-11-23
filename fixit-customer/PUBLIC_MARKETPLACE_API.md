# Public marketplace API contract

This document defines the proposed public-provider response expected by the customer app. The repository currently contains API client scaffolding, not a deployed backend. Do not treat these routes or fields as implemented until the backend team confirms them.

## Public provider list

`GET /public/providers?limit=50`

Authentication: none.

Recommended response:

```json
{
  "data": {
    "items": [
      {
        "id": "provider_123",
        "displayName": "Ada Example",
        "headline": "Licensed electrician",
        "bio": "Residential electrical repairs and installations.",
        "avatarUrl": "https://example.com/public/provider_123.jpg",
        "category": { "id": "electrical", "name": "Electrical" },
        "services": [
          {
            "id": "service_1",
            "name": "Electrical repairs",
            "description": "Socket, lighting and wiring repairs."
          }
        ],
        "serviceAreas": [
          { "city": "Port Harcourt", "area": "GRA" }
        ],
        "hourlyRate": { "amount": 6500, "currency": "NGN", "unit": "hour" },
        "availability": { "status": "available" },
        "verification": { "status": "verified" },
        "ratingSummary": { "average": 4.8, "count": 24 }
      }
    ],
    "nextCursor": null
  }
}
```

Only return fields approved for public display. Do not include private phone numbers, email addresses, identity documents, internal moderation notes, or account/security data.

## Public provider profile

`GET /public/providers/{providerId}`

Authentication: none.

Return the same public identity and service fields as the list response, plus any additional public profile fields the backend explicitly approves. A missing field means the frontend must omit that detail rather than inventing a value.

## Field rules

- `id` is a stable public identifier used by profile deep links.
- `displayName` (or `name`) and `headline` (or `jobTitle`) are display text.
- `services` and `serviceAreas` are arrays of public records.
- `hourlyRate.amount` is a numeric NGN amount. Omit the rate when the provider has not supplied one.
- `availability.status` is a backend-defined state. The frontend currently treats only `available` as available.
- `verification.status` must come from the verification system. Do not infer verification from profile completion.
- `publicCredentials` may contain only credential labels approved for public display. Never return document images, identity numbers, or private verification evidence.
- `ratingSummary.average` and `ratingSummary.count` must be calculated from eligible, published reviews. Omit the summary when no eligible reviews exist.
- Distance is not shown or filtered unless the backend returns a meaningful `distanceKm` value calculated for a supplied customer location.

## Public provider reviews

`GET /public/providers/{providerId}/reviews?limit=10`

Authentication: none. Return only published, eligible reviews with public-safe fields such as `id`, `author.displayName`, `rating`, `comment`, and `createdAt`. The frontend omits missing author, rating, and comment fields. An unavailable reviews endpoint must not prevent the public profile itself from rendering.

## Errors and empty results

Use the shared API error envelope documented in the repository README. A successful empty list should return `items: []`. Use 404 for a provider profile that is not publicly available; do not reveal whether a private or suspended account exists.

## Frontend fallback

Until the backend endpoint is available, the customer app may display the isolated records in `src/home/providers.js`. Those records must remain visibly labelled as sample listings. API records and sample records must never be mixed in one result set. Missing ratings, prices, availability, service areas, and verification fields must remain absent in the UI.
