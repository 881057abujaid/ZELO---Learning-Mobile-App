# ZELO 2.0 — Documentation Index

**Filename:** `ZELO_DOCUMENTATION_INDEX.md`
**Document:** 47
**Version:** 4.7
**Status:** Draft — Documentation Register
**Project:** ZELO 2.0 — Learn. Practice. Build.

---

## 1. Purpose

This document is the central index for the ZELO 2.0 product, UX, architecture, implementation, and release documentation.

It provides:

* A categorized register of the 47 planned documents.
* A recommended reading order.
* Dependencies between product decisions and implementation work.
* Guidance for identifying approved requirements versus proposals.
* A maintenance policy for keeping the documentation consistent.

**Important:** This index records the document series created during planning. It does not imply that all proposed technology choices, architecture decisions, or implementation details have been approved or verified.

## 2. Project Overview

ZELO 2.0 is a beginner-focused learning application built around the principle:

**Learn. Practice. Build.**

The intended learning sequence is:

1. HTML
2. CSS
3. JavaScript
4. React

The core learning loop is:

**Learn → Interact → Practise → Feedback → Progress and rewards**

The product takes inspiration from the engaging learning loops of Duolingo and SoloLearn while maintaining a clean, premium, mobile-first interface.

The MVP prioritizes the complete learning journey over social features, complex economies, AI-generated lessons, or unrestricted code execution.

## 3. Documentation Register

### Category A — Product Screens and User Experience

| No. | Document                                   | Purpose                                    |
| --: | ------------------------------------------ | ------------------------------------------ |
|  01 | Home Dashboard                             | Home screen structure and primary actions  |
|  02 | Explore Worlds                             | Browse available learning worlds           |
|  03 | World Learning Path                        | Modules, lessons, and progression          |
|  04 | Lesson Player                              | Main lesson experience                     |
|  05 | Lesson Completion & Results                | Results, retry, and completion feedback    |
|  06 | Coding Practice / Challenge                | Coding challenge interface                 |
|  07 | Interactive Quiz & Practice Activities     | Supported interactive activity types       |
|  08 | Daily Quests                               | Daily learning objectives                  |
|  09 | Profile & Learning Progress                | User progress and profile overview         |
|  10 | Settings                                   | Essential application settings             |
|  11 | Onboarding                                 | First-time user experience                 |
|  12 | Login & Sign Up                            | Authentication screens                     |
|  13 | Navigation & App Flow                      | Screen transitions and navigation          |
|  14 | Personal Details                           | Personal account information               |
|  15 | Loading, Empty, Error & Offline States     | Non-happy-path UI behavior                 |
|  16 | Accessibility & Responsive UI Requirements | Accessibility and screen-size requirements |
|  17 | Design System & Reusable UI Components     | Visual tokens and reusable components      |

### Category B — Curriculum and Learning Experience

| No. | Document                                           | Purpose                                         |
| --: | -------------------------------------------------- | ----------------------------------------------- |
|  18 | Content Model & Curriculum Structure               | Curriculum hierarchy and entities               |
|  19 | Progress Tracking & XP Rules                       | Progress persistence and XP principles          |
|  20 | Curriculum Blueprint & Lesson Sequencing           | Learning order and dependencies                 |
|  21 | Lesson Content Authoring & Quality Standards       | Content quality and authoring rules             |
|  34 | Content Authoring Workflow & Curriculum Publishing | Review, validation, and publishing workflow     |
|  38 | Lesson UX & Engagement Design Standards            | Engagement, pacing, feedback, and accessibility |
|  39 | Sample Lesson Specification                        | Example lesson flow and acceptance criteria     |
|  40 | Sample Lesson Data Schema                          | Proposed lesson data structure                  |
|  41 | MVP Content Authoring Format                       | Initial content format and publishing approach  |

### Category C — Technical Architecture and Contracts

