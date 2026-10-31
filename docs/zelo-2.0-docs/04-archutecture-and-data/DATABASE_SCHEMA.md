# ZELO 2.0 — DATABASE_SCHEMA.md

**Version:** 2.4
**Status:** Draft
**Module:** Database Schema & Entity Relationships
**Priority:** MVP — Must Have

## 1. Purpose

Define the logical database entities, relationships, constraints and data-integrity requirements for ZELO 2.0.

The schema must support:

* User accounts and profiles.
* Worlds, modules, lessons and lesson steps.
* Lesson progress and completion.
* Coding challenges, drafts and submissions.
* XP reward history.
* Daily Quest definitions and learner progress.
* Content publication and versioning.

**Core principle:** Store each piece of authoritative data in one clear place. Avoid duplicated state, unnecessary tables and premature abstraction.

## 2. Proposed Entity Relationship Diagram

<box border radius="lg" padding={3} gap={2} align="center">
  <box border radius="md" padding={3} width="100%" align="center">
    **User**

```
<text color="secondary" size="sm">Profile · Settings · Identity reference</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Learning Progress**

```
<text color="secondary" size="sm">User ↔ Lesson · Current step · Completion</text>
```

  </box>
  <icon name="arrow-down" color="secondary" size="lg" />
  <box border radius="md" padding={3} width="100%" align="center">
    **Curriculum**

```
<text color="secondary" size="sm">World → Module → Lesson → Lesson Step</text>
```

  </box>
  <divider color="subtle" />
  <grid columns={2} gap={2}>
    <grid-item>
      <box border radius="md" padding={3} align="center" gap={1}>
        <icon name="code-2" size="lg" />
        **Challenge**

```
    <text color="secondary" size="sm" textAlign="center">Drafts · Submissions · Results</text>
  </box>
</grid-item>
<grid-item>
  <box border radius="md" padding={3} align="center" gap={1}>
    <icon name="trophy" size="lg" />
    **Rewards**

    <text color="secondary" size="sm" textAlign="center">XP ledger · Quest rewards</text>
  </box>
