# ZELO 2.0 — MVP Scope Freeze & Implementation Plan

**Document ID:** ZELO-PLAN-031
**Filename:** `MVP_IMPLEMENTATION_PLAN.md`
**Version:** 3.1
**Status:** Draft
**Priority:** Critical — Project Planning

---

## 1. Purpose

This document converts the ZELO 2.0 product specifications into a sequenced, testable implementation plan.

Its objectives are to:

* Freeze the initial MVP scope.
* Establish implementation dependencies.
* Define development phases and exit criteria.
* Prevent scope creep and unnecessary architecture.
* Ensure that every feature is tested before dependent work begins.
* Deliver a usable beginner-focused learning experience as early as practical.

This plan defines the intended development order. It does not claim that any phase has already been implemented.

## 2. MVP Product Definition

ZELO 2.0 is a beginner-focused learning application built around:

**Learn → Interact → Practise → Receive Feedback → Progress**

The first curriculum follows this order:

1. HTML
2. CSS
3. JavaScript
4. React

The initial release must deliver a coherent learning experience rather than four incomplete curriculum sections.

### MVP must include

* Account access and session handling.
* Home dashboard.
* Explore and curriculum navigation.
* Published lessons and prerequisite-based unlocking.
* Reusable lesson player.
* Interactive quizzes and practice activities.
* Guided coding challenges appropriate to the published curriculum.
* Lesson results and persistent progress.
* Basic XP and reward integrity.
* Profile and essential settings.
* Loading, empty, error and offline-awareness states.
* Accessibility and responsive UI requirements.
* Essential automated tests and a repeatable release process.

### MVP does not require

* Social feeds, friends or leaderboards.
* An AI tutor or AI-generated curriculum.
* User-created courses.
* Complex coins, shops or character upgrades.
* Subscription and payment systems.
* An unrestricted online IDE.
* Production hosting for learner-created projects.
* Advanced analytics, notification automation or sophisticated personalisation.

These features must not be added simply because they appear in competing learning apps.

## 3. Scope Freeze Rules

After this plan is approved, use these rules during implementation:

1. A feature enters the MVP only when it solves a defined learner problem or is required for a critical dependency.
2. A new idea does not automatically become a requirement.
3. Changes to authentication, database structure, code execution or progress rules require an impact review.
4. Cosmetic changes must not repeatedly delay core learning functionality.
5. Optional features remain deferred unless a specific release blocker justifies them.
6. Existing decisions may be revised when evidence identifies a real problem, but the reason and impact must be documented.

**Scope freeze does not mean that defects cannot be fixed.** Bug fixes, accessibility corrections and security improvements remain part of the delivery process.

## 4. Implementation Roadmap

<CodeBlock language="mermaid" model_previewable>
flowchart TD
    A["Phase 0: Decisions and Setup"] --> B["Phase 1: Project Foundation"]
    B --> C["Phase 2: Authentication and Data"]
    C --> D["Phase 3: Curriculum and Progress"]
    D --> E["Phase 4: Lesson Player and Activities"]
    E --> F["Phase 5: Coding Challenges"]
    F --> G["Phase 6: XP, Quests and Profile"]
    G --> H["Phase 7: Testing and Polish"]
    H --> I["Phase 8: Staging and MVP Release"]
</CodeBlock>

Phases may overlap only when dependencies are clear. Do not start a dependent feature merely because its UI can be built independently.

## 5. Phase 0 — Decisions and Setup

**Objective:** Resolve architecture choices that would otherwise cause expensive rework.

Tasks:

* [ ] Confirm the target platform: mobile, web or both.
* [ ] Select the frontend framework and application structure.
* [ ] Select backend architecture and hosting approach.
* [ ] Select database and ORM, if an ORM is needed.
* [ ] Choose the authentication approach.
* [ ] Decide how coding challenges will be evaluated and isolated.
* [ ] Choose where lesson content will be authored and stored.
* [ ] Define the initial HTML lesson sequence.
* [ ] Establish the repository and documentation structure.

**Exit criteria:** Critical technology decisions are documented, the initial release scope is approved, and no unresolved architecture choice blocks the foundation.

## 6. Phase 1 — Project Foundation

**Objective:** Create a stable development environment.

Tasks:

