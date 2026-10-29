# ZELO 2.0 — MVP Content Authoring Format

**Document ID:** ZELO-CONTENT-041
**Filename:** `MVP_CONTENT_AUTHORING_FORMAT.md`
**Version:** 4.1
**Status:** Draft — Proposed Recommendation

---

## 1. Purpose

Define the simplest maintainable format for authoring, validating, reviewing, and publishing ZELO's educational content during MVP development.

The format must support the learning path:

**HTML → CSS → JavaScript → React**

It should allow developers to add or update lessons without building new screens for every lesson.

## 2. Recommendation

Use a **hybrid content architecture**:

* **Version-controlled JSON files** for authored lesson content during the initial MVP.
* **Backend validation** before content is made available to learners.
* **Database records** for user accounts, learning progress, challenge submissions, XP, and other learner-specific data.
* **Database-backed content management** only when a genuine editing or publishing requirement justifies it.

This is a proposed decision, not an approved technology-stack commitment.

### Why this approach?

| Approach              | Advantage                                             | Limitation                                             |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| JSON files only       | Simple, reviewable, version-controlled                | Requires a deployment to publish changes               |
| Database content only | Easier dynamic publishing later                       | Requires additional authoring and validation workflows |
| Hybrid                | Simple initial authoring with persistent learner data | Requires a clear boundary between content and progress |

For the MVP, version-controlled lesson files provide a straightforward starting point without introducing a custom course-management system prematurely.

## 3. Proposed Directory Structure

```text
content/
├── curriculum.json
├── html/
│   ├── world.json
│   ├── module-01/
│   │   ├── module.json
│   │   ├── lesson-001.json
│   │   └── lesson-002.json
│   └── module-02/
│       └── module.json
├── css/
│   └── ...
├── javascript/
│   └── ...
└── react/
    └── ...
```

The structure is illustrative. It can be adjusted to fit the final repository architecture.

**Rules:**

* Keep each lesson in a separate file.
* Group lessons by world and module.
* Store shared curriculum metadata separately.
* Avoid duplicating the same lesson content across multiple files.
* Do not store user-specific progress or XP in lesson files.

## 4. Lesson File Format

Each lesson should contain:

* Stable lesson ID.
* Title and summary.
* World and module references.
* Content version.
* Learning objectives.
* Prerequisites.
* Ordered steps.
* Completion requirements.
* Publication metadata where required.

Example:

```json
{
  "id": "html-first-webpage-001",
  "slug": "build-your-first-webpage",
  "title": "Build Your First Webpage",
  "summary": "Learn basic HTML structure.",
  "worldId": "html",
  "moduleId": "html-foundations",
  "contentVersion": "1.0.0",
  "difficulty": "beginner",
  "estimatedMinutes": 10,
  "learningObjectives": [
    "Explain what HTML does",
    "Recognise opening and closing tags",
    "Create a heading and paragraph"
  ],
  "prerequisiteLessonIds": [],
  "steps": [],
  "completionRequirements": {
    "requiredStepIds": [],
    "codingChallengeMustPass": true
  }
}
```

The empty arrays are placeholders in this format example. A publishable lesson must contain valid, fully defined steps and completion rules.

## 5. Supported Content Types

The MVP authoring format should support the following content blocks:

| Type                 | Use                             |
| -------------------- | ------------------------------- |
| `paragraph`          | Explanations                    |
| `heading`            | Content section headings        |
| `code`               | Code examples                   |
| `image`              | Relevant learning illustrations |
| `callout`            | Important notes or warnings     |
| `single_choice`      | One correct answer              |
| `multiple_select`    | Multiple correct answers        |
| `reorder`            | Arrange items in order          |
| `fill_blank_options` | Choose missing content          |
| `fill_blank_text`    | Type missing content            |
| `coding_challenge`   | Practical coding task           |

The Lesson Player should render these using shared components. A new content type should be added only when an actual learning requirement cannot be handled by the existing types.

## 6. Authoring Rules

### Educational quality

* Every lesson must have specific learning objectives.
* Each step must contribute to at least one objective.
* Explanations must be understandable to complete beginners.
* Examples must be correct and relevant to the lesson.
* Activities must test the concept being taught.
* Incorrect-answer feedback should explain how to improve.
* Difficulty should increase gradually.

