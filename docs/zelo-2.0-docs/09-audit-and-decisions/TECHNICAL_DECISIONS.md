# ZELO 2.0 — Technical Decisions & Architecture Decision Records

**File:** `TECHNICAL_DECISIONS.md`
**Version:** 3.2
**Status:** Draft — Decisions Pending Approval
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

This document maintains a single source of truth for ZELO 2.0 technical decisions.

It records:

* What decision is required.
* Why the decision matters.
* Which options are available.
* Which option is proposed.
* What trade-offs the decision introduces.
* Whether the decision has been approved.

**Important:** A proposed default is a recommendation, not an approved decision. No technology selection becomes final until it is explicitly accepted.

## 2. Decision Statuses

| Status     | Meaning                                                         |
| ---------- | --------------------------------------------------------------- |
| Proposed   | A recommended option is awaiting approval.                      |
| Accepted   | The decision has been approved and should guide implementation. |
| Deferred   | The decision is intentionally postponed.                        |
| Superseded | A newer decision has replaced the previous one.                 |

Every accepted decision should include a date, rationale, and consequences.

## 3. Architecture Principles

All technical decisions must follow these principles:

1. **Simplicity first:** Avoid infrastructure that the MVP does not need.
2. **Modular architecture:** Separate responsibilities without creating unnecessary services.
3. **Beginner-first learning:** Technical limitations must not undermine the lesson experience.
4. **Security by design:** User data, authentication, and code execution require explicit safeguards.
5. **Testability:** Critical business rules must be independently testable.
6. **Incremental development:** Implement one meaningful feature, test it, verify it, and commit it.
7. **Content independence:** Curriculum content should not be tightly coupled to UI components.
8. **No premature scaling:** Optimize for a reliable MVP, not hypothetical millions of users.

---

## 4. Technical Decision Register

### TD-01 — Target Platform

**Context:** ZELO needs a clear initial deployment target.

**Options:**

* Mobile application.
* Web application.
* Mobile and web applications.

**Proposed default — not approved:** Choose one primary platform for the MVP and avoid maintaining two complete interfaces simultaneously.

**Rationale:** A focused first release reduces development and testing costs.

**Consequences:** The choice affects navigation, authentication, code-editor integration, deployment, and responsive design.

**Status:** Proposed.

### TD-02 — Frontend Framework

**Context:** The product requires an interactive lesson player, progress tracking, coding challenges, and a polished interface.

**Options:**

* React with Vite.
* Next.js.
* React Native with Expo.
* A web frontend plus a separate React Native application.

**Proposed default — not approved:** Select the framework only after TD-01 is accepted. Prefer the simplest framework that supports the chosen platform and its required features.

**Rationale:** Framework choice should follow platform requirements rather than personal preference alone.

**Risks:** Choosing separate web and mobile applications increases duplicated UI work and testing effort.

**Status:** Proposed.

### TD-03 — Backend Architecture

**Context:** ZELO needs authentication, curriculum delivery, progress persistence, rewards, quests, and code-challenge evaluation.

**Options:**

* Managed backend services.
* A custom backend using a modular monolith.
* Microservices.

**Proposed default — not approved:** Use either a suitable managed backend or a custom modular monolith. Do not begin with microservices.

**Rationale:** A single deployable backend with clearly separated modules is easier to develop, test, and maintain.

**Consequences:** Modules must have clear responsibilities and avoid unnecessary cross-dependencies.

**Status:** Proposed.

### TD-04 — Database and ORM

**Context:** The system needs persistent users, curriculum, lesson progress, submissions, and reward records.

**Options:**

* PostgreSQL with an ORM.
* PostgreSQL with direct SQL.
* Another managed database appropriate to the selected backend.

**Proposed default — not approved:** Evaluate PostgreSQL first if relational consistency, transactions, and structured relationships are required.

**ORM decision:** Choose an ORM only after the backend and database approach are selected.

**Rationale:** Lesson completion, progress updates, and reward issuance require reliable consistency.

**Risks:** An ORM introduces migrations, generated types or clients, and version-specific maintenance.

**Status:** Proposed.

### TD-05 — Authentication Provider

