# ZELO 2.0 — Final Technology Stack & Technical Recommendations

**Document ID:** ZELO-ARCH-042
**Filename:** `FINAL_TECHNOLOGY_STACK.md`
**Version:** 4.2
**Status:** Draft — Proposed Stack
**Product:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Purpose

Select a practical technology stack for ZELO 2.0 that supports an engaging, interactive coding-learning experience without unnecessary infrastructure or architectural complexity.

The stack must support:

* A mobile-first learning experience.
* Reusable lesson and activity components.
* Interactive coding challenges and previews.
* Persistent accounts, progress, and rewards.
* Secure backend APIs.
* Version-controlled lesson content.
* Automated testing and manageable deployments.

## 2. Executive Recommendation

The proposed stack is:

| Layer              | Recommended technology                                                   | Status                               |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------ |
| Mobile application | React Native + Expo                                                      | Proposed                             |
| Language           | TypeScript                                                               | Proposed                             |
| Navigation         | Expo-compatible React Navigation solution                                | Proposed                             |
| UI styling         | React Native StyleSheet and shared design tokens                         | Proposed                             |
| Server state       | TanStack Query or a similarly focused solution                           | Proposed                             |
| Backend API        | Node.js + Express                                                        | Proposed                             |
| Database           | PostgreSQL                                                               | Proposed                             |
| ORM                | Prisma                                                                   | Proposed                             |
| Authentication     | Secure session/token design, provider to be selected                     | Open                                 |
| Lesson content     | Version-controlled JSON files                                            | Proposed                             |
| Code evaluation    | Isolated execution service                                               | Required architecture; provider open |
| Testing            | Jest or Vitest where compatible, API integration tests, end-to-end tests | Proposed                             |
| Version control    | Git + GitHub                                                             | Proposed                             |
| CI/CD              | GitHub Actions or an equivalent pipeline                                 | Proposed                             |
| Hosting            | Selected after platform and code-runner evaluation                       | Open                                 |

**Recommendation:** Prefer a single mobile application, a modular backend, one relational database, and a separately isolated code execution environment. Do not introduce microservices for ordinary application features.

## 3. Platform Decision

### Recommended: React Native with Expo

ZELO's primary experience revolves around short learning steps, quizzes, progress, and coding practice. React Native with Expo is a suitable candidate for a mobile-first application.

Advantages:

* Shared UI components across supported mobile platforms.
* Efficient development and device testing.
* Reusable lesson, activity, progress, and profile components.
* Access to native capabilities when required.
* A development workflow aligned with the existing ZELO implementation experience.

Trade-offs:

* A mobile code editor and preview environment require careful design.
* Web-based code execution must not be assumed to work identically across mobile platforms.
* Some native dependencies may require development builds rather than Expo Go.
* Browser-first accessibility and desktop editor ergonomics require separate consideration if web support becomes a primary requirement.

**Decision gate:** Confirm whether the first release targets mobile only or mobile plus web before finalising the platform.

## 4. Frontend Architecture

### Proposed approach

Organise the application by feature, with shared UI components and a common design system.

Suggested feature boundaries:

* Authentication and onboarding.
* Home dashboard.
* Explore and curriculum navigation.
* Lesson player.
* Interactive activities.
* Coding challenges.
* Progress and rewards.
* Daily quests.
* Profile and settings.

### State management

Use focused tools for different responsibilities:

* **Server state:** A query/cache solution for curriculum, progress, and account data.
* **Local UI state:** React state for selections, temporary inputs, and modal visibility.
* **Persistent learning state:** Backend records, not client-only state.
* **Code drafts:** Local draft state with persistence where appropriate.

Do not add a global state library solely because the application has multiple screens. Adopt one only when shared state complexity demonstrates a clear need.

### UI system

Use reusable components for:

* Buttons and inputs.
* Lesson step layouts.
* Activity options and feedback.
* Code editor and preview containers.
* Progress indicators.
* Loading, empty, and error states.

Maintain ZELO's visual direction: ivory and white surfaces, violet and green accents, generous spacing, readable typography, and minimal decorative effects.

## 5. Backend Architecture

### Recommended: Node.js + Express

A modular monolith is sufficient for the MVP.

Suggested modules:

* `auth`
* `users`
* `curriculum`
* `lessons`
* `progress`
* `challenges`
* `rewards`
* `quests`
* `settings`

Each module should have clear responsibilities and validated interfaces.

The backend remains authoritative for:

* User identity and access control.
* Lesson completion.
* Challenge evaluation results.
* Progress updates.
* XP rewards and duplicate prevention.
* Quest progress and achievement eligibility.

A request from the client must never be treated as proof that a learner has passed a challenge or earned a reward.

## 6. Database and ORM

### Recommended: PostgreSQL + Prisma

PostgreSQL is a strong fit for structured relationships among users, lessons, progress records, challenge submissions, and reward transactions.

Prisma can provide:

* Typed database access.
* Schema and migration management.
* Consistent data models.
* Transaction support for related updates.

### Important implementation rules

* Use database constraints for uniqueness and referential integrity.
* Use transactions for completion and reward operations that must succeed together.
* Make reward granting idempotent.
* Index frequently queried relationships and progress records.
* Keep lesson content separate from user-specific progress.
* Never trust client-supplied user IDs for authorisation.
* Keep schema migrations under version control.

