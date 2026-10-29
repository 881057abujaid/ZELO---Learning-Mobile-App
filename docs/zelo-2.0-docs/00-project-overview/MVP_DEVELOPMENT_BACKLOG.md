# ZELO 2.0 — MVP Development Backlog

**Document ID:** ZELO-PLAN-044
**Filename:** `MVP_DEVELOPMENT_BACKLOG.md`
**Version:** 4.4
**Status:** Draft — Proposed Implementation Plan

---

## 1. Purpose

Convert the approved ZELO 2.0 MVP scope into a practical, ordered backlog of development tasks.

The backlog must:

* Establish implementation order and dependencies.
* Prioritise the core learning loop.
* Keep work small enough to implement and verify incrementally.
* Define acceptance criteria for each work package.
* Avoid starting optional features before core learning works reliably.

This backlog is a proposed plan. Final task selection depends on approval of the platform, authentication, database, hosting, and code execution decisions.

## 2. Implementation Principles

1. Build the smallest complete learning experience first.
2. Complete one meaningful feature at a time.
3. Test the feature before moving to the next dependent feature.
4. Keep frontend, backend, and content responsibilities separate.
5. Do not implement UI controls that have no working behaviour.
6. Do not award progress or XP from unverified client claims.
7. Keep Git commits small and meaningful.
8. Do not introduce infrastructure before the feature requires it.

**Working loop:**

Specify → Implement → Test → Verify → Commit → Next Feature

## 3. Priority Definitions

| Priority      | Meaning                                                                |
| ------------- | ---------------------------------------------------------------------- |
| P0 — Critical | Required to build or safely release the core MVP                       |
| P1 — High     | Required for a complete and usable MVP experience                      |
| P2 — Optional | Useful enhancement that can be deferred without blocking core learning |

## 4. Phase 0 — Finalise Decisions

**Goal:** Resolve architecture choices that would otherwise cause rework.

### Tasks

* [ ] **D-001:** Confirm primary platform: mobile only or mobile plus web.
* [ ] **D-002:** Approve frontend framework and language.
* [ ] **D-003:** Approve backend framework and API architecture.
* [ ] **D-004:** Approve database and ORM.
* [ ] **D-005:** Select authentication and session strategy.
* [ ] **D-006:** Select the isolated code execution and evaluation approach.
* [ ] **D-007:** Confirm content loading and publication strategy.
* [ ] **D-008:** Select deployment and CI/CD providers.
* [ ] **D-009:** Finalise initial curriculum and content acceptance criteria.

**Acceptance criteria:** No implementation-critical decision remains ambiguous. Deferred decisions have a documented reason and do not block the first phase.

## 5. Phase 1 — Repository and Development Foundation

**Priority:** P0

### Tasks

* [ ] **FND-001:** Create the repository structure.
* [ ] **FND-002:** Configure the selected frontend application.
* [ ] **FND-003:** Configure the backend application.
* [ ] **FND-004:** Configure environment variables and example configuration.
* [ ] **FND-005:** Add formatting, linting, and static checks.
* [ ] **FND-006:** Add a basic automated test setup.
* [ ] **FND-007:** Configure local development scripts.
* [ ] **FND-008:** Document installation and startup instructions.
* [ ] **FND-009:** Add a basic health-check endpoint.

**Acceptance criteria:**

* A developer can start the approved application locally.
* Frontend and backend communicate successfully.
* Secrets are not committed to Git.
* Basic checks and tests run reliably.
* Setup instructions work from a clean checkout.

## 6. Phase 2 — Database and Authentication

**Priority:** P0

### Tasks

* [ ] **AUTH-001:** Implement the approved authentication flow.
* [ ] **AUTH-002:** Implement protected API access.
* [ ] **AUTH-003:** Implement the authenticated user's profile endpoint.
* [ ] **AUTH-004:** Create the initial database schema and migrations.
* [ ] **AUTH-005:** Enforce user-data ownership.
* [ ] **AUTH-006:** Implement essential logout and session handling.
* [ ] **AUTH-007:** Add authentication and authorisation tests.
* [ ] **AUTH-008:** Implement account recovery if required by the chosen provider and release scope.

**Acceptance criteria:**

* A learner can authenticate through the selected flow.
* Protected endpoints reject unauthenticated requests.
* One learner cannot access another learner's private records.
* Database migrations can be applied in a clean environment.

## 7. Phase 3 — Curriculum and Content Delivery

**Priority:** P0

### Tasks

* [ ] **CUR-001:** Implement the content schema validator.
* [ ] **CUR-002:** Create the curriculum and world definitions.
* [ ] **CUR-003:** Add the first HTML module.
* [ ] **CUR-004:** Add the first publishable HTML lesson.
* [ ] **CUR-005:** Implement the worlds listing API.
* [ ] **CUR-006:** Implement lesson and module retrieval.
* [ ] **CUR-007:** Validate prerequisites and content references.
* [ ] **CUR-008:** Exclude private answer keys from learner-facing responses.
* [ ] **CUR-009:** Add content validation to the development workflow.