| No. | Document                                            | Purpose                                    |
| --: | --------------------------------------------------- | ------------------------------------------ |
|  22 | Coding Engine & Code Execution Architecture         | Code runner architecture and isolation     |
|  23 | Backend Architecture & API Contracts                | Backend boundaries and API design          |
|  24 | Database Schema & Entity Relationships              | Data model and relationships               |
|  25 | Authentication, Authorisation & Account Security    | Identity and access control                |
|  32 | Technical Decisions & Architecture Decision Records | Track decisions and rationale              |
|  33 | Repository Structure & Coding Conventions           | Project layout and coding rules            |
|  35 | Lesson Player State Machine & Completion Logic      | Lesson states and transition rules         |
|  37 | Code Challenge Evaluation & Test Case Specification | Challenge evaluation behavior              |
|  42 | Final Technology Stack & Technical Recommendations  | Proposed technology stack                  |
|  43 | API & Data Contracts Specification                  | API request, response, and error contracts |

### Category D — Gamification, Analytics, and Supporting Systems

| No. | Document                               | Purpose                             |
| --: | -------------------------------------- | ----------------------------------- |
|  26 | Testing Strategy & Quality Gates       | Testing layers and quality gates    |
|  27 | Analytics & Learning Metrics           | Learning and product measurements   |
|  28 | Notifications & Reminder System        | Reminder and notification behavior  |
|  30 | Performance & Reliability Requirements | Performance targets and reliability |
|  36 | Gamification System & Reward Economy   | XP, rewards, and progression rules  |

### Category E — Delivery and Release

| No. | Document                                    | Purpose                                  |
| --: | ------------------------------------------- | ---------------------------------------- |
|  29 | Deployment, Environments & Release Strategy | Environment and deployment planning      |
|  31 | MVP Scope Freeze & Implementation Plan      | MVP boundaries and implementation phases |
|  44 | MVP Development Backlog                     | Ordered implementation work              |
|  45 | Development Environment Setup               | Local development and configuration      |
|  46 | MVP Release Checklist                       | Release readiness and acceptance         |

### Category F — Central Reference

| No. | Document                 | Purpose                                  |
| --: | ------------------------ | ---------------------------------------- |
|  47 | ZELO Documentation Index | Central document register and navigation |

## 4. Recommended Reading Order

Do not implement the project by reading every document sequentially and immediately translating each paragraph into code. First resolve the decisions that affect the entire architecture.

### Stage 1 — Product and scope

Read:

1. Documents 31 and 44 — MVP scope and backlog.
2. Documents 01–17 — Screens, navigation, and UX.
3. Documents 18–21 — Curriculum structure and learning sequence.
4. Document 38 — Lesson UX and engagement standards.

**Outcome:** A clear understanding of what ZELO 2.0 must deliver.

### Stage 2 — Architecture decisions

Read:

1. Document 42 — Technology stack.
2. Document 32 — Technical decisions and ADRs.
3. Documents 22–25 — Code execution, backend, database, and authentication.
4. Documents 33 and 43 — Repository conventions and API contracts.
5. Document 24 — Database schema.

**Outcome:** Explicit approval of the platform, stack, repository strategy, authentication, database, and code runner before implementation.

### Stage 3 — Content and learning engine

Read:

1. Documents 20 and 21 — Curriculum and authoring standards.
2. Documents 34 and 41 — Content publishing workflow and format.
3. Documents 39 and 40 — Sample lesson and data schema.
4. Document 35 — Lesson state machine.
5. Document 37 — Challenge evaluation.
6. Document 36 — Gamification rules.

**Outcome:** A validated, testable lesson delivery and completion model.

### Stage 4 — Development and verification

Read:

1. Document 45 — Development environment.
2. Document 26 — Testing strategy.
3. Document 30 — Performance and reliability.
4. Document 29 — Deployment strategy.
5. Document 46 — Release checklist.

**Outcome:** A reproducible development workflow and defined release gates.

## 5. Cross-Document Dependencies

