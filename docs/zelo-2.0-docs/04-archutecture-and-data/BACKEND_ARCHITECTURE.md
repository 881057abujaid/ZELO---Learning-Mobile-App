# ZELO 2.0 — BACKEND_ARCHITECTURE.md

**Version:** 2.3
**Status:** Draft
**Module:** Backend Architecture & API Contracts
**Priority:** MVP — Must Have

## 1. Purpose

Define the backend responsibilities, API boundaries, data access rules and reliability requirements for ZELO 2.0.

The backend must support:

* Authentication and user identity.
* Curriculum and published lesson content.
* Learner lesson progress.
* Coding challenge submissions.
* XP and reward records.
* Daily Quest progress.
* Profile and settings.
* Consistent error handling and data validation.

**Core principle:** Use a modular monolith until there is a concrete reason to separate components into independent services.

## 2. Proposed Architecture

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **ZELO Mobile App**

```
<text color="secondary" size="sm">Screens · UI state · API client</text>
```

  </box>
  <icon name="arrow-down-up" size="xl" color="secondary" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Backend API**

```
<text color="secondary" size="sm">Authentication · Validation · Authorisation · Business rules</text>
```

  </box>
  <grid columns={2} gap={2}>
    <grid-item>
      <box border radius="md" padding={2} align="center" gap={1}>
        <icon name="book-open" size="lg" />
        **Learning Modules**

```
    <text color="secondary" size="sm" textAlign="center">Curriculum, lessons, progress</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={2} align="center" gap={1}>
    <icon name="trophy" size="lg" />
    **Reward Modules**

    <text color="secondary" size="sm" textAlign="center">XP, quests, completion</text>
  </box>
</grid-item>
```

  </grid>
  <icon name="arrow-down-up" size="xl" color="secondary" />
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **Primary Database**

```
<text color="secondary" size="sm">Users · Content references · Progress · Rewards · Submissions</text>
```

  </box>
  <text color="secondary" size="sm" textAlign="center">Coding execution may use a separate isolated runner. It must not run arbitrary learner code inside the trusted API process.</text>
</box>

This is a logical architecture. Exact frameworks, deployment and database configuration remain open until the technical stack is formally approved.

## 3. Backend Module Boundaries

| Module                | Responsibility                                           |
| --------------------- | -------------------------------------------------------- |
| Authentication        | Validate identity and manage authenticated access        |
| Users                 | User profile and account operations                      |
| Curriculum            | Published worlds, modules, lessons and lesson steps      |
| Learning Progress     | Lesson state, saved position and completion              |
| Coding Challenges     | Challenge definitions, submissions and evaluation status |
| Rewards               | XP eligibility, ledger and duplicate prevention          |
| Daily Quests          | Quest definitions and learner quest progress             |
| Settings              | Supported user preferences                               |
| Shared Infrastructure | Validation, logging, errors and security controls        |

These are logical modules within one backend application, not separate deployable services.

Modules should communicate through clear internal interfaces rather than directly manipulating one another's data without defined rules.

## 4. API Design Principles

* Use a versioned API prefix, such as `/api/v1`.
* Use resource-oriented endpoints and consistent HTTP methods.
* Validate all request parameters and request bodies on the server.
* Return predictable response structures.
* Use appropriate HTTP status codes.
* Keep database internals out of public API responses.
* Never trust user IDs, XP amounts, completion flags or unlock status supplied by the client.
* Add pagination where collections may grow.
* Keep API responses limited to the information needed by the app.
* Document request and response schemas before implementation.

The endpoint names below are proposed contracts, not existing implemented routes.

## 5. Authentication and User APIs

