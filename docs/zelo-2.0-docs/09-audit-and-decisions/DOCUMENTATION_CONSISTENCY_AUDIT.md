# ZELO 2.0 — Documentation Consistency Audit

**Filename:** `DOCUMENTATION_CONSISTENCY_AUDIT.md`
**Document:** Architecture Review — Audit 01
**Version:** 1.0
**Status:** Preliminary Findings — Pending Verification
**Project:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Audit Objective

The purpose of this audit is to identify inconsistencies, unresolved architectural dependencies, duplicated rules, and implementation risks across the ZELO 2.0 planning documentation.

The audit covers the documented requirements for:

* Product scope and user experience.
* Curriculum and lesson content.
* Lesson execution and completion.
* Progress tracking and gamification.
* Backend APIs and database design.
* Authentication and security.
* Coding challenge execution.
* Testing, deployment, and release.

### Audit limitation

This review is based on the available planning context and document summaries. The original 47 documents have not been independently inspected as a complete file set, and the implementation repository has not been audited here.

Accordingly, findings are classified as **confirmed open decisions**, **consistency risks requiring verification**, or **proposed corrective actions**. They are not claims that an uninspected implementation is defective.

## 2. Architecture Baseline

The user has approved the following architectural direction:

| Area              | Approved direction                                                   |
| ----------------- | -------------------------------------------------------------------- |
| Platform          | Mobile-first; Android and iOS first, web deferred                    |
| Core technologies | React Native, Expo, TypeScript, Node.js, Express, PostgreSQL, Prisma |
| Repository        | Simple single repository initially                                   |
| Authentication    | Select a maintained solution after evaluation                        |
| Code execution    | Separate isolated execution service                                  |
| Lesson content    | Version-controlled JSON for the initial curriculum                   |
| Offline support   | Online-first; full offline synchronization deferred                  |
| Hosting           | Select providers after evaluating component requirements             |

Approval of this direction does not finalize exact dependency versions, service providers, repository folders, authentication configuration, or deployment settings.

## 3. Audit Priority Definitions

* **P0 — Blocker:** Must be resolved before the affected architecture or release-critical feature can be implemented safely.
* **P1 — Important:** Must be resolved before the relevant feature is considered complete or released.
* **P2 — Later:** Can be deferred if the MVP remains reliable and the deferral is documented.

## 4. Findings Summary

| ID     | Area                         | Priority | Finding                                                                                 |
| ------ | ---------------------------- | -------- | --------------------------------------------------------------------------------------- |
| AUD-01 | Architecture decisions       | P0       | Detailed technology and infrastructure decisions remain open                            |
| AUD-02 | Lesson completion            | P0       | Completion requirements must be reconciled into one authoritative contract              |
| AUD-03 | Code execution               | P0       | Runner capabilities, security boundaries, and failure behavior need final specification |
| AUD-04 | API and database             | P0       | Cross-document contract compatibility needs verification                                |
| AUD-05 | Progress and rewards         | P0       | Atomic completion, retry behavior, and reward idempotency need one consistent rule      |
| AUD-06 | Content security             | P1       | Authoring data, learner-facing data, and grading secrets need explicit separation       |
| AUD-07 | Curriculum publishing        | P1       | Content versioning and existing-progress compatibility need a defined policy            |
| AUD-08 | Authentication               | P1       | Provider, session strategy, and account lifecycle behavior remain open                  |
| AUD-09 | Offline and network failures | P1       | Safe retry and pending-attempt behavior need clarification                              |
| AUD-10 | Testing and release          | P1       | Acceptance criteria and release gates need measurable definitions                       |
| AUD-11 | Analytics and privacy        | P1       | Event collection must be aligned with privacy and data-retention rules                  |
| AUD-12 | Future capabilities          | P2       | Full offline support, CMS, web, and social features should remain deferred              |

These findings identify review work. They do not mean all listed problems are present in actual code.

## 5. Detailed Findings

### AUD-01 — Detailed architecture decisions remain open

**Priority:** P0

**Related documents:** 29, 31, 32, 33, 42, 43, 45.

The overall architecture direction is approved, but implementation still depends on exact decisions about:

