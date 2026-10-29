# ZELO 2.0 — Content Authoring Workflow & Curriculum Publishing

**File:** `CONTENT_AUTHORING_WORKFLOW.md`
**Version:** 3.4
**Status:** Draft — Pending Approval
**Product:** ZELO — Learn. Practice. Build.

---

## 1. Purpose

This document defines how ZELO curriculum content is created, validated, reviewed, published, maintained, and retired.

The initial curriculum covers:

1. HTML
2. CSS
3. JavaScript
4. React

The target audience is complete beginners. Lessons must be understandable, interactive, technically correct, and progressively more challenging.

The workflow must prevent incomplete, untested, or incorrectly sequenced lessons from appearing in the learner experience.

## 2. Core Principles

* **Learning before decoration:** Every activity must support a defined learning objective.
* **Consistency without rigidity:** Lessons follow a common structure while allowing different activity types.
* **Correctness before publication:** Code examples and expected answers must be verified.
* **Small releases:** Publish validated sections incrementally rather than waiting for the entire curriculum.
* **Stable progress:** Content updates must not silently erase learner progress.
* **Separation of content and presentation:** Curriculum content should not depend on a particular screen's implementation.
* **Beginner-first language:** Introduce concepts gradually and explain unfamiliar terminology.
* **No fake completeness:** A world or module must not appear complete when required content is missing.

---

## 3. Curriculum Hierarchy

ZELO uses the following conceptual hierarchy:

```text
Curriculum
└── World
    └── Module
        └── Lesson
            ├── Learning objectives
            ├── Explanation
            ├── Examples
            ├── Interactive activities
            ├── Practice challenge
            └── Completion criteria
```

### Definitions

* **Curriculum:** The complete web-development learning path.
* **World:** A major subject such as HTML or JavaScript.
* **Module:** A related group of concepts.
* **Lesson:** A focused learning unit with defined objectives.
* **Activity:** A quiz, interaction, or coding task within a lesson.

Each entity must have a stable identifier. Display names may change without changing identifiers unnecessarily.

---

## 4. Content Lifecycle

Every lesson follows this lifecycle:

<box border radius="lg" padding={3} gap={2}>
  <box background="surface-secondary" radius="md" padding={2} align="center">
    **Draft**

```
<text size="sm" color="secondary">Content is being created.</text>
```

  </box>
  <box align="center"><icon name="arrow-down" size="lg" /></box>
  <box background="surface-secondary" radius="md" padding={2} align="center">
    **Validation**

```
<text size="sm" color="secondary">Schema, references, activities and code are checked.</text>
```

  </box>
  <box align="center"><icon name="arrow-down" size="lg" /></box>
  <box background="surface-secondary" radius="md" padding={2} align="center">
    **Review**

```
<text size="sm" color="secondary">Educational quality and technical correctness are reviewed.</text>
```

  </box>
  <box align="center"><icon name="arrow-down" size="lg" /></box>
  <box background="surface" border radius="md" padding={2} align="center">
    **Published**

```
<text size="sm" color="secondary">The lesson is available when its release conditions are met.</text>
```

  </box>
  <box align="center"><icon name="arrow-down" size="lg" /></box>
  <box background="surface-secondary" radius="md" padding={2} align="center">
    **Archived**

```
<text size="sm" color="secondary">The lesson is retired from new learning paths.</text>
```

  </box>
</box>

A published lesson may return to Draft or Review through an explicit revision workflow. The previous published version should remain available until the replacement is approved, where the storage architecture supports versioned publication.

### Publication rule

A lesson cannot be published if:

* Required fields are missing.
* Referenced prerequisites do not exist.
* An activity uses an unsupported type.
* Required answer keys or evaluation rules are missing.
* A code example fails its required validation.
* Completion criteria are undefined.
* The lesson has unresolved critical review issues.

---

## 5. Lesson Authoring Template

Every lesson must define the following information.

### A. Identity

* Lesson ID.
* Lesson title.
* World and module.
* Lesson order.
* Content version.
* Publication status.

### B. Learning objectives

State what a learner should be able to do after completing the lesson.

Objectives must be observable and specific.

Weak objective: “Understand CSS.”

Better objective: “Use CSS selectors to apply different styles to headings and paragraphs.”

### C. Prerequisites

List the concepts the learner should know before starting.

A prerequisite must reference a valid lesson or another explicitly supported prerequisite rule.

