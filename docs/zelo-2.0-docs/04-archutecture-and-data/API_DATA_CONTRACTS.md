# ZELO 2.0 — API & Data Contracts Specification

**Document ID:** ZELO-API-043
**Filename:** `API_DATA_CONTRACTS.md`
**Version:** 4.3
**Status:** Draft — Proposed Contracts
**Related Documents:** Backend Architecture, Database Schema, Authentication & Security, Lesson Player State Machine, Code Challenge Evaluation

---

## 1. Purpose

Define consistent API contracts between the ZELO client and backend.

The contracts must support:

* Authentication and account management.
* Curriculum discovery.
* Lesson content delivery.
* Learning progress.
* Activity submissions.
* Coding challenge execution and evaluation.
* XP rewards and daily quests.
* Profile and settings.

These contracts are proposed specifications. They become implementation requirements after the API and technology decisions are approved.

## 2. API Conventions

**Base path:** `/api/v1`

**Content type:** `application/json`, except where a future endpoint explicitly requires another format.

### Naming conventions

* Use plural nouns for collections.
* Use stable IDs rather than display names in requests.
* Use ISO 8601 timestamps in UTC for API timestamps.
* Use explicit enums for status fields.
* Validate request bodies on the server.
* Return consistent response envelopes.
* Never expose internal database records without an intentional API contract.

### Example resource paths

```text
/api/v1/users/me
/api/v1/curriculum/worlds
/api/v1/lessons/:lessonId
/api/v1/progress/lessons/:lessonId
/api/v1/challenges/:challengeId
```

## 3. Standard Response Format

### Successful response

```json
{
  "data": {
    "id": "html-first-webpage-001",
    "title": "Build Your First Webpage"
  },
  "meta": {
    "requestId": "req_example"
  }
}
```

The `data` object varies by endpoint. The request ID is optional if the hosting or logging architecture cannot provide it consistently.