**Context:** Accounts require registration, login, sessions, protected endpoints, and secure account management.

**Options:**

* Managed authentication provider.
* Framework-integrated authentication.
* Custom authentication implementation.

**Proposed default — not approved:** Prefer a maintained solution with secure session handling over writing authentication infrastructure from scratch.

**Evaluation criteria:**

* Platform compatibility.
* Session and token security.
* Password recovery.
* Account deletion.
* Integration complexity.
* Cost and deployment constraints.

**Status:** Proposed.

### TD-06 — Lesson Content Storage

**Context:** Curriculum content must evolve without requiring changes to the lesson-player UI.

**Options:**

* Version-controlled content files.
* Database-managed content.
* A hybrid model.

**Proposed default — not approved:** Start with version-controlled structured content files if the initial curriculum can be authored and reviewed without a dedicated CMS.

**Rationale:** Content changes can be reviewed in Git, versioned alongside tests, and kept independent from presentation components.

**Consequences:** Publishing workflows must validate content before release. A database-backed authoring system can be introduced later if editorial requirements justify it.

**Status:** Proposed.

### TD-07 — Code Execution Architecture

**Context:** Coding challenges must support running code and evaluating submissions without exposing the platform or other users to malicious code.

**Options:**

* Browser-based execution for suitable exercises.
* An isolated server-side code execution service.
* A combination of both.

**Proposed default — not approved:** Use the simplest safe execution method for each language, with a dedicated isolated execution environment whenever server-side execution is necessary.

**Mandatory safeguards:**

* Execution time limits.
* Memory and resource limits.
* Network restrictions.
* No arbitrary package installation.
* No access to application secrets or production databases.
* Separation between user-visible feedback and hidden evaluation tests.
* Abuse controls and execution quotas.

**Rationale:** A coding challenge must never execute untrusted code inside the trusted application server process.

**Risks:** Secure code execution adds infrastructure, operational complexity, and cost. Its feasibility must be validated before implementing the coding engine.

**Status:** Proposed.

### TD-08 — State Management

**Context:** The frontend needs local UI state, lesson answers, navigation state, and persisted progress.

**Options:**

* Framework-native state and context.
* A dedicated client-state library.
* A server-state caching library alongside local state.

**Proposed default — not approved:** Begin with native state where sufficient. Add dedicated libraries only when a demonstrated requirement justifies them.

**Rationale:** Avoid introducing global state for data that can remain local to a screen or component.

**Status:** Proposed.

### TD-09 — API Contracts

**Context:** Frontend and backend functionality must have predictable request and response formats.

**Proposed default — not approved:** Use consistent, versioned API contracts with explicit validation and standardized errors.

**Requirements:**

* Keep business rules on the server.
* Validate incoming data.
* Enforce authentication and authorization.
* Use idempotency for operations that must not be duplicated.
* Document response and error formats.
* Test important contracts automatically.

**Status:** Proposed.

### TD-10 — Testing Strategy

**Context:** Incorrect progress, duplicate XP, broken authentication, or unreliable code evaluation can undermine the learning experience.

**Proposed default — not approved:** Combine unit tests, integration tests, and end-to-end tests according to risk.

**Minimum coverage priorities:**

* Authentication and user-data isolation.
* Lesson completion and prerequisite unlocking.
* XP issuance and duplicate prevention.
* Coding challenge evaluation.
* Navigation and primary learning journeys.

**Status:** Proposed.

### TD-11 — Analytics

**Context:** ZELO needs to measure whether beginners start lessons, complete them, and return to learning.

**Options:**

* Basic first-party event tracking.
* A managed analytics service.
* No product analytics in the initial build.

**Proposed default — not approved:** Define event names and success metrics early, but begin with the smallest privacy-conscious implementation that supports product decisions.

**Restrictions:**

* Do not collect passwords, code secrets, or unnecessary personal information.
* Do not treat raw activity volume as proof of learning.
* Establish appropriate retention and consent policies.

**Status:** Proposed.

### TD-12 — Hosting and Deployment

**Context:** The application needs reliable deployments, environment separation, secret management, and database migrations.

