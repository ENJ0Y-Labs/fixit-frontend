# Phase 1: Customer Application Audit

Branch: `feat/customer-phase-1`

## Audit status
The customer application is currently a UI prototype with local/mock state. The existing architecture and styling are being preserved. Phase 1 is focused on making the existing customer flows coherent and production-ready at the UI boundary without inventing backend behavior.

## Screen audit

### Home
- [x] Hero exists
- [x] Service search exists
- [x] Location filter exists
- [x] Categories exist
- [x] Provider cards exist
- [x] Price range exists
- [x] Rating filter exists
- [x] Distance filter exists
- [x] Availability filter exists
- [x] Sorting exists
- [x] Empty provider state exists
- [x] Load-more behavior exists
- [ ] Replace hardcoded providers with API data
- [ ] Replace fake "Book a Service Now" flow with a real product flow
- [ ] Implement provider favorites
- [ ] Implement notifications/cart behavior or remove the non-functional controls

### My Jobs
- [x] Job list
- [x] Status tabs
- [x] Search
- [x] Sorting
- [x] Job cards
- [x] Empty state
- [ ] Loading state from API
- [ ] API error state
- [ ] Replace local job source with API
- [ ] Verify every action against backend job permissions

### Post Job
- [x] Category
- [x] Title
- [x] Description
- [x] Urgency
- [x] Date
- [x] Time
- [x] Location
- [x] Budget
- [x] Optional photo selection
- [x] Basic required-field validation
- [ ] File type/size validation
- [ ] Upload progress/error handling
- [ ] Submission loading state
- [ ] API submission
- [ ] Server validation errors
- [ ] Real draft persistence
- [ ] Success state after backend confirmation

### Job Details
- [x] Job information
- [x] Provider section
- [x] Location section
- [x] Payment overview
- [x] Progress timeline
- [x] Cancel confirmation
- [x] Messaging action
- [ ] Replace fallback/mock details with API data
- [ ] Add real photos
- [ ] Implement add-photo behavior
- [ ] Gate payment action by backend job/payment state
- [ ] Add loading/error/permission states
- [ ] Add review transition when the backend exposes completion state

### Payment
- [x] Order summary
- [x] Provider/job/amount display
- [x] Payment method selection UI
- [ ] Replace hardcoded payment methods
- [ ] Add payment submission loading state
- [ ] Add payment failure state
- [ ] Add payment success state
- [ ] Integrate approved backend/payment-provider contract
- [ ] Do not simulate successful payment

### Review
- [x] Provider information
- [x] Job information
- [x] Comment field
- [x] Anonymous option
- [x] Photo selection
- [ ] Make rating interactive
- [ ] Validate review submission
- [ ] Submission loading state
- [ ] Submission error state
- [ ] Success state
- [ ] API integration

### Messages
- [x] Conversation list
- [x] Conversation search
- [x] Active conversation
- [x] Message history
- [x] Composer
- [x] Local send interaction
- [ ] API message loading
- [ ] Send loading state
- [ ] Send failure state
- [ ] Empty conversation state
- [ ] Real attachment handling
- [ ] Report-provider behavior
- [ ] Replace mock "ACTIVE NOW" with backend presence state
- [ ] Real-time/polling behavior only if supported by backend

### Account
- [x] Profile display
- [x] Profile edit UI
- [x] Basic validation
- [x] Notification setting UI
- [ ] API profile loading/saving
- [ ] Loading/error/empty states
- [ ] Notification preference persistence
- [ ] Saved-address behavior
- [ ] Payment-method behavior
- [ ] Security behavior
- [ ] Logout
- [ ] Privacy/terms/help navigation

## Confirmed code issue fixed in Phase 1
`src/home/ServiceProvider.jsx` contained malformed image markup (`<i ... mg src=...>`), which prevented the provider avatar from being rendered correctly. The markup was corrected without changing the component architecture.

## Important prototype boundaries
The following are intentionally not being faked:
- Payments are not considered complete until a backend/payment-provider contract exists.
- Messaging is not considered real-time until backend support exists.
- Authentication and authorization are backend responsibilities.
- Local jobs are mock data and are not persistent server records.
- Local profile edits are not server persistence.
- Provider favorites are not implemented merely by toggling local UI state.

## Phase 1 API dependencies
The customer app will eventually need documented backend contracts for:
- Authentication/session
- Current customer profile
- Providers/search/filtering
- Categories
- Jobs
- Job photos
- Bids
- Job status transitions
- Conversations/messages
- Payment methods/payment intents
- Reviews
- Notification preferences
- Saved addresses

No undocumented endpoint should be invented during integration.

## Next implementation order
1. Complete Home UI cleanup and remove obviously non-functional controls or give them explicit behavior.
2. Complete My Jobs and Post Job UI states.
3. Complete Job Details state handling.
4. Make Review interactive and validated.
5. Make Payment UI stateful without pretending payment is processed.
6. Make Messages handle empty/error/loading states.
7. Make Account controls honest and usable.
8. Define API contract requirements.
9. Integrate real API data once the backend contract is available.