### Error response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": [
      {
        "field": "answer",
        "reason": "Required field is missing."
      }
    ],
    "requestId": "req_example"
  }
}
```

**Rules:**

* `code` must be a stable machine-readable identifier.
* `message` must be safe to display to a learner.
* `details` is optional and must not reveal secrets or hidden evaluation information.
* `requestId` is optional but recommended for troubleshooting.
* Stack traces, SQL errors, credentials, and internal infrastructure details must never be returned.

## 4. HTTP Status Codes

| Status | Meaning                                               |
| ------ | ----------------------------------------------------- |
| `200`  | Request succeeded                                     |
| `201`  | Resource created                                      |
| `202`  | Asynchronous operation accepted                       |
| `204`  | Request succeeded with no response body               |
| `400`  | Malformed request                                     |
| `401`  | Authentication required or invalid                    |
| `403`  | Authenticated but not authorised                      |
| `404`  | Resource not found or intentionally concealed         |
| `409`  | Conflict with the current resource state              |
| `422`  | Valid request structure but invalid operation or data |
| `429`  | Rate limit exceeded                                   |
| `500`  | Unexpected server error                               |
| `503`  | Service temporarily unavailable                       |

Endpoints must use these codes consistently. A coding challenge's learner solution failing evaluation is normally a successful evaluation response, not an HTTP server error.

## 5. Authentication Contracts

ZELO 2.0 MVP uses custom email/password authentication
implemented by the ZELO backend, as approved in TD-05
and AUTH_SECURITY_SPEC.md.

The backend is authoritative for credential validation,
token issuance, refresh-session management, revocation,
and password-recovery operations.

### 5.1 Authentication Endpoints

All endpoints use the `/api/v1` base path.

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Create an account | Public |
| POST | `/auth/login` | Authenticate credentials and create a session | Public |
| POST | `/auth/refresh` | Rotate the refresh token and issue a new access token | Refresh token required |
| POST | `/auth/logout` | Revoke the current refresh session | Authenticated session |
| POST | `/auth/password/forgot` | Request password recovery | Public |
| POST | `/auth/password/reset` | Reset a password using a recovery token | Recovery token required |
| GET | `/users/me` | Retrieve the authenticated user's profile | Access token required |

Google and Apple sign-in buttons are UI-only in the MVP.
Tapping either button must display exactly:

"This feature will be implemented in the future."

These buttons must not initiate OAuth or create a session.

### 5.2 Token and Session Requirements

- Access tokens expire after 15 minutes.
- Refresh sessions expire after 30 days.
- Refresh tokens must be rotated when successfully used.
- The backend must detect reuse of an already-consumed refresh token.
- Logout revokes the current refresh session.
- The server stores refresh-token hashes, not raw refresh tokens.
- The mobile app stores authentication credentials using
  Expo SecureStore.
- Protected endpoints derive the current user identity from
  validated authentication credentials.
- Client-supplied user IDs must never override the authenticated
  identity.
- Expired, revoked, or invalid credentials must not grant access.

Token format, signing-key management, and detailed refresh-token
reuse response behavior must follow the approved security
specification and its documented implementation decisions.

### 5.3 Request and Response Requirements

Every request body must be validated by the backend.

Authentication responses must follow the standard response
envelope defined in Section 3.

Registration and login responses must never expose password hashes or other internal authentication secrets.

When a refresh token is issued to the client, the raw token must not be persisted in server-side records. The server must store only its hash.

Authentication tokens must be returned and stored only through the approved session-management flow.

Invalid login credentials must produce a consistent error that does not disclose whether an email address is registered.

The refresh endpoint must reject expired, revoked, invalid, or previously consumed refresh tokens.

A successful refresh must rotate the refresh token and issue a new access token.

Logout must revoke the current refresh session. A successful logout must not depend on the client deleting its local tokens.

### 5.4 Password Recovery Requirements

The password-recovery request must not disclose whether an email address belongs to an existing account.

Recovery tokens must be:
- Time-limited, expiring 30 minutes after issuance.
- Single-use.
- Stored as hashes on the server.
- Invalidated after successful use.

A successful password reset must:
- Validate that the recovery token is valid, unexpired, and unused.
- Update the user's password using Argon2 password hashing.
- Consume the recovery token.
- Revoke all active sessions belonging to the user.
- Perform the password update, token consumption, and session revocation in a single database transaction.

The user must authenticate again after a successful password reset.

Invalid, expired, or previously consumed recovery tokens must not permit a password change.

### 5.5 Rate Limiting and Validation

Registration, login, refresh, and password-recovery endpoints
must have appropriate abuse protection.

Request validation must happen on the server. Client-side validation is for usability and is not a security boundary.

Rate-limit thresholds and abuse-protection policies must be documented before production release.

### 5.6 Authentication Acceptance Criteria

- A user can register and log in with valid credentials.
- Duplicate account registration is rejected consistently.
- Invalid credentials do not create a session.
- Access tokens expire after 15 minutes.
- Refresh sessions expire after 30 days.
- Refresh-token rotation invalidates the previous token.
- Reuse of a consumed refresh token is detected.
- Logout revokes the current refresh session.
- Password-recovery tokens expire and cannot be reused.
- Password recovery does not disclose account existence.
- Protected endpoints reject invalid or expired access tokens.
- Users cannot access another user's data by changing request IDs.

## 6. Curriculum Contracts

### List worlds

`GET /api/v1/curriculum/worlds`

Example response:

```json
{
  "data": [
    {
      "id": "html",
      "title": "HTML World",
      "description": "Learn to structure webpages.",
      "status": "available",
      "progressPercent": 0
    },
    {
      "id": "css",
      "title": "CSS World",
      "description": "Learn to style webpages.",
      "status": "locked",
      "progressPercent": 0
    }
  ]
}
```

The values are illustrative. The backend calculates availability and progress using published curriculum data and persisted learner progress.

### Get world details

`GET /api/v1/curriculum/worlds/:worldId`

Returns world metadata, modules, lesson summaries, prerequisite information, and learner-safe status fields.

### Get lesson content

`GET /api/v1/lessons/:lessonId`

Example response:

```json
{
  "data": {
    "id": "html-first-webpage-001",
    "title": "Build Your First Webpage",
    "contentVersion": "1.0.0",
    "learningObjectives": [
      "Explain what HTML does",
      "Create a heading and paragraph"
    ],
    "steps": []
  }
}
```

The empty `steps` array is a structural placeholder. The production response must contain the actual published lesson steps.

**Security requirement:** Learner-facing responses must exclude answer keys, hidden tests, private evaluation rules, and authoring-only metadata.

## 7. Learning Progress Contracts

### Retrieve lesson progress

`GET /api/v1/progress/lessons/:lessonId`

Example response:

```json
{
  "data": {
    "lessonId": "html-first-webpage-001",
    "status": "in_progress",
    "completedStepIds": [
      "welcome",
      "html-element"
    ],
    "contentVersion": "1.0.0",
    "completedAt": null
  }
}
```

### Save progress

`PUT /api/v1/progress/lessons/:lessonId`

Example request:

```json
{
  "completedStepIds": [
    "welcome",
    "html-element"
  ],
  "contentVersion": "1.0.0"
}
```

The server must validate step IDs against the relevant published lesson. A client cannot declare a lesson complete merely by including every step ID in a request.

Progress updates should be designed for safe retries and should not accidentally erase newer progress.

### Complete a lesson

`POST /api/v1/progress/lessons/:lessonId/complete`

Example request:

```json
{
  "contentVersion": "1.0.0",
  "completionAttemptId": "client-generated-unique-id"
}
```

Example response:

```json
{
  "data": {
    "lessonId": "html-first-webpage-001",
    "status": "completed",
    "completedAt": "2026-10-28T10:00:00Z",
    "newlyCompleted": true,
    "rewards": {
      "xpAwarded": 20
    }
  }
}
```

All values are illustrative; reward amounts and completion policies must be configured centrally.

**Rules:**

* Verify all required completion conditions on the server.
* Confirm the completion transaction before showing success.
* Prevent duplicate XP when a request is retried.
* Distinguish a newly completed lesson from an already completed lesson.
* Do not award rewards for locked lessons or failed required challenges.
* Define the behaviour when content changes during an active lesson.

## 8. Activity Submission Contracts

### Submit an activity answer

`POST /api/v1/lessons/:lessonId/activities/:activityId/attempts`

Example request:

```json
{
  "contentVersion": "1.0.0",
  "attemptId": "unique-attempt-id",
  "answer": {
    "selectedOptionId": "option-b"
  }
}
```

The `answer` structure depends on the activity type.

Examples:

* Single choice: selected option ID.
* Multiple select: selected option IDs.
* Reorder: ordered item IDs.
* Fill in the blank: entered value or selected option.
* Coding challenge: use the challenge endpoints rather than this generic activity endpoint.

Example response:

```json
{
  "data": {
    "attemptId": "unique-attempt-id",
    "result": "correct",
    "feedback": "Correct! <p> opens a paragraph element.",
    "retryAllowed": true,
    "activityCompleted": true
  }
}
```

### Validation requirements

* Validate the answer against the published activity.
* Protect answer keys.
* Return only feedback permitted for the current attempt.
* Apply retry rules consistently.
* Prevent duplicate processing when the same attempt ID is resubmitted.
* Do not expose hidden test data or internal scoring logic.

The final decision on whether all activity attempts are persisted must be made before implementation.

## 9. Coding Challenge Contracts

### Retrieve a challenge

`GET /api/v1/challenges/:challengeId`

Returns the prompt, supported language or mode, starter code, instructions, and learner-safe constraints.

It must not return hidden tests or private expected solutions.

### Save a draft

`PUT /api/v1/challenges/:challengeId/draft`

Example request:

```json
{
  "sourceCode": "<h1>Hello, ZELO!</h1>",
  "language": "html"
}
```

The server must enforce size limits and verify the challenge's supported language. Draft persistence should not automatically mark the challenge as passed.

### Run code

`POST /api/v1/challenges/:challengeId/run`

Example request:

```json
{
  "sourceCode": "<h1>Hello, ZELO!</h1>",
  "language": "html"
}
```

Example response:

```json
{
  "data": {
    "runId": "run_example",
    "status": "completed",
    "previewAvailable": true,
    "output": null
  }
}
```

This response is illustrative. Actual output, preview references, and execution statuses depend on the selected runner. Output must be size-limited and safely rendered.

### Submit a solution

`POST /api/v1/challenges/:challengeId/submit`

Example request:

```json
{
  "submissionId": "unique-submission-id",
  "sourceCode": "<h1>Hello, ZELO!</h1>",
  "language": "html"
}
```

Example response:

```json
{
  "data": {
    "submissionId": "unique-submission-id",
    "status": "passed",
    "feedback": "Your heading matches the required output.",
    "challengeCompleted": true
  }
}
```

For asynchronous evaluation, return `202 Accepted` with a job identifier and provide a defined way to retrieve its status.

### Evaluation statuses

Use the statuses defined in the code challenge evaluation specification, including:

* `QUEUED`
* `RUNNING`
* `PASSED`
* `FAILED`
* `COMPILE_ERROR`
* `RUNTIME_ERROR`
* `TIMEOUT`
* `RESOURCE_LIMIT`
* `SYSTEM_ERROR`
* `CANCELLED`

Map these consistently to learner-facing messages without exposing private infrastructure details.

## 10. XP, Rewards, and Quests

### Get rewards summary

`GET /api/v1/rewards/summary`

Returns the authenticated learner's current XP and supported achievement summary.

### List quests

`GET /api/v1/quests`

Returns active quests, descriptions, progress, and completion status.

### Reward authority

* The backend calculates reward eligibility.
* The client cannot submit an arbitrary XP amount to claim.
* Completion and reward ledger updates must be transaction-safe.
* Repeated requests must not award duplicate rewards.
* Quest progress should be derived from trusted events or validated operations.

Separate manual reward-claim endpoints are not required unless the approved quest design needs them.

## 11. Profile and Settings

### Retrieve profile

`GET /api/v1/users/me`

Returns the authenticated user's permitted profile fields.

### Update profile

`PATCH /api/v1/users/me`

Only explicitly supported fields may be updated.

### Retrieve settings

`GET /api/v1/users/me/settings`

### Update settings

`PATCH /api/v1/users/me/settings`

The server must validate allowed values and enforce ownership. Sensitive account changes may require reauthentication.

## 12. Pagination and Filtering

Use pagination only for collections that can grow large, such as orders if a future commerce feature is added, challenge submissions, or extensive lesson history.

For relevant list endpoints, define:

* Page or cursor.
* Page size limit.
* Stable ordering.
* Filtering rules.
* A consistent continuation mechanism.

Do not introduce pagination machinery for small, bounded curriculum responses unless required.

## 13. Idempotency and Concurrency

Operations that can create rewards, submissions, or completion records need duplicate protection.

Requirements:

* Use stable unique IDs or idempotency keys where appropriate.
* Enforce uniqueness in the database.
* Make repeated completion requests return a consistent result.
* Avoid duplicate submissions when a client retries after a network timeout.
* Define how concurrent progress updates are reconciled.
* Use transactions for related progress and reward writes.

An idempotency key must be scoped to the authenticated user and relevant operation.

## 14. API Security Requirements

* Authenticate protected endpoints.
* Authorise access to each resource.
* Validate request bodies and path parameters.
* Apply rate limits to login and expensive challenge operations.
* Limit source code and output sizes.
* Restrict code execution resources and network access.
* Prevent unsafe rendering of learner-generated output.
* Keep hidden tests and expected solutions server-side.
* Return generic safe errors for unexpected failures.
* Use TLS in deployed environments.
* Log request identifiers and operational outcomes without logging credentials or unnecessary personal data.

## 15. Contract Testing

Before release, automated tests must verify:

* Response schemas match the documented contracts.
* Invalid requests return the expected error shape.
* Protected endpoints reject unauthenticated requests.
* One user cannot access another user's progress or drafts.
* Lesson content does not expose private answer keys.
* Repeated completion requests do not duplicate XP.
* Challenge statuses are handled consistently.
* Network failures do not falsely mark lessons complete.
* Content-version mismatches produce a defined response.
* API changes do not silently break the client.

## 16. Decisions Required Before Implementation

The following remain open:

1. Whether activity attempts are persisted individually.
2. Whether code evaluation is synchronous or asynchronous for each challenge mode.
3. How preview output is delivered safely to the client.
4. Whether progress is saved per step or in batches.
5. Exact pagination conventions where required.
6. The final error-code catalogue.
7. The content-version compatibility policy.
8. The deployment architecture and API origin configuration.

---

**End of Document 43 — API & Data Contracts Specification**