* Supported runtime and package-manager versions.
* Final repository structure and package scripts.
* Authentication provider and session/token strategy.
* Code execution provider and supported runtimes.
* Hosting and database provisioning.
* CI/CD and required automated checks.

**Required action**

Create or update the Architecture Decision Records with an explicit status, rationale, alternatives considered, consequences, and approval date.

**Acceptance criteria**

* Each implementation-blocking choice has a recorded decision.
* Deferred choices have an owner or a documented selection milestone.
* Proposed examples are not mistaken for verified configuration.
* No production credentials or provider-specific assumptions are introduced prematurely.

### AUD-02 — Lesson completion rules need one authoritative contract

**Priority:** P0

**Related documents:** 05, 19, 35, 39, 43.

The documented learning journey requires activity completion, successful coding evaluation where applicable, results, and persistent progress.

The exact completion rules must remain consistent across the lesson player, backend, progress storage, and results screen.

**Questions to resolve**

1. Which activities are required and which are optional?
2. Does a lesson require all required activities to be completed, or must every answer be correct?
3. What qualifies as a passed coding challenge?
4. When is completion committed to the server?
5. What should the client display if completion succeeds on the server but the response is lost?
6. Can lesson requirements change after a user has started or completed a lesson?

**Required action**

Define a single normative completion contract and reference it from the lesson state machine, API specification, database design, and test plan.

**Acceptance criteria**

* Client and server agree on completion eligibility.
* A lesson cannot be marked complete through client-only state.
* Retry behavior does not produce contradictory results.
* Completion survives application restart and network interruption.
* Automated tests cover successful, failed, interrupted, and repeated completion requests.

### AUD-03 — Code execution needs an approved operational contract

**Priority:** P0

**Related documents:** 06, 22, 37, 42, 43, 46.

The isolated code runner is a core MVP dependency. However, the provider and exact execution capabilities remain undecided.

**Required decisions**

* Which languages and challenge types are supported at launch?
* Which runtimes are available for HTML, CSS, JavaScript, and eventually React?
* What CPU, memory, execution-time, and output limits apply?
* How are compilation errors, runtime errors, timeouts, and service failures represented?
* How are submissions authenticated, rate-limited, and associated with users?
* How are hidden test cases protected?
* How are temporary environments cleaned up?
* What happens if the runner is unavailable?

**Required action**

Finalize the runner interface and security requirements before implementing coding challenge evaluation.

**Acceptance criteria**

* Untrusted code is isolated from the API and other workloads.
* Resource limits and access restrictions are tested.
* Runner failures cannot incorrectly award lesson completion or XP.
* Hidden tests and grading secrets are not exposed to the client.
* A real evaluation result is required before a challenge can be marked passed.

### AUD-04 — API and database contracts require cross-validation

**Priority:** P0

**Related documents:** 23, 24, 25, 32, 33, 43.

The backend, API, and database specifications describe related parts of the same system. Their identifiers, ownership rules, request fields, response fields, and persistence behavior must agree.

**Required action**

Create a contract verification matrix covering:

* Authentication and account identity.
* Curriculum, world, module, lesson, and content version identifiers.
* Activity attempts and coding submissions.
* Progress and completion records.
* XP transactions and reward records.
* Profile and settings.
* Pagination and standard error responses.

For every endpoint, map the request and response contract to the database entities and relevant authorization rule.

**Acceptance criteria**

* Every persistent API field maps to a defined model or an explicitly computed value.
* Every user-owned resource has a server-side ownership check.
* Database constraints support important uniqueness and relationship rules.
* Error responses use a consistent documented format.
* No endpoint depends on an undefined entity, identifier, or status value.

### AUD-05 — Progress and reward updates need consistent transaction semantics

**Priority:** P0

**Related documents:** 19, 24, 35, 36, 43.

Progress, lesson completion, and XP are related but should not be treated as independent client-side updates.

A repeated request, delayed response, or concurrent request must not create duplicate rewards or inconsistent completion records.

**Required action**

Specify the authoritative server-side operation that commits completion and its associated rewards.

The design should define:

* The idempotency strategy.
* Unique identifiers for completion and reward events.
* Transaction boundaries.
* Behavior when a database operation partially fails.
* Recovery behavior when the client retries after an unknown outcome.
* The relationship between lesson versions and previously earned rewards.