**Acceptance criteria:**

* Published content can be retrieved through the API.
* Invalid content fails validation.
* The first HTML lesson is complete and reviewed.
* Lesson delivery does not require a lesson-specific UI implementation.

## 8. Phase 4 — Learning Interface and Lesson Player

**Priority:** P0

### Tasks

* [ ] **LRN-001:** Implement the shared design tokens and basic UI components.
* [ ] **LRN-002:** Implement the Home dashboard.
* [ ] **LRN-003:** Implement curriculum Explore and world details.
* [ ] **LRN-004:** Implement the ordered learning path.
* [ ] **LRN-005:** Implement the reusable lesson player.
* [ ] **LRN-006:** Implement explanation and code-example steps.
* [ ] **LRN-007:** Implement single-choice activities.
* [ ] **LRN-008:** Implement multiple-select activities.
* [ ] **LRN-009:** Implement reorder and fill-in-the-blank activities as supported by the MVP content.
* [ ] **LRN-010:** Implement correct and incorrect feedback.
* [ ] **LRN-011:** Implement retry and step navigation.
* [ ] **LRN-012:** Implement lesson completion results.
* [ ] **LRN-013:** Implement loading, empty, offline, and error states.

**Acceptance criteria:**

* A learner can open the HTML World and start a lesson.
* Lesson steps are rendered using reusable components.
* Required activities can be completed.
* Feedback is understandable and accessible.
* A learner can navigate the lesson without losing valid progress.

## 9. Phase 5 — Progress and Completion

**Priority:** P0

### Tasks

* [ ] **PRG-001:** Implement lesson progress persistence.
* [ ] **PRG-002:** Implement server-side completion validation.
* [ ] **PRG-003:** Implement prerequisite-based lesson unlocking.
* [ ] **PRG-004:** Implement world and curriculum progress calculations.
* [ ] **PRG-005:** Implement safe retry handling for completion requests.
* [ ] **PRG-006:** Add content-version compatibility handling.
* [ ] **PRG-007:** Test interrupted sessions and recovery.

**Acceptance criteria:**

* Progress persists across app restarts and sessions.
* Locked lessons cannot be completed prematurely.
* Client-side requests cannot falsely complete a lesson.
* Repeated completion requests do not create duplicate rewards or progress records.

## 10. Phase 6 — Coding Challenge System

**Priority:** P0 for the complete coding-learning MVP

### Tasks

* [ ] **CODE-001:** Confirm the secure execution provider and architecture.
* [ ] **CODE-002:** Implement challenge definitions and retrieval.
* [ ] **CODE-003:** Implement the editor experience for the approved platform.
* [ ] **CODE-004:** Implement HTML/CSS preview rendering.
* [ ] **CODE-005:** Implement isolated JavaScript execution where included in the release.
* [ ] **CODE-006:** Implement the Run operation.
* [ ] **CODE-007:** Implement Submit and evaluation.
* [ ] **CODE-008:** Implement evaluation status and feedback handling.
* [ ] **CODE-009:** Implement draft persistence where required.
* [ ] **CODE-010:** Connect successful challenge evaluation to lesson completion.
* [ ] **CODE-011:** Add security, timeout, resource-limit, and failure-path tests.

**Acceptance criteria:**

* A learner can write and run supported code.
* Submit evaluates the defined requirements.
* Only a server-confirmed passing result can satisfy a required coding challenge.
* Unsafe code cannot access application secrets or unrestricted server resources.
* Evaluation failures are handled without falsely marking challenges as passed.

**Important:** The coding runner is a release-critical dependency. Do not build a fake evaluator or mark arbitrary submissions successful to make the UI appear complete.

## 11. Phase 7 — Rewards and Learning Motivation

**Priority:** P1

### Tasks

* [ ] **RWD-001:** Implement the XP reward ledger.
* [ ] **RWD-002:** Implement centrally configured reward rules.
* [ ] **RWD-003:** Prevent duplicate rewards.
* [ ] **RWD-004:** Display XP and lesson results.
* [ ] **RWD-005:** Implement a small initial achievement set if approved.
* [ ] **RWD-006:** Implement daily quests if they remain within the release scope.
* [ ] **RWD-007:** Add reward and quest tests.

**Acceptance criteria:**

* Rewards are calculated by the backend.
* Retries do not generate duplicate XP.
* Reward changes do not corrupt learning progress.
* Motivation features do not block access to learning content.

Streaks, coins, shops, leaderboards, and complex reward economies remain deferred unless explicitly approved.

## 12. Phase 8 — Profile and Settings

**Priority:** P1

### Tasks

