# ZELO 2.0 — Repository Structure & Coding Conventions

**File:** `REPOSITORY_STRUCTURE_AND_CODING_CONVENTIONS.md`
**Version:** 3.3
**Status:** Draft — Pending Technical Stack Approval
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

This document defines how ZELO 2.0 source code should be organized and maintained.

It establishes:

* A predictable repository structure.
* Clear responsibilities for modules and files.
* Naming conventions.
* Rules for reusable components and shared logic.
* Code quality and testing expectations.
* A consistent Git workflow.

The final folder structure must be adjusted after the target platform, frontend framework, and backend stack are approved.

## 2. Core Principles

1. **Feature-oriented organization:** Keep related functionality together.
2. **Separation of concerns:** UI, business rules, data access, and infrastructure must have distinct responsibilities.
3. **Small modules:** A file should have one clear primary responsibility.
4. **Reuse when justified:** Do not create abstractions for hypothetical future requirements.
5. **Explicit dependencies:** Avoid hidden dependencies and unnecessary global state.
6. **Consistent naming:** File and function names should make their purpose obvious.
7. **Testable business logic:** Critical rules should not depend on UI rendering.
8. **Incremental delivery:** Build one meaningful feature at a time.

---

## 3. Proposed Repository Strategy

**Proposed—not approved:** Use a single repository for the initial application if the selected frontend and backend can be maintained together without excessive complexity.

A possible structure is:

```text
zelo/
├── apps/
│   ├── client/
│   └── api/
├── packages/
│   └── shared/
├── content/
│   ├── curriculum/
│   └── schemas/
├── docs/
│   ├── product/
│   ├── design/
│   ├── architecture/
│   └── testing/
├── scripts/
├── .gitignore
├── README.md
└── package.json
```

### Structure rules

* `apps/client/` contains the user-facing application.
* `apps/api/` contains the backend, if a custom backend is selected.
* `packages/shared/` is optional and should be added only when genuine shared code exists.
* `content/` contains version-controlled curriculum content if that storage strategy is accepted.
* `docs/` contains approved product and engineering documentation.
* `scripts/` contains small, repeatable development and maintenance scripts.

Do not create empty folders merely to make the repository look complete.

If the selected platform uses a different project structure—for example, a single Expo application—the repository should follow that framework's conventions instead of forcing this proposed layout.

---

## 4. Frontend Module Organization

The client should be organized by product feature rather than placing every component in one global folder.

Illustrative structure:

```text
apps/client/
├── src/
│   ├── app/
│   ├── features/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── explore/
│   │   ├── lessons/
│   │   ├── coding/
│   │   ├── progress/
│   │   ├── quests/
│   │   └── profile/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   └── types/
└── tests/
```

This is a conceptual layout, not a requirement to create every directory immediately.

### Responsibilities

| Directory            | Responsibility                                                    |
| -------------------- | ----------------------------------------------------------------- |
| `app/`               | Routes, screens, and application entry points.                    |
| `features/`          | Feature-specific UI, hooks, logic, and tests.                     |
| `components/ui/`     | Reusable, presentation-focused components.                        |
| `components/layout/` | Shared navigation and layout components.                          |
| `services/`          | API clients and external service integrations.                    |
| `hooks/`             | Shared hooks with genuine reuse.                                  |
| `utils/`             | Small, framework-independent utility functions.                   |
| `constants/`         | Stable shared configuration and constants.                        |
| `styles/`            | Global styling and design tokens where applicable.                |
| `types/`             | Shared type definitions when the selected language requires them. |

### Feature boundaries

A feature should own its specialized components and logic.

For example, the lessons feature may contain:

```text
features/lessons/
├── components/
├── hooks/
├── services/
├── utils/
└── tests/
```

Only introduce these subfolders when they are needed. A small feature may begin with two or three files.

---

## 5. Backend Module Organization

If ZELO uses a custom backend, organize it as a **modular monolith**.

Illustrative structure:

```text
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── curriculum/
│   │   ├── progress/
│   │   ├── coding/
│   │   ├── rewards/
│   │   └── quests/
│   ├── middleware/
│   ├── config/
│   ├── infrastructure/
│   ├── utils/
│   └── app
└── tests/
```