**Acceptance criteria**

* Repeating an eligible completion request does not duplicate rewards.
* A failed operation cannot leave contradictory completion and reward records.
* Concurrent requests produce a consistent final result.
* The client can recover from a lost response without awarding rewards again.

### AUD-06 — Authoring content and learner-facing content need explicit separation

**Priority:** P1

**Related documents:** 21, 34, 40, 41, 43.

The JSON-based authoring approach is appropriate for the initial curriculum, but authoring files may contain answer keys, grading rules, or hidden test metadata that must not be delivered to learners.

**Required action**

Define separate representations or a documented filtering process for:

1. Authoring content.
2. Published learner-facing content.
3. Server-side grading configuration.

**Acceptance criteria**

* Schema validation runs before content publication.
* Learner-facing APIs omit protected answer keys and hidden tests.
* Content identifiers and activity types are validated.
* Published content can be traced to a specific version.
* Invalid or incomplete content cannot be published accidentally.

### AUD-07 — Curriculum versioning needs a compatibility policy

**Priority:** P1

**Related documents:** 18, 20, 21, 34, 40, 41.

Version-controlled JSON provides change history, but changing a lesson after users have started it can affect progress and completion rules.

**Required decisions**

* How are lesson and curriculum versions identified?
* Can existing attempts reference an older version?
* What happens when an in-progress lesson is updated?
* Are previously completed lessons ever recalculated?
* How are removed or replaced lesson identifiers handled?

**Required action**

Document the compatibility policy for published content and existing progress.

**Acceptance criteria**

* Progress references valid lesson identities and, where required, a content version.
* Publishing a content update does not silently invalidate existing completion records.
* Removed or replaced lessons have a defined migration or retirement behavior.

### AUD-08 — Authentication requires more than selecting a provider

**Priority:** P1

**Related documents:** 12, 14, 25, 42, 43.

The architecture direction calls for a maintained authentication solution, but provider and session strategy remain open.

**Required action**

Evaluate suitable options using:

* Mobile SDK and Expo compatibility.
* Account registration and sign-in experience.
* Session renewal and logout behavior.
* Password recovery or equivalent account recovery.
* Server-side API verification.
* Cost and vendor dependency.
* Account deletion and personal-data handling.

**Acceptance criteria**

* The backend verifies authenticated identity.
* Protected data cannot be accessed using a client-supplied user ID alone.
* Session expiration and invalid credentials have defined behavior.
* Account lifecycle behavior matches the approved MVP scope.

### AUD-09 — Online-first behavior needs explicit recovery rules

**Priority:** P1

**Related documents:** 04, 05, 15, 19, 30, 43, 45.

Deferring full offline synchronization is reasonable. It does not remove the need to handle unstable networks safely.

**Required decisions**

* Which lesson content may be cached?
* Which actions require immediate server confirmation?
* How are unsaved attempts represented?
* Which requests can be retried safely?
* How does the app distinguish an unknown completion outcome from a definite failure?

**Acceptance criteria**

* The UI does not falsely report unsaved progress as permanently saved.
* Retryable requests follow documented rules.
* Completion and reward operations are safe to retry.
* Network failures produce useful feedback and a recoverable state.

### AUD-10 — Testing and release criteria need measurable gates

**Priority:** P1

**Related documents:** 26, 29, 30, 31, 44, 45, 46.

The specifications identify testing and release activities, but the final implementation must define which checks are mandatory for each change and release.

**Required action**

Map the critical user journey and every P0 requirement to automated tests or a documented manual acceptance test.

**Acceptance criteria**

* The core journey has repeatable acceptance tests.
* Security and reward-idempotency tests are mandatory.
* Production builds and applicable quality checks run before release.
* Critical defects block release.
* Staging and post-deployment verification steps are documented.

### AUD-11 — Analytics must respect product and privacy boundaries

**Priority:** P1

**Related documents:** 25, 27, 28, 43.

Learning metrics can help evaluate engagement, but event collection must be proportionate to the product's needs.

**Required action**

Define an approved event catalogue, data minimization rules, retention policy, and access controls before production analytics are enabled.