### Technical quality

* Use unique, stable IDs.
* Validate all required fields and references.
* Use valid JSON syntax.
* Escape content correctly.
* Define expected answers and evaluation rules explicitly.
* Keep hidden answer keys out of learner-facing responses.
* Never place credentials, API keys, or secrets in content files.

### Consistency

* Use consistent naming conventions.
* Use the same field names across curriculum worlds.
* Reuse shared templates.
* Avoid lesson-specific rendering logic.
* Keep content and application behaviour separate.

## 7. Validation and Publishing Workflow

Every lesson follows this workflow:

**Draft → Validate → Review → Publish → Maintain**

### Step 1: Draft

Create or edit the lesson file using the agreed schema.

### Step 2: Validate

Run automated checks for:

* JSON syntax.
* Required fields.
* Supported step types.
* Unique IDs.
* Valid references.
* Valid answer keys.
* Valid coding challenge references.
* Completion-rule consistency.

### Step 3: Review

Check:

* Educational accuracy.
* Beginner readability.
* Correctness of code examples.
* Quality of feedback.
* Accessibility.
* Challenge evaluation criteria.

### Step 4: Publish

Only validated and reviewed content can be released to learners.

For the initial MVP, publishing may occur through the normal application deployment process.

### Step 5: Maintain

When content changes, update its version and review whether existing learner progress remains compatible.

## 8. Content and Database Responsibilities

### Version-controlled content files

Store:

* World and module definitions.
* Lesson explanations.
* Code examples.
* Activity prompts and options.
* Feedback text.
* Challenge references.
* Learning objectives.
* Prerequisite definitions.

### Database

Store:

* User accounts and settings.
* Lesson progress.
* Activity attempts where needed.
* Challenge drafts and submissions where needed.
* XP reward ledger.
* Quest progress.
* Other learner-specific state.

### Backend services

Responsible for:

* Serving published content.
* Validating learner requests.
* Protecting correct answers and hidden tests.
* Recording progress.
* Confirming lesson completion.
* Preventing duplicate rewards.

The database and backend implementation details remain subject to the final architecture decision.

## 9. Content Versioning

* Every published lesson must have a content version.
* Changes should be reviewed before release.
* Existing progress must not be reset accidentally because a lesson file changed.
* Stable IDs should be preserved when the learning objective remains the same.
* Significant changes to required activities or evaluation criteria may require a new version.
* The backend must use an explicit compatibility policy when old progress meets updated content.

A version change alone must not automatically grant rewards or mark lessons complete.

## 10. Automated Quality Checks

The content validation command should eventually support a workflow similar to:

```bash
npm run content:validate
```

The command name is proposed and should be finalised with the repository setup.

It should:

1. Discover all curriculum content files.
2. Parse each file.
3. Validate the content schema.
4. Check references and IDs.
5. Validate lesson completion requirements.
6. Report actionable errors.
7. Exit unsuccessfully when invalid content is detected.

Content validation should be included in the development workflow and continuous integration before content is released.

## 11. MVP Boundaries

The initial content authoring system does **not** require:

* A custom visual course editor.
* Real-time collaborative editing.
* A content marketplace.
* Dynamic learner-generated courses.
* AI-generated lessons.
* A complex content management platform.
* A separate microservice for content.
* An elaborate translation-management platform.

These capabilities can be considered later if supported by real product requirements.

## 12. Acceptance Criteria

This approach is ready for implementation when:

* A lesson can be created using the agreed JSON structure.
* The same Lesson Player renders lessons from different curriculum worlds.
* Invalid content is rejected before publication.
* Hidden answers and tests are not exposed to learners.
* Learner progress is stored separately from authored content.
* Content updates follow a documented versioning policy.
* A validation command can check the complete content directory.
* Adding a normal lesson does not require a new lesson-specific UI component.

## 13. Open Decisions

The following decisions must be finalised before implementation:

1. Final content schema and validation library.
2. Whether published content is loaded from files at build time or imported into the backend.
3. How production answer keys are stored and validated.
4. How content versions interact with existing learner progress.
5. Whether a database-backed authoring interface is needed after MVP validation.

---

**End of Document 41 — MVP Content Authoring Format**