Do not create circular dependencies.

### D. Learning content

Include:

* A short introduction.
* Plain-language explanations.
* Relevant examples.
* Expected outputs or visual results.
* Common mistakes where helpful.
* A concise recap.

Avoid unnecessary terminology and long explanations before the learner performs an action.

### E. Activities

For each activity, define:

* Activity ID and type.
* Instructions.
* Available options or initial code.
* Correct answer or evaluation criteria.
* Feedback for correct and incorrect attempts.
* Whether it is required for completion.
* Any retry rules.

### F. Completion

Define the conditions that make the lesson complete.

Completion rules must be deterministic and enforced by the application. Merely opening a lesson must not automatically mark it complete.

---

## 6. Standard Lesson Experience

A lesson should normally follow this sequence:

1. **Learn:** Introduce one concept.
2. **See:** Demonstrate the concept with an example.
3. **Interact:** Ask the learner to make a meaningful choice.
4. **Practise:** Apply the concept in an exercise or coding challenge.
5. **Understand:** Provide feedback and reinforce the key takeaway.
6. **Continue:** Show progress and the next recommended action.

This is a recommended learning pattern, not a requirement that every lesson contain exactly six screens.

Short lessons may combine steps when doing so improves clarity. Complex lessons may repeat the learn–practise cycle for multiple concepts.

---

## 7. Supported Activity Types

The content system initially supports six activity categories.

| Activity                | Authoring requirements                                              |
| ----------------------- | ------------------------------------------------------------------- |
| Single-choice MCQ       | Question, options, correct option, explanations.                    |
| Multiple-select         | Question, options, correct set, partial-credit policy if supported. |
| Drag/reorder            | Items, expected order, accessible alternative.                      |
| Fill blank from options | Prompt, blank positions, options, correct selections.               |
| Fill blank by typing    | Prompt, accepted answers, normalization rules.                      |
| Coding challenge        | Instructions, starter code, language/runtime, evaluation criteria.  |

### Activity authoring rules

* Every question must have an unambiguous intended answer.
* Incorrect options should be plausible but fair.
* Feedback must explain the concept, not only display “Wrong.”
* Typed answers must define case sensitivity and whitespace handling where relevant.
* Multiple-select questions must specify whether partial credit exists.
* Drag interactions must have a keyboard-accessible alternative.
* Coding challenges must define observable success conditions.
* Hidden evaluation tests must never be exposed to the client.

Unsupported activity types must not be published until the player and validation system implement them.

---

## 8. Technical Validation Pipeline

Each content submission should pass automated validation before review.

### Stage 1 — Schema validation

Check:

* Required fields.
* Field types and allowed values.
* Unique identifiers.
* Valid activity definitions.
* Correct references between curriculum entities.

### Stage 2 — Curriculum validation

Check:

* Prerequisite references exist.
* No prerequisite cycles exist.
* Lesson ordering is valid.
* Published lessons do not depend on unavailable content without an explicit policy.
* All required lesson IDs are unique.

### Stage 3 — Code validation

Depending on the lesson, check:

* HTML structure and expected rendering.
* CSS syntax and visual behaviour.
* JavaScript syntax and test results.
* React compilation and component behaviour.
* Coding challenge evaluation rules.

### Stage 4 — Content integrity

Check:

* Every required activity has a valid answer key or evaluation rule.
* Completion criteria are present.
* Internal references resolve.
* No placeholder text remains in publishable content.
* No accidental secrets or sensitive information are included.

A successful schema check does not replace educational review or runtime testing.

---

## 9. Educational and Technical Review

Every lesson must be reviewed before publication.

### Educational review

* Are the learning objectives clear?
* Is the explanation appropriate for a complete beginner?
* Are unfamiliar terms explained?
* Does the lesson build on previously taught concepts?
* Are the examples relevant and easy to follow?
* Does practice genuinely test the stated objective?
* Is the lesson length reasonable?

### Technical review

* Do examples run as intended?
* Are expected outputs correct?
* Are answer keys accurate?
* Do coding challenges pass their reference tests?
* Are incorrect-answer explanations valid?
* Are activity and completion rules implemented?
* Does the lesson work in the supported client environment?

### Accessibility review

* Can the content be understood without relying on colour alone?
* Are instructions clear to screen-reader users?
* Is an alternative available for drag-based interactions?
* Are code examples readable?
* Are interactive controls keyboard accessible where applicable?