| Method | Proposed endpoint           | Purpose                         |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/v1/auth/register`     | Create an account               |
| POST   | `/api/v1/auth/login`        | Authenticate a user             |
| POST   | `/api/v1/auth/logout`       | End the current session         |
| GET    | `/api/v1/users/me`          | Get the current user's profile  |
| PATCH  | `/api/v1/users/me`          | Update supported profile fields |
| GET    | `/api/v1/users/me/settings` | Read supported settings         |
| PATCH  | `/api/v1/users/me/settings` | Update supported settings       |

Exact authentication endpoints depend on the chosen provider. If the provider manages registration, login or sessions directly, ZELO should use its supported integration instead of duplicating those flows unnecessarily.

### Requirements

* Protected endpoints require valid authentication.
* The server derives the current user identity from the authenticated session or token.
* A client must not be able to update another user's profile by changing a user ID.
* Passwords, access tokens and secrets must not appear in logs.
* Authentication failures must not expose unnecessary account details.
* Rate limiting and secure session handling must be configured before public release.

## 6. Curriculum APIs

| Method | Proposed endpoint                   | Purpose                           |
| ------ | ----------------------------------- | --------------------------------- |
| GET    | `/api/v1/worlds`                    | List published worlds             |
| GET    | `/api/v1/worlds/:worldId`           | Retrieve a world and its summary  |
| GET    | `/api/v1/worlds/:worldId/modules`   | List published modules            |
| GET    | `/api/v1/modules/:moduleId/lessons` | List published lessons            |
| GET    | `/api/v1/lessons/:lessonId`         | Retrieve published lesson content |

### Requirements

* Learners can access only content permitted by publication and prerequisite rules.
* Draft and archived content must not accidentally appear as available learning material.
* Stable content IDs must be used across requests.
* Responses must include enough information for the app to display progress and access status.
* Unlock status must be determined using authoritative prerequisite rules.
* The backend must not imply that an unpublished React curriculum is complete.

Public content may be cacheable when appropriate. Learner-specific progress must be handled separately so one user's data is never returned to another.

## 7. Learning Progress APIs

| Method | Proposed endpoint                    | Purpose                            |
| ------ | ------------------------------------ | ---------------------------------- |
| GET    | `/api/v1/users/me/progress`          | Retrieve overall learning progress |
| GET    | `/api/v1/lessons/:lessonId/progress` | Retrieve progress for a lesson     |
| PUT    | `/api/v1/lessons/:lessonId/progress` | Save supported lesson state        |
| POST   | `/api/v1/lessons/:lessonId/complete` | Request lesson completion          |

### Server-side rules

* Validate that the lesson is published and accessible.
* Validate required step completion and assessment results.
* Preserve progress according to the content-versioning policy.
* Prevent duplicate lesson completion records.
* Derive completion from trusted activity results rather than a client-provided `completed: true` flag.
* Coordinate completion and reward issuance using the progress and reward policies.
* Return the canonical completion state after processing.

The app may save local UI state for responsiveness, but local state alone must not establish authoritative completion.

## 8. Coding Challenge APIs

| Method | Proposed endpoint                        | Purpose                                          |
| ------ | ---------------------------------------- | ------------------------------------------------ |
| GET    | `/api/v1/challenges`                     | List published challenges                        |
| GET    | `/api/v1/challenges/:challengeId`        | Retrieve challenge instructions and starter code |
| PUT    | `/api/v1/challenges/:challengeId/draft`  | Save a supported learner draft                   |
| POST   | `/api/v1/challenges/:challengeId/run`    | Run or preview code                              |
| POST   | `/api/v1/challenges/:challengeId/submit` | Evaluate a submission                            |

### Submission contract

A submission request may include:

* Challenge ID.
* Supported language.
* Learner code or files allowed by that challenge.
* Content version.
* An idempotency key where needed.

The client must not provide trusted test results or dictate that the challenge passed.

### Server behaviour

1. Authenticate the learner.
2. Validate the challenge and submission format.
3. Verify access and request limits.
4. Dispatch execution to the appropriate isolated runner.
5. Apply execution time and resource limits.
6. Store the evaluation outcome as appropriate.
7. Update completion and reward eligibility through authoritative rules.
8. Return the result with a clear status.

Execution errors must remain distinguishable from failed solutions. Long-running execution should not block the main API process indefinitely.

## 9. Rewards and XP APIs

| Method | Proposed endpoint                        | Purpose                                                               |
| ------ | ---------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/api/v1/users/me/rewards`               | Retrieve total XP and reward history                                  |
| GET    | `/api/v1/users/me/quests`                | Retrieve quest progress                                               |
| POST   | `/api/v1/users/me/quests/:questId/claim` | Claim a reward, only if explicit claiming is part of the final design |

A claim endpoint is unnecessary if eligible quest rewards are granted automatically. Do not implement both flows without a clear product requirement.

### Reward security

* The client cannot set its own XP amount.
* Rewards are calculated using centrally configured rules.
* A qualifying event can produce only one reward for the same learner and reward policy.
* Duplicate requests must not create duplicate reward records.
* Reward records are authoritative.
* The server returns the resulting total and reward status.
* Reward issuance and completion persistence must be atomic or use a reliable recovery mechanism.

A separate public endpoint for arbitrary XP grants must not exist.

## 10. Daily Quest APIs

Quest data may be returned alongside the user's dashboard or through the dedicated quest endpoint.

The backend must:

* Return only valid, configured quests.
* Derive progress from eligible learning events.
* Prevent repeated processing of the same event.
* Respect the configured daily boundary and timezone policy.
* Distinguish incomplete, completed and reward-pending states where applicable.
* Avoid issuing duplicate rewards when a client retries a request.

Daily reset and offline-event policies must be finalised before launch.

## 11. Standard Response Format

Successful responses should use a consistent structure.

Example:

```json
{
  "success": true,
  "data": {
    "lessonId": "html-intro-01",
    "status": "in_progress"
  }
}
```

