# Provider communication and account API requirements

Status: proposal only. These routes and fields are not confirmed as implemented. Do not wire them into production until the backend team approves the contract.

## Messages

- List conversations with pagination and a server-defined unread count.
- Load a conversation's messages with stable IDs, sender role, body, and creation timestamp.
- Send a message with the conversation ID and body.
- The server response must include the persisted message ID, body, sender role, and timestamp. A successful HTTP status without a valid persisted message must not be presented as a sent message.
- The server must enforce participant access, content validation, rate limits, and message ownership.
- UI requirements: loading, empty conversations, no search matches, send pending, send failure with draft preservation, unauthorized/session-expired state, and no unsupported real-time claims.

## Earnings and payment history

Each record should include a stable ID, reference, job reference/title, amount in NGN, classification ('estimated', 'agreed', or 'paid'), server-defined payment status, and timestamp. The backend must define whether amounts are gross/net and how refunds, fees, and partial payments are represented. Never infer paid status from an agreed amount.

Payout setup, withdrawal, bank-account management, and payout status require a separately approved payment-provider contract. Until then the UI must state that payouts are unavailable and must not simulate a withdrawal.

## Reviews

Return reviews associated with the authenticated provider, with stable ID, customer display name where allowed, job reference/title, rating range, optional comment, and timestamp. If a rating summary is returned, specify its aggregation and count semantics. Do not invent a rating when there are no records.

## Settings

Return persisted notification preferences and supported locale values. Save changes through an authenticated server request and return the persisted canonical settings. A save must not be shown as successful unless the server confirms persistence. The backend owns account identity, authorization, validation, and storage.

## Required error handling

All endpoints should define authentication/session-expiry (401), forbidden access (403), validation (400/422), rate limiting (429 where relevant), conflict (409 where relevant), and server/network failure behavior. The backend owns persistence and authorization; frontend state is not authoritative.