The exact entry-point filename and module conventions depend on the approved backend framework.

### Backend responsibilities

Each module should contain only the layers it actually needs:

* **Routes/controllers:** Receive requests and return responses.
* **Validation:** Validate incoming data and request parameters.
* **Services:** Implement application and business rules.
* **Repositories/data access:** Encapsulate database operations where useful.
* **Tests:** Verify module behaviour and important edge cases.

Do not create a separate repository abstraction for every database query automatically. Introduce it when it meaningfully improves testability or separation.

### Business-rule ownership

The backend must be authoritative for:

* Lesson completion.
* Prerequisite unlocking.
* XP calculation and award eligibility.
* Quest progress.
* Authorization and user-data access.
* Coding challenge evaluation results.

The client may display these results, but it must not be trusted to decide them.

---

## 6. Curriculum Content Organization

If version-controlled content files are selected, use a predictable hierarchy.

```text
content/
├── curriculum/
│   ├── html/
│   │   ├── module-01/
│   │   └── module-02/
│   ├── css/
│   ├── javascript/
│   └── react/
└── schemas/
```

### Content conventions

* Each lesson must have a stable, unique identifier.
* Lesson order must be explicit.
* Prerequisites must reference valid identifiers.
* Activity types must use a controlled set of supported values.
* Content must pass schema validation before publication.
* Draft lessons must not appear in the published learning path.
* Content changes must not silently invalidate existing learner progress.

Example identifier pattern:

```text
html-intro-001
css-box-model-001
js-functions-001
react-components-001
```

These are illustrative identifiers. The final curriculum IDs should be assigned consistently during content authoring.

---

## 7. Naming Conventions

Follow the conventions of the selected language and framework where they differ from these general defaults.

| Item                  | Proposed convention                 | Example                |
| --------------------- | ----------------------------------- | ---------------------- |
| Components            | PascalCase                          | `LessonCard`           |
| Variables             | camelCase                           | `lessonProgress`       |
| Functions             | camelCase, action-oriented          | `completeLesson()`     |
| Constants             | UPPER_SNAKE_CASE for true constants | `MAX_RUN_TIME_MS`      |
| Hooks                 | `use` prefix                        | `useLessonProgress`    |
| Types/interfaces      | PascalCase                          | `LessonProgress`       |
| Test files            | Match the tested module             | `lesson-progress.test` |
| Content IDs           | Stable lowercase identifiers        | `html-intro-001`       |
| Environment variables | UPPER_SNAKE_CASE                    | `DATABASE_URL`         |

Avoid vague names such as `data`, `temp`, `helper`, or `manager` when a more precise name is available.

Use names that communicate intent. A boolean should read naturally, such as `isCompleted` or `hasAccess`.

---

## 8. Component and Function Design

### Components

A component should:

* Have a clear UI responsibility.
* Receive explicit inputs.
* Avoid unnecessary internal data fetching.
* Avoid duplicating business rules.
* Handle loading, empty, error, and success states when relevant.

Do not extract every small JSX or UI fragment into a separate component. Extract components when reuse, complexity, or readability justifies it.

### Functions

A function should:

* Have a clear purpose.
* Accept explicit parameters.
* Return predictable results where practical.
* Avoid unrelated side effects.
* Handle expected failure cases.

Keep business logic in testable functions or services rather than embedding it throughout UI components.

### File size

There is no mandatory maximum line count. However, if a file becomes difficult to understand because it contains multiple responsibilities, split it by responsibility rather than arbitrarily by line number.

---

## 9. API and Data Handling Conventions

* Use a centralized API client where appropriate.
* Keep endpoint paths and request formats consistent.
* Validate responses when runtime validation is needed.
* Represent loading, success, and failure explicitly.
* Do not hardcode production URLs or secrets.
* Avoid duplicating the same API request logic across screens.
* Do not expose database internals or sensitive error details to users.
* Treat server responses as untrusted until validated when appropriate.

Use the API contract defined in the architecture documentation as the source of truth.

---

## 10. Styling and Design System Conventions

ZELO's visual direction is premium, simple, and learning-focused.