**Options:** Managed frontend hosting, managed backend hosting, serverless infrastructure, or another compatible deployment platform.

**Proposed default — not approved:** Prefer managed hosting with straightforward deployment and rollback procedures.

**Required environments:**

* Development.
* Testing or staging.
* Production.

**Risks:** Hosting must support the selected framework, persistent connections where necessary, database access, and the chosen code-execution architecture.

**Status:** Proposed.

### TD-13 — Notifications and Reminders

**Context:** Reminders may help learners return, but can also become distracting.

**Proposed default — not approved:** Start with immediate in-app feedback. Add optional reminders only after the core learning loop is reliable.

**Requirements:**

* Clear user controls.
* Low notification frequency.
* Duplicate prevention.
* Respect for local time and user preferences where relevant.

**Status:** Proposed.

### TD-14 — Error Monitoring and Logging

**Context:** The team needs to diagnose failures without exposing sensitive information.

**Proposed default — not approved:** Use structured logs and basic error monitoring appropriate to the selected deployment platform.

**Requirements:**

* Capture useful error context.
* Never log credentials, session tokens, or secrets.
* Avoid collecting unnecessary source code or personal data.
* Monitor authentication failures, API errors, and code-runner failures.

**Status:** Proposed.

---

## 5. Decision Dependencies

Some choices should be made in sequence rather than independently.

1. **Platform → Frontend framework:** Decide where ZELO launches before selecting its UI architecture.
2. **Backend → Database and ORM:** Select the backend approach before committing to persistence tooling.
3. **Platform and backend → Authentication:** Verify the authentication solution works across the intended clients.
4. **Curriculum format → Content storage:** Confirm authoring and publishing needs before building a CMS.
5. **Coding curriculum → Code execution:** Validate required languages, evaluation methods, and isolation before selecting a runner.
6. **Hosting → Deployment architecture:** Confirm that the hosting environment supports the chosen runtime and security requirements.

These dependencies should prevent avoidable rewrites.

---

## 6. Architecture Decision Record Template

Use this template for any major technical choice that requires a durable explanation.

### ADR-XXX — [Decision Title]

**Status:** Proposed / Accepted / Deferred / Superseded

**Date:** YYYY-MM-DD

**Context:** What problem are we solving, and why does it matter?

**Options considered:**

1. Option A.
2. Option B.
3. Option C.

**Decision:** What was selected?

**Rationale:** Why is this option the best fit for ZELO's current scope?

**Consequences:** What becomes easier or harder?

**Risks and mitigations:** What could go wrong, and how will it be controlled?

**Review trigger:** Under what circumstances should this decision be reconsidered?

---

## 7. When to Revisit a Decision

Reopen an accepted decision when:

* A required feature cannot be implemented safely.
* A platform or provider lacks a necessary capability.
* Costs exceed the agreed MVP budget.
* Testing reveals a major reliability problem.
* A decision creates substantial duplication or maintenance burden.
* Product scope changes materially.

Do not reopen decisions simply because a different library or framework becomes fashionable.

When a decision changes, mark the earlier record **Superseded**, explain why, and record the replacement.

---

## 8. Approval Checklist

Before implementation begins, resolve or explicitly defer the following:

* [ ] Primary launch platform.
* [ ] Frontend framework.
* [ ] Backend approach.
* [ ] Database and ORM.
* [ ] Authentication provider.
* [ ] Lesson content format and storage.
* [ ] Code execution and evaluation strategy.
* [ ] State management approach.
* [ ] API contract conventions.
* [ ] Testing and CI requirements.
* [ ] Analytics scope.
* [ ] Hosting and deployment platform.
* [ ] Logging and error monitoring.

Deferred decisions must have a reason and a date or milestone for review.

## 9. Final Rule

**ZELO 2.0 will use the simplest architecture that safely supports the agreed MVP.**

No proposed technology in this document should be treated as selected until its status is changed to **Accepted** after review.

The goal is not to build the most sophisticated infrastructure. The goal is to deliver a reliable, enjoyable learning experience that helps complete beginners learn HTML, CSS, JavaScript, and React through practice and feedback.