* [ ] **USR-001:** Implement the profile screen.
* [ ] **USR-002:** Display curriculum progress and learning statistics.
* [ ] **USR-003:** Implement supported personal detail updates.
* [ ] **USR-004:** Implement essential settings.
* [ ] **USR-005:** Add account and settings tests.

**Acceptance criteria:**

* Profile information is retrieved from the authenticated account.
* Displayed progress matches persisted records.
* Unsupported settings are not presented as working controls.

## 13. Phase 9 — Testing, Accessibility, and Polish

**Priority:** P0 before release

### Tasks

* [ ] **QA-001:** Complete unit and integration tests.
* [ ] **QA-002:** Test the full first-lesson journey.
* [ ] **QA-003:** Test API authorisation and user-data isolation.
* [ ] **QA-004:** Test challenge execution security and resource limits.
* [ ] **QA-005:** Test loading, offline, and recoverable error states.
* [ ] **QA-006:** Verify responsive layouts for approved platforms.
* [ ] **QA-007:** Verify keyboard and assistive-technology support where applicable.
* [ ] **QA-008:** Check contrast, touch targets, and reduced-motion behaviour.
* [ ] **QA-009:** Fix all release-blocking defects.
* [ ] **QA-010:** Verify telemetry and privacy requirements.

**Acceptance criteria:** All critical user journeys pass, all P0 defects are resolved, and no known critical security issue remains.

## 14. Phase 10 — Staging and MVP Release

**Priority:** P0

### Tasks

* [ ] **REL-001:** Configure staging.
* [ ] **REL-002:** Configure production secrets and environment settings.
* [ ] **REL-003:** Apply and verify database migrations.
* [ ] **REL-004:** Configure monitoring and error reporting.
* [ ] **REL-005:** Run staging smoke tests.
* [ ] **REL-006:** Verify backups and recovery procedures.
* [ ] **REL-007:** Verify release and rollback procedures.
* [ ] **REL-008:** Confirm the release checklist.
* [ ] **REL-009:** Release to the approved initial audience.
* [ ] **REL-010:** Review early learning metrics and user feedback.

**Acceptance criteria:**

* Production configuration is secure.
* Critical journeys pass in staging.
* Recovery procedures are documented.
* The team can identify and respond to application failures.

## 15. Recommended Implementation Order

The phases should generally be executed in sequence because later phases depend on earlier ones.

Within a phase, work may be split into smaller vertical slices. For example, the first HTML lesson should move through content delivery, rendering, answer validation, progress persistence, and testing before the same pattern is expanded to additional lessons.

Do not build the entire backend first and postpone all frontend validation until the end. Integrate incrementally.

## 16. Feature Definition of Done

A feature is complete only when:

* Its acceptance criteria are satisfied.
* The implementation follows the approved architecture.
* Relevant tests pass.
* Loading and error behaviour is handled.
* Security and authorisation requirements are satisfied.
* The UI matches the approved design direction.
* No fake or nonfunctional controls remain.
* Documentation is updated where necessary.
* Changes are verified locally.
* A meaningful Git commit is created.

## 17. Release Scope Freeze

The first release should focus on the following journey:

**Sign in → Explore HTML → Start a lesson → Complete activities → Solve a coding challenge → Receive feedback → Save progress → Return to learning.**

Features that do not directly support this journey should be deferred when they threaten release quality or delivery time.

## 18. Risk Register

| Risk                                                     | Mitigation                                                     |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| Coding runner is harder than expected                    | Validate the provider and security model before implementation |
| Too many lessons are planned before the player is tested | Build and validate one complete sample lesson first            |
| Content and UI become tightly coupled                    | Use the shared schema and reusable renderers                   |
| XP can be farmed through retries                         | Use a server-side reward ledger and idempotency                |
| Technology decisions change mid-project                  | Approve critical decisions before dependent implementation     |
| Scope expands during development                         | Use the release scope freeze and explicit change review        |
| Network interruption loses learner progress              | Persist progress safely and test recovery                      |
| UI looks complete but features do not work               | Enforce functional acceptance criteria for every control       |

## 19. MVP Completion Criteria

ZELO 2.0 MVP is ready when:

* The approved target platform runs reliably.
* A learner can authenticate using the selected flow.
* The HTML curriculum contains reviewed, published starter content.
* The reusable lesson player supports the required activity types.
* Coding challenges execute and evaluate securely.
* Progress persists and prerequisite unlocking works.
* Rewards, if included, are duplicate-safe.
* Essential profile and settings functions work.
* Critical tests and accessibility checks pass.
* Production deployment and recovery procedures are verified.

The MVP does not require the entire HTML-to-React curriculum to be published before the first release, provided the release scope clearly communicates which content is available. However, the core learning loop must be complete for every lesson advertised as playable.

---

**End of Document 44 — MVP Development Backlog**