| Requirement             | Primary documents  | Must be resolved before          |
| ----------------------- | ------------------ | -------------------------------- |
| Platform and repository | 42, 32, 33         | Project initialization           |
| Authentication          | 25, 42, 43         | Protected user features          |
| Database and progress   | 19, 24, 43         | Persistent learning progress     |
| Lesson content format   | 18, 21, 40, 41     | Content delivery implementation  |
| Lesson completion       | 05, 19, 35, 36, 43 | Final completion and reward APIs |
| Code execution          | 06, 22, 37, 42     | Coding challenge release         |
| Progress and XP         | 19, 35, 36, 43     | Reward persistence               |
| Content publishing      | 21, 34, 41         | Publishing production lessons    |
| Quality gates           | 26, 30, 45         | Reliable staging deployment      |
| Release approval        | 29, 31, 44, 46     | Public MVP launch                |

Where documents conflict, record the conflict and resolve it through the relevant decision owner or Architecture Decision Record. Do not silently choose whichever specification is easiest to implement.

## 6. Document Status Policy

Every document should have one of these statuses:

* **Draft:** Proposed content requiring review.
* **Under Review:** Being checked for correctness and consistency.
* **Approved:** Explicitly accepted as the project's current requirement.
* **Superseded:** Replaced by a newer approved document or decision.
* **Archived:** Retained for historical reference but no longer active.

The presence of a document in this index does not automatically make it approved.

### Source-of-truth hierarchy

When deciding what to implement:

1. Follow an explicit, approved architecture or product decision.
2. Follow the latest approved feature specification.
3. Follow the approved API and data contracts.
4. Use draft documents as guidance only until resolved.
5. If a conflict remains, stop the affected implementation and record the decision needed.

## 7. Documentation Maintenance Rules

Update documentation when a meaningful change affects:

* User-visible behavior.
* API contracts or error responses.
* Database schema or migrations.
* Authentication or security.
* Lesson content structure.
* Completion and reward logic.
* Code execution constraints.
* Deployment and recovery procedures.

For each meaningful update:

1. Identify the affected documents.
2. Change the relevant specification.
3. Record important architectural decisions.
4. Update tests and acceptance criteria.
5. Ensure implementation matches the approved documents.
6. Commit the documentation update with the relevant feature when practical.

Avoid duplicating detailed technical rules across many documents. Keep a primary source for each rule and reference it elsewhere.

## 8. Suggested Repository Documentation Layout

The following layout is proposed and should be aligned with the approved repository structure:

```text
docs/
├── README.md
├── product/
├── ux/
├── curriculum/
├── architecture/
├── api/
├── security/
├── testing/
├── operations/
└── release/
```

Place this index at `docs/README.md` or retain the filename `ZELO_DOCUMENTATION_INDEX.md` and link it from the repository's main README. The final location should be chosen once the repository structure is approved.

## 9. Final Planning Gate

Before coding begins, confirm that:

* [ ] The MVP scope is approved.
* [ ] The target platform is selected.
* [ ] The technology stack is approved.
* [ ] The repository structure is selected.
* [ ] Authentication and database decisions are resolved.
* [ ] The isolated code execution approach is selected.
* [ ] The critical learning journey is agreed.
* [ ] The lesson content format is validated.
* [ ] The initial backlog is prioritized.
* [ ] Testing and release criteria are accepted.

Any unresolved decision that materially affects architecture should be recorded explicitly rather than guessed during implementation.

## 10. Definition of Done for the Documentation Series

* [ ] All 47 planned documents are listed.
* [ ] Product, curriculum, architecture, and release documents are categorized.
* [ ] Recommended reading order is defined.
* [ ] Cross-document dependencies are identified.
* [ ] Draft and approved content are clearly distinguished.
* [ ] Conflicting requirements have a resolution process.
* [ ] The documentation index is linked from the project README.
* [ ] The next implementation phase can use these documents without treating unapproved proposals as final decisions.

---

**End of Document 47 — ZELO Documentation Index**

**Planning milestone:** The 47-document planning series is complete. The next phase is to review and approve the architecture decisions, reconcile any specification conflicts, and then implement ZELO 2.0 incrementally against the approved MVP backlog.