Error example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted information."
  }
}
```

These are illustrative API contracts. The final response schema should be standardised across the application.

### Error handling

Use appropriate HTTP status codes, including:

* `400` — Invalid request.
* `401` — Authentication required or invalid.
* `403` — Access not permitted.
* `404` — Resource not found or intentionally undisclosed.
* `409` — State conflict.
* `422` — Valid request structure but unacceptable submitted data, where appropriate.
* `429` — Rate limit exceeded.
* `500` — Unexpected server error.
* `503` — Temporarily unavailable service.

Avoid returning stack traces, database errors, internal paths or secrets to the client.

## 12. Database and Transaction Rules

The database must preserve relationships and enforce important integrity constraints.

At minimum:

* Each user has an isolated learning-progress scope.
* Lesson completion is unique per learner and lesson, subject to the chosen versioning policy.
* Reward records have a reliable deduplication key.
* Submissions reference valid challenges and users.
* Quest progress references valid quest definitions and eligible events.
* Published content references valid modules and worlds.

### Transaction-sensitive operations

Lesson completion, XP issuance and quest progress updates must be coordinated so a partial failure cannot silently create inconsistent results.

Use database transactions when supported by the chosen persistence layer. For work involving an external code runner, use an appropriate durable job or recovery pattern rather than attempting to hold a database transaction open throughout code execution.

## 13. Security Requirements

* Authenticate protected operations.
* Authorise access to each learner-owned resource.
* Validate request bodies and path parameters.
* Apply rate limits to authentication and code execution.
* Restrict code execution to isolated environments.
* Protect secrets through environment or secret-management configuration.
* Use secure transport in production.
* Avoid logging credentials, session tokens or unnecessary personal data.
* Keep internal evaluator tests and reference solutions private.
* Apply suitable database access controls and backups.
* Use safe error messages and appropriate operational logging.

## 14. Testing Strategy

### Unit tests

Test business rules independently:

* Lesson unlock eligibility.
* Lesson completion criteria.
* XP eligibility and deduplication.
* Quest event processing.
* Progress calculations.
* Request validation.

### Integration tests

Test:

* Authentication and protected routes.
* Curriculum retrieval.
* Saving and resuming progress.
* Completing a lesson and receiving XP.
* Challenge submission and evaluation.
* Quest progress after eligible events.
* Database transaction and recovery behaviour.

### End-to-end tests

Verify critical learner journeys:

1. Register or sign in.
2. Open the first available lesson.
3. Complete its required activities.
4. Save lesson completion.
5. Receive the correct XP once.
6. Open the next available lesson.
7. Review the completed lesson without duplicate rewards.

Also test invalid requests, duplicate submissions, network failures and unauthorised data access.

## 15. MVP Scope

**Included:**

* A single modular backend application.
* Versioned API contracts.
* Authentication integration.
* Published curriculum APIs.
* Learner progress persistence.
* Coding challenge submission integration.
* XP and quest consistency.
* Standard error handling.
* Validation, authorisation and rate limiting.
* Unit, integration and critical end-to-end tests.

**Out of scope:**

* Microservices.
* GraphQL unless a demonstrated need emerges.
* Event-streaming infrastructure.
* Distributed caching infrastructure without measured need.
* Multi-region deployment.
* Public APIs for third-party developers.
* Social feeds and messaging.
* Billing and subscription APIs.
* An advanced analytics data warehouse.

## 16. Acceptance Criteria

* [ ] All protected endpoints enforce authentication.
* [ ] Learner-owned resources are authorised server-side.
* [ ] Curriculum APIs return only valid published content.
* [ ] Progress is persisted and can be resumed.
* [ ] Completion cannot be forged through a client-provided flag.
* [ ] Duplicate requests cannot issue duplicate XP.
* [ ] Coding execution is isolated from the trusted API process.
* [ ] API errors follow a consistent response format.
* [ ] Rate limits and validation are implemented for sensitive endpoints.
* [ ] Critical learner journeys pass end-to-end tests.
* [ ] Database integrity and failure recovery are tested.
* [ ] The architecture remains modular without unnecessary distributed services.

## 17. Open Decisions

Before implementation, finalise:

1. Backend framework and runtime.
2. Database and ORM.
3. Authentication provider and session strategy.
4. Production hosting and environment configuration.
5. Code runner deployment and communication contract.
6. API request/response schemas.
7. Pagination and content caching policy.
8. Database migration and backup strategy.
9. Logging, monitoring and privacy requirements.
10. Offline progress synchronisation requirements.

**Implementation principle:** Keep the backend small and modular. Implement the critical learning journey reliably before adding infrastructure for hypothetical future scale.

---

**Next document:** Screen 24 — Database Schema & Entity Relationships.
