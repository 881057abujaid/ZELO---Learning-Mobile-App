# ZELO 2.0 — Testing Strategy & Quality Gates

**Document ID:** ZELO-QA-026
**Filename:** `TESTING_STRATEGY.md`
**Version:** 2.6
**Status:** Draft
**Priority:** MVP — Must Have

---

## 1. Purpose

Define how ZELO 2.0 will be tested throughout development, from individual UI components to complete learning journeys.

Testing must verify that:

* Features work according to their specifications.
* User progress and rewards remain consistent.
* Coding challenges execute safely.
* Authentication and authorisation protect user data.
* Changes do not break previously completed features.
* The application remains usable for complete beginners.

The goal is reliable software, not maximum test count or unnecessary testing infrastructure.

## 2. Testing Principles

1. **Test behaviour, not implementation details.**
2. **Test critical business rules at the backend boundary.**
3. **Prevent regressions before adding new features.**
4. **Prioritise learner-facing flows and security-sensitive operations.**
5. **Keep tests deterministic and repeatable.**
6. **Use the simplest testing tools that fit the selected stack.**
7. **Do not mark a feature complete merely because its screen renders.**

## 3. Testing Levels

### 3.1 Unit Testing

Test small, isolated functions and business rules.

Examples:

* Lesson progress percentage calculation.
* XP award calculation.
* Lesson unlock eligibility.
* Quiz answer validation.
* Quest progress updates.
* Input validation.
* Formatting of lesson and challenge results.

Unit tests should be fast and independent of external services.

### 3.2 Integration Testing

Verify that related modules work together correctly.

Examples:

* API endpoint and database interaction.
* Lesson completion and progress persistence.
* Coding submission and result storage.
* Quest completion triggered by a lesson event.
* Authentication middleware and ownership checks.
* XP ledger updates within database transactions.

Integration tests should use a controlled test database or isolated test environment.

### 3.3 End-to-End Testing

Test complete user journeys from the interface through the backend.

Priority journeys:

1. Register or sign in.
2. Open the first available lesson.
3. Complete a learning activity.
4. Submit a coding challenge.
5. View the lesson result.
6. Verify that progress persists after reopening the app.
7. Earn XP without receiving duplicate rewards.
8. Complete a daily quest and view the updated state.

Automate the most critical journeys. Do not attempt to automate every minor visual detail in the MVP.

### 3.4 Manual Exploratory Testing

Use manual testing to discover issues that automated tests may miss.

Check:

* Confusing instructions.
* Incorrect or unhelpful feedback.
* Small-screen layout problems.
* Keyboard behaviour.
* Screen-reader usability.
* Slow network behaviour.
* Empty, loading and error states.
* Whether the lesson feels understandable to a complete beginner.

## 4. Feature-Based Test Plan

| Feature           | Required checks                                           |
| ----------------- | --------------------------------------------------------- |
| Authentication    | Valid and invalid credentials, session expiry, sign-out   |
| Home              | Correct progress summary, continue-learning destination   |
| Explore           | World availability, prerequisite locks, published content |
| Learning path     | Lesson ordering, completion states, unlock rules          |
| Lesson player     | Activity validation, feedback, continue behaviour         |
| Quiz activities   | Correct and incorrect answers, retry behaviour            |
| Coding challenges | Run, submit, evaluation, errors and timeout handling      |
| Lesson completion | Correct status, persistent progress, next lesson          |
| XP rewards        | Correct awards, duplicate prevention, retry safety        |
| Daily quests      | Event counting, completion, duplicate-event prevention    |
| Profile           | Correct user information and learning statistics          |
| Settings          | Valid updates and persistence                             |
| Account security  | User-data isolation and protected endpoints               |
| Accessibility     | Touch targets, focus, labels, keyboard alternatives       |
| Error states      | Useful messages, recovery actions, no misleading success  |

Every feature should have tests derived from its own specification.

## 5. Critical Business Rules

### 5.1 Lesson completion

Verify that:

* A lesson becomes complete only after its defined completion requirements are satisfied.
* Completion persists across app restarts and new sessions.
* Reopening a completed lesson does not create a duplicate completion record.
* A failed activity does not accidentally mark the entire lesson complete.
* A learner cannot unlock restricted lessons by changing client-side state.

### 5.2 XP and rewards

Verify that:

* XP is awarded according to centrally defined rules.
* Repeated requests do not award the same reward twice.
* Network retries do not create duplicate ledger entries.
* Clients cannot choose arbitrary XP amounts.
* Reward history and displayed totals remain consistent.

**Required invariant:** One eligible reward event must not generate multiple reward entries for the same reward key.

### 5.3 Progress and prerequisites

Verify that:

* Progress calculations use the intended published curriculum.
* Locked lessons remain locked until their prerequisites are satisfied.
* Content changes do not silently corrupt existing progress.
* Progress is calculated from authoritative server data.
* Empty or newly published learning paths do not cause division-by-zero errors.

### 5.4 Coding engine

Verify that:

* Correct submissions pass.
* Incorrect submissions receive useful feedback.
* Syntax errors are reported safely.
* Execution timeouts terminate the run.
* Excessive output and resource usage are limited.
* Untrusted code cannot access secrets, private user data or unrestricted server resources.
* Hidden tests and evaluation logic are not exposed to the learner.