* Use shared design tokens for colors, spacing, typography, and other recurring values.
* Reuse common UI patterns where appropriate.
* Keep layouts consistent across screens.
* Prefer clear visual hierarchy over decorative complexity.
* Avoid repeated one-off values when an existing design token fits.
* Do not introduce a large UI library without a concrete benefit.
* Respect accessibility and responsive-layout requirements.

The ivory/white foundation with violet and green accents remains the proposed visual direction unless the design system is formally revised.

---

## 11. Error Handling and Logging

* Handle expected errors explicitly.
* Use consistent error formats at API boundaries.
* Do not silently swallow unexpected exceptions.
* Show understandable feedback to learners.
* Log enough context to diagnose failures without exposing sensitive data.
* Never log passwords, session tokens, API secrets, or unnecessary personal information.
* Avoid exposing stack traces or internal implementation details in production responses.

Coding-engine errors should distinguish syntax errors, failed tests, timeouts, and infrastructure failures whenever the runner supports those distinctions.

---

## 12. Testing Conventions

Tests should be located close to the module they validate or in a clearly defined test directory, depending on framework conventions.

Prioritize tests for:

* Lesson completion.
* Prerequisite unlocking.
* XP idempotency.
* Quest progress.
* Authentication and authorization.
* Content validation.
* Coding challenge evaluation.
* API request validation.

Test names should describe behaviour rather than implementation details.

For example:

```text
completing a lesson awards XP only once
locked lessons cannot be completed
users cannot read another user's progress
invalid lesson content fails validation
```

Tests must not depend on production data or real user accounts.

---

## 13. Environment Configuration

* Commit an `.env.example` containing variable names and safe placeholder values.
* Never commit real credentials or production secrets.
* Validate required environment variables at application startup.
* Keep development and production configuration separate.
* Document any environment variable needed to run the application.
* Rotate any secret that is accidentally exposed.

The exact environment variables will be defined after the technology stack is accepted.

---

## 14. Git and Commit Workflow

Use small, meaningful commits.

Recommended sequence:

1. Write or update the feature specification.
2. Implement one meaningful feature.
3. Run relevant tests and static checks.
4. Verify the behaviour manually when appropriate.
5. Review the diff for accidental changes or secrets.
6. Commit the verified work.
7. Move to the next feature.

Example commit messages:

```text
feat(lessons): add lesson progress display
fix(progress): prevent duplicate XP awards
test(curriculum): validate prerequisite rules
docs(architecture): clarify content publishing flow
refactor(coding): isolate challenge evaluation
```

Do not combine unrelated features, formatting changes, and bug fixes into one oversized commit without a clear reason.

Never claim a feature is complete merely because its code was written; verify the relevant acceptance criteria.

---

## 15. Dependency and Abstraction Rules

Before adding a dependency, answer:

1. What specific requirement does it solve?
2. Can the existing stack handle the requirement cleanly?
3. Is it actively maintained and compatible with the selected stack?
4. Does it introduce cost, security, or licensing concerns?
5. Is the dependency worth its ongoing maintenance?

Avoid:

* Microservices for the initial MVP.
* Unnecessary generic frameworks.
* Multiple libraries that solve the same problem.
* Premature plugin or extension systems.
* Custom infrastructure when a reliable managed solution is sufficient.
* Global state for isolated UI concerns.
* Abstract layers that only forward calls without adding value.

---

## 16. Definition of Done

A feature is ready to commit when:

* [ ] Its acceptance criteria are met.
* [ ] The implementation follows module boundaries.
* [ ] Relevant tests pass.
* [ ] Static checks and builds pass where applicable.
* [ ] Loading, error, and empty states are handled where required.
* [ ] No secrets or unrelated files were introduced.
* [ ] The diff has been reviewed.
* [ ] Documentation is updated when behaviour or architecture changes.

A release additionally requires the testing and release gates defined in ZELO's testing and deployment specifications.

---

## 17. Final Rule

**Organize code for the current product, not for imaginary future scale.**

Start with the smallest structure that clearly separates responsibilities. Introduce new folders, libraries, abstractions, and modules only when an actual feature or maintenance problem justifies them.

This document remains a proposed standard until the technical stack is approved and the structure is adapted to that stack.