**Acceptance criteria**

* Events have defined names and properties.
* Secrets and unnecessary personal information are excluded.
* Analytics collection does not become a hidden dependency for lesson completion.
* Data access and retention follow the approved privacy requirements.

### AUD-12 — Deferred features must remain outside the initial release

**Priority:** P2

**Related documents:** 31, 36, 42, 44, 46.

The initial MVP should remain focused on the mobile learning journey.

Unless a later approved scope change is made, defer:

* Full offline synchronization.
* A custom content-management system.
* Social features and leaderboards.
* Complex virtual currencies and shops.
* AI-generated lessons or an AI tutor.
* A web application.
* Unrestricted IDE capabilities or arbitrary package installation.

**Acceptance criteria**

* Deferred features do not become hidden dependencies of core lessons.
* New scope is assessed against the MVP release criteria.
* Any approved scope expansion is documented before implementation.

## 6. Cross-Document Verification Matrix

The following matrix defines the next concrete verification work.

| Verification        | Documents to compare   | Expected result                                    |
| ------------------- | ---------------------- | -------------------------------------------------- |
| Completion contract | 05, 19, 35, 39, 43     | One consistent set of completion rules             |
| Reward integrity    | 19, 24, 36, 43         | Consistent XP and idempotency behavior             |
| Code execution      | 22, 37, 42, 43         | Compatible runner, evaluation, and API contracts   |
| Data model          | 18, 24, 40, 43         | Consistent entity IDs, relationships, and versions |
| Authentication      | 12, 25, 42, 43         | Compatible identity and authorization model        |
| Content publishing  | 21, 34, 40, 41, 43     | Validated, versioned, learner-safe content         |
| Error recovery      | 15, 19, 30, 43         | Consistent failure and retry behavior              |
| Release readiness   | 26, 29, 31, 44, 45, 46 | One enforceable set of release gates               |

The matrix is a verification plan, not a declaration that the documents have already passed these checks.

## 7. Recommended Resolution Order

### Phase A — Resolve P0 decisions

1. Record exact architecture decisions and their approval status.
2. Define the authoritative lesson completion contract.
3. Finalize the code runner's security and evaluation interface.
4. Verify API and database compatibility.
5. Define progress and reward transaction semantics.

**Exit condition:** No unresolved P0 contract prevents safe implementation of the core learning journey.

### Phase B — Resolve P1 requirements

1. Define content publication and learner-facing filtering.
2. Establish curriculum version compatibility.
3. Select and configure authentication.
4. Define network recovery behavior.
5. Connect testing requirements to release gates.
6. Approve analytics and data-retention rules.

**Exit condition:** The affected feature specifications and acceptance tests agree.

### Phase C — Preserve MVP scope

1. Keep deferred features out of the release-critical path.
2. Update the backlog to reflect approved decisions.
3. Link every implementation task to its authoritative specification.
4. Record unresolved non-blocking items explicitly.

**Exit condition:** The initial implementation backlog is consistent with the approved architecture and MVP scope.

## 8. Audit Status

| Category                                  | Current status                                 |
| ----------------------------------------- | ---------------------------------------------- |
| Overall architecture direction            | Approved by user selections                    |
| Exact technical configuration             | Pending                                        |
| Cross-document consistency                | Requires verification against source documents |
| Completion and reward contracts           | Require consolidation and testing              |
| Code runner provider and configuration    | Pending                                        |
| Authentication provider and configuration | Pending                                        |
| Implementation readiness                  | Not yet confirmed                              |
| Actual repository/code audit              | Not performed by this document                 |

## 9. Final Recommendation

Do not start feature implementation merely because the overall architecture direction has been selected.

First, resolve the P0 decisions and verify the authoritative contracts for lesson completion, code evaluation, persistence, and rewards. These are the areas most likely to create expensive rework if implementation begins with conflicting assumptions.

Once the relevant source documents have been cross-checked and the P0 findings are closed, finalize the implementation backlog and begin the first approved feature.

---

**End of Document — ZELO 2.0 Documentation Consistency Audit**

**Next action:** Verify the original specifications against this audit, beginning with lesson completion, progress and rewards, code execution, API contracts, and database relationships.