Security isolation must be validated independently; passing functional tests does not prove that a code runner is secure.

## 6. Authentication and Authorisation Tests

The following cases are release-blocking:

* Unauthenticated requests cannot access protected user data.
* User A cannot read or modify User B’s progress, drafts or submissions.
* Changing a request's `userId` does not bypass ownership checks.
* Learners cannot grant themselves administrative permissions.
* Expired or revoked sessions are rejected.
* Sensitive credentials and tokens are absent from logs.
* Invalid requests fail safely without exposing internal stack traces.

These checks must cover backend APIs, not just UI navigation.

## 7. Test Data and Environment

Maintain separate environments for:

* Local development.
* Automated testing.
* Staging or pre-release verification.
* Production.

Requirements:

* Automated tests must not depend on production data.
* Test users and seed data must be reproducible.
* Tests must clean up temporary records when appropriate.
* Test credentials and secrets must remain separate from production credentials.
* Database migrations must be tested before production deployment.
* External services should be mocked or replaced with controlled test integrations where practical.

Do not run destructive tests against a production database.

## 8. Quality Gates

ZELO will use a simple feature-by-feature quality gate.

### Gate 1 — Specification

* [ ] Feature requirements are defined.
* [ ] Acceptance criteria are clear.
* [ ] Dependencies are understood.
* [ ] Out-of-scope behaviour is identified.

### Gate 2 — Implementation

* [ ] Feature follows the documented architecture.
* [ ] UI states are implemented.
* [ ] Input validation and error handling are included.
* [ ] Security checks exist where required.

### Gate 3 — Verification

* [ ] Relevant unit tests pass.
* [ ] Relevant integration tests pass.
* [ ] Critical user flows are manually or automatically verified.
* [ ] Existing regression tests pass.
* [ ] Type checks and lint checks pass when supported by the selected stack.
* [ ] The app has been checked on the target platform.

### Gate 4 — Commit

* [ ] No unrelated changes are included.
* [ ] No secrets or credentials are committed.
* [ ] Changes are reviewed for obvious defects.
* [ ] The commit message describes the feature or fix.
* [ ] The working tree is checked after committing.

### Gate 5 — Release

* [ ] Production configuration is verified.
* [ ] Database migrations are validated.
* [ ] Authentication and data-isolation tests pass.
* [ ] Critical learning journeys pass.
* [ ] Coding execution limits are verified if code execution is included.
* [ ] Rollback or recovery steps are documented for risky changes.

## 9. Recommended Development Workflow

Use this repeatable loop for each meaningful feature:

**Specify → Implement → Test → Verify → Commit → Next feature**

Example:

1. Define lesson completion behaviour.
2. Implement the backend rule and UI result.
3. Add tests for successful completion, failure and repeated requests.
4. Run relevant checks and manually verify the flow.
5. Commit the completed feature.
6. Start the next feature only when the current one meets its acceptance criteria.

If a gate fails, fix the issue before proceeding with dependent work.

## 10. Continuous Integration

A CI pipeline should eventually run the checks relevant to each change:

1. Dependency and configuration validation.
2. Formatting or lint checks.
3. Type checking, if applicable.
4. Unit tests.
5. Integration tests.
6. Production build.
7. Selected critical end-to-end tests.

The exact commands and CI provider will be defined after the technology stack is finalised.

For the MVP, start with a small reliable pipeline rather than a large, complicated deployment system.

## 11. Defect Severity

| Severity      | Definition                                                          | Release rule                       |
| ------------- | ------------------------------------------------------------------- | ---------------------------------- |
| P0 — Critical | Data exposure, major security breach, unrecoverable data corruption | Release blocked                    |
| P1 — High     | Core learning flow broken, progress or rewards materially incorrect | Release blocked                    |
| P2 — Medium   | Feature partially broken with a workaround                          | Fix before release where practical |
| P3 — Low      | Minor visual or non-critical usability issue                        | May be scheduled after release     |

Any security defect involving unauthorised access or unsafe code execution requires explicit resolution before release.

## 12. MVP Success Criteria

Before the first public beta:

* [ ] All release-blocking tests pass.
* [ ] All critical end-to-end learning journeys pass.
* [ ] No known unresolved P0 or P1 defects remain.
* [ ] Lesson progress survives a new session.
* [ ] Duplicate reward requests are handled safely.
* [ ] User-data isolation tests pass.
* [ ] Essential loading, empty and error states are verified.
* [ ] A production build completes successfully.
* [ ] Coding execution has passed its required security checks, if included in the release.

These criteria are release targets, not claims that testing has already been completed.

## 13. Out of Scope for the Initial Testing System

* A dedicated quality-engineering team.
* Complex performance-testing infrastructure.
* Full-scale chaos engineering.
* Large visual-regression snapshot suites.
* Testing every possible device and browser combination.
* Elaborate test dashboards that do not improve release decisions.

Basic performance, accessibility and security checks remain necessary where they affect core functionality or user safety.

## 14. Definition of Done

A feature is complete when its documented acceptance criteria are met, relevant automated and manual tests pass, critical regressions are ruled out, and the change is committed in a reviewable state.

**End of Document — ZELO-QA-026**