Avoid adding a separate database for analytics, caching, or event streaming until measured requirements justify it.

## 7. Lesson Content Architecture

### Recommended for MVP: Version-controlled JSON

Store authored curriculum content in structured JSON files and validate it before release.

Benefits:

* Content changes can be reviewed in Git.
* Lesson history is easy to track.
* New lessons can reuse existing renderers.
* A custom content management system is not required.

Use the backend to deliver learner-safe content and keep answer keys and hidden evaluation rules on the trusted side.

The exact loading strategy—bundling, importing into the backend, or loading validated files at runtime—must be finalised alongside deployment architecture.

## 8. Coding Challenge Architecture

Coding practice is a critical subsystem and must not be treated as an ordinary UI feature.

### HTML and CSS

Use a constrained preview environment that can render learner code without granting access to application credentials or internal resources.

### JavaScript

Run learner code in an isolated environment with strict execution and resource limits.

### React

Use a constrained React challenge runtime with an explicitly supported component model. Do not promise unrestricted package installation or a complete local development environment.

### Required controls

* Isolated execution.
* CPU, memory, and time limits.
* Restricted network and filesystem access.
* No access to server secrets.
* Separate visible feedback from hidden tests.
* Normalised execution and evaluation statuses.
* Server-side evaluation of submissions.
* Duplicate-safe challenge rewards.

**Architecture rule:** The execution environment must be isolated from the main application backend. A browser preview or mobile WebView alone is not a sufficient security boundary for arbitrary code execution.

The exact code runner, hosting arrangement, and supported language modes must be selected through a dedicated technical evaluation before challenge execution is implemented.

## 9. Authentication and Account Security

Authentication must support the selected client platform and secure API access.

Requirements:

* Secure session lifecycle.
* Server-side authorisation on protected routes.
* User-data isolation.
* Safe token storage appropriate to the platform.
* Rate limiting for sensitive endpoints.
* Safe password handling if password-based authentication is selected.
* Account recovery and deletion policies.
* No credentials or secrets embedded in the client application.

The identity provider and exact session strategy remain open decisions. Do not implement a provider-specific flow until the decision is approved.

## 10. Testing Strategy

Use multiple levels of testing.

**Unit tests**

* Content validation.
* Activity-answer validation.
* Progress calculations.
* Reward eligibility and idempotency.
* Challenge result normalisation.

**Integration tests**

* API authentication and authorisation.
* Database transactions.
* Lesson completion.
* Challenge submission lifecycle.
* Content delivery and version compatibility.

**End-to-end tests**

* Sign in.
* Start a lesson.
* Complete an activity.
* Pass a coding challenge.
* Receive a completion result.
* Confirm persisted progress.
* Reopen the app and verify state.

Security and failure-path tests are required for the coding execution subsystem.

## 11. Development and Deployment

### Development

* Use Git branches and meaningful commits.
* Keep environment-specific configuration outside source code.
* Provide a documented local development setup.
* Validate content and run tests before merging changes.
* Use small, feature-focused implementation steps.

### CI/CD

The pipeline should eventually:

1. Install dependencies reproducibly.
2. Run formatting and static checks.
3. Run content validation.
4. Run unit and integration tests.
5. Build the application and backend.
6. Verify migrations.
7. Deploy only after required quality gates pass.

### Hosting

Choose hosting only after evaluating:

* Supported mobile and web targets.
* PostgreSQL availability and backups.
* API deployment requirements.
* Code runner isolation and resource limits.
* Operational cost and monitoring.
* Secrets management and recovery procedures.

The code execution service may require different hosting from the main API.

## 12. Technologies Not Recommended for the Initial MVP

Avoid adding the following without a demonstrated requirement:

* Microservices for each backend module.
* Kubernetes or a complex orchestration platform.
* Multiple databases for the same core product.
* A custom content management application.
* A full online IDE with arbitrary package installation.
* Multiple overlapping state-management libraries.
* Event streaming infrastructure.
* AI tutoring or AI-generated curriculum.
* A separate analytics warehouse before basic metrics are validated.

These may become relevant later, but they are not prerequisites for delivering a useful learning experience.

## 13. Approval Checklist

Before implementation, explicitly approve or revise:

* [ ] Primary target: mobile only or mobile plus web.
* [ ] React Native + Expo.
* [ ] TypeScript.
* [ ] Node.js + Express.
* [ ] PostgreSQL + Prisma.
* [ ] Version-controlled JSON lesson content.
* [ ] Authentication provider and session strategy.
* [ ] Coding execution and evaluation provider.
* [ ] State-management approach.
* [ ] Hosting and deployment providers.
* [ ] Testing tools and CI pipeline.

## 14. Final Recommendation

Use the simplest architecture that can safely deliver the core learning loop:

**Learn → Interact → Practise → Receive Feedback → Track Progress**

Prioritise the reliability and quality of lessons before adding infrastructure for speculative future features.

The technology stack is ready for approval only after the platform target, authentication approach, code execution strategy, and deployment constraints have been resolved.

---

**End of Document 42 — Final Technology Stack & Technical Recommendations**