* [ ] Initialise the selected application structure.
* [ ] Configure environment variables and secret handling.
* [ ] Establish formatting, linting and type-checking rules where applicable.
* [ ] Configure the test framework.
* [ ] Establish the shared design tokens and reusable UI foundations.
* [ ] Create the initial navigation structure.
* [ ] Add basic loading, empty and error patterns.
* [ ] Verify the development and production builds.

**Exit criteria:** The application starts reliably, core checks run, and a small UI change can be tested and committed without disrupting the foundation.

## 7. Phase 2 — Authentication and Data Foundation

**Objective:** Make user identity and persistent data reliable before implementing learner-specific functionality.

Tasks:

* [ ] Implement the selected registration and sign-in flow.
* [ ] Implement session restoration and sign-out.
* [ ] Protect private API endpoints.
* [ ] Implement server-side user ownership checks.
* [ ] Create and validate database migrations.
* [ ] Establish the curriculum and user data models.
* [ ] Add reproducible seed data.
* [ ] Test user-data isolation.

**Exit criteria:** Authentication works, protected data is isolated by user, migrations can be applied reproducibly, and no critical security tests fail.

## 8. Phase 3 — Curriculum and Progress

**Objective:** Make the learning path real before investing in advanced gamification.

Tasks:

* [ ] Implement worlds, modules, lessons and lesson steps.
* [ ] Implement the published-content lifecycle.
* [ ] Implement prerequisite and lesson-unlock rules.
* [ ] Implement lesson progress persistence.
* [ ] Implement the Explore screen and learning-path screen.
* [ ] Implement Home's continue-learning destination.
* [ ] Publish the initial reviewed HTML curriculum.
* [ ] Test completion, progression and resume behaviour.

**Exit criteria:** A learner can discover the HTML curriculum, open an available lesson, save progress and resume it in a later session.

## 9. Phase 4 — Lesson Player and Activities

**Objective:** Deliver the core learning experience.

Tasks:

* [ ] Build the reusable lesson player.
* [ ] Implement explanations and worked examples.
* [ ] Implement single-choice quizzes.
* [ ] Implement multiple-select questions.
* [ ] Implement drag/reorder activities with an accessible alternative.
* [ ] Implement fill-in-the-blank activities.
* [ ] Add useful correct and incorrect feedback.
* [ ] Implement lesson completion and results.
* [ ] Review the first lessons with beginner-level usability testing.

**Exit criteria:** A learner can complete a full HTML lesson, understand the feedback, view the result and return to the learning path without losing progress.

## 10. Phase 5 — Coding Challenges

**Objective:** Add practical coding without compromising security or lesson usability.

Tasks:

* [ ] Define the supported challenge formats.
* [ ] Implement the guided editor interface.
* [ ] Separate Run from Submit.
* [ ] Implement HTML/CSS preview evaluation.
* [ ] Implement isolated JavaScript execution.
* [ ] Add timeouts, output limits and resource controls.
* [ ] Implement evaluation feedback.
* [ ] Persist drafts and submissions according to the agreed data model.
* [ ] Test failed runs, retries and duplicate requests.
* [ ] Validate the execution boundary independently.

React challenge execution must not be presented as supported until its runtime and evaluation model have been implemented and tested.

**Exit criteria:** Supported challenges can run and be evaluated safely, learners receive useful feedback, and infrastructure failures are distinguishable from code errors.

## 11. Phase 6 — XP, Quests and Profile

**Objective:** Introduce lightweight motivation after the core learning loop is reliable.

Tasks:

* [ ] Implement centrally configured XP rules.
* [ ] Implement the reward ledger and duplicate prevention.
* [ ] Connect eligible learning events to quest progress.
* [ ] Implement a minimal daily-quest experience if its reset policy is resolved.
* [ ] Implement the Profile screen.
* [ ] Implement personal details and essential settings.
* [ ] Display progress using authoritative data.
* [ ] Verify that retries cannot be exploited for duplicate rewards.

**Exit criteria:** XP, quests and profile information match persisted server data and do not interfere with learning completion.

A streak system remains optional until its rules and learner value are justified.

## 12. Phase 7 — Testing and Product Polish

**Objective:** Verify that the MVP is usable, secure and stable.

Tasks:

* [ ] Complete critical unit and integration tests.
* [ ] Run end-to-end tests for the main learner journey.
* [ ] Verify account security and cross-user access prevention.
* [ ] Verify reward and progress idempotency.
* [ ] Test slow network and transient failure scenarios.
* [ ] Verify accessibility requirements.
* [ ] Check representative mobile screen sizes and devices.
* [ ] Measure critical-flow performance.
* [ ] Review lesson quality and beginner comprehension.
* [ ] Fix release-blocking defects.

**Exit criteria:** Critical journeys pass, no unresolved P0/P1 defects remain, and documented release gates are satisfied.

## 13. Phase 8 — Staging and MVP Release

**Objective:** Release the first usable version through a controlled process.

Tasks:

* [ ] Configure production secrets and environment settings.
* [ ] Verify database migrations.
* [ ] Deploy the release candidate to staging.
* [ ] Run smoke tests.
* [ ] Confirm authentication and published curriculum access.
* [ ] Verify lesson completion and progress persistence.
* [ ] Verify code execution if included in the release.
* [ ] Confirm monitoring and recovery procedures.
* [ ] Deploy the approved release.
* [ ] Review initial activation and learning-completion metrics.

**Exit criteria:** The release is deployed, critical learner flows work in the target environment, and the team can detect and respond to operational failures.

## 14. Content Release Strategy

Do not wait for every world to be complete before validating the learning experience.

Recommended sequence:

1. Prepare a small, complete HTML learning path.
2. Validate lesson clarity, activity feedback and completion behaviour.
3. Complete the core CSS path.
4. Introduce JavaScript content as it passes the content quality checks.
5. Publish React lessons only after their prerequisites and coding environment are ready.

The curriculum must distinguish clearly between available, in-progress, completed and locked content. Never show an incomplete curriculum as fully available.

## 15. Feature Completion Checklist

Every meaningful feature must follow the same workflow:

**Specify → Implement → Test → Verify → Commit**

Before moving to the next dependent feature:

* [ ] Acceptance criteria are satisfied.
* [ ] Relevant automated tests pass.
* [ ] The UI has been checked on the target platform.
* [ ] Loading, error and empty states are handled where applicable.
* [ ] Security and data-integrity implications have been reviewed.
* [ ] No unrelated changes are included in the commit.
* [ ] The working tree is checked after committing.
* [ ] Documentation is updated if the behaviour or architecture changed.

Use small, meaningful commits rather than combining several unrelated features into one large change.

## 16. Risk Register

| Risk                       | Mitigation                                                  |
| -------------------------- | ----------------------------------------------------------- |
| Scope creep                | Enforce MVP boundaries and document exceptions              |
| Incomplete curriculum      | Release reviewed content in stages                          |
| Weak learning engagement   | Test real lessons with beginners early                      |
| Progress or XP duplication | Server-authoritative transactions and idempotency           |
| Unsafe code execution      | Isolated runner, resource limits and security tests         |
| Architecture rework        | Resolve critical technology decisions before implementation |
| Over-engineering           | Add infrastructure only when justified by requirements      |
| Unreliable release         | Automated quality gates, staging and smoke tests            |
| Excessive UI complexity    | Follow the approved design system and screen specifications |

## 17. Release Definition of Done

The MVP is ready for release when:

* [ ] A learner can sign in and access the published curriculum.
* [ ] The first complete learning journey works end to end.
* [ ] Lesson progress persists across sessions.
* [ ] Supported coding challenges work within a verified security boundary.
* [ ] XP and quest logic cannot be trivially duplicated through retries.
* [ ] Essential profile and settings flows work.
* [ ] Critical accessibility, security and regression tests pass.
* [ ] Performance and operational checks meet the agreed release criteria.
* [ ] Production configuration, migrations and recovery procedures are verified.
* [ ] Initial analytics are sufficient to evaluate activation and learning completion.

## 18. Open Decisions Before Implementation

The roadmap depends on final decisions about:

1. Target platforms and framework.
2. Backend and hosting provider.
3. Database and ORM.
4. Authentication provider.
5. Coding execution infrastructure.
6. Content authoring and versioning approach.
7. Initial lesson count and release threshold.
8. Analytics provider or first-party reporting approach.

These decisions must be recorded before the phases that depend on them begin.

**End of Document — ZELO-PLAN-031**