</grid-item>
```

  </grid>
  <text color="secondary" size="sm" textAlign="center">Conceptual relationships. Exact foreign keys, uniqueness constraints and optional relationships will be finalised during schema implementation.</text>
</box>

## 3. Core Entities

### 3.1 User

Represents a registered ZELO learner and the owner of their
authentication identity and private learning data.

| Field | Purpose |
|---|---|
| `id` | Stable primary identifier |
| `email` | Email address supplied during registration |
| `emailNormalized` | Normalized email used for uniqueness checks |
| `passwordHash` | Argon2 password hash |
| `createdAt` | Account creation timestamp |
| `updatedAt` | Last update timestamp |

Rules:

- Email/password authentication is implemented by the ZELO backend.
- `emailNormalized` must be unique.
- Email normalization must be applied consistently during
  registration and login.
- Passwords must never be stored in plaintext.
- Passwords must be hashed using Argon2.
- Password hashes must never be returned through public APIs.
- Email verification is optional in the initial MVP.
- A user's identity must be derived from authenticated credentials,
  not from a client-supplied user ID.
- User-owned resources must enforce server-side ownership checks.

The Prisma schema is the implementation-level representation
of this logical model. Changes to the logical schema must be
reflected in Prisma migrations and relevant API contracts.

### 3.2 User Settings

Stores only preferences that the MVP actually supports.

| Field         | Purpose                                |
| ------------- | -------------------------------------- |
| `userId`      | User reference and logical primary key |
| `preferences` | Supported preference values, if needed |
| `updatedAt`   | Last update timestamp                  |

Avoid creating settings fields for features that do not exist. If the MVP has no configurable theme or notification preferences, do not introduce unnecessary settings complexity.

### 3.2.1 Authentication Persistence

Authentication persistence must support refresh-token rotation, reuse detection, session revocation, and password recovery.

#### Refresh Token Records

The database must persist refresh-token records associated
with a user and a refresh-session family.

Each record must support:

| Field | Purpose |
|---|---|
| `id` | Stable token-record identifier |
| `userId` | Owner of the authentication session |
| `familyId` | Identifier grouping rotated tokens belonging to one session |
| `tokenHash` | Hash of the refresh token; unique |
| `createdAt` | Token-record creation timestamp |
| `expiresAt` | Token expiry timestamp |
| `consumedAt` | Timestamp when the token was successfully rotated |
| `revokedAt` | Timestamp when the token or session was revoked |
| `replacedByTokenId` | Reference to the replacement token, when applicable |

Requirements:

- Raw refresh tokens must never be stored in the database.
- Token hashes must be unique.
- Each token must belong to a valid user.
- Refresh-token rotation must be performed transactionally.
- A consumed token must not be accepted for another refresh.
- Reuse detection must identify the associated session family.
- When reuse is detected, the backend must revoke the affected
  session family and reject subsequent authentication attempts
  using tokens from that family.
- `revokedAt` records the revocation state of an individual token
  record. Session-family revocation must be enforced consistently
  across the affected family.
- Logging out must revoke the current refresh session.
- A successful password reset must revoke all active sessions belonging to the user.
- Expired and revoked tokens must not establish an authenticated session.

#### Password Recovery Records

The database must persist password-recovery token records.

Each record must support:

| Field | Purpose |
|---|---|
| `id` | Stable recovery-record identifier |
| `userId` | Account requesting recovery |
| `tokenHash` | Hash of the recovery token; unique |
| `createdAt` | Token creation timestamp |
| `expiresAt` | Recovery-token expiry timestamp |
| `usedAt` | Timestamp when the token was consumed |

Requirements:

- Raw recovery tokens must never be stored in the database.
- Recovery tokens must expire 30 minutes after issuance.
- Recovery tokens must be single-use.
- Expired or previously consumed tokens must be rejected.
- A token must belong to a valid user.
- Token consumption and password replacement must be atomic.
- Recovery requests must not disclose whether an account exists.

The implementation must define the exact Prisma model names, deletion behavior, and indexes.

Password-recovery tokens must expire 30 minutes after issuance,
as specified in AUTH_SECURITY_SPEC.md.

A successful password reset must atomically:
- Replace the user's password with an Argon2 password hash.
- Mark the recovery token as consumed.
- Revoke all active sessions belonging to the user.

The password update, recovery-token consumption, and session
revocation must succeed or roll back together in one database
transaction.

### 3.3 World

Represents a major curriculum stage.

| Field         | Purpose                         |
| ------------- | ------------------------------- |
| `id`          | Stable identifier               |
| `slug`        | Unique human-readable key       |
| `title`       | Display name                    |
| `description` | Short explanation               |
| `order`       | Curriculum sequence             |
| `imageRef`    | Optional illustration reference |
| `status`      | Draft, Published or Archived    |
| `createdAt`   | Creation timestamp              |
| `updatedAt`   | Last update timestamp           |

Initial worlds:

1. Frontend Foundations — HTML
2. Styling Studio — CSS
3. JavaScript Lab — JavaScript
4. React World — React

World publication status must reflect actual available curriculum content.

### 3.4 Module

Groups related lessons inside a world.

| Field         | Purpose                      |
| ------------- | ---------------------------- |
| `id`          | Stable identifier            |
| `worldId`     | Parent world reference       |
| `title`       | Module title                 |
| `description` | Module summary               |
| `order`       | Position within the world    |
| `status`      | Draft, Published or Archived |

**Relationship:** One World has many Modules.

### 3.5 Lesson

Represents a single learning unit.

| Field                | Purpose                      |
| -------------------- | ---------------------------- |
| `id`                 | Stable identifier            |
| `moduleId`           | Parent module reference      |
| `title`              | Lesson title                 |
| `description`        | Lesson summary               |
| `order`              | Position within the module   |
| `learningObjectives` | Defined learning outcomes    |
| `estimatedDuration`  | Optional estimated duration  |
| `completionCriteria` | Requirements for completion  |
| `contentVersion`     | Published content version    |
| `status`             | Draft, Published or Archived |

**Relationship:** One Module has many Lessons.

The content model must prevent invalid references and define how lesson prerequisites are represented. If multiple prerequisites are required, model them explicitly rather than relying on undocumented ordering conventions.

### 3.6 Lesson Step

Represents one ordered piece of lesson content.

| Field           | Purpose                                            |
| --------------- | -------------------------------------------------- |
| `id`            | Stable identifier                                  |
| `lessonId`      | Parent lesson reference                            |
| `type`          | Explanation, example, activity or coding challenge |
| `order`         | Position within the lesson                         |
| `title`         | Optional step title                                |
| `content`       | Step content                                       |
| `required`      | Whether the step is required                       |
| `configuration` | Type-specific settings                             |

Use a validated structured format for step configuration. Do not allow arbitrary unvalidated configuration to bypass the rules for activity types.

### 3.7 Coding Challenge

Represents a coding exercise that can be embedded in a lesson or offered through the practice section.

| Field                | Purpose                         |
| -------------------- | ------------------------------- |
| `id`                 | Stable identifier               |
| `title`              | Challenge title                 |
| `description`        | Challenge instructions          |
| `language`           | HTML, CSS, JavaScript or React  |
| `starterCode`        | Optional initial code           |
| `evaluationType`     | Evaluation strategy             |
| `acceptanceCriteria` | Required outcome                |
| `testConfiguration`  | Trusted evaluator configuration |
| `contentVersion`     | Challenge version               |
| `status`             | Draft, Published or Archived    |

If a challenge belongs to a lesson step, that relationship must be explicit. Standalone challenges should remain possible without inventing a fake parent lesson.

Hidden tests and trusted evaluator configuration must never be exposed through ordinary learner-facing challenge responses.

## 4. Learner Progress Entities

### 4.1 Lesson Progress

Stores the learner's state for a lesson.

| Field            | Purpose                               |
| ---------------- | ------------------------------------- |
| `id`             | Progress record identifier            |
| `userId`         | Learner reference                     |
| `lessonId`       | Lesson reference                      |
| `status`         | Not Started, In Progress or Completed |
| `currentStepId`  | Optional resume position              |
| `contentVersion` | Version associated with progress      |
| `startedAt`      | First start timestamp                 |
| `completedAt`    | Completion timestamp, nullable        |
| `updatedAt`      | Last update timestamp                 |

**Important constraints:**

* A learner must not have duplicate active progress records for the same lesson and applicable content version.
* A completed lesson must have a valid completion timestamp.
* A Locked state should normally be derived from access rules rather than stored as ordinary lesson progress.
* Progress updates must not allow arbitrary user IDs or forged completion flags from the client.
* Content-version changes must follow an explicit migration or compatibility policy.

### 4.2 Activity Attempt

Stores activity attempts only where durable attempt history is needed for evaluation, debugging or product requirements.

| Field           | Purpose                       |
| --------------- | ----------------------------- |
| `id`            | Attempt identifier            |
| `userId`        | Learner reference             |
| `stepId`        | Activity reference            |
| `attemptNumber` | Attempt sequence, if required |
| `result`        | Validated outcome             |
| `createdAt`     | Attempt timestamp             |

**MVP decision:** Do not persist every trivial UI interaction by default. Store attempts when they have a clear purpose. The system must still preserve whatever authoritative assessment evidence is needed to validate lesson completion.

## 5. Coding Drafts and Submissions

### 5.1 Challenge Draft

Stores a learner's editable code when draft persistence is supported.

| Field            | Purpose                      |
| ---------------- | ---------------------------- |
| `id`             | Draft identifier             |
| `userId`         | Learner reference            |
| `challengeId`    | Challenge reference          |
| `code`           | Saved learner code           |
| `contentVersion` | Associated challenge version |
| `updatedAt`      | Last save timestamp          |

A unique constraint on the appropriate learner/challenge pair can prevent duplicate current drafts.

If multiple files are supported later, the data model can evolve to represent files explicitly. The MVP should not introduce a multi-file abstraction unless required by actual challenges.

### 5.2 Challenge Submission

Records an evaluation attempt.

| Field            | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `id`             | Submission identifier                              |
| `userId`         | Learner reference                                  |
| `challengeId`    | Challenge reference                                |
| `contentVersion` | Evaluated challenge version                        |
| `status`         | Queued, Running, Passed, Failed or Execution Error |
| `resultSummary`  | Learner-safe result                                |
| `createdAt`      | Submission timestamp                               |
| `completedAt`    | Evaluation completion timestamp, nullable          |

Submission records should not expose hidden tests, private reference solutions, sensitive runner output or internal infrastructure details.

The evaluator must have a separate trusted configuration boundary. Do not return all evaluator data merely because a challenge record exists.

## 6. XP Reward Ledger

The reward ledger records committed XP grants.

| Field           | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `id`            | Reward record identifier                         |
| `userId`        | Learner reference                                |
| `eventType`     | Lesson, coding challenge or quest reward         |
| `sourceId`      | Related lesson, challenge or quest               |
| `sourceEventId` | Unique qualifying event or idempotency reference |
| `xpAmount`      | Granted XP                                       |
| `createdAt`     | Reward timestamp                                 |

### Integrity rules

* XP amounts must be validated against the configured reward policy.
* A learner cannot grant XP to themselves through a client request.
* A qualifying event cannot produce duplicate rewards.
* A unique constraint or equivalent atomic deduplication mechanism must enforce reward uniqueness.
* Total XP must be derived from valid committed reward records.
* Reward persistence must be coordinated with the relevant completion event.

Do not store a manually editable total XP value as the sole source of truth.

A cached total may be introduced later if measurement shows a performance need, but it must remain reconcilable with the ledger.

## 7. Daily Quest Entities

### 7.1 Quest Definition

| Field         | Purpose                              |
| ------------- | ------------------------------------ |
| `id`          | Quest identifier                     |
| `title`       | Display title                        |
| `description` | Learning objective                   |
| `eventType`   | Eligible learning event              |
| `targetCount` | Required number of qualifying events |
| `xpReward`    | Configured XP reward                 |
| `status`      | Draft, Published or Archived         |

Quest definitions must specify what qualifies as progress and how repeated events are handled.

### 7.2 User Quest Progress

| Field           | Purpose                                    |
| --------------- | ------------------------------------------ |
| `id`            | Progress identifier                        |
| `userId`        | Learner reference                          |
| `questId`       | Quest definition reference                 |
| `periodKey`     | Identifier for the applicable quest period |
| `progressCount` | Number of eligible events                  |
| `status`        | Available, In Progress or Completed        |
| `completedAt`   | Completion timestamp, nullable             |

A uniqueness constraint should prevent duplicate progress records for the same user, quest and period.

If a daily reset is used, the period key must follow the agreed timezone and daily-boundary policy. A quest reward must be awarded only once for its qualifying period.

Do not create separate tables for every possible quest category unless the implementation demonstrates a need.

## 8. Entity Relationships

| Relationship                           | Cardinality |
| -------------------------------------- | ----------- |
| User → Lesson Progress                 | One-to-many |
| World → Module                         | One-to-many |
| Module → Lesson                        | One-to-many |
| Lesson → Lesson Step                   | One-to-many |
| User → Challenge Draft                 | One-to-many |
| Challenge → Challenge Submission       | One-to-many |
| User → Challenge Submission            | One-to-many |
| User → XP Reward                       | One-to-many |
| Quest Definition → User Quest Progress | One-to-many |
| User → User Quest Progress             | One-to-many |

Prerequisites may require explicit relationship tables when a lesson or world can depend on multiple other lessons or worlds.

The final relational schema must define foreign keys, deletion behaviour and uniqueness constraints for these relationships.

## 9. Data Integrity and Transactions

The following operations require special attention:

### Lesson completion

Completion must be validated against required activities and persisted without creating duplicate records.

### XP issuance

The reward ledger must enforce idempotency. Repeated requests must return the existing reward outcome rather than grant XP again.

### Coding challenge completion

A passed result must be tied to a valid evaluation and the correct learner and challenge version.

### Quest progress

A qualifying event must be counted once. Reprocessing the same event must not increase quest progress repeatedly.

### Failure recovery

If a request fails after a database commit but before the client receives a response, a safe retry must not duplicate completion, XP or quest progress.

Use transactions for related database operations where appropriate. External code execution must not hold a database transaction open for the duration of execution; use a durable job and recovery pattern if asynchronous evaluation is required.

## 10. Indexing and Query Requirements

Start with indexes supporting actual application queries.

Likely candidates include:

* World ordering and publication status.
* Modules by `worldId` and order.
* Lessons by `moduleId` and order.
* Lesson progress by `userId` and `lessonId`.
* Submissions by `userId`, `challengeId` and creation time.
* XP records by `userId` and creation time.
* Quest progress by `userId`, `periodKey` and `questId`.

Final indexes must follow the chosen database, query patterns and measured performance. Avoid adding speculative indexes without a clear query or integrity purpose.

## 11. Privacy and Retention

* Users must only access their own learner-specific records.
* Public curriculum responses must not include private learner data.
* Code drafts and submissions should be retained only according to a defined product policy.
* Logs must not expose credentials, tokens or unnecessary personal information.
* Account deletion must follow the product's approved data-deletion policy.
* Reward and progress retention requirements must be reconciled with account deletion and legal obligations.

Do not assume that all records can be deleted immediately without checking integrity, audit and applicable retention requirements.

## 12. Migration and Content Versioning

* Use version-controlled database migrations.
* Test migrations against representative data before deployment.
* Preserve stable identifiers for published content.
* Define how content edits affect existing progress.
* Avoid destructive migrations without an explicit recovery plan.
* Keep development, testing and production environments separated.

Content versioning is not a substitute for database migration versioning; they solve different problems.

## 13. MVP Scope

**Included:**

* User and profile records or references.
* World, module, lesson and lesson-step entities.
* Lesson progress.
* Challenge definitions, drafts and submissions as required.
* XP reward ledger.
* Quest definitions and learner quest progress.
* Foreign keys, unique constraints and relevant indexes.
* Database migrations and integrity tests.

**Out of scope:**

* Social relationships and follower tables.
* Leaderboard snapshots.
* Currency and marketplace entities.
* Payment and subscription records.
* User-created courses.
* Multi-tenant organisation models.
* Event-streaming infrastructure.
* A general-purpose analytics warehouse.
* Complex gamification inventory systems.

## 14. Acceptance Criteria

* [ ] Every curriculum entity has a stable identifier.
* [ ] Worlds, modules, lessons and steps have valid parent relationships.
* [ ] Only valid published content is returned to learners.
* [ ] Lesson progress is unique and can be resumed.
* [ ] Completion records cannot be forged through client input.
* [ ] Coding submissions reference valid challenges and users.
* [ ] XP grants have a reliable deduplication mechanism.
* [ ] Quest progress cannot be duplicated by replaying events.
* [ ] Foreign keys and uniqueness constraints protect core relationships.
* [ ] Database migrations are version-controlled and tested.
* [ ] User-owned data is protected by server-side authorisation.
* [ ] Content version changes have an explicit progress-preservation policy.

## 15. Open Decisions

Before writing the production schema, finalise:

1. Database engine and ORM.
2. Authentication identity model.
3. Exact lesson progress and attempt-history requirements.
4. Content versioning and migration rules.
5. Challenge runner and submission persistence model.
6. XP reward uniqueness key.
7. Daily Quest timezone and period policy.
8. Account deletion and data-retention requirements.
9. Whether content will be stored in the database or managed through version-controlled files with a publishing process.

**Implementation principle:** Finalise the relationships and integrity rules first, then translate them into the selected ORM schema. Do not introduce entities simply because they might be useful in a hypothetical future feature.

---

**Next document:** Screen 25 — Authentication, Authorisation & Account Security.