Critical defects must be resolved before publication.

---

## 10. Publishing Workflow

The proposed publishing workflow is:

1. Author or update the lesson.
2. Validate its structure.
3. Validate prerequisites and references.
4. Run relevant code and activity tests.
5. Review educational quality.
6. Review accessibility and usability.
7. Approve the release.
8. Publish the validated version.
9. Confirm it appears correctly in the learning path.
10. Monitor reported defects and correct them through a new revision.

Publishing must be an explicit action. Saving a draft must never make it visible to learners.

### Release strategy

Publish curriculum incrementally:

* First: foundational HTML lessons.
* Next: CSS foundations and layout.
* Then: JavaScript foundations and interaction.
* Finally: React foundations and application building.

These stages describe the planned sequence, not a promise that all content will be ready at a particular date.

---

## 11. Content Updates and Learner Progress

Content updates must preserve the distinction between lesson identity and lesson version.

### Non-breaking updates

Examples:

* Typographical corrections.
* Clarifications.
* Improved accessibility text.
* Non-functional formatting changes.

These may be published as a new revision after appropriate checks.

### Behaviour-changing updates

Examples:

* Changing the correct answer.
* Changing completion criteria.
* Replacing a coding challenge's evaluation tests.
* Changing prerequisite relationships.
* Reorganizing modules or lesson order.

These require additional review because they may affect existing progress or submissions.

### Required rules

* Do not silently reset completed lessons.
* Do not award completion XP repeatedly because content was revised.
* Do not delete historical reward records merely because a lesson changes.
* Define how active learners transition to revised content.
* Retain stable IDs wherever the learning objective and identity remain substantially the same.
* Use a new lesson ID when the new content represents a materially different learning unit.

The exact content-versioning and migration mechanism remains a technical decision.

---

## 12. Content Quality Levels

Use internal quality levels to guide release readiness.

**Level 1 — Structurally valid**

Required fields and references are present.

**Level 2 — Technically verified**

Examples, answer keys, and evaluation rules have passed relevant tests.

**Level 3 — Educationally reviewed**

The lesson meets beginner-first explanation and sequencing standards.

**Level 4 — Release-ready**

The lesson has passed required accessibility, functional, and publication checks.

Only release-ready content may be published to learners.

These levels are internal quality gates, not learner-facing badges.

---

## 13. Content Ownership and Workflow Tools

For the MVP, a dedicated content management system is not mandatory.

The authoring workflow may begin with version-controlled structured files if that approach is accepted in the technical decisions register.

A future authoring interface should be introduced only when it materially improves:

* Editorial collaboration.
* Review and approval.
* Previewing lessons.
* Validation feedback.
* Version comparison.
* Publishing control.

Do not build a CMS merely because the curriculum contains many lessons.

---

## 14. Acceptance Criteria

The content-authoring system is ready for MVP use when:

* [ ] Lessons follow a documented content schema.
* [ ] Required fields are validated automatically.
* [ ] Invalid prerequisite references are rejected.
* [ ] Circular prerequisites are detected.
* [ ] Unsupported activity types cannot be published.
* [ ] Coding examples can be validated using appropriate checks.
* [ ] Draft content remains hidden from learners.
* [ ] Published content passes the required review checklist.
* [ ] Content changes do not accidentally reset learner progress.
* [ ] Duplicate XP awards are prevented after retries or revisions.
* [ ] The published learning path reflects the approved lesson order.
* [ ] A failed publication leaves the previous valid publication intact where versioned publishing is supported.

---

## 15. Open Decisions

The following items must be resolved before the corresponding implementation work:

1. Structured content format and schema-validation tooling.
2. Whether content is stored in files, a database, or a hybrid arrangement.
3. Lesson versioning and migration rules.
4. Required reviewer and approver roles.
5. Preview environment for unpublished lessons.
6. Supported code validation and execution tools.
7. Rules for replacing or retiring lessons with active learner progress.
8. Whether a content management interface is needed after the MVP.

---

## 16. Final Rule

**No lesson is ready merely because its content has been written.**

A lesson is ready when its structure is valid, its examples and answers are verified, its teaching quality is reviewed, and its publication will not unexpectedly break the learner's progress.

ZELO's curriculum should grow in small, reliable releases while preserving a consistent and enjoyable learning experience.